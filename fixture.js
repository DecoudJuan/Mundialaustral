// Generador de fixture Mundial 2026
// Fase de grupos: 11 jun – 27 jun 2026 (72 partidos)
// Eliminación: 28 jun – 19 jul 2026 (32 partidos)
// Total: 104 partidos

const HORARIOS_BASE = [12, 15, 18, 21]; // hora local de la sede (ART/AR: +2 a +5 aprox)

// Dónde ver (por región). Simplificado pero realista para 2026.
const BROADCASTERS = {
  AR: ["TyC Sports", "Telefé", "DSports", "DirecTV GO"],
  US: ["FOX", "Telemundo", "Peacock"],
  MX: ["Televisa", "TV Azteca", "ViX"],
  CA: ["TSN", "CTV", "RDS"],
  ES: ["RTVE", "Movistar+"],
  UK: ["BBC", "ITV"],
  BR: ["Globo", "SporTV", "GE"],
  LATAM: ["ESPN", "Disney+", "Caracol", "RCN"]
};

function pairKey(a, b) {
  return [a, b].sort().join("-");
}

// Genera los 6 partidos de un grupo (round-robin de 4 equipos)
function groupMatches(groupId, teams) {
  // Fixture round-robin clásico: J1: 1v2, 3v4 | J2: 1v3, 2v4 | J3: 1v4, 2v3
  return [
    { matchday: 1, home: teams[0], away: teams[1] },
    { matchday: 1, home: teams[2], away: teams[3] },
    { matchday: 2, home: teams[0], away: teams[2] },
    { matchday: 2, home: teams[3], away: teams[1] },
    { matchday: 3, home: teams[0], away: teams[3] },
    { matchday: 3, home: teams[1], away: teams[2] }
  ].map(m => ({ ...m, group: groupId, stage: "Grupos" }));
}

// Reparte fechas y sedes plausibles
function scheduleGroupStage(groups, venues) {
  const matches = [];
  let venueIdx = 0;

  // J1: 11–17 jun, J2: 18–22 jun, J3: 23–27 jun
  const startDates = {
    1: new Date("2026-06-11"),
    2: new Date("2026-06-18"),
    3: new Date("2026-06-23")
  };

  const groupIds = Object.keys(groups);
  let matchId = 1;

  for (const gid of groupIds) {
    const teams = groups[gid];
    const gMatches = groupMatches(gid, teams);
    gMatches.forEach((m, i) => {
      const base = startDates[m.matchday];
      const dayOffset = (groupIds.indexOf(gid) % 6) + (i % 2);
      const date = new Date(base);
      date.setDate(base.getDate() + dayOffset);
      const hour = HORARIOS_BASE[(matchId + i) % HORARIOS_BASE.length];
      const venue = venues[venueIdx % venues.length];
      venueIdx++;

      matches.push({
        id: `M${String(matchId).padStart(3, "0")}`,
        ...m,
        date: date.toISOString().slice(0, 10),
        kickoffLocal: `${String(hour).padStart(2, "0")}:00`,
        kickoffART: localToART(hour, venue.tz),
        venue
      });
      matchId++;
    });
  }
  return matches;
}

function localToART(hourLocal, tz) {
  // ART = UTC-3. tz es la diferencia UTC de la sede.
  const utcHour = hourLocal - tz;
  let artHour = (utcHour + (-3) + 24) % 24;
  return `${String(artHour).padStart(2, "0")}:00`;
}

// Eliminación: estructura con placeholders (1A, 2A, 3A, etc.)
function knockoutFixture(venues) {
  const matches = [];
  let venueIdx = 5;
  let id = 73;

  // R32: 16 partidos (los 12 ganadores + 12 segundos + 8 mejores terceros)
  const r32Pairings = [
    ["1A","2C"], ["1C","3D/E/F"], ["1B","3A/D/E/F"], ["1F","2A"],
    ["1D","3B/E/F/G"], ["1E","2D"], ["1G","3A/B/C/D"], ["1H","2F"],
    ["1I","3B/C/E/F"], ["1J","2H"], ["1K","3A/B/C/G"], ["1L","2J"],
    ["2B","2E"], ["2G","2I"], ["2K","2L"], ["3H","3I/J/K/L"]
  ];

  const r32Start = new Date("2026-06-28");
  r32Pairings.forEach((p, i) => {
    const d = new Date(r32Start);
    d.setDate(r32Start.getDate() + Math.floor(i / 2));
    const hour = HORARIOS_BASE[i % HORARIOS_BASE.length];
    const venue = venues[venueIdx % venues.length]; venueIdx++;
    matches.push({
      id: `M${id++}`,
      stage: "R32",
      home: p[0], away: p[1],
      date: d.toISOString().slice(0, 10),
      kickoffLocal: `${String(hour).padStart(2, "0")}:00`,
      kickoffART: localToART(hour, venue.tz),
      venue,
      placeholder: true
    });
  });

  // R16: 8 partidos
  const r16Start = new Date("2026-07-04");
  for (let i = 0; i < 8; i++) {
    const d = new Date(r16Start);
    d.setDate(r16Start.getDate() + Math.floor(i / 2));
    const hour = HORARIOS_BASE[i % HORARIOS_BASE.length];
    const venue = venues[venueIdx % venues.length]; venueIdx++;
    matches.push({
      id: `M${id++}`,
      stage: "Octavos",
      home: `G R32-${i*2+1}`, away: `G R32-${i*2+2}`,
      date: d.toISOString().slice(0, 10),
      kickoffLocal: `${String(hour).padStart(2, "0")}:00`,
      kickoffART: localToART(hour, venue.tz),
      venue,
      placeholder: true
    });
  }

  // QF: 4 partidos (9-11 jul)
  const qfStart = new Date("2026-07-09");
  for (let i = 0; i < 4; i++) {
    const d = new Date(qfStart);
    d.setDate(qfStart.getDate() + Math.floor(i / 2));
    const hour = HORARIOS_BASE[(i+1) % HORARIOS_BASE.length];
    const venue = venues[venueIdx % venues.length]; venueIdx++;
    matches.push({
      id: `M${id++}`,
      stage: "Cuartos",
      home: `G O-${i*2+1}`, away: `G O-${i*2+2}`,
      date: d.toISOString().slice(0, 10),
      kickoffLocal: `${String(hour).padStart(2, "0")}:00`,
      kickoffART: localToART(hour, venue.tz),
      venue,
      placeholder: true
    });
  }

  // SF: 2 partidos (14-15 jul)
  const sfStart = new Date("2026-07-14");
  for (let i = 0; i < 2; i++) {
    const d = new Date(sfStart); d.setDate(sfStart.getDate() + i);
    const venue = venues[venueIdx % venues.length]; venueIdx++;
    matches.push({
      id: `M${id++}`,
      stage: "Semis",
      home: `G C-${i*2+1}`, away: `G C-${i*2+2}`,
      date: d.toISOString().slice(0, 10),
      kickoffLocal: "20:00",
      kickoffART: localToART(20, venue.tz),
      venue,
      placeholder: true
    });
  }

  // 3er puesto (18 jul)
  const venue3 = venues[venueIdx % venues.length]; venueIdx++;
  matches.push({
    id: `M${id++}`,
    stage: "3er Puesto",
    home: "P SF-1", away: "P SF-2",
    date: "2026-07-18",
    kickoffLocal: "16:00",
    kickoffART: localToART(16, venue3.tz),
    venue: venue3,
    placeholder: true
  });

  // Final (19 jul) — MetLife
  const venueF = venues.find(v => v.stadium === "MetLife Stadium");
  matches.push({
    id: `M${id++}`,
    stage: "Final",
    home: "G SF-1", away: "G SF-2",
    date: "2026-07-19",
    kickoffLocal: "15:00",
    kickoffART: localToART(15, venueF.tz),
    venue: venueF,
    placeholder: true,
    isFinal: true
  });

  return matches;
}

function buildFixture() {
  const { GROUPS, VENUES } = window.MUNDIAL_DATA;
  const group = scheduleGroupStage(GROUPS, VENUES);
  const ko = knockoutFixture(VENUES);
  return [...group, ...ko];
}

window.MUNDIAL_FIXTURE = { buildFixture, BROADCASTERS };
