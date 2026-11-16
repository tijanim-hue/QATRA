package com.qatra.app;

import android.content.Intent;
import android.net.Uri;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name="QatraNewsLinks")
public class QatraNewsLinksPlugin extends Plugin {
    @PluginMethod public void openSource(PluginCall call){
        String source=call.getString("source");
        final String url;
        if("aljazeera-home".equals(source))url="https://www.aljazeera.net/";
        else if("aljazeera-latest".equals(source))url="https://www.aljazeera.net/latest";
        else{call.reject("NEWS_SOURCE_NOT_ALLOWED");return;}
        getActivity().runOnUiThread(()->{
            try{
                Intent intent=new Intent(Intent.ACTION_VIEW,Uri.parse(url));
                intent.addCategory(Intent.CATEGORY_BROWSABLE);
                getActivity().startActivity(intent);
                JSObject result=new JSObject();result.put("opened",true);call.resolve(result);
            }catch(Exception error){call.reject("NEWS_EXTERNAL_OPEN_FAILED");}
        });
    }
}
