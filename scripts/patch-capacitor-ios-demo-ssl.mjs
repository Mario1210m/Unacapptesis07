import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const capacitorDelegate = fileURLToPath(
  new URL(
    '../node_modules/@capacitor/ios/Capacitor/Capacitor/WebViewDelegationHandler.swift',
    import.meta.url,
  ),
);

const marker = 'BERTELLO_DEMO_SSL_BYPASS';
const anchor = '    // MARK: - WKScriptMessageHandler';
const temporaryDemoOverride = [
  '    // BERTELLO_DEMO_SSL_BYPASS: temporal, solo para la compilacion DEBUG de demostracion.',
  '    // El compilado Release mantiene la validacion TLS normal de iOS.',
  '    open func webView(_ webView: WKWebView,',
  '                      didReceive challenge: URLAuthenticationChallenge,',
  '                      completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {',
  '        #if DEBUG',
  '        if challenge.protectionSpace.host == "bertello.137.116.64.157.nip.io",',
  '           challenge.protectionSpace.authenticationMethod == NSURLAuthenticationMethodServerTrust,',
  '           let serverTrust = challenge.protectionSpace.serverTrust {',
  '            completionHandler(.useCredential, URLCredential(trust: serverTrust))',
  '            return',
  '        }',
  '        #endif',
  '',
  '        completionHandler(.performDefaultHandling, nil)',
  '    }',
  '',
].join('\n');

const source = readFileSync(capacitorDelegate, 'utf8');

if (source.includes(marker)) {
  console.log('El bypass TLS temporal de iOS ya estaba aplicado.');
  process.exit(0);
}

if (!source.includes(anchor)) {
  throw new Error(
    'No se encontro el punto de insercion de Capacitor. Revisa si cambio la version de @capacitor/ios.',
  );
}

writeFileSync(
  capacitorDelegate,
  source.replace(anchor, temporaryDemoOverride + anchor),
  'utf8',
);

console.log('Bypass TLS temporal aplicado al compilado iOS DEBUG.');
