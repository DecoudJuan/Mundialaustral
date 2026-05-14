// Mundial 2026 — Datos
// 48 selecciones, 12 grupos de 4
// 72 partidos de fase de grupos + 32 de eliminación = 104 partidos

const TEAMS = {
  // CONMEBOL (6)
  ARG: { name: "Argentina", flag: "🇦🇷", confed: "CONMEBOL", rank: 1, style: "técnico", stars: ["Messi", "Lautaro", "Julián Álvarez", "Mac Allister"] },
  BRA: { name: "Brasil", flag: "🇧🇷", confed: "CONMEBOL", rank: 5, style: "ofensivo", stars: ["Vinicius Jr.", "Rodrygo", "Endrick", "Raphinha"] },
  URU: { name: "Uruguay", flag: "🇺🇾", confed: "CONMEBOL", rank: 11, style: "intenso", stars: ["Valverde", "Núñez", "Araújo"] },
  COL: { name: "Colombia", flag: "🇨🇴", confed: "CONMEBOL", rank: 12, style: "técnico", stars: ["James", "Luis Díaz"] },
  ECU: { name: "Ecuador", flag: "🇪🇨", confed: "CONMEBOL", rank: 31, style: "físico", stars: ["Caicedo", "Estupiñán"] },
  PAR: { name: "Paraguay", flag: "🇵🇾", confed: "CONMEBOL", rank: 48, style: "defensivo", stars: ["Almirón"] },

  // UEFA (16)
  FRA: { name: "Francia", flag: "🇫🇷", confed: "UEFA", rank: 2, style: "ofensivo", stars: ["Mbappé", "Griezmann", "Tchouaméni", "Camavinga"] },
  ESP: { name: "España", flag: "🇪🇸", confed: "UEFA", rank: 3, style: "técnico", stars: ["Yamal", "Pedri", "Rodri", "Nico Williams"] },
  ENG: { name: "Inglaterra", flag: "🏴", confed: "UEFA", rank: 4, style: "ofensivo", stars: ["Bellingham", "Saka", "Foden", "Kane"] },
  POR: { name: "Portugal", flag: "🇵🇹", confed: "UEFA", rank: 6, style: "ofensivo", stars: ["Cristiano Ronaldo", "Bruno Fernandes", "Bernardo Silva", "Leão"] },
  NED: { name: "Países Bajos", flag: "🇳🇱", confed: "UEFA", rank: 7, style: "técnico", stars: ["Van Dijk", "Gakpo", "Frenkie de Jong"] },
  CRO: { name: "Croacia", flag: "🇭🇷", confed: "UEFA", rank: 8, style: "técnico", stars: ["Modrić", "Kovačić"] },
  ITA: { name: "Italia", flag: "🇮🇹", confed: "UEFA", rank: 9, style: "defensivo", stars: ["Donnarumma", "Barella", "Chiesa"] },
  GER: { name: "Alemania", flag: "🇩🇪", confed: "UEFA", rank: 10, style: "técnico", stars: ["Musiala", "Wirtz", "Kimmich", "Havertz"] },
  BEL: { name: "Bélgica", flag: "🇧🇪", confed: "UEFA", rank: 13, style: "ofensivo", stars: ["De Bruyne", "Lukaku", "Doku"] },
  SUI: { name: "Suiza", flag: "🇨🇭", confed: "UEFA", rank: 19, style: "defensivo", stars: ["Xhaka", "Akanji"] },
  DEN: { name: "Dinamarca", flag: "🇩🇰", confed: "UEFA", rank: 21, style: "físico", stars: ["Eriksen", "Højlund"] },
  AUT: { name: "Austria", flag: "🇦🇹", confed: "UEFA", rank: 24, style: "físico", stars: ["Alaba", "Sabitzer"] },
  TUR: { name: "Turquía", flag: "🇹🇷", confed: "UEFA", rank: 26, style: "ofensivo", stars: ["Güler", "Çalhanoğlu"] },
  NOR: { name: "Noruega", flag: "🇳🇴", confed: "UEFA", rank: 27, style: "ofensivo", stars: ["Haaland", "Ødegaard"] },
  POL: { name: "Polonia", flag: "🇵🇱", confed: "UEFA", rank: 28, style: "físico", stars: ["Lewandowski", "Zieliński"] },
  SRB: { name: "Serbia", flag: "🇷🇸", confed: "UEFA", rank: 32, style: "intenso", stars: ["Vlahović", "Mitrović"] },

  // CONCACAF (6: 3 anfitriones + 3)
  USA: { name: "Estados Unidos", flag: "🇺🇸", confed: "CONCACAF", rank: 16, style: "físico", stars: ["Pulisic", "McKennie", "Reyna"], host: true },
  MEX: { name: "México", flag: "🇲🇽", confed: "CONCACAF", rank: 18, style: "técnico", stars: ["Lozano", "Edson Álvarez"], host: true },
  CAN: { name: "Canadá", flag: "🇨🇦", confed: "CONCACAF", rank: 36, style: "físico", stars: ["Alphonso Davies", "Jonathan David"], host: true },
  PAN: { name: "Panamá", flag: "🇵🇦", confed: "CONCACAF", rank: 41, style: "físico", stars: ["Carrasquilla"] },
  JAM: { name: "Jamaica", flag: "🇯🇲", confed: "CONCACAF", rank: 53, style: "físico", stars: ["Bailey"] },
  CRC: { name: "Costa Rica", flag: "🇨🇷", confed: "CONCACAF", rank: 47, style: "defensivo", stars: ["Navas"] },

  // AFC (8)
  JPN: { name: "Japón", flag: "🇯🇵", confed: "AFC", rank: 17, style: "técnico", stars: ["Mitoma", "Kubo", "Endō"] },
  IRN: { name: "Irán", flag: "🇮🇷", confed: "AFC", rank: 20, style: "defensivo", stars: ["Taremi", "Azmoun"] },
  KOR: { name: "Corea del Sur", flag: "🇰🇷", confed: "AFC", rank: 22, style: "ofensivo", stars: ["Son", "Kim Min-jae"] },
  AUS: { name: "Australia", flag: "🇦🇺", confed: "AFC", rank: 25, style: "físico", stars: ["Irvine"] },
  KSA: { name: "Arabia Saudita", flag: "🇸🇦", confed: "AFC", rank: 56, style: "técnico", stars: ["Al-Dawsari"] },
  UZB: { name: "Uzbekistán", flag: "🇺🇿", confed: "AFC", rank: 57, style: "físico", stars: ["Shomurodov"] },
  IRQ: { name: "Irak", flag: "🇮🇶", confed: "AFC", rank: 58, style: "intenso", stars: ["Aymen Hussein"] },
  JOR: { name: "Jordania", flag: "🇯🇴", confed: "AFC", rank: 64, style: "defensivo", stars: ["Al-Naimat"] },

  // CAF (9)
  MAR: { name: "Marruecos", flag: "🇲🇦", confed: "CAF", rank: 14, style: "intenso", stars: ["Hakimi", "Ziyech", "En-Nesyri"] },
  SEN: { name: "Senegal", flag: "🇸🇳", confed: "CAF", rank: 15, style: "físico", stars: ["Mané", "Koulibaly"] },
  NGA: { name: "Nigeria", flag: "🇳🇬", confed: "CAF", rank: 33, style: "ofensivo", stars: ["Osimhen", "Lookman"] },
  EGY: { name: "Egipto", flag: "🇪🇬", confed: "CAF", rank: 34, style: "técnico", stars: ["Salah"] },
  ALG: { name: "Argelia", flag: "🇩🇿", confed: "CAF", rank: 35, style: "técnico", stars: ["Mahrez"] },
  TUN: { name: "Túnez", flag: "🇹🇳", confed: "CAF", rank: 40, style: "defensivo", stars: ["Msakni"] },
  CIV: { name: "Costa de Marfil", flag: "🇨🇮", confed: "CAF", rank: 42, style: "físico", stars: ["Haller", "Kessié"] },
  CMR: { name: "Camerún", flag: "🇨🇲", confed: "CAF", rank: 50, style: "físico", stars: ["Onana", "Aboubakar"] },
  GHA: { name: "Ghana", flag: "🇬🇭", confed: "CAF", rank: 65, style: "físico", stars: ["Kudus"] },

  // OFC (1)
  NZL: { name: "Nueva Zelanda", flag: "🇳🇿", confed: "OFC", rank: 95, style: "físico", stars: ["Wood"] },

  // Repechaje intercontinental (2)
  BOL: { name: "Bolivia", flag: "🇧🇴", confed: "Repechaje", rank: 84, style: "físico", stars: ["Vaca"] },
  NCA: { name: "Nueva Caledonia", flag: "🇳🇨", confed: "Repechaje", rank: 150, style: "físico", stars: ["Wajoka"] }
};

// 12 grupos de 4 — sorteo plausible (48 únicos, anfitriones cabeza de serie)
const GROUPS = {
  A: ["MEX", "POL", "TUN", "JOR"],
  B: ["CAN", "BEL", "SEN", "UZB"],
  C: ["USA", "POR", "EGY", "JAM"],
  D: ["ARG", "JPN", "CRO", "PAN"],
  E: ["FRA", "MAR", "ECU", "NZL"],
  F: ["ESP", "KOR", "URU", "GHA"],
  G: ["ENG", "AUS", "COL", "ALG"],
  H: ["BRA", "SUI", "NGA", "IRQ"],
  I: ["GER", "IRN", "PAR", "CMR"],
  J: ["NED", "DEN", "CIV", "KSA"],
  K: ["ITA", "TUR", "CRC", "BOL"],
  L: ["NOR", "SRB", "AUT", "NCA"]
};

// Pares de rivalidad (clave "A-B", 0-100). Se usa simétricamente.
const RIVALRIES = {
  "ARG-BRA": 100, "ARG-ENG": 95, "ARG-GER": 85, "ARG-URU": 80, "ARG-FRA": 78,
  "BRA-ITA": 80, "BRA-GER": 78, "BRA-URU": 78, "BRA-FRA": 72, "BRA-NED": 75,
  "ENG-GER": 95, "ENG-FRA": 85, "ENG-USA": 60, "ENG-ESP": 65,
  "FRA-GER": 88, "FRA-ITA": 85, "FRA-ESP": 75, "FRA-POR": 70,
  "ESP-POR": 90, "ESP-ITA": 78, "ESP-NED": 82,
  "GER-NED": 92, "GER-ITA": 85,
  "ITA-FRA": 85,
  "NED-BEL": 80,
  "MEX-USA": 95, "USA-CAN": 75, "MEX-CAN": 65,
  "KOR-JPN": 95, "JPN-AUS": 70,
  "MAR-ALG": 95, "EGY-ALG": 85, "MAR-TUN": 70,
  "URU-BRA": 78,
  "COL-ARG": 70, "COL-BRA": 72,
  "IRN-KSA": 88, "IRN-IRQ": 80,
  "POR-NED": 75, "POR-ESP": 90,
  "SRB-CRO": 90, "POL-GER": 78, "POL-RUS": 0,
  "CIV-GHA": 80, "CIV-CMR": 75, "SEN-CIV": 72,
  "NGA-GHA": 85, "NGA-CMR": 78
};

// Sedes (16 ciudades anfitrionas reales del Mundial 2026)
const VENUES = [
  { city: "Ciudad de México", country: "MEX", stadium: "Estadio Azteca", tz: -6 },
  { city: "Guadalajara", country: "MEX", stadium: "Estadio Akron", tz: -6 },
  { city: "Monterrey", country: "MEX", stadium: "Estadio BBVA", tz: -6 },
  { city: "Toronto", country: "CAN", stadium: "BMO Field", tz: -4 },
  { city: "Vancouver", country: "CAN", stadium: "BC Place", tz: -7 },
  { city: "Nueva York/NJ", country: "USA", stadium: "MetLife Stadium", tz: -4 },
  { city: "Los Ángeles", country: "USA", stadium: "SoFi Stadium", tz: -7 },
  { city: "Dallas", country: "USA", stadium: "AT&T Stadium", tz: -5 },
  { city: "Miami", country: "USA", stadium: "Hard Rock Stadium", tz: -4 },
  { city: "Atlanta", country: "USA", stadium: "Mercedes-Benz Stadium", tz: -4 },
  { city: "Boston", country: "USA", stadium: "Gillette Stadium", tz: -4 },
  { city: "Filadelfia", country: "USA", stadium: "Lincoln Financial Field", tz: -4 },
  { city: "Houston", country: "USA", stadium: "NRG Stadium", tz: -5 },
  { city: "Kansas City", country: "USA", stadium: "Arrowhead Stadium", tz: -5 },
  { city: "Seattle", country: "USA", stadium: "Lumen Field", tz: -7 },
  { city: "San Francisco", country: "USA", stadium: "Levi's Stadium", tz: -7 }
];

window.MUNDIAL_DATA = { TEAMS, GROUPS, RIVALRIES, VENUES };
