package com.letsfixmoney.snapshot;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.print.PrintAttributes;
import android.print.PrintJob;
import android.print.PrintManager;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.CookieManager;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.Toolbar;
import androidx.activity.ComponentActivity;
import androidx.activity.OnBackPressedCallback;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;
import java.io.ByteArrayInputStream;
import java.io.OutputStream;
import java.util.Collections;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.json.JSONObject;

public final class MainActivity extends ComponentActivity {
    private static final String ORIGIN = "https://appassets.androidplatform.net";
    private static final String HOME_PATH = "/assets/site/apps/financial-reset/index.html";
    private static final String HOME_URL = ORIGIN + HOME_PATH;
    private static final int OPEN_FILE = 1, SAVE_FILE = 2;
    private final ExecutorService writer = Executors.newSingleThreadExecutor();
    private WebView webView;
    private ValueCallback<Uri[]> fileCallback;
    private byte[] pendingExport;
    private boolean writingExport;
    private boolean clearHistoryAfterLoad = true;
    private PrintJob printJob;

    @SuppressLint("SetJavaScriptEnabled")
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setBackgroundColor(Color.rgb(246, 247, 242));
        Toolbar toolbar = new Toolbar(this);
        toolbar.setTitle(R.string.app_name);
        toolbar.setSubtitle(R.string.app_subtitle);
        toolbar.setTitleTextColor(Color.rgb(22, 63, 57));
        layout.addView(toolbar, new LinearLayout.LayoutParams(-1, -2));
        setActionBar(toolbar);
        webView = new WebView(this);
        webView.setImportantForAutofill(View.IMPORTANT_FOR_AUTOFILL_NO_EXCLUDE_DESCENDANTS);
        layout.addView(webView, new LinearLayout.LayoutParams(-1, 0, 1));
        setContentView(layout);
        // Target 36 is edge-to-edge. Keep controls and file inputs above system bars/IME.
        layout.setOnApplyWindowInsetsListener((v, insets) -> {
            if (Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout() | WindowInsets.Type.ime());
                v.setPadding(bars.left, bars.top, bars.right, bars.bottom);
            } else {
                v.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(), insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            }
            return insets;
        });
        layout.requestApplyInsets();

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(false);
        settings.setDatabaseEnabled(false);
        settings.setSaveFormData(false);
        settings.setAllowFileAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        // Needed for files explicitly selected through Android's document picker.
        // All content:// navigation and subresource loads are blocked below.
        settings.setAllowContentAccess(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setSupportMultipleWindows(false);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        CookieManager.getInstance().setAcceptCookie(false);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, false);
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
        WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this)).build();
        webView.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (isTrusted(uri) && "GET".equals(request.getMethod())) {
                    WebResourceResponse asset = loader.shouldInterceptRequest(uri);
                    if (asset != null) return asset;
                }
                return new WebResourceResponse("text/plain", "UTF-8", 403, "Blocked", Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (isHome(uri)) return false;
                if (request.isForMainFrame() && request.hasGesture()) openExternal(uri);
                return true;
            }
            @Override public void onPageFinished(WebView view, String url) {
                if (clearHistoryAfterLoad) { view.clearHistory(); clearHistoryAfterLoad = false; }
                if (state != null) tellPage("The previous session was cleared. Re-import statements or load a saved plan to continue.");
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (!isHome(Uri.parse(view.getUrl() == null ? "" : view.getUrl()))) return false;
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("*/*");
                // Banks/providers use inconsistent MIME types for CSV, OFX, QFX and QBO.
                // The shared parser validates extension, format, size and CAD currency.
                try { startActivityForResult(intent, OPEN_FILE); }
                catch (ActivityNotFoundException ex) { fileCallback.onReceiveValue(null); fileCallback = null; toast("No document picker is available."); }
                return true;
            }
        });
        if (!WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
            TextView message = new TextView(this);
            message.setPadding(32, 32, 32, 32);
            message.setText(R.string.update_webview);
            layout.removeView(webView);
            layout.addView(message);
            return;
        }
        if (WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) WebViewCompat.addWebMessageListener(webView, "MoneySnapshotAndroid", Collections.singleton(ORIGIN),
                (view, message, sourceOrigin, isMainFrame, replyProxy) -> {
                    if (!isMainFrame || !isTrusted(sourceOrigin) || !isHome(Uri.parse(view.getUrl() == null ? "" : view.getUrl()))) return;
                    String raw = message.getData();
                    if (raw == null || raw.length() > ExportPolicy.MAX_BYTES + 1024) return;
                    try {
                        JSONObject request = new JSONObject(raw);
                        if ("save".equals(request.optString("type"))) saveDocument(request.getString("filename"), request.getString("text"));
                        else if ("print".equals(request.optString("type"))) printReport();
                        else if ("open".equals(request.optString("type"))) openExternal(Uri.parse(request.getString("url")));
                    } catch (Exception ex) { tellPage("That action could not be completed. Try again."); }
                });
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override public void handleOnBackPressed() { confirmExit(); }
        });
        webView.loadUrl(HOME_URL);
    }

    private static boolean isTrusted(Uri uri) {
        return "https".equals(uri.getScheme()) && "appassets.androidplatform.net".equals(uri.getHost()) && (uri.getPort() == -1 || uri.getPort() == 443) && uri.getUserInfo() == null;
    }
    private static boolean isHome(Uri uri) { return isTrusted(uri) && HOME_PATH.equals(uri.getPath()); }
    private void openExternal(Uri uri) {
        if (isTrusted(uri) && uri.getPath() != null && uri.getPath().startsWith("/assets/site/")) {
            uri = uri.buildUpon().authority("www.letsfixmoney.com").encodedPath(uri.getEncodedPath().substring("/assets/site".length())).build();
        }
        if (!"https".equals(uri.getScheme()) || uri.getHost() == null || uri.getUserInfo() != null) { toast("This link cannot be opened."); return; }
        try { startActivity(new Intent(Intent.ACTION_VIEW, uri).addCategory(Intent.CATEGORY_BROWSABLE)); }
        catch (ActivityNotFoundException ex) { toast("No browser is available to open this link."); }
    }
    private void saveDocument(String filename, String text) {
        if (pendingExport != null || writingExport) { tellPage("Finish the current save before starting another."); return; }
        String mime = ExportPolicy.mimeFor(filename);
        pendingExport = ExportPolicy.bytesFor(text);
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType(mime).putExtra(Intent.EXTRA_TITLE, filename);
        try { startActivityForResult(intent, SAVE_FILE); }
        catch (ActivityNotFoundException ex) { pendingExport = null; tellPage("No document saver is available."); }
    }
    @Override protected void onActivityResult(int code, int result, Intent data) {
        super.onActivityResult(code, result, data);
        Uri uri = result == RESULT_OK && data != null ? data.getData() : null;
        if (uri != null && !"content".equals(uri.getScheme())) uri = null;
        if (code == OPEN_FILE && fileCallback != null) {
            fileCallback.onReceiveValue(uri == null ? null : new Uri[]{uri}); fileCallback = null;
        } else if (code == SAVE_FILE) {
            byte[] bytes = pendingExport; pendingExport = null;
            if (uri == null || bytes == null) { tellPage("Save cancelled. Nothing was exported."); return; }
            Uri destination = uri;
            writingExport = true;
            writer.execute(() -> {
                String message;
                try (OutputStream stream = getContentResolver().openOutputStream(destination, "wt")) {
                    if (stream == null) throw new java.io.IOException("Destination unavailable");
                    stream.write(bytes); stream.flush(); message = "File saved to your chosen location.";
                } catch (Exception ex) { message = "The file could not be fully saved. Retry and check the destination before closing this session."; }
                java.util.Arrays.fill(bytes, (byte)0);
                String finalMessage = message;
                runOnUiThread(() -> { writingExport = false; if (!isDestroyed()) tellPage(finalMessage); });
            });
        }
    }
    private void printReport() {
        if (printJob != null && !printJob.isCompleted() && !printJob.isCancelled() && !printJob.isFailed()) { toast("Finish the current print job first."); return; }
        PrintManager manager = (PrintManager)getSystemService(PRINT_SERVICE);
        if (manager == null) { finishPrint(); tellPage("Printing is unavailable on this device."); return; }
        try {
            printJob = manager.print("Money Snapshot", webView.createPrintDocumentAdapter("Money Snapshot"), new PrintAttributes.Builder().build());
            webView.postDelayed(new Runnable() {
                @Override public void run() {
                    if (isDestroyed()) return;
                    if (printJob == null || printJob.isCompleted() || printJob.isCancelled() || printJob.isFailed()) finishPrint();
                    else webView.postDelayed(this, 500);
                }
            }, 500);
        } catch (RuntimeException ex) { finishPrint(); tellPage("Printing could not start. Try saving the text report instead."); }
    }
    private void finishPrint() { if (webView != null) webView.evaluateJavascript("window.dispatchEvent(new Event('afterprint'))", null); printJob = null; }
    private void tellPage(String message) {
        if (webView != null) webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('money-snapshot-native-status',{detail:" + JSONObject.quote(message) + "}))", null);
        toast(message);
    }
    private void toast(String text) { Toast.makeText(this, text, Toast.LENGTH_LONG).show(); }
    @Override public boolean onCreateOptionsMenu(Menu menu) {
        menu.add(0, 1, 0, R.string.reload); menu.add(0, 2, 1, R.string.website); menu.add(0, 3, 2, R.string.privacy); menu.add(0, 4, 3, R.string.about); return true;
    }
    @Override public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case 1: new AlertDialog.Builder(this).setTitle(R.string.reset_title).setMessage(R.string.reset_message).setNegativeButton("Cancel", null).setPositiveButton("Clear session", (d, w) -> { clearHistoryAfterLoad = true; webView.loadUrl(HOME_URL); }).show(); return true;
            case 2: openExternal(Uri.parse("https://www.letsfixmoney.com/")); return true;
            case 3: new AlertDialog.Builder(this).setTitle(R.string.privacy).setMessage("Statements and analysis stay on this device in memory. No analytics, account login or network access is included. Android's file picker can access cloud providers you have installed; choose local storage if you want local-only files. Saved reports and plans are written only to the destination you select. Closing or clearing this session removes unsaved analysis.").setPositiveButton("Close", null).show(); return true;
            case 4: new AlertDialog.Builder(this).setTitle(R.string.about).setMessage(R.string.about_message).setPositiveButton("Close", null).show(); return true;
            default: return super.onOptionsItemSelected(item);
        }
    }
    private void confirmExit() {
        if (webView != null && webView.canGoBack()) { webView.goBack(); return; }
        new AlertDialog.Builder(this).setTitle(R.string.leave_title).setMessage(R.string.leave_message).setNegativeButton("Keep working", null).setPositiveButton("Close", (d,w) -> finish()).show();
    }
    @Override protected void onDestroy() {
        if (fileCallback != null) { fileCallback.onReceiveValue(null); fileCallback = null; }
        if (pendingExport != null) java.util.Arrays.fill(pendingExport, (byte)0);
        pendingExport = null;
        if (webView != null) { webView.stopLoading(); webView.clearHistory(); webView.clearCache(true); webView.removeAllViews(); webView.destroy(); webView = null; }
        writer.shutdown();
        super.onDestroy();
    }
}
