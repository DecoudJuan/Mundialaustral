// Motor de recomendación Mundial 2026
// Inspirado en sistemas de recomendación tipo Spotify:
// - Filtrado basado en contenido (afinidad de equipos, estilo, jugadores)
// - Señales contextuales (horario, etapa, rivalidad, narrativa)
// - Score normalizado 0-100 → cubos Imperdible / Vale la pena / Resumen

const STAGE_WEIGHT = {
  "Grupos": 10,
  "R32": 35,
  "Octavos": 55,
  "Cuartos": 75,
  "Semis": 90,
  "3er Puesto": 70,
  "Final": 100
};

function rivalryScore(a, b, RIVALRIES) {
  const k1 = [a, b].sort().join("-");
  const k2 = [b, a].sort().join("-");
  return RIVALRIES[k1] ?? RIVALRIES[k2] ?? RIVALRIES[`${a}-${b}`] ?? RIVALRIES[`${b}-${a}`] ?? 0;
}

function teamAffinity(teamCode, profile, TEAMS) {
  const team = TEAMS[teamCode];
  if (!team) return 0;

  let score = 0;
  if (profile.favTeams?.includes(teamCode)) score += 100;
  if (profile.favConfeds?.includes(team.confed)) score += 30;
  // Bonus si el estilo del equipo coincide con preferencia
  if (profile.styles?.includes(team.style)) score += 25;
  // Bonus si tiene jugador favorito
  if (profile.favPlayers?.length) {
    const hasFavPlayer = team.stars.some(s =>
      profile.favPlayers.some(fp => s.toLowerCase().includes(fp.toLowerCase()))
    );
    if (hasFavPlayer) score += 60;
  }
  return score;
}

function competitivenessScore(a, b, TEAMS) {
  const ta = TEAMS[a], tb = TEAMS[b];
  if (!ta || !tb) return 30; // placeholder de eliminatorias
  const gap = Math.abs(ta.rank - tb.rank);
  // Cerca en ranking → más competitivo. Ranking promedio bajo (top mundial) suma.
  const closeness = Math.max(0, 100 - gap * 2);
  const avgRank = (ta.rank + tb.rank) / 2;
  const eliteBoost = Math.max(0, 100 - avgRank * 2);
  return Math.min(100, closeness * 0.5 + eliteBoost * 0.5);
}

function starPower(a, b, TEAMS) {
  const ta = TEAMS[a], tb = TEAMS[b];
  if (!ta || !tb) return 40;
  // Estrellas globales por nombre (heurística): jugadores top contemporáneos
  const GLOBAL = ["Mbappé","Messi","Haaland","Bellingham","Vinicius","Yamal","Pedri","Salah","Son","Cristiano Ronaldo","De Bruyne","Modrić","Musiala","Lewandowski","Mané","Osimhen","Hakimi"];
  const all = [...ta.stars, ...tb.stars];
  const hits = all.filter(s => GLOBAL.some(g => s.includes(g)));
  return Math.min(100, hits.length * 28);
}

function timeFitScore(match, profile) {
  if (!profile.availability) return 50;
  // profile.availability: array de franjas ART aceptables, ej ["mañana","tarde","noche","trasnoche"]
  const hourART = parseInt(match.kickoffART.slice(0, 2), 10);
  let franja;
  if (hourART >= 6 && hourART < 12) franja = "mañana";
  else if (hourART >= 12 && hourART < 18) franja = "tarde";
  else if (hourART >= 18 && hourART < 24) franja = "noche";
  else franja = "trasnoche";
  return profile.availability.includes(franja) ? 100 : 20;
}

function narrativeScore(a, b, TEAMS) {
  const ta = TEAMS[a], tb = TEAMS[b];
  if (!ta || !tb) return 0;
  let bonus = 0;
  if (ta.host || tb.host) bonus += 15; // partidos de anfitriones
  if (ta.confed === tb.confed && ta.confed !== "UEFA") bonus += 10; // derbi continental
  return bonus;
}

function scoreMatch(match, profile, data) {
  const { TEAMS, RIVALRIES } = data;
  const a = match.home, b = match.away;
  const isPlaceholder = match.placeholder === true;

  // Para partidos de eliminación con placeholder (equipos aún no definidos),
  // la importancia se basa principalmente en la etapa.
  if (isPlaceholder) {
    const stageImp = STAGE_WEIGHT[match.stage] ?? 30;
    const timeFit = timeFitScore(match, profile);
    const raw = stageImp * 0.85 + timeFit * 0.15;
    const score = Math.round(Math.min(100, raw));
    let bucket, label;
    if (score >= 70) { bucket = "imperdible"; label = "Imperdible"; }
    else if (score >= 45) { bucket = "vale"; label = "Vale la pena"; }
    else { bucket = "resumen"; label = "Resumen"; }
    const reasons = [`Etapa decisiva del torneo: ${match.stage}`];
    if (timeFit === 100) reasons.push("Horario que te funciona");
    if (match.isFinal) reasons.unshift("LA FINAL del Mundial 🏆");
    return {
      score, bucket, label, reasons,
      breakdown: { affinity: 0, rivalry: 0, stars: 0, stageImp, compet: 0, timeFit, narrative: 0 }
    };
  }

  const affA = teamAffinity(a, profile, TEAMS);
  const affB = teamAffinity(b, profile, TEAMS);
  const affinity = Math.min(100, (affA + affB) * 0.6);

  const rivalry = rivalryScore(a, b, RIVALRIES);
  const stars = starPower(a, b, TEAMS);
  const stageImp = STAGE_WEIGHT[match.stage] ?? 30;
  const compet = competitivenessScore(a, b, TEAMS);
  const narr = narrativeScore(a, b, TEAMS);
  const timeFit = timeFitScore(match, profile);

  // Pesos del modelo (ajustables — el profile podría afinarlos)
  const W = {
    affinity: 0.30,
    rivalry: 0.15,
    stars: 0.10,
    stage: 0.20,
    compet: 0.10,
    timeFit: 0.10,
    narrative: 0.05
  };

  const raw =
    affinity * W.affinity +
    rivalry * W.rivalry +
    stars * W.stars +
    stageImp * W.stage +
    compet * W.compet +
    timeFit * W.timeFit +
    narr * W.narrative;

  const score = Math.round(Math.min(100, raw));

  let bucket, label;
  if (score >= 70) { bucket = "imperdible"; label = "Imperdible"; }
  else if (score >= 45) { bucket = "vale"; label = "Vale la pena"; }
  else { bucket = "resumen"; label = "Resumen"; }

  const reasons = buildReasons({ affA, affB, rivalry, stars, stageImp, compet, timeFit, narr, match, profile, TEAMS });

  return { score, bucket, label, reasons, breakdown: { affinity, rivalry, stars, stageImp, compet, timeFit, narrative: narr } };
}

function buildReasons({ affA, affB, rivalry, stars, stageImp, compet, timeFit, narr, match, profile, TEAMS }) {
  const r = [];
  const a = TEAMS[match.home], b = TEAMS[match.away];

  if (profile.favTeams?.includes(match.home) || profile.favTeams?.includes(match.away)) {
    const fav = profile.favTeams.find(t => t === match.home || t === match.away);
    r.push(`Juega tu seleccionado favorito (${TEAMS[fav].name})`);
  }
  if (rivalry >= 80) r.push(`Clásico mundial (rivalidad ${rivalry}/100)`);
  else if (rivalry >= 50) r.push(`Partido con historia entre rivales`);

  if (stars >= 60) r.push(`Estrellas globales en cancha`);
  if (stageImp >= 75) r.push(`Etapa decisiva: ${match.stage}`);
  if (compet >= 70 && a && b) r.push(`Equipos parejos en ranking FIFA (${a.rank} vs ${b.rank})`);
  if (timeFit === 100) r.push(`Horario que te funciona`);
  if (timeFit === 20) r.push(`Fuera de tu franja preferida`);
  if (narr >= 15) r.push(`Anfitrión en cancha`);

  if (r.length === 0) r.push("Partido estándar de fase de grupos");
  return r;
}

window.MUNDIAL_ENGINE = { scoreMatch };
