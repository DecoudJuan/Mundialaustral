# Mundialaustral

Repositorio donde se sube el desarrollo de la competencia **Mundial Austral**, organizada por el departamento de Inteligencia Artificial de la Facultad de Ingeniería, **Universidad Austral**.

---

# Mundial 2026 — Recomendador de Partidos

Motor de recomendación inteligente para el Mundial 2026 (48 selecciones, 104 partidos).

## Idea

Inspirado en sistemas tipo Spotify: analiza el perfil del usuario (selecciones favoritas, jugadores, estilo de juego, disponibilidad horaria) y clasifica cada uno de los 104 partidos en tres categorías:

- 🔴 **Imperdible** — score ≥ 70
- 🔵 **Vale la pena** — score 45-69
- 🟢 **Resumen** — score < 45

## Cómo correrlo

No requiere build. Solo abrí `index.html` en cualquier navegador moderno.

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

## Arquitectura

```
mundial/
├── index.html    → 4 vistas: onboarding, recomendaciones, fixture, perfil
├── style.css     → paleta Mundial 2026 (anfitriones USA/CAN/MEX)
├── data.js       → 48 selecciones, 12 grupos, 16 sedes, rivalidades
├── fixture.js    → genera los 104 partidos con fecha/hora/sede
├── engine.js     → motor de scoring 0-100
└── app.js        → UI + persistencia (localStorage)
```

## Motor de recomendación

Cada partido se evalúa con una combinación lineal ponderada de señales:

| Señal | Peso | Qué mide |
|---|---|---|
| Afinidad de equipos | 30% | Selecciones favoritas, confederación, jugadores favoritos |
| Etapa | 20% | Grupos → R32 → Octavos → Cuartos → Semis → Final |
| Rivalidad | 15% | Clásicos históricos (ARG-BRA=100, ENG-GER=95, MEX-USA=95) |
| Estrellas | 10% | Presencia de figuras globales en cancha |
| Paridad | 10% | Cercanía en ranking FIFA |
| Horario | 10% | Disponibilidad del usuario (ART) |
| Narrativa | 5% | Anfitriones, derbis continentales |

El score se mapea a un cubo. Cada partido incluye razones explicables ("Juega tu seleccionado favorito", "Clásico mundial", etc.) y un breakdown visual de cómo se calculó.

## Por partido

- 📍 Estadio y ciudad (Azteca, MetLife, SoFi, BC Place, etc.)
- 🕗 Hora local + hora ART
- 📺 Dónde verlo según región (TyC, Telefé, DSports, ESPN, FOX, Telemundo, Televisa, BBC...)
- ⭐ Figuras en cancha
- 📝 Por qué te lo recomendamos
- 📊 Breakdown del score

## Paleta

Inspirada en los anfitriones del Mundial 2026:

- `#E4002B` Rojo (Canadá / México)
- `#002F87` Azul (USA)
- `#00B140` Verde (México)
- `#FFD100` Dorado (acento)

## Licencia

Proyecto académico. Datos de partidos son una proyección plausible al momento de construirlo.
