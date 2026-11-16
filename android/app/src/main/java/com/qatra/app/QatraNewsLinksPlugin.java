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
import java.text.Normalizer;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Locale;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.atomic.AtomicLong;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@CapacitorPlugin(name="QatraNewsLinks")
public class QatraNewsLinksPlugin extends Plugin {
    private final ExecutorService worker=Executors.newSingleThreadExecutor();
    private final AtomicLong generation=new AtomicLong();
    private volatile HttpURLConnection current;
    private volatile String activeLanguage="";
    private static final class Source {
        final String language,id,host,name;
        Source(String language,String host,String name){this.language=language;this.id="gv-"+language;this.host=host;this.name=name;}
        String home(){return "https://"+host+"/";}
    }
    private Source source(String lang){
        if("ar".equals(lang))return new Source(lang,"ar.globalvoices.org","الأصوات العالمية — العربية");
        if("en".equals(lang))return new Source(lang,"globalvoices.org","Global Voices — English");
        if("fr".equals(lang))return new Source(lang,"fr.globalvoices.org","Global Voices en Français");
        if("es".equals(lang))return new Source(lang,"es.globalvoices.org","Global Voices en Español");
        if("de".equals(lang))return new Source(lang,"de.globalvoices.org","Global Voices auf Deutsch");
        return null;
    }
    private Source selected(PluginCall call){
        String lang=call.getString("language");Source result=source(lang);
        if(result==null||!result.id.equals(call.getString("source"))||!result.language.equals(activeLanguage))throw new IllegalArgumentException("Language/source mismatch");return result;
    }
    @PluginMethod public void getSources(PluginCall call){
        String lang=call.getString("language");if(lang==null)lang="";
        if(!lang.matches("[a-z]{0,8}")){call.reject("CULTURE_LANGUAGE_INVALID");return;}
        activeLanguage=lang;long epoch=generation.incrementAndGet();HttpURLConnection old=current;if(old!=null)old.disconnect();
        JSONArray rows=new JSONArray();Source s=source(lang);
        if(s!=null){JSObject row=new JSObject();row.put("id",s.id);row.put("language",s.language);row.put("name",s.name);row.put("home",s.home());row.put("policy","https://globalvoices.org/about/global-voices-attribution-policy/");rows.put(row);}
        JSObject result=new JSObject();result.put("language",lang);result.put("epoch",epoch);result.put("sources",rows);call.resolve(result);
    }
    private boolean validArticle(Source source,String value){
        try{Uri uri=Uri.parse(value);return "https".equals(uri.getScheme())&&source.host.equals(uri.getHost())&&uri.getUserInfo()==null&&(uri.getPort()==-1||uri.getPort()==443)&&uri.getPath()!=null&&uri.getPath().matches("/[0-9]{4}/[0-9]{2}/[0-9]{2}/[^/]+/?");}catch(Exception error){return false;}
    }
    private void open(PluginCall call,Source source,String url){
        if(getActivity()==null){call.reject("CULTURE_ACTIVITY_UNAVAILABLE");return;}
        getActivity().runOnUiThread(()->{try{if(!source.language.equals(activeLanguage))throw new IllegalStateException("Language changed");Intent intent=new Intent(Intent.ACTION_VIEW,Uri.parse(url));intent.addCategory(Intent.CATEGORY_BROWSABLE);getActivity().startActivity(intent);JSObject result=new JSObject();result.put("opened",true);call.resolve(result);}catch(Exception error){call.reject("CULTURE_EXTERNAL_OPEN_FAILED");}});
    }
    @PluginMethod public void openSource(PluginCall call){
        try{Source s=selected(call);String kind=call.getString("kind");if(!"home".equals(kind)&&!"policy".equals(kind))throw new IllegalArgumentException("kind");open(call,s,"home".equals(kind)?s.home():"https://globalvoices.org/about/global-voices-attribution-policy/");}catch(Exception error){call.reject("CULTURE_SOURCE_NOT_ALLOWED");}
    }
    @PluginMethod public void openArticle(PluginCall call){
        try{Source s=selected(call);String url=call.getString("url");if(!validArticle(s,url))throw new IllegalArgumentException("url");open(call,s,Uri.parse(url).buildUpon().clearQuery().fragment(null).build().toString());}catch(Exception error){call.reject("CULTURE_ARTICLE_NOT_ALLOWED");}
    }
    private long date(String text){
        for(String pattern:new String[]{"EEE, dd MMM yyyy HH:mm:ss Z","EEE, d MMM yyyy HH:mm:ss Z"})try{SimpleDateFormat format=new SimpleDateFormat(pattern,Locale.ENGLISH);format.setLenient(false);Date parsed=format.parse(text);if(parsed!=null)return parsed.getTime();}catch(Exception ignored){}return 0L;
    }
    private String plain(String html){
        String safe=html.replaceAll("(?is)<(script|style)\\b[^>]*>.*?</\\1>"," ");return (Build.VERSION.SDK_INT>=24?Html.fromHtml(safe,Html.FROM_HTML_MODE_LEGACY):Html.fromHtml(safe)).toString().replace('\uFFFC',' ').replaceAll("\\s+"," ").trim();
    }
    private String excerpt(String html){String text=plain(html);if(text.length()<=260)return text;int end=text.lastIndexOf(' ',260);if(end<180)end=260;return text.substring(0,end)+"…";}
    private boolean cultural(String text){
        String value=Normalizer.normalize(text.toLowerCase(Locale.ROOT),Normalizer.Form.NFD).replaceAll("\\p{M}","");
        return value.matches(".*(ثقاف|فنون|ادب|آداب|تاريخ|علوم|تعليم|تقني|تكنولوجيا|فلسف|لغات|تراث|موسيقى|سينما|بيئ|طبيع|\\b(arts?|culture|literature|history|science|education|technology|philosophy|language|heritage|music|cinema|environment|environnement|technologie|litterature|histoire|langue|patrimoine|musique|cultura|arte|literatura|historia|ciencia|educacion|tecnologia|filosofia|lengua|patrimonio|musica|cine|ambiente|kunst|kultur|literatur|geschichte|wissenschaft|bildung|philosophie|sprache|musik|kino|umwelt)\\b).*" );
    }
    private void credits(JSONObject item,String html)throws Exception {
        Matcher blocks=Pattern.compile("(?is)<div[^>]*class=['\"][^'\"]*text-credits-section[^'\"]*['\"][^>]*>(.*?)</div>").matcher(html);
        ArrayList<String> authors=new ArrayList<>(),translators=new ArrayList<>();
        while(blocks.find()){
            String block=blocks.group(1),label=plain(block).toLowerCase(Locale.ROOT);
            boolean written=label.matches("(?s).*(written|ecrit|écrit|verfasst|escrito|بقلم).*"),translated=label.matches("(?s).*(translated|traduit|traducido|übersetzt|ترجم).*" );
            Matcher names=Pattern.compile("(?is)<a\\b[^>]*>(.*?)</a>").matcher(block);while(names.find()){String name=plain(names.group(1));if(!name.isEmpty()){if(written)authors.add(name);else if(translated)translators.add(name);}}
        }
        item.put("author",String.join("، ",authors));item.put("translator",String.join("، ",translators));
    }
    @PluginMethod public void getArticles(PluginCall call){
        final Source s;final long epoch=call.getData().optLong("epoch",-1);
        try{s=selected(call);if(epoch!=generation.get())throw new IllegalArgumentException("stale");}catch(Exception error){call.reject("CULTURE_CONTEXT_CHANGED");return;}
        try{worker.execute(()->{
            HttpURLConnection connection=null;
            try{
                if(epoch!=generation.get())throw new Exception("stale");
                connection=(HttpURLConnection)new URL(s.home()+"feed/").openConnection();current=connection;connection.setConnectTimeout(8000);connection.setReadTimeout(8000);connection.setInstanceFollowRedirects(false);connection.setRequestProperty("Accept","application/rss+xml, application/xml, text/xml");connection.setRequestProperty("Accept-Encoding","identity");connection.setRequestProperty("User-Agent","Qatra-Culture/1.1");
                if(epoch!=generation.get()||connection.getResponseCode()!=200||connection.getContentLengthLong()>1500000)throw new Exception("Feed unavailable");
                ByteArrayOutputStream bytes=new ByteArrayOutputStream();try(InputStream input=connection.getInputStream()){byte[] buffer=new byte[8192];int count;while((count=input.read(buffer))!=-1){if(epoch!=generation.get()||bytes.size()+count>1500000)throw new Exception("Cancelled or too large");bytes.write(buffer,0,count);}}
                String xml=bytes.toString("UTF-8"),upper=xml.toUpperCase(Locale.ROOT);if(upper.contains("<!DOCTYPE")||upper.contains("<!ENTITY"))throw new Exception("Unsupported feed");
                XmlPullParser parser=Xml.newPullParser();parser.setFeature(XmlPullParser.FEATURE_PROCESS_NAMESPACES,true);parser.setInput(new StringReader(xml));
                ArrayList<JSONObject> articles=new ArrayList<>();HashSet<String> seen=new HashSet<>();JSONObject item=null;JSONArray categories=null;int depth=-1;boolean restricted=false,wrongLanguage=false;
                for(int event=parser.getEventType();event!=XmlPullParser.END_DOCUMENT;event=parser.next()){
                    if(epoch!=generation.get())throw new Exception("stale");
                    if(event==XmlPullParser.START_TAG&&"item".equals(parser.getName())){item=new JSONObject();categories=new JSONArray();depth=parser.getDepth();restricted=false;String itemLang=parser.getAttributeValue("http://www.w3.org/XML/1998/namespace","lang");wrongLanguage=itemLang!=null&&!itemLang.toLowerCase(Locale.ROOT).split("[-_]")[0].equals(s.language);}
                    else if(item!=null&&event==XmlPullParser.START_TAG&&parser.getDepth()==depth+1){
                        String tag=parser.getName();
                        if("title".equals(tag)||"link".equals(tag)||"pubDate".equals(tag)||"description".equals(tag)||"category".equals(tag)||"encoded".equals(tag)){
                            String value=parser.nextText().trim();
                            if("description".equals(tag))item.put("excerpt",excerpt(value));
                            else if("encoded".equals(tag)){
                                credits(item,value);String lower=value.toLowerCase(Locale.ROOT);restricted=lower.matches("(?s).*(content.sharing agreement|content partnership|accord de partenariat|acuerdo de intercambio de contenido|اتفاقية شراكة|creativecommons.org/licenses/by-nc).*" );
                            }
                            else if("category".equals(tag)){if(value.length()<=120&&cultural(value))categories.put(value);}
                            else if("title".equals(tag)&&value.length()<=500)item.put("title",plain(value));
                            else if("link".equals(tag)&&value.length()<=2000)item.put("url",value);
                            else if("pubDate".equals(tag))item.put("publishedAt",date(value));
                        }
                    }else if(item!=null&&event==XmlPullParser.END_TAG&&"item".equals(parser.getName())&&parser.getDepth()==depth){
                        String url=item.optString("url");if(!restricted&&!wrongLanguage&&categories.length()>0&&validArticle(s,url)&&!item.optString("title").isEmpty()&&seen.add(url)){item.put("categories",categories);item.put("language",s.language);item.put("source",s.id);articles.add(item);}item=null;
                    }
                }
                if(epoch!=generation.get())throw new Exception("stale");articles.sort((a,b)->Long.compare(b.optLong("publishedAt"),a.optLong("publishedAt")));JSONArray result=new JSONArray();for(int i=0;i<Math.min(20,articles.size());i++)result.put(articles.get(i));JSObject response=new JSObject();response.put("articles",result);response.put("language",s.language);response.put("source",s.id);response.put("epoch",epoch);call.resolve(response);
            }catch(Exception error){call.reject("CULTURE_FEED_UNAVAILABLE");}finally{if(connection!=null)connection.disconnect();if(current==connection)current=null;}
        });}catch(Exception error){call.reject("CULTURE_FEED_UNAVAILABLE");}
    }
    @Override protected void handleOnDestroy(){generation.incrementAndGet();if(current!=null)current.disconnect();worker.shutdownNow();super.handleOnDestroy();}
}
