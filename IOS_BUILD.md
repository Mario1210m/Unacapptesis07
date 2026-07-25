# Compilar iOS desde Windows con GitHub Actions

El proyecto incluye una plataforma iOS de Capacitor y un workflow que genera
una IPA sin firmar usando un runner macOS de GitHub.

## Generar la IPA

1. Sube el proyecto completo a un repositorio de GitHub.
2. Abre la pestaña **Actions** del repositorio.
3. Selecciona **Build unsigned iOS IPA**.
4. Pulsa **Run workflow** y espera a que termine.
5. Abre la ejecución terminada y descarga el artefacto
   **Bertello-Track-unsigned-ipa**.
6. Descomprime el artefacto para obtener `Bertello-Track-unsigned.ipa`.

## Importante

La IPA generada no incluye una firma de Apple y no se puede instalar
directamente. Debe firmarse para cada iPhone con una Apple Account. Con una
cuenta gratuita, la autorización vence después de siete días y será necesario
firmar e instalar nuevamente la aplicación.

El identificador de la aplicación es `pe.edu.bertellotrack`.

## Actualizar el proyecto iOS

Después de modificar la aplicación web, ejecuta:

```bash
npm run ios:sync
```

La sincronización completa de CocoaPods requiere macOS y se realiza también
dentro del workflow de GitHub Actions.
