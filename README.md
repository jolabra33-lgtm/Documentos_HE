# Archivo de Fuentes · Historia de España Contemporánea

Sitio estático e instalable como PWA (Progressive Web App), independiente de cualquier otro
proyecto. Once expedientes de fuentes primarias y secundarias comentadas, de 1808 a 1982.

## Estructura

```
├── index.html                 → portada / catálogo de las 11 unidades
├── unidad-01-...html … unidad-11-...html
├── images/                    → imágenes históricas de los documentos
├── icons/
│   ├── icon-192.png           → icono estándar (purpose: any)
│   ├── icon-512.png           → icono estándar (purpose: any)
│   ├── icon-192-maskable.png  → icono con margen de seguridad (purpose: maskable)
│   ├── icon-512-maskable.png  → ídem, 512 px
│   ├── apple-touch-icon.png   → icono para "Añadir a pantalla de inicio" en iOS
│   ├── favicon-32.png / favicon-16.png
├── manifest.json               → manifiesto de la PWA
├── sw.js                       → service worker mínimo (requisito de instalación)
└── .nojekyll
```

## Publicar en GitHub Pages (repositorio nuevo e independiente)

1. Crea un **repositorio nuevo** en GitHub (público, o privado si tu plan lo permite).
2. Sube **todo el contenido de esta carpeta a la raíz** del repositorio (no dentro de una
   subcarpeta), conservando los nombres de archivo exactos.
3. **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main / (root) → Save.**
4. En uno o dos minutos tendrás la URL pública:
   ```
   https://TU-USUARIO.github.io/TU-REPOSITORIO/
   ```

## Verificar que se puede instalar como aplicación

1. Abre la URL publicada en **Chrome de escritorio**.
2. **DevTools (F12) → pestaña "Application" → "Manifest"**: debe mostrar el nombre, los
   colores y los 4 iconos en verde, sin errores.
3. Recarga la página: debería aparecer el icono ⊕ de instalar en la barra de direcciones.
4. En Android, Chrome ofrecerá "Añadir a pantalla de inicio" de forma automática al cabo de
   unas visitas. En iPhone/iPad (Safari), se añade manualmente con *Compartir → Añadir a
   pantalla de inicio* (usa `apple-touch-icon.png`).

## Notas técnicas

- El manifest y el service worker están enlazados **en las 12 páginas** (portada + 11
  unidades), no solo en `index.html`, para que la app se pueda instalar entres por donde
  entres y la barra de Chrome mantenga el color de marca (`#241c14`) en toda la navegación.
- El service worker (`sw.js`) es intencionadamente mínimo: no cachea nada de forma agresiva,
  solo existe para cumplir el requisito técnico de instalabilidad de Chrome. Así, cada vez
  que actualices una unidad, los visitantes verán siempre la versión más reciente en vez de
  una copia cacheada.
- Los subrayados, notas y el modo oscuro de cada unidad usan la API de almacenamiento propia
  de los artefactos de Claude (`window.storage`), que no existe fuera de Claude.ai. Fuera de
  ahí —incluida esta PWA— la lectura y navegación funcionan con normalidad, pero esas
  anotaciones no se guardan entre sesiones.
- Si cambias el icono más adelante, sustituye los archivos dentro de `icons/` manteniendo
  los mismos nombres y medidas exactas (192×192 y 512×512 para los estándar y maskable,
  180×180 para `apple-touch-icon.png`), para no tener que tocar `manifest.json` ni el HTML.
