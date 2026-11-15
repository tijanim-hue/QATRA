package com.qatra.app;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(QatraPlugin.class);
        registerPlugin(QatraAwarenessPlugin.class);
        registerPlugin(QatraMedicinePlugin.class);
        registerPlugin(QatraMedicineAlertsPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
