package com.qatra.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // هذا السطر هو الذي يربط أوامر الواجهة بنظام أندرويد
        registerPlugin(QatraPlugin.class);
    }
}
