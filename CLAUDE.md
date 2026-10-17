# Mundialaustral

Recomendador de partidos del Mundial 2026 para la competencia Mundial Austral (Facultad de Ingeniería, Universidad
Austral). Dado un perfil de usuario, puntúa los 104 partidos de 0 a 100 y los clasifica en Imperdible, Vale la pena y
Resumen.

## Stack
- HTML, CSS y JavaScript planos en el navegador. Sin framework, sin bundler, sin dependencias, sin backend.
- Persistencia: `localStorage` (el perfil del usuario).

## Comandos
No hay `package.json`, build ni tests. Para verlo, abrir `index.html` en el navegador (`start index.html` en Windows).
Para servirlo local: `python -m http.server` en la raíz.

## Estructura
- `index.html` — las cuatro vistas (onboarding, recomendaciones, fixture, perfil) y la carga de scripts.
- `data.js` — `TEAMS`, grupos, sedes, `RIVALRIES`. `fixture.js` — genera los 104 partidos.
- `engine.js` — `scoreMatch`, pesos y umbrales. `app.js` — interfaz y `localStorage`. `style.css` — estilos.
- `docs/arquitectura.md` — explica el motor y el flujo.

## Convenciones
- Los scripts comparten el ámbito global; el orden en `index.html` es `data.js`, `fixture.js`, `engine.js`, `app.js`.
- Los pesos del motor están en el objeto `W` de `scoreMatch` y suman 1. Si se cambian, actualizar la tabla del README y
  de `docs/arquitectura.md`.
- Umbrales de cubo: 70 y 45, repetidos en dos lugares de `engine.js` (partidos con equipos definidos y placeholders).
- Textos de la interfaz y comentarios en español. Sin emojis de color en la documentación.
- Los datos del fixture no son oficiales: no presentarlos como tales.

## Git
Commits y PRs sin atribución a Claude: nada de `Co-Authored-By: Claude` ni "Generated with Claude Code".
