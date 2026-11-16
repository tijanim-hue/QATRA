package com.qatra.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.text.Html;
import android.util.Xml;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import org.json.JSONArray;
import org.json.JSONObject;
import org.xmlpull.v1.XmlPullParser;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Locale;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.atomic.AtomicBoolean;

/** Legacy bridge name retained for installed navigation; only culture sources are exposed. */
@CapacitorPlugin(name="QatraNewsLinks")
public class QatraNewsLinksPlugin extends Plugin {
    private final ExecutorService worker=Executors.newSingleThreadExecutor();
    private final AtomicBoolean loading=new AtomicBoolean(false);
    private boolean validArticle(String value){
        try{Uri uri=Uri.parse(value);return "https".equals(uri.getScheme())&&"ar.globalvoices.org".equals(uri.getHost())&&uri.getUserInfo()==null&&(uri.getPort()==-1||uri.getPort()==443)&&uri.getPath()!=null&&uri.getPath().matches("/[0-9]{4}/[0-9]{2}/[0-9]{2}/[^/]+/?");}catch(Exception error){return false;}
    }
    private void open(PluginCall call,String url){
        if(getActivity()==null){call.reject("CULTURE_ACTIVITY_UNAVAILABLE");return;}
        getActivity().runOnUiThread(()->{try{Intent intent=new Intent(Intent.ACTION_VIEW,Uri.parse(url));intent.addCategory(Intent.CATEGORY_BROWSABLE);getActivity().startActivity(intent);JSObject result=new JSObject();result.put("opened",true);call.resolve(result);}catch(Exception error){call.reject("CULTURE_EXTERNAL_OPEN_FAILED");}});
    }
    @PluginMethod public void openSource(PluginCall call){
        String source=call.getString("source");
        if("globalvoices-home".equals(source))open(call,"https://ar.globalvoices.org/");
        else if("globalvoices-license".equals(source))open(call,"https://ar.globalvoices.org/about/global-voices-attribution-policy/");
        else call.reject("CULTURE_SOURCE_NOT_ALLOWED");
    }
    @PluginMethod public void openArticle(PluginCall call){
        String url=call.getString("url");if(!validArticle(url)){call.reject("CULTURE_ARTICLE_NOT_ALLOWED");return;}open(call,Uri.parse(url).buildUpon().clearQuery().fragment(null).build().toString());
    }
    private long date(String text){
        for(String pattern:new String[]{"EEE, dd MMM yyyy HH:mm:ss Z","EEE, d MMM yyyy HH:mm:ss Z"})try{SimpleDateFormat format=new SimpleDateFormat(pattern,Locale.ENGLISH);format.setLenient(false);Date parsed=format.parse(text);if(parsed!=null)return parsed.getTime();}catch(Exception ignored){}return 0L;
    }
    private String excerpt(String html){
        String safe=html.replaceAll("(?is)<(script|style)\\b[^>]*>.*?</\\1>"," ");
        String text=(Build.VERSION.SDK_INT>=24?Html.fromHtml(safe,Html.FROM_HTML_MODE_LEGACY):Html.fromHtml(safe)).toString().replace('\uFFFC',' ').replaceAll("\\s+"," ").trim();
        if(text.length()<=260)return text;int end=text.lastIndexOf(' ',260);if(end<180)end=260;return text.substring(0,end)+"…";
    }
    private boolean cultural(String category){
        String value=category.toLowerCase(Locale.ROOT);
        return value.matches(".*(ثقاف|فنون|أدب|آداب|تاريخ|علوم|تعليم|تقني|تكنولوجيا|فلسف|لغات|تراث|موسيقى|سينما|\\b(arts?|culture|literature|history|science|education|technology|philosophy|language|heritage|music|cinema)\\b).*" );
    }
    @PluginMethod public void getArticles(PluginCall call){
        if(!loading.compareAndSet(false,true)){call.reject("CULTURE_BUSY");return;}
        try{worker.execute(()->{
            HttpURLConnection connection=null;
            try{
                connection=(HttpURLConnection)new URL("https://ar.globalvoices.org/feed/").openConnection();connection.setConnectTimeout(8000);connection.setReadTimeout(8000);connection.setInstanceFollowRedirects(false);connection.setRequestProperty("Accept","application/rss+xml, application/xml, text/xml");connection.setRequestProperty("Accept-Encoding","identity");connection.setRequestProperty("User-Agent","Qatra-Culture-Pilot/1.0");
                if(connection.getResponseCode()!=200||connection.getContentLengthLong()>1500000)throw new Exception("Feed unavailable");
                ByteArrayOutputStream bytes=new ByteArrayOutputStream();try(InputStream input=connection.getInputStream()){byte[] buffer=new byte[8192];int count;while((count=input.read(buffer))!=-1){if(bytes.size()+count>1500000)throw new Exception("Feed too large");bytes.write(buffer,0,count);}}
                String xml=bytes.toString("UTF-8"),upper=xml.toUpperCase(Locale.ROOT);if(upper.contains("<!DOCTYPE")||upper.contains("<!ENTITY"))throw new Exception("Unsupported feed");
                XmlPullParser parser=Xml.newPullParser();parser.setFeature(XmlPullParser.FEATURE_PROCESS_NAMESPACES,true);parser.setInput(new StringReader(xml));
                ArrayList<JSONObject> articles=new ArrayList<>();HashSet<String> seen=new HashSet<>();JSONObject item=null;JSONArray categories=null;int depth=-1;
                for(int event=parser.getEventType();event!=XmlPullParser.END_DOCUMENT;event=parser.next()){
                    if(event==XmlPullParser.START_TAG&&"item".equals(parser.getName())){item=new JSONObject();categories=new JSONArray();depth=parser.getDepth();}
                    else if(item!=null&&event==XmlPullParser.START_TAG&&parser.getDepth()==depth+1){
                        String tag=parser.getName();
                        if("title".equals(tag)||"link".equals(tag)||"pubDate".equals(tag)||"creator".equals(tag)||"author".equals(tag)||"description".equals(tag)||"category".equals(tag)){
                            String value=parser.nextText().trim();
                            if("description".equals(tag))item.put("excerpt",excerpt(value));
                            else if("category".equals(tag)){if(value.length()<=120&&cultural(value))categories.put(value);}
                            else if("title".equals(tag)&&value.length()<=500)item.put("title",value);
                            else if("link".equals(tag)&&value.length()<=2000)item.put("url",value);
                            else if("pubDate".equals(tag))item.put("publishedAt",date(value));
                            else if(("creator".equals(tag)||"author".equals(tag))&&value.length()<=500&&(!item.has("author")||"creator".equals(tag)))item.put("author",value);
                        }
                    }else if(item!=null&&event==XmlPullParser.END_TAG&&"item".equals(parser.getName())&&parser.getDepth()==depth){
                        String url=item.optString("url");if(categories.length()>0&&validArticle(url)&&!item.optString("title").isEmpty()&&seen.add(url)){item.put("categories",categories);articles.add(item);}item=null;
                    }
                }
                articles.sort((a,b)->Long.compare(b.optLong("publishedAt"),a.optLong("publishedAt")));JSONArray result=new JSONArray();for(int i=0;i<Math.min(20,articles.size());i++)result.put(articles.get(i));JSObject response=new JSObject();response.put("articles",result);response.put("checkedAt",System.currentTimeMillis());call.resolve(response);
            }catch(Exception error){call.reject("CULTURE_FEED_UNAVAILABLE");}finally{if(connection!=null)connection.disconnect();loading.set(false);}
        });}catch(Exception error){loading.set(false);call.reject("CULTURE_FEED_UNAVAILABLE");}
    }
    @Override protected void handleOnDestroy(){worker.shutdownNow();super.handleOnDestroy();}
}
