# Sistema de Cine

Aplicación web para un cine: cartelera, películas, reseñas, estrenos, preventa, salas, funciones, butacas y administración.

## Índice

- [Objetivos](#objetivos)
- [Funcionalidades](#funcionalidades)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Requisitos](#requisitos)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Rutas](#rutas)
- [Pruebas](#pruebas)
- [Estructura del proyecto](#estructura-del-proyecto)

## Objetivos

- Modelar la película (`Movie`) con tipos estrictos en TypeScript.
- Implementar alta y edición con validaciones (Signal Forms).
- Mantener el estado en Signals centralizados (`signal`/`computed`).
- Componer componentes standalone con signal inputs y `@if`/`@for`.
- Incorporar rutas parametrizadas y una interfaz en español.
- Modelar salas, funciones y butacas (estándar, accesibles y VIP).

## Funcionalidades

- **Principal:** top 3 más vendidas primero y películas destacadas (elegidas por admin).
- **Cartelera:** búsqueda por nombre y filtro por género (lista cerrada de 8).
- **Detalle:** datos, precio vigente, promedio de reseñas y formulario de reseña (estrellas 1–5 + comentario).
- **Próximamente:** estrenos con fecha y botón de alerta ("Avísame").
- **Preventa:** 7 días antes del estreno con precio especial; luego precio normal.
- **Mis películas:** historial visual con póster, fecha y calificación propia.
- **Admin películas:** lista con toggle "En principal", alta y edición (nombre, imagen URL, sinopsis, duración, géneros, edad, fecha de estreno, precios).
- **Admin funciones:** alta y edición (película, sala manual o automática, fecha, hora, formato 2D–5D, idioma), sin solapes y con 30 min entre funciones.
- **Mapa de butacas:** 20 filas en bloques 4/20/4, J/K accesibles 2/10/2, R/S/T VIP con precio mayor; ocupación visible y selección contigua.
- **Persistencia S1:** reseñas, alertas y calificaciones propias en `localStorage`. Salas, funciones y ocupación en memoria.

## Tecnologías

- [Angular](https://angular.dev/) 22.1 (standalone, Signals, signal inputs y Signal Forms)
- Angular Router (rutas parametrizadas, sin guards todavía)
- TypeScript 6.0
- RxJS 7.8
- Vitest 4 para pruebas unitarias

## Arquitectura

La aplicación arranca en `src/main.ts` con `bootstrapApplication` y `provideRouter(routes)`:

- `App`: componente raíz, navegación y outlet.
- `CatalogStore`: películas mock, `computed` de destacadas/top 3/filtradas/próximos estrenos, precios de preventa.
- `ReviewStore`: reseñas con promedio, persistidas en `localStorage`.
- `AlertStore`: alertas de estreno en `localStorage`.
- `MyMoviesStore`: historial mock + calificación propia en `localStorage`.
- `BookingStore`: salas y funciones mock, sala automática, solapes, ocupación y selección.
- `Home`: top 3 y destacadas con links al detalle.
- `MovieList`: buscador y filtro por género.
- `MovieDetail`: datos, precio vigente, reseñas y alta de reseña.
- `ComingSoon`: estrenos con alerta.
- `MyMovies`: historial con calificación propia.
- `MovieAdmin`: lista con toggles y links de alta/edición.
- `MovieForm`: alta y edición con Signal Forms y validadores.
- `ScreeningAdmin` / `ScreeningForm`: funciones con sala automática y validación de solapes.
- `SeatMap`: mapa por función con ocupación y selección contigua.

La UI usa control de flujo integrado (`@if`, `@for`), Signals (`signal`, `computed`, `effect`) y Signal Forms. Estilo base mínimo en `src/styles.css`.

## Requisitos

- Node.js compatible con Angular 22 y npm.
- Navegador actualizado.
- Para S3–S5: proyecto Supabase con Auth, Postgres, Storage y Realtime.

```bash
node --version
npm --version
```

## Instalación y ejecución

```bash
npm ci
npm start
```

Abrir `http://localhost:4200/`.

```bash
npm run build
npm test -- --watch=false
```

No commitear claves `service_role`. Solo URL y anon key en el frontend, con RLS (desde S3).

## Rutas

| Ruta | Vista | Descripción |
| --- | --- | --- |
| `/` | Principal | Top 3 y destacadas. |
| `/peliculas` | Cartelera | Búsqueda por nombre y filtro por género. |
| `/peliculas/:movieId` | Detalle | Datos, precio, reseñas y promedio. |
| `/proximamente` | Próximamente | Estrenos con alerta. |
| `/mis-peliculas` | Mis películas | Historial con calificación propia. |
| `/funciones/:screeningId` | Mapa | Butacas con ocupación y selección. |
| `/admin/peliculas` | Admin | Lista con toggles y accesos. |
| `/admin/funciones` | Admin funciones | Lista con accesos. |
| `/admin/funciones/nueva` | Nueva función | Alta. |
| `/admin/funciones/:screeningId/editar` | Editar función | Modifica una función. |
| `/admin/peliculas/nueva` | Nueva película | Alta. |
| `/admin/peliculas/:movieId/editar` | Editar película | Modifica una película. |

## Pruebas

```bash
npm test -- --watch=false
```

Vitest vía `@angular/build:unit-test` (solo `src/**/*.spec.ts`): 15 archivos, 37 pruebas. Cubren el store (alta, edición, filtros, destacadas, top 3, estrenos, preventa), reseñas, alertas y calificaciones, salas (automática, solapes), butacas (mapa, ocupación, contigüidad, selección), más creación de componentes. Sin e2e.

## Estructura del proyecto

```text
├── src/
│   ├── main.ts
│   ├── styles.css
│   └── app/
│       ├── app.ts / app.html / app.routes.ts / app.config.ts
│       ├── admin/
│       │   ├── movie-admin/   # Lista con toggles
│       │   └── movie-form/    # Alta y edición
│       ├── catalog/
│       │   ├── movie.model.ts / review.model.ts
│       │   ├── home/          # Top 3 y destacadas
│       │   ├── movie-list/    # Buscador y filtro
│       │   ├── movie-detail/  # Datos, precio, funciones y reseñas
│       │   ├── coming-soon/   # Estrenos y alertas
│       │   └── my-movies/     # Historial propio
│       ├── booking/
│       │   ├── screening.model.ts / seat.model.ts
│       │   ├── screening-admin/ # Lista de funciones
│       │   ├── screening-form/  # Alta y edición
│       │   └── seat-map/        # Mapa con selección
│       └── services/
│           ├── catalog-store.ts   # Películas y derivados
│           ├── booking-store.ts   # Salas, funciones y selección
│           ├── review-store.ts    # Reseñas (localStorage)
│           ├── alert-store.ts     # Alertas (localStorage)
│           └── my-movies-store.ts # Historial y ratings
└── public/
```
