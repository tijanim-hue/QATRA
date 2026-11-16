package com.qatra.app;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String PENDING_MEDICINE = "qatra.pendingMedicine";
    private final Handler medicineHandler = new Handler(Looper.getMainLooper());
    private boolean pendingMedicine;
    private boolean medicineResumed;
    private long medicineGeneration;
    private int medicineAttempts;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        pendingMedicine = savedInstanceState != null && savedInstanceState.getBoolean(PENDING_MEDICINE, false);
        captureMedicineIntent(getIntent());
        registerPlugin(QatraPlugin.class);
        registerPlugin(QatraAwarenessPlugin.class);
        registerPlugin(QatraMedicinePlugin.class);
        registerPlugin(QatraMedicineAlertsPlugin.class);
        registerPlugin(QatraMedicineImagesPlugin.class);
        registerPlugin(QatraMedicineDeletionPlugin.class);
        super.onCreate(savedInstanceState);
    }

    private void captureMedicineIntent(Intent intent) {
        if (intent != null && intent.getBooleanExtra("openMedicine", false)) {
            pendingMedicine = true;
            medicineGeneration++;
            intent.removeExtra("openMedicine");
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        captureMedicineIntent(intent);
        scheduleMedicineOpen();
    }

    @Override
    public void onResume() {
        super.onResume();
        medicineResumed = true;
        scheduleMedicineOpen();
    }

    private void scheduleMedicineOpen() {
        medicineHandler.removeCallbacks(openMedicine);
        medicineAttempts = 0;
        if (medicineResumed && pendingMedicine) medicineHandler.post(openMedicine);
    }

    private final Runnable openMedicine = new Runnable() {
        @Override
        public void run() {
            if (!medicineResumed || !pendingMedicine || isFinishing()) return;
            if (++medicineAttempts > 80) return;
            final long generation = medicineGeneration;
            if (getBridge() == null || getBridge().getWebView() == null) {
                medicineHandler.postDelayed(this, 250L);
                return;
            }
            getBridge().getWebView().evaluateJavascript(
                "(function(){try{var s=document.getElementById('medicineSheet');"
                + "if(!s||!window.QatraMedicine||typeof window.QatraMedicine.open!=='function')return false;"
                + "window.QatraMedicine.open();return !s.hidden;}catch(e){return false;}})()",
                result -> {
                    if (generation != medicineGeneration || !medicineResumed) return;
                    if ("true".equals(result)) pendingMedicine = false;
                    else if (pendingMedicine) medicineHandler.postDelayed(openMedicine, 250L);
                }
            );
        }
    };

    @Override
    public void onPause() {
        medicineResumed = false;
        medicineGeneration++;
        medicineHandler.removeCallbacks(openMedicine);
        super.onPause();
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        outState.putBoolean(PENDING_MEDICINE, pendingMedicine);
        super.onSaveInstanceState(outState);
    }
}
