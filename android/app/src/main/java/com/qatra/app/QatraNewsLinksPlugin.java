package com.qatra.app;

import android.content.Intent;
import android.net.Uri;
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

@CapacitorPlugin(name="QatraNewsLinks")
public class QatraNewsLinksPlugin extends Plugin {
    private final ExecutorService worker=Executors.newSingleThreadExecutor();
    private final AtomicBoolean loading=new AtomicBoolean(false);
    private boolean validArticle(String value){
        try{
            Uri uri=Uri.parse(value);
            return "https".equals(uri.getScheme())&&"ar.globalvoices.org".equals(uri.getHost())&&uri.getUserInfo()==null&&(uri.getPort()==-1||uri.getPort()==443)&&uri.getPath()!=null&&uri.getPath().matches("/[0-9]{4}/[0-9]{2}/[0-9]{2}/[^/]+/?");
        }catch(Exception error){return false;}
    }
    private void open(PluginCall call,String url){
        if(getActivity()==null){call.reject("NEWS_ACTIVITY_UNAVAILABLE");return;}
        getActivity().runOnUiThread(()->{
            try{
                Intent intent=new Intent(Intent.ACTION_VIEW,Uri.parse(url));intent.addCategory(Intent.CATEGORY_BROWSABLE);getActivity().startActivity(intent);
                JSObject result=new JSObject();result.put("opened",true);call.resolve(result);
            }catch(Exception error){call.reject("NEWS_EXTERNAL_OPEN_FAILED");}
        });
    }
    @PluginMethod public void openSource(PluginCall call){
        String source=call.getString("source");final String url;
        if("aljazeera-home".equals(source))url="https://www.aljazeera.net/";
        else if("aljazeera-latest".equals(source))url="https://www.aljazeera.net/latest";
        else if("globalvoices-home".equals(source))url="https://ar.globalvoices.org/";
        else if("globalvoices-license".equals(source))url="https://globalvoices.org/about/global-voices-attribution-policy/";
        else{call.reject("NEWS_SOURCE_NOT_ALLOWED");return;}open(call,url);
    }
    @PluginMethod public void openArticle(PluginCall call){
        String url=call.getString("url");if(!validArticle(url)){call.reject("NEWS_ARTICLE_NOT_ALLOWED");return;}
        open(call,Uri.parse(url).buildUpon().clearQuery().fragment(null).build().toString());
    }
    private long date(String text){
        for(String pattern:new String[]{"EEE, dd MMM yyyy HH:mm:ss Z","EEE, d MMM yyyy HH:mm:ss Z"}){
            try{SimpleDateFormat format=new SimpleDateFormat(pattern,Locale.ENGLISH);format.setLenient(false);Date parsed=format.parse(text);if(parsed!=null)return parsed.getTime();}catch(Exception ignored){}
        }return 0L;
    }
    @PluginMethod public void getStories(PluginCall call){
        if(!loading.compareAndSet(false,true)){call.reject("NEWS_BUSY");return;}
        try{worker.execute(()->{
            HttpURLConnection connection=null;
            try{
                connection=(HttpURLConnection)new URL("https://ar.globalvoices.org/feed/").openConnection();
                connection.setConnectTimeout(8000);connection.setReadTimeout(8000);connection.setInstanceFollowRedirects(false);
                connection.setRequestProperty("Accept","application/rss+xml, application/xml, text/xml");connection.setRequestProperty("Accept-Encoding","identity");connection.setRequestProperty("User-Agent","Qatra-News-Pilot/1.0");
                if(connection.getResponseCode()!=200)throw new Exception("Feed unavailable");
                if(connection.getContentLengthLong()>1500000)throw new Exception("Feed too large");
                ByteArrayOutputStream bytes=new ByteArrayOutputStream();
                try(InputStream input=connection.getInputStream()){
                    byte[] buffer=new byte[8192];int count;while((count=input.read(buffer))!=-1){if(bytes.size()+count>1500000)throw new Exception("Feed too large");bytes.write(buffer,0,count);}
                }
                String xml=bytes.toString("UTF-8");String upper=xml.toUpperCase(Locale.ROOT);
                if(upper.contains("<!DOCTYPE")||upper.contains("<!ENTITY"))throw new Exception("Unsupported feed");
                XmlPullParser parser=Xml.newPullParser();parser.setFeature(XmlPullParser.FEATURE_PROCESS_NAMESPACES,true);parser.setInput(new StringReader(xml));
                ArrayList<JSONObject> stories=new ArrayList<>();HashSet<String> seen=new HashSet<>();JSONObject item=null;int depth=-1;
                for(int event=parser.getEventType();event!=XmlPullParser.END_DOCUMENT;event=parser.next()){
                    if(event==XmlPullParser.START_TAG&&"item".equals(parser.getName())){item=new JSONObject();depth=parser.getDepth();}
                    else if(item!=null&&event==XmlPullParser.START_TAG&&parser.getDepth()==depth+1){
                        String tag=parser.getName();
                        if("title".equals(tag)||"link".equals(tag)||"pubDate".equals(tag)||"creator".equals(tag)||"author".equals(tag)){
                            String value=parser.nextText().trim();int max="link".equals(tag)?2000:500;if(value.length()>max)value=value.substring(0,max);
                            if("title".equals(tag))item.put("title",value);
                            else if("link".equals(tag))item.put("url",value);
                            else if("pubDate".equals(tag))item.put("publishedAt",date(value));
                            else item.put("author",value);
                        }
                    }else if(item!=null&&event==XmlPullParser.END_TAG&&"item".equals(parser.getName())&&parser.getDepth()==depth){
                        String url=item.optString("url");if(validArticle(url)&&!item.optString("title").isEmpty()&&seen.add(url))stories.add(item);item=null;
                    }
                }
                stories.sort((a,b)->Long.compare(b.optLong("publishedAt"),a.optLong("publishedAt")));
                JSONArray result=new JSONArray();for(int i=0;i<Math.min(10,stories.size());i++)result.put(stories.get(i));
                JSObject response=new JSObject();response.put("stories",result);response.put("checkedAt",System.currentTimeMillis());call.resolve(response);
            }catch(Exception error){call.reject("NEWS_FEED_UNAVAILABLE");}
            finally{if(connection!=null)connection.disconnect();loading.set(false);}
        });}catch(Exception error){loading.set(false);call.reject("NEWS_FEED_UNAVAILABLE");}
    }
    @Override protected void handleOnDestroy(){worker.shutdownNow();super.handleOnDestroy();}
}
