# Arquitectura

Mundial Austral es un sitio estático sin build ni dependencias: un `index.html` que carga cuatro scripts en este orden
(`data.js`, `fixture.js`, `engine.js`, `app.js`) y una hoja de estilos (`style.css`). Todo vive en el navegador. Cómo
correrlo y qué hace está en el [README](../README.md).

## Archivos

| Archivo | Rol |
|---|---|
| `index.html` | Marcado de las cuatro vistas: onboarding, recomendaciones, fixture y perfil. |
| `style.css` | Estilos y paleta del Mundial 2026 (rojo, azul, verde y dorado de los anfitriones). |
| `data.js` | Datos: `TEAMS` (48 selecciones con confederación, ranking, estilo y figuras), grupos, sedes y `RIVALRIES`. |
| `fixture.js` | Genera los 104 partidos (72 de grupos, 32 de eliminación) con fecha, hora local y hora ART, sede y dónde verlos. |
| `engine.js` | El motor de scoring. Expone `window.MUNDIAL_ENGINE.scoreMatch`. |
| `app.js` | La interfaz: navegación entre vistas, render de tarjetas, filtros del fixture, modal de detalle y persistencia. |

Los scripts comparten el ámbito global del navegador; no hay módulos ni empaquetado, por eso el orden de los `<script>`
importa.

## Motor de recomendación

`scoreMatch(match, profile, data)` devuelve `{ score, bucket, label, reasons, breakdown }`. El score va de 0 a 100 y
sale de una combinación lineal de siete señales (cada una normalizada de 0 a 100):

| Señal | Peso | Cómo se calcula |
|---|---|---|
| Afinidad | 0,30 | Selecciones favoritas, confederación, estilo de juego y jugador favorito, de ambos equipos. |
| Etapa | 0,20 | Peso fijo por etapa: de 10 en grupos a 100 en la final. |
| Rivalidad | 0,15 | Tabla `RIVALRIES` en `data.js`, en cualquier orden del par. |
| Estrellas | 0,10 | Cuántas figuras globales hay entre los dos planteles. |
| Paridad | 0,10 | Cercanía en el ranking FIFA y nivel promedio de los dos equipos. |
| Horario | 0,10 | 100 si el partido cae en una franja que el usuario eligió (hora ART), 20 si no. |
| Narrativa | 0,05 | Anfitriones y derbis continentales (salvo UEFA). |

El score se redondea y se asigna a un cubo: 70 o más es **Imperdible**, de 45 a 69 es **Vale la pena** y menos de 45
es **Resumen**. Los partidos de eliminación con equipos todavía sin definir (`placeholder`) se puntúan casi sólo por
etapa (85 %) y horario (15 %). Cada resultado trae `reasons`, frases que explican por qué se recomienda, y `breakdown`,
el aporte de cada señal que la interfaz dibuja.

## Perfil y persistencia

El onboarding arma un perfil (selecciones favoritas, confederaciones, estilos, jugadores y franjas horarias) que
`app.js` guarda en `localStorage` como JSON. Al abrir el sitio, si hay perfil se va directo a las recomendaciones; si no,
al onboarding. Desde la vista de perfil se puede borrar y empezar de nuevo.

## Datos

Los datos de partidos son una proyección plausible al momento de construir el proyecto, no datos oficiales. Para
actualizarlos hay que editar `data.js` y `fixture.js`.
