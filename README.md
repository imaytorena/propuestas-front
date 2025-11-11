# QCI Front — Svelte + TS + Vite

Este repositorio contiene el frontend de QCI construido con Svelte 5, Vite y TypeScript. A continuación se documenta cómo iniciar el proyecto en desarrollo (con y sin Docker), cómo configurar variables de entorno, cómo preparar un despliegue, y las principales rutas de la aplicación (SPA con page.js).

## Requisitos

- Node.js 20+ (se recomienda 22) y npm
- Docker 24+ y Docker Compose (solo si usarás ejecución con Docker)

## Variables de entorno

La aplicación consume una API externa. Configura la URL base con la variable `VITE_API_BASE`.

- Ejemplo (API local): `VITE_API_BASE=http://localhost:3000`
- Dónde definirla:
  - Sin Docker: crea un archivo `.env` en la raíz o exporta la variable en tu shell antes de ejecutar Vite. Los prefijos `VITE_` son leídos por Vite en tiempo de dev/compilación.
  - Con Docker: ya está mapeada en `docker-compose.yml` y se pasa al contenedor.

## Desarrollo SIN Docker

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo en tu red local:
   ```bash
   npm run dev
   ```
   - La app quedará disponible en http://localhost:5173
   - Si necesitas exponerla a la LAN, usa `npm run dev -- --host`
3. Asegúrate de que tu backend esté accesible en la URL definida por `VITE_API_BASE`.

## Desarrollo CON Docker

Este proyecto incluye un entorno Docker que ejecuta el servidor de desarrollo de Vite dentro del contenedor.

- Red externa requerida: `qci` (debe existir antes de levantar los servicios).
- Imagen/servicio: `qci-front`
- Puerto expuesto: `5173` (host) → `5173` (contenedor)

Pasos:
1. Crear la red (solo una vez):
   ```bash
   docker network create qci
   ```
2. Levantar el contenedor (con build):
   ```bash
   docker compose up --build
   ```
3. Abrir la app: http://localhost:5173

Notas:
- El `docker-compose.yml` fija `platform: linux/amd64`. Si no la necesitas (p. ej., en Linux nativo), puedes comentarla.
- Dentro del contenedor se ejecuta `npm run dev --host`. El script `docker/start` instalará dependencias la primera vez.
- Define `VITE_API_BASE` en tu entorno o en un archivo `.env` para que Compose lo inyecte al contenedor.

## Despliegue (Build de producción)

Este proyecto es una SPA que se construye a estáticos en `dist/`. Opciones para desplegar:

1) Build local y servir estáticos con tu servidor (Nginx, Apache, Caddy, etc.):
   ```bash
   npm ci
   npm run build
   # Carpeta de salida: dist/
   ```
   - Copia el contenido de `dist/` a tu servidor web.
   - Asegura fallback a `index.html` para todas las rutas (SPA). En Nginx, por ejemplo:
     ```nginx
     location / {
       try_files $uri /index.html;
     }
     ```

2) Previsualizar el build localmente:
   ```bash
   npm run preview
   # por defecto en http://localhost:4173
   ```

3) Plataformas de hosting estático (Netlify, Vercel, GitHub Pages, Cloudflare Pages):
   - Comando de build: `npm run build`
   - Directorio de publicación: `dist`
   - Si necesitas reescrituras para SPA, configura el fallback a `index.html`.

4) Docker (opcional) para producción:
   - Actualmente el Dockerfile ejecuta un entorno de desarrollo. Para prod, se recomienda construir con `npm run build` y servir `dist/` con un servidor estático (p. ej., Nginx) en una imagen separada. Ejemplo de multi-stage (referencia):
     ```Dockerfile
     FROM node:22-alpine AS build
     WORKDIR /app
     COPY package*.json ./
     RUN npm ci
     COPY . .
     RUN npm run build

     FROM nginx:alpine
     COPY --from=build /app/dist /usr/share/nginx/html
     # Fallback SPA
     RUN printf "server {\n  listen 80;\n  location / {\n    try_files \\$uri /index.html;\n  }\n}\n" > /etc/nginx/conf.d/default.conf
     ```

## Principales rutas de la app

La navegación se maneja con `page.js` en `src/router.ts`. Rutas disponibles:

- Inicio: `/`
- Participación: `/participacion`

- Ideas:
  - Listado: `/ideas`
  - Crear: `/ideas/crear`
  - Detalle: `/ideas/:ideaId`
  - Editar: `/ideas/:ideaId/editar`

- Propuestas:
  - Listado: `/propuestas`
  - Crear: `/propuestas/crear` (requiere autenticación)
  - Detalle: `/propuestas/:propuestaId`
  - Editar: `/propuestas/:propuestaId/editar`

- Actividades:
  - Listado: `/actividades`
  - Crear: `/actividades/crear` (requiere autenticación)
  - Detalle: `/actividades/:actividadId`
  - Editar: `/actividades/:actividadId/editar`

- Comunidades:
  - Listado: `/comunidades`
  - Crear: `/comunidades/crear`
  - Detalle: `/comunidades/:comunidadId`
  - Editar: `/comunidades/:comunidadId/editar`
  - Recomendar: `/comunidades/:comunidadId/recomendar`

- Usuario / Auth:
  - Perfil: `/usuario`
  - Editar perfil: `/usuario/editar`
  - Login: `/auth/login`
  - Registro: `/auth/registrar`

## IDE recomendado

- Visual Studio Code con la extensión oficial de Svelte: https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode

## Notas útiles

- Comandos npm:
  - `npm run dev`: servidor de desarrollo Vite.
  - `npm run build`: build de producción a `dist/`.
  - `npm run preview`: vista previa local del build.
  - `npm run check`: chequeos de tipos y Svelte.
- Estilos: TailwindCSS 4 + DaisyUI.
- Cliente HTTP: axios.
- Si tu backend vive bajo el mismo dominio, puedes exponerlo como `/api` mediante un reverse proxy y fijar `VITE_API_BASE=/api`.
