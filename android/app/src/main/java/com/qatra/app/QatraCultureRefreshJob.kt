package com.qatra.app

import android.app.job.JobInfo
import android.app.job.JobParameters
import android.app.job.JobScheduler
import android.app.job.JobService
import android.content.ComponentName
import android.content.Context
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.PersistableBundle
import org.json.JSONArray
import java.net.HttpURLConnection
import java.util.concurrent.Executors

private data class CultureRefreshSnapshot(val language:String,val source:String,val field:String,val revision:Long)

/** Fetches metadata using the same parser as foreground culture updates. */
class QatraCultureRefreshJob:JobService() {
    private class Run(val parameters:JobParameters,val expected:CultureRefreshSnapshot) {
        @Volatile var cancelled=false
        @Volatile var connection:HttpURLConnection?=null
    }
    private val executor=Executors.newSingleThreadExecutor()
    private val main=Handler(Looper.getMainLooper())
    @Volatile private var activeRun:Run?=null

    override fun onStartJob(parameters:JobParameters):Boolean {
        val expected=snapshot(this)?:return false
        if(!matches(parameters.extras,expected))return false
        val run=Run(parameters,expected)
        activeRun?.let{it.cancelled=true;it.connection?.disconnect()}
        activeRun=run
        val guard=object:QatraNewsLinksPlugin.FeedGuard {
            override fun active():Boolean = !run.cancelled&&activeRun===run&&snapshot(this@QatraCultureRefreshJob)==expected
            override fun connection(connection:HttpURLConnection?) {
                run.connection=connection
                if(run.cancelled)connection?.disconnect()
            }
        }
        try {
            executor.execute {
                var retry=false
                try {
                    if(!guard.active())return@execute
                    val articles=QatraNewsLinksPlugin.fetchArticlesChecked(expected.language,expected.source,guard)
                    synchronized(QatraCultureRuntime) {
                        if(guard.active()) {
                            if(articles.length()>0)QatraCultureRuntime.cache(applicationContext,expected.language,expected.source,articles)
                            prefs(applicationContext).edit()
                                .putLong("${expected.language}:lastRefreshAt",System.currentTimeMillis())
                                .putString("${expected.language}:refreshState",if(articles.length()>0)"ok" else "empty")
                                .commit()
                        }
                    }
                } catch(_:Exception) {
                    if(guard.active()) {
                        retry=true
                        prefs(applicationContext).edit().putString("${expected.language}:refreshState","failed").apply()
                    }
                } finally {
                    run.connection?.disconnect()
                    run.connection=null
                    main.post {
                        if(activeRun===run&&!run.cancelled) {
                            activeRun=null
                            jobFinished(parameters,retry&&snapshot(this)==expected)
                        }
                    }
                }
            }
        } catch(_:Exception) {
            activeRun=null
            return false
        }
        return true
    }

    override fun onStopJob(parameters:JobParameters):Boolean {
        activeRun?.let{it.cancelled=true;it.connection?.disconnect()}
        activeRun=null
        return snapshot(this)!=null
    }

    override fun onDestroy() {
        activeRun?.let{it.cancelled=true;it.connection?.disconnect()}
        activeRun=null
        executor.shutdownNow()
        main.removeCallbacksAndMessages(null)
        super.onDestroy()
    }

    companion object {
        private const val JOB_ID=713403
        private const val PERIOD=6*60*60*1000L
        private fun prefs(c:Context)=c.getSharedPreferences("qatra_culture_runtime",Context.MODE_PRIVATE)
        private fun snapshot(c:Context):CultureRefreshSnapshot? {
            val p=prefs(c)
            val language=p.getString("language","").orEmpty()
            if(language !in setOf("ar","en","fr","es","de")||!p.getBoolean("$language:enabled",false))return null
            val source=p.getString("$language:source","gv-$language").orEmpty()
            val field=p.getString("$language:field","all").orEmpty()
            if(source!="gv-$language"||field.length>120)return null
            return CultureRefreshSnapshot(language,source,field,p.getLong("revision",0))
        }
        private fun matches(extras:PersistableBundle,s:CultureRefreshSnapshot):Boolean =
            extras.getString("language")==s.language&&extras.getString("source")==s.source&&extras.getString("field")==s.field&&extras.getLong("revision",-1)==s.revision

        @JvmStatic fun scheduled(c:Context,language:String):Boolean {
            return try {
                val expected=snapshot(c)?:return false
                if(expected.language!=language)return false
                val scheduler=c.getSystemService(Context.JOB_SCHEDULER_SERVICE) as JobScheduler
                scheduler.allPendingJobs.any{it.id==JOB_ID&&matches(it.extras,expected)}
            } catch(_:Exception){false}
        }

        @JvmStatic @Synchronized fun sync(c:Context):Boolean {
            return try {
                val scheduler=c.getSystemService(Context.JOB_SCHEDULER_SERVICE) as JobScheduler
                val expected=snapshot(c)
                if(expected==null){scheduler.cancel(JOB_ID);return false}
                val existing=scheduler.allPendingJobs.firstOrNull{it.id==JOB_ID}
                if(existing!=null&&matches(existing.extras,expected))return true
                scheduler.cancel(JOB_ID)
                val extras=PersistableBundle().apply {
                    putString("language",expected.language)
                    putString("source",expected.source)
                    putString("field",expected.field)
                    putLong("revision",expected.revision)
                }
                val builder=JobInfo.Builder(JOB_ID,ComponentName(c,QatraCultureRefreshJob::class.java))
                    .setRequiredNetworkType(JobInfo.NETWORK_TYPE_ANY)
                    .setPersisted(true)
                    .setPeriodic(PERIOD)
                    .setBackoffCriteria(30*60*1000L,JobInfo.BACKOFF_POLICY_EXPONENTIAL)
                    .setExtras(extras)
                if(Build.VERSION.SDK_INT>=26)builder.setRequiresBatteryNotLow(true)
                scheduler.schedule(builder.build())==JobScheduler.RESULT_SUCCESS
            } catch(_:Exception){false}
        }
    }
}
