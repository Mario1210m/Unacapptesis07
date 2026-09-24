# Compilar iOS desde Windows con GitHub Actions

El proyecto incluye una plataforma iOS de Capacitor y un workflow que genera
una IPA sin firmar usando un runner macOS de GitHub.

## Generar la IPA

1. Sube el proyecto completo a un repositorio de GitHub.
2. Abre la pestaña **Actions** del repositorio.
3. Selecciona **Build iOS demo (unsigned IPA)**.
4. Pulsa **Run workflow** y espera a que termine.
5. Abre la ejecución terminada y descarga el artefacto
   **Bertello-Track-demo-unsigned-ipa**.
6. Descomprime el artefacto para obtener
   `Bertello-Track-demo-unsigned.ipa`.

## Importante

La IPA generada no incluye una firma de Apple y no se puede instalar
directamente. Debe firmarse para cada iPhone con una Apple Account. Con una
cuenta gratuita, la autorización vence después de siete días y será necesario
firmar e instalar nuevamente la aplicación.

El identificador de la aplicación es `pe.edu.bertellotrack`.

## Firmar e instalar temporalmente desde Windows

1. Instala iTunes desde el sitio de Apple y conecta el iPhone por USB.
2. En el iPhone, acepta **Confiar en este ordenador**.
3. Abre Sideloadly y comprueba que el dispositivo aparezca en **iDevice**.
4. Arrastra `Bertello-Track-demo-unsigned.ipa` a Sideloadly.
5. Escribe tu Apple Account y pulsa **Start**. La contraseña se ingresa
   solamente en Sideloadly; no debe guardarse en GitHub ni en el proyecto.
6. En el iPhone, habilita el modo desarrollador si iOS lo solicita y confia
   en el perfil desde **Ajustes > General > VPN y gestion de dispositivos**.

## HTTPS temporal de demostracion

El backend actual presenta un certificado no confiable. Por eso este workflow
aplica, despues de `npm ci`, una excepcion limitada al compilado `Debug` y al
host `bertello.137.116.64.157.nip.io`. El compilado `Release` conserva la
validacion TLS normal. Esta excepcion es solo para la demostracion y debe
retirarse cuando el Ingress tenga un certificado valido, antes de publicar la
aplicacion.

## Actualizar el proyecto iOS

Después de modificar la aplicación web, ejecuta:

```bash
npm run ios:sync
```

La sincronización completa de CocoaPods requiere macOS y se realiza también
dentro del workflow de GitHub Actions.
