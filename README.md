# RESOLVIA — Sitio web oficial

**De principio a fin.**

Este es un sitio estático: HTML, CSS y JavaScript sin frameworks. Funciona directamente en GitHub Pages, tanto en `https://usuario.github.io/repositorio/` como en `https://resolvia.com.mx`. No requiere npm, servidor, base de datos ni compilación.

---

## 1. Estructura del proyecto

```
/
├── index.html            Página principal (todas las secciones)
├── 404.html              Página de error (GitHub Pages la usa sola)
├── privacidad.html       Aviso de privacidad (con datos legales pendientes)
├── CNAME                 Dominio personalizado: resolvia.com.mx
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── .nojekyll             Indica a GitHub Pages que no procese el sitio con Jekyll
├── favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png
│
├── css/
│   ├── variables.css     Colores, tipografías, espaciados (tokens de marca)
│   ├── reset.css         Reset mínimo
│   ├── styles.css        Estilos de todas las secciones (mobile first)
│   └── responsive.css    Ajustes para tablet y escritorio
│
├── js/
│   └── main.js           Menú, animaciones, WhatsApp, formulario
│
└── assets/
    ├── fonts/            Manrope y IBM Plex Mono (auto-alojadas, licencia OFL)
    ├── logos/
    │   ├── resolvia-dark.png/.webp    Logo con texto oscuro → para fondos CLAROS
    │   ├── resolvia-light.png/.webp   Logo con texto claro  → para fondos OSCUROS
    │   ├── resolvia-symbol.png/.webp  Solo el escudo (isotipo)
    │   └── resolvia-logo-1200.png     Logo en alta resolución (datos estructurados)
    ├── images/
    │   ├── resolvia-og.jpg            Imagen para compartir en redes (1200×630)
    │   ├── hero/                      Fotografía principal
    │   ├── projects/                  Fotografías de casos
    │   └── about/                     Fotografías de la sección Nosotros
    └── icons/
        ├── icons.svg                  Sprite de iconos del sitio
        └── icon-192.png, icon-512.png
```

Cada sección en `index.html` y `styles.css` está marcada con un comentario en mayúsculas. Orden de la página (V1.1):

1. `HERO`: Resolvemos. De principio a fin. + WhatsApp
2. `SERVICES`: Qué resolvemos (4 pilares)
3. `VALUE PROPOSITION`: Un problema. Un responsable. Una solución.
4. `PROCESS`: El método RESOLVIA (6 etapas, `#metodo`)
5. `TRUST`: Claridad antes, durante y después
6. `CONTROL`: documentos de seguimiento (`#seguimiento`)
7. `PROJECTS`: trabajos reales (desactivada, `#trabajos`)
8. `CTA`: ¿Tienes algo que resolver?
9. `CONTACT` y `FOOTER`

**Logotipos:** todos salen del archivo oficial. Solo se recortó el fondo. La versión para fondo oscuro (`resolvia-light`) tiene el mismo dibujo, con el texto en blanco cálido. El escudo no se modificó.

---

## 2. Cómo modificar textos

Los textos están escritos directamente en `index.html`. Busca la sección por su comentario (por ejemplo `SERVICES`) y edita el texto entre las etiquetas. No hace falta tocar CSS ni JavaScript.

Si cambias el título o la descripción del sitio, actualízalos también en:
- `<title>` y `<meta name="description">`
- las etiquetas `og:` y `twitter:`
- el bloque JSON-LD (`<script type="application/ld+json">`)

---

## 3. Cómo agregar fotografías

1. Exporta la foto en **WebP** (y de preferencia también en JPG como respaldo). Ancho recomendado: 1600 px para el hero y 1200 px para proyectos. Procura que cada archivo pese menos de 250 KB.
   - Opciones gratuitas: [Squoosh](https://squoosh.app) o `cwebp -q 80 foto.jpg -o foto.webp`.
2. Colócala en la carpeta que le corresponde (`assets/images/hero/`, `projects/` o `about/`). Usa nombres en minúsculas y sin espacios: `oficina-polanco-despues.webp`.
3. **Hero:** en `index.html`, dentro de `<figure class="hero__media">`, sustituye el bloque `<div class="media-placeholder ...">…</div>` por el `<picture>` que aparece en el comentario justo arriba.
4. Escribe siempre un `alt` que describa lo que se ve en la foto: *“Oficina remodelada con estaciones de trabajo y plafón nuevo”*.
5. Indica `width` y `height` con las medidas reales de la imagen para que la página no “brinque” al cargar.
6. Usa `loading="lazy"` en todas las fotos, excepto en la del hero.

> Usa solo fotografías de obra real. Evita fotos de stock y renders.

---

## 4. Cómo agregar un trabajo (y activar la sección)

La sección `PROJECTS` (`#trabajos`) está **desactivada** con el atributo `hidden` hasta que haya casos reales documentados. Así el sitio no muestra mensajes de “próximamente”.

1. En `index.html`, sección `PROJECTS`, copia la **plantilla comentada** `<article class="case">…</article>`.
2. Pégala dentro de `<div class="projects__grid">`, fuera del comentario.
3. Completa categoría, nombre, ubicación, duración y los tres pasos **Problema → Solución → Resultado**. Lo que importa es cómo se resolvió, no el tamaño o el monto de la obra.
4. Sube las fotos **antes** y **después** a `assets/images/projects/` y ajusta las rutas.
5. Quita `hidden` de `<section class="projects section" id="trabajos" …>`.
6. Agrega “Trabajos” al menú (`site-nav`, `mobile-menu` y footer) con `href="#trabajos"`.

Antes de publicar un caso, confirma que el cliente autoriza mostrar su nombre y sus fotografías. No publiques métricas ni testimonios que no puedas respaldar.

### Componentes para crecer

Debajo de `PROJECTS` hay un comentario `COMPONENTES PARA CRECER` con plantillas para **testimonios**, **indicadores** y **lista de clientes o industrias**. Sus estilos ya existen (`styles.css`, sección 17). Actívalos solo con información real.

### Documentos de seguimiento

Las cuatro tarjetas de `#seguimiento` son maquetas hechas en HTML y CSS. No son imágenes y no contienen datos de clientes. Si algún día quieres usar capturas reales de tus documentos, anonimízalas primero.

## 5. Cómo actualizar teléfono o correo

El teléfono y el correo aparecen en varios lugares. Busca y reemplaza en **todos** estos archivos:

| Dato | Buscar | Archivos |
|---|---|---|
| Teléfono visible | `+52 55 3310 1723` | `index.html`, `privacidad.html` (también en el JSON-LD) |
| Enlace de teléfono | `tel:+525533101723` | `index.html`, `privacidad.html` |
| WhatsApp | `525533101723` | `index.html` (enlaces `wa.me`) y `js/main.js` → `CONFIG.whatsappNumber` |
| Correo | `contacto@resolvia.com.mx` | `index.html`, `privacidad.html`, `js/main.js` → `CONFIG.email` |

El mensaje prellenado de WhatsApp se define en `js/main.js` → `CONFIG.whatsappMessage`.

### Conectar el formulario (Formspree u otro servicio)

GitHub Pages no puede procesar formularios por su cuenta. Mientras no conectes un servicio, el botón “Enviar mensaje” abre la aplicación de correo del visitante con el mensaje ya redactado. El sitio no finge un envío.

Para recibir los mensajes directamente:
1. Crea un formulario en [formspree.io](https://formspree.io). También funciona cualquier servicio que acepte `POST` con `FormData` y responda en JSON.
2. Copia la URL del formulario, por ejemplo `https://formspree.io/f/abcdwxyz`.
3. Pégala en `index.html` → `<form … data-endpoint="">`, o en `js/main.js` → `CONFIG.formEndpoint`.
4. Menciona al proveedor en `privacidad.html`, sección 4.

La URL de Formspree es pública por diseño. **Nunca** pongas claves privadas o secretas en este repositorio.

---

## 6. Cómo probarlo localmente

Los iconos se cargan desde un archivo SVG, así que conviene abrir el sitio con un servidor local y no con doble clic:

```bash
# Desde la carpeta del proyecto
python3 -m http.server 8000
# Abre http://localhost:8000
```

También funciona `npx serve`, o la extensión “Live Server” de VS Code.

---

## 7. Cómo publicar en GitHub Pages

```bash
git init
git add .
git commit -m "Sitio RESOLVIA v1.0"
git branch -M main
git remote add origin https://github.com/USUARIO/REPOSITORIO.git
git push -u origin main
```

Después, en GitHub:
1. Ve a **Settings → Pages**.
2. En **Source**, elige **Deploy from a branch**.
3. Elige la rama `main` y la carpeta `/ (root)`, y guarda.
4. En uno o dos minutos el sitio estará en `https://USUARIO.github.io/REPOSITORIO/`.

Todas las rutas son relativas, así que el sitio funciona igual en esa dirección y en el dominio propio. `404.html` detecta sola si está en `*.github.io/repositorio/` o en el dominio.

> **Recuerda:** todo lo que subas a un repositorio público es información pública.

---

## 8. Cómo configurar el dominio personalizado

El archivo `CNAME` ya contiene `resolvia.com.mx`.

1. En **Settings → Pages → Custom domain**, escribe `resolvia.com.mx` y guarda.
2. En el proveedor del dominio, crea estos registros DNS:

   | Tipo | Nombre | Valor |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | USUARIO.github.io |

   Antes de configurarlos, confirma estas IPs en la documentación oficial: [Managing a custom domain for your GitHub Pages site](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
3. Espera a que el DNS se propague (desde minutos hasta 24 horas).
4. Activa **Enforce HTTPS** en Settings → Pages en cuanto GitHub emita el certificado.
5. Recomendado: verifica el dominio en **Settings → Pages → Verified domains** de tu cuenta.

---

## Analítica (Google Analytics 4)

En el `<head>` de `index.html` hay un bloque comentado que dice `GOOGLE ANALYTICS - INSERT GA4 ID HERE`. Descoméntalo y reemplaza `G-XXXXXXXXXX` por tu Measurement ID. Al activarlo, actualiza la sección 7 del Aviso de privacidad.

## Pendientes antes de lanzar

- [ ] Fotografía real para el hero (y opcionalmente para Nosotros).
- [ ] Primeros casos reales en Proyectos, con autorización del cliente.
- [ ] Datos legales del Aviso de privacidad (todo lo marcado `[DATOS LEGALES PENDIENTES]`).
- [ ] Endpoint del formulario (Formspree o equivalente).
- [ ] ID de Google Analytics 4 (opcional).
- [ ] DNS de `resolvia.com.mx` y HTTPS.
