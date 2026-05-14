// Mundial 2026 — App
(function () {
  const DATA = window.MUNDIAL_DATA;
  const { buildFixture, BROADCASTERS } = window.MUNDIAL_FIXTURE;
  const { scoreMatch } = window.MUNDIAL_ENGINE;

  const STORAGE_KEY = "mundial26_profile";
  let profile = loadProfile();
  let fixture = buildFixture();
  let scored = [];

  // ------ navegación ------
  const views = {
    onboarding: document.getElementById("view-onboarding"),
    recos: document.getElementById("view-recos"),
    fixture: document.getElementById("view-fixture"),
    profile: document.getElementById("view-profile")
  };

  function show(viewId) {
    Object.values(views).forEach(v => v.classList.remove("active"));
    views[viewId].classList.add("active");
    document.querySelectorAll(".nav-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.view === viewId);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!profile) {
        show("onboarding");
        return;
      }
      show(btn.dataset.view);
    });
  });

  // ------ onboarding ------
  function renderTeamPicker() {
    const picker = document.getElementById("team-picker");
    picker.innerHTML = "";
    const entries = Object.entries(DATA.TEAMS).sort((a, b) => a[1].rank - b[1].rank);
    for (const [code, t] of entries) {
      const el = document.createElement("div");
      el.className = "team-card";
      el.dataset.code = code;
      el.innerHTML = `
        <span class="flag">${t.flag}</span>
        <span>${t.name}</span>
        <span class="rank">#${t.rank}</span>
      `;
      el.addEventListener("click", () => {
        const selected = picker.querySelectorAll(".selected");
        if (el.classList.contains("selected")) {
          el.classList.remove("selected");
        } else if (selected.length < 5) {
          el.classList.add("selected");
        }
      });
      picker.appendChild(el);
    }
  }

  document.getElementById("btn-build").addEventListener("click", () => {
    const favTeams = [...document.querySelectorAll("#team-picker .team-card.selected")].map(e => e.dataset.code);
    const styles = [...document.querySelectorAll("#style-picker input:checked")].map(i => i.value);
    const favPlayers = document.getElementById("players-input").value
      .split(",").map(s => s.trim()).filter(Boolean);
    const availability = [...document.querySelectorAll("#time-picker input:checked")].map(i => i.value);

    profile = { favTeams, styles, favPlayers, availability };
    saveProfile(profile);
    runEngine();
    show("recos");
  });

  // ------ recommendation render ------
  function runEngine() {
    if (!profile) return;
    scored = fixture.map(m => {
      const result = scoreMatch(m, profile, DATA);
      return { match: m, ...result };
    });

    renderBuckets();
    renderFixture();
    renderProfile();
  }

  function renderBuckets() {
    const buckets = { imperdible: [], vale: [], resumen: [] };
    scored.forEach(s => buckets[s.bucket].push(s));
    Object.keys(buckets).forEach(k =>
      buckets[k].sort((a, b) => b.score - a.score || a.match.date.localeCompare(b.match.date))
    );

    fillBucket("imperdible", buckets.imperdible, 12);
    fillBucket("vale", buckets.vale, 16);
    fillBucket("resumen", buckets.resumen, 20);
  }

  function fillBucket(name, items, limit) {
    const list = document.getElementById(`list-${name}`);
    const count = document.getElementById(`count-${name}`);
    list.innerHTML = "";
    count.textContent = `${items.length} partidos`;
    items.slice(0, limit).forEach(s => list.appendChild(matchCard(s)));
    if (items.length > limit) {
      const more = document.createElement("div");
      more.style.cssText = "display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:14px;font-weight:600;padding:20px;background:var(--paper);border:1px dashed var(--line);border-radius:var(--radius);";
      more.textContent = `+${items.length - limit} más en el fixture →`;
      more.style.cursor = "pointer";
      more.addEventListener("click", () => show("fixture"));
      list.appendChild(more);
    }
  }

  function matchCard(s) {
    const m = s.match;
    const home = DATA.TEAMS[m.home] || { name: m.home, flag: "🏳️" };
    const away = DATA.TEAMS[m.away] || { name: m.away, flag: "🏳️" };

    const el = document.createElement("div");
    el.className = `match-card ${s.bucket}`;
    el.innerHTML = `
      <div class="match-score">${s.score}</div>
      <div class="match-meta">
        <span class="match-stage">${m.stage}${m.group ? ` · Grupo ${m.group}` : ""}</span>
        <span>${formatDate(m.date)}</span>
      </div>
      <div class="match-teams">
        <div class="match-team">
          <span class="flag">${home.flag}</span>
          <span class="name">${home.name}</span>
        </div>
        <span class="match-vs">VS</span>
        <div class="match-team">
          <span class="flag">${away.flag}</span>
          <span class="name">${away.name}</span>
        </div>
      </div>
      <div class="match-info">
        <div class="row"><span class="icon">🕗</span> ${m.kickoffART} ART</div>
        <div class="row"><span class="icon">📍</span> ${m.venue.stadium}, ${m.venue.city}</div>
      </div>
    `;
    el.addEventListener("click", () => openModal(s));
    return el;
  }

  // ------ fixture view ------
  function renderFixture() {
    const filterStage = document.getElementById("filter-stage").value;
    const filterTeam = document.getElementById("filter-team").value;
    const list = document.getElementById("fixture-list");
    list.innerHTML = "";

    const filtered = scored.filter(s => {
      if (filterStage && s.match.stage !== filterStage) return false;
      if (filterTeam && s.match.home !== filterTeam && s.match.away !== filterTeam) return false;
      return true;
    }).sort((a, b) => a.match.date.localeCompare(b.match.date) || a.match.kickoffART.localeCompare(b.match.kickoffART));

    if (filtered.length === 0) {
      list.innerHTML = `<p style="color:var(--muted)">No hay partidos con esos filtros.</p>`;
      return;
    }

    const byDay = {};
    filtered.forEach(s => {
      const k = s.match.date;
      (byDay[k] ||= []).push(s);
    });

    Object.keys(byDay).sort().forEach(day => {
      const dayEl = document.createElement("div");
      dayEl.className = "fixture-day";
      dayEl.innerHTML = `<h3>${formatDateLong(day)}</h3><div class="fixture-rows"></div>`;
      const rows = dayEl.querySelector(".fixture-rows");
      byDay[day].forEach(s => rows.appendChild(fixtureRow(s)));
      list.appendChild(dayEl);
    });
  }

  function fixtureRow(s) {
    const m = s.match;
    const home = DATA.TEAMS[m.home] || { name: m.home, flag: "🏳️" };
    const away = DATA.TEAMS[m.away] || { name: m.away, flag: "🏳️" };
    const row = document.createElement("div");
    row.className = "fixture-row";
    row.innerHTML = `
      <span class="time">${m.kickoffART}</span>
      <span class="home"><span class="flag">${home.flag}</span><span>${home.name}</span></span>
      <span class="vs">VS</span>
      <span class="away"><span>${away.name}</span><span class="flag">${away.flag}</span></span>
      <span class="stage-pill">${m.stage}${m.group ? ` ${m.group}` : ""}</span>
    `;
    row.addEventListener("click", () => openModal(s));
    return row;
  }

  function setupFixtureFilters() {
    document.getElementById("filter-stage").addEventListener("change", renderFixture);

    const teamSelect = document.getElementById("filter-team");
    Object.entries(DATA.TEAMS)
      .sort((a, b) => a[1].name.localeCompare(b[1].name))
      .forEach(([code, t]) => {
        const opt = document.createElement("option");
        opt.value = code;
        opt.textContent = `${t.flag} ${t.name}`;
        teamSelect.appendChild(opt);
      });
    teamSelect.addEventListener("change", renderFixture);
  }

  // ------ modal ------
  function openModal(s) {
    const m = s.match;
    const home = DATA.TEAMS[m.home] || { name: m.home, flag: "🏳️", stars: [] };
    const away = DATA.TEAMS[m.away] || { name: m.away, flag: "🏳️", stars: [] };

    const content = document.getElementById("modal-content");
    const ar = BROADCASTERS.AR;
    const intl = [
      ...(home.confed === "CONMEBOL" || away.confed === "CONMEBOL" ? BROADCASTERS.LATAM : []),
      ...((m.venue.country === "USA") ? BROADCASTERS.US : []),
      ...((m.venue.country === "MEX") ? BROADCASTERS.MX : []),
      ...((m.venue.country === "CAN") ? BROADCASTERS.CA : [])
    ];
    const allBroadcasters = [...new Set([...ar, ...intl])];

    const breakdownRows = Object.entries(s.breakdown).map(([k, v]) => {
      const labels = {
        affinity: "Tus equipos",
        rivalry: "Rivalidad",
        stars: "Estrellas",
        stageImp: "Etapa",
        compet: "Paridad",
        timeFit: "Horario",
        narrative: "Narrativa"
      };
      return `
        <div class="bar-row">
          <span>${labels[k]}</span>
          <div class="bar-bg"><div class="bar-fill" style="width:${Math.round(v)}%"></div></div>
          <span class="bar-val">${Math.round(v)}</span>
        </div>
      `;
    }).join("");

    content.innerHTML = `
      <div class="modal-head ${s.bucket}">
        <button class="modal-close">×</button>
        <div class="stage-meta">${m.stage}${m.group ? ` · Grupo ${m.group}` : ""} · ${s.label} · ${s.score}/100</div>
        <div class="teams-big">
          <div class="team-big">
            <span class="flag">${home.flag}</span>
            <span class="name">${home.name}</span>
          </div>
          <span class="vs-big">VS</span>
          <div class="team-big">
            <span class="flag">${away.flag}</span>
            <span class="name">${away.name}</span>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <h4>Cuándo y dónde</h4>
        <div class="modal-row"><span class="lbl">Fecha</span><span class="val">${formatDateLong(m.date)}</span></div>
        <div class="modal-row"><span class="lbl">Hora ART</span><span class="val">${m.kickoffART} (local ${m.kickoffLocal})</span></div>
        <div class="modal-row"><span class="lbl">Estadio</span><span class="val">${m.venue.stadium}</span></div>
        <div class="modal-row"><span class="lbl">Ciudad</span><span class="val">${m.venue.city}, ${m.venue.country}</span></div>

        <h4>Dónde verlo</h4>
        <div class="broadcast-grid">
          ${allBroadcasters.map(b => `<span class="broadcast-pill">${b}</span>`).join("")}
        </div>

        <h4>Por qué te lo recomendamos</h4>
        <ul class="reasons-list">
          ${s.reasons.map(r => `<li>${r}</li>`).join("")}
        </ul>

        ${home.stars && home.stars.length ? `
          <h4>Figuras en cancha</h4>
          <div class="broadcast-grid">
            ${[...home.stars.slice(0, 3), ...away.stars.slice(0, 3)].map(p => `<span class="broadcast-pill">⭐ ${p}</span>`).join("")}
          </div>
        ` : ""}

        <h4>Detalle del score</h4>
        <div class="breakdown">${breakdownRows}</div>
      </div>
    `;

    document.getElementById("modal").classList.remove("hidden");
    content.querySelector(".modal-close").addEventListener("click", closeModal);
  }
  function closeModal() {
    document.getElementById("modal").classList.add("hidden");
  }
  document.querySelector(".modal-backdrop").addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  // ------ profile view ------
  function renderProfile() {
    if (!profile) return;
    const el = document.getElementById("profile-summary");
    const teamTags = (profile.favTeams || []).map(c => {
      const t = DATA.TEAMS[c];
      return t ? `<span class="tag">${t.flag} ${t.name}</span>` : "";
    }).join("") || `<span class="tag">Sin selecciones favoritas</span>`;

    const styleTags = (profile.styles || []).map(s => `<span class="tag">${s}</span>`).join("") || `<span class="tag">Cualquier estilo</span>`;
    const playerTags = (profile.favPlayers || []).map(p => `<span class="tag">⭐ ${p}</span>`).join("") || `<span class="tag">Sin jugadores favoritos</span>`;
    const timeTags = (profile.availability || []).map(t => `<span class="tag">${t}</span>`).join("");

    el.innerHTML = `
      <h3>Selecciones favoritas</h3>
      <div class="tags">${teamTags}</div>
      <h3>Estilo</h3>
      <div class="tags">${styleTags}</div>
      <h3>Jugadores</h3>
      <div class="tags">${playerTags}</div>
      <h3>Disponibilidad horaria (ART)</h3>
      <div class="tags">${timeTags}</div>
    `;
  }

  document.getElementById("btn-reset").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    profile = null;
    show("onboarding");
  });

  // ------ helpers ------
  function formatDate(d) {
    const [y, m, day] = d.split("-");
    const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
    return `${parseInt(day)} ${meses[parseInt(m)-1]}`;
  }
  function formatDateLong(d) {
    const dt = new Date(d);
    return dt.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  }
  function loadProfile() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
  }
  function saveProfile(p) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }

  // ------ init ------
  renderTeamPicker();
  setupFixtureFilters();

  if (profile) {
    runEngine();
    show("recos");
  } else {
    show("onboarding");
  }
})();
