package pe.edu.bertellotrack;

import android.content.pm.ApplicationInfo;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Bundle;
import android.webkit.SslErrorHandler;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;

public class MainActivity extends BridgeActivity {

    private static final String DEMO_API_HOST = "bertello.137.116.64.157.nip.io";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Solo para el APK debug de demostracion mientras el Ingress usa
        // un certificado autofirmado. Las compilaciones release lo rechazan.
        if ((getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0) {
            bridge.getWebView().setWebViewClient(new BridgeWebViewClient(bridge) {
                @Override
                public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                    String host = Uri.parse(error.getUrl()).getHost();
                    if (DEMO_API_HOST.equalsIgnoreCase(host)) {
                        handler.proceed();
                        return;
                    }
                    handler.cancel();
                }
            });
        }
    }
}
