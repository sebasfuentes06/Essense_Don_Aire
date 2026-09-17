# Restos de la exportación de Figma Make

Estos archivos venían con la exportación original y **ya no los usa nadie**.

- `index.html`, `vite.config.ts`, `postcss.config.mjs`: una segunda
  configuración de Vite en la raíz que apuntaba a `frontend/` con
  `root: 'frontend'`. La aplicación real se construye con la configuración
  propia de `frontend/vite.config.ts`, así que esta sobraba.
- `pnpm-workspace.yaml`, `pnpm-lock.yaml`: el proyecto se maneja con npm.
- `package-lock.json`: correspondía al `package.json` viejo de la raíz, que
  era una copia de las dependencias del frontend. Ya no coincide con el nuevo.

Se apartaron aquí en vez de borrarlos por si hiciera falta consultarlos.
Se pueden eliminar sin consecuencias; el historial de git también los guarda.

Importante: tenerlos en la raíz hacía que Vercel detectara un proyecto Vite
ahí y se confundiera sobre qué construir.
