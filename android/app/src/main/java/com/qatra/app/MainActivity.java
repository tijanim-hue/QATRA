package com.qatra.app;

import com.getcapacitor.BridgeActivity;
import com.qatra.app.QatraPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(QatraPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
