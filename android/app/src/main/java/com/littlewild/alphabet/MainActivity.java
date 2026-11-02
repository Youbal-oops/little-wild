package com.littlewild.alphabet;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import org.json.JSONArray;
import org.json.JSONObject;

/** Bundled game, with optional system speech recognition and no saved recordings. */
public final class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final int MICROPHONE_REQUEST = 41;
    private WebView webView;
    private SpeechRecognizer recognizer;
    private boolean pendingPermission = false;
    private boolean speechActive = false;
    private int speechGeneration = 0;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        final FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.WHITE);
        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(178,255,233));
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setSupportZoom(false);
        webView.addJavascriptInterface(new VoiceBridge(),"AndroidVoice");
        webView.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri=request.getUrl();
                return !HOST.equals(uri.getHost()) || !"https".equals(uri.getScheme());
            }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri=request.getUrl(); String path=uri.getPath();
                if (!HOST.equals(uri.getHost()) || !"https".equals(uri.getScheme()) || path==null || path.contains("..") || path.contains("\\")) return error(403,"Forbidden");
                String asset=path.equals("/")?"index.html":path.substring(1);
                try {
                    InputStream stream=getAssets().open(asset);
                    String mime=asset.endsWith(".html")?"text/html":asset.endsWith(".js")?"text/javascript":asset.endsWith(".css")?"text/css":asset.endsWith(".wav")?"audio/wav":asset.endsWith(".svg")?"image/svg+xml":asset.endsWith(".ttf")?"font/ttf":"text/plain";
                    return new WebResourceResponse(mime,asset.endsWith(".wav")||asset.endsWith(".ttf")?null:"UTF-8",stream);
                } catch(IOException exception) { return error(404,"Not Found"); }
            }
        });
        root.addView(webView,new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT,FrameLayout.LayoutParams.MATCH_PARENT));
        setContentView(root);
        if(Build.VERSION.SDK_INT>=30) getWindow().setDecorFitsSystemWindows(false);
        else getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE|View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN|View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR|View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
        getWindow().setStatusBarColor(Color.rgb(178,255,233));
        getWindow().setNavigationBarColor(Color.WHITE);
        root.post(new Runnable(){@Override public void run(){
            if(Build.VERSION.SDK_INT>=30&&root.getWindowInsetsController()!=null) root.getWindowInsetsController().setSystemBarsAppearance(8|16,8|16);
        }});
        // Apply insets to a parent layout so the WebView itself has smaller bounds.
        // The game's navigation occupies a normal flex row inside those bounds.
        root.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener(){
            @Override public WindowInsets onApplyWindowInsets(View view,WindowInsets insets){
                if(Build.VERSION.SDK_INT>=30){
                    android.graphics.Insets bars=insets.getInsets(WindowInsets.Type.systemBars()|WindowInsets.Type.displayCutout());
                    view.setPadding(bars.left,bars.top,bars.right,bars.bottom);
                    return WindowInsets.CONSUMED;
                }
                view.setPadding(insets.getSystemWindowInsetLeft(),insets.getSystemWindowInsetTop(),insets.getSystemWindowInsetRight(),insets.getSystemWindowInsetBottom());
                return insets.consumeSystemWindowInsets();
            }
        });
        root.requestApplyInsets();
        webView.loadUrl("https://"+HOST+"/index.html");
    }

    public final class VoiceBridge {
        @JavascriptInterface public boolean isAvailable(){return SpeechRecognizer.isRecognitionAvailable(MainActivity.this);}
        @JavascriptInterface public void start(){runOnUiThread(new Runnable(){@Override public void run(){requestVoice();}});}
        @JavascriptInterface public void cancel(){runOnUiThread(new Runnable(){@Override public void run(){cancelVoice();}});}
    }

    private void requestVoice(){
        cancelVoice();
        if(!SpeechRecognizer.isRecognitionAvailable(this)){emit("unavailable",null);return;}
        if(checkSelfPermission(Manifest.permission.RECORD_AUDIO)!=PackageManager.PERMISSION_GRANTED){
            pendingPermission=true;
            requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO},MICROPHONE_REQUEST);
            return;
        }
        startVoice();
    }
    @Override public void onRequestPermissionsResult(int request,String[] permissions,int[] results){
        super.onRequestPermissionsResult(request,permissions,results);
        if(request!=MICROPHONE_REQUEST)return;
        pendingPermission=false;
        if(results.length>0&&results[0]==PackageManager.PERMISSION_GRANTED)emit("ready",null);
        else emit("permission",null);
    }
    private void startVoice(){
        final int token=++speechGeneration;speechActive=true;
        try{
            if(Build.VERSION.SDK_INT>=31&&SpeechRecognizer.isOnDeviceRecognitionAvailable(this))recognizer=SpeechRecognizer.createOnDeviceSpeechRecognizer(this);
            else recognizer=SpeechRecognizer.createSpeechRecognizer(this);
            recognizer.setRecognitionListener(new RecognitionListener(){
                private boolean current(){return speechActive&&token==speechGeneration;}
                @Override public void onReadyForSpeech(Bundle params){if(current())emit("listening",null);}
                @Override public void onBeginningOfSpeech(){}
                @Override public void onRmsChanged(float rms){}
                @Override public void onBufferReceived(byte[] buffer){}
                @Override public void onEndOfSpeech(){if(current())emit("processing",null);}
                @Override public void onError(int code){
                    if(!current())return;speechActive=false;
                    String status=code==SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS?"permission":code==SpeechRecognizer.ERROR_NETWORK||code==SpeechRecognizer.ERROR_NETWORK_TIMEOUT?"network":code==SpeechRecognizer.ERROR_LANGUAGE_NOT_SUPPORTED||code==SpeechRecognizer.ERROR_LANGUAGE_UNAVAILABLE?"language":"uncertain";
                    emit(status,null);
                }
                @Override public void onResults(Bundle results){
                    if(!current())return;speechActive=false;
                    ArrayList<String> words=results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                    emit("results",words);
                }
                @Override public void onPartialResults(Bundle partial){}
                @Override public void onEvent(int event,Bundle params){}
            });
            Intent intent=new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE,"en-US");
            intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS,false);
            intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS,4);
            intent.putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE,true);
            recognizer.startListening(intent);
        }catch(Exception exception){cancelVoice();emit("unavailable",null);}
    }
    private void cancelVoice(){
        pendingPermission=false;speechActive=false;speechGeneration++;
        if(recognizer!=null){recognizer.cancel();recognizer.destroy();recognizer=null;}
    }
    private void emit(String status,ArrayList<String> results){
        if(webView==null)return;
        try{
            JSONObject detail=new JSONObject();detail.put("status",status);
            if(results!=null)detail.put("results",new JSONArray(results));
            webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('littlewild-voice',{detail:"+detail.toString()+"}))",null);
        }catch(Exception ignored){}
    }
    private static WebResourceResponse error(int code,String reason){return new WebResourceResponse("text/plain","UTF-8",code,reason,Collections.emptyMap(),new ByteArrayInputStream(new byte[0]));}
    @Override protected void onPause(){cancelVoice();webView.evaluateJavascript("window.LittleWild&&window.LittleWild.pause()",null);webView.onPause();super.onPause();}
    @Override protected void onResume(){super.onResume();if(webView!=null)webView.onResume();}
    @Override public void onBackPressed(){webView.evaluateJavascript("window.LittleWild?window.LittleWild.back():false",new ValueCallback<String>(){@Override public void onReceiveValue(String result){if(!"true".equals(result))finish();}});}
    @Override protected void onDestroy(){cancelVoice();webView.removeJavascriptInterface("AndroidVoice");webView.destroy();webView=null;super.onDestroy();}
}
