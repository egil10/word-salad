const corpus = window.ORDSALAT_DATA;

const routes = {
  "/": { title: "Language Trends", kicker: "Dashboard" },
  "/dashboard": { title: "Language Trends", kicker: "Dashboard" },
  "/corpus": { title: "Corpus Search", kicker: "Dataset browser" },
  "/terms": { title: "Term Explorer", kicker: "Indexed language" },
  "/compare": { title: "Compare Words", kicker: "Term comparison" },
  "/sources": { title: "Source Library", kicker: "Resources" },
  "/ai": { title: "AI Workspace", kicker: "Evidence packs" },
  "/method": { title: "Method", kicker: "Reproducibility" },
};

const sourceCatalog = [
  {
    title: "Miller Center Presidential Speeches",
    status: "Live in app",
    coverage: `${corpus.source.earliestYear}-${corpus.source.latestYear}`,
    format: "Bulk JSON archive",
    url: "https://data.millercenter.org/",
    note: "Current processed corpus: presidential speeches with titles, dates, presidents, URLs, term evidence and decade-normalized frequencies.",
  },
  {
    title: "UN General Debate Corpus",
    status: "Next importer",
    coverage: "1946-present",
    format: "Searchable speech corpus",
    url: "https://www.ungdc.bham.ac.uk/",
    note: "Best source for cross-country institutional language. Add as a UN cohort with country and session metadata.",
  },
  {
    title: "European Parliament Verbatim Reports",
    status: "Next importer",
    coverage: "Current XML/HTML",
    format: "Official plenary records",
    url: "https://www.europarl.europa.eu/plenary/en/debates-video.html",
    note: "Use official sitting reports to track EU language by date, debate title, speaker and party where available.",
  },
  {
    title: "EUPDCorp 1999-2024",
    status: "Bulk research source",
    coverage: "1999-2024",
    format: "RDS dataset",
    url: "https://zenodo.org/records/15056399",
    note: "Large European Parliament debate corpus with speaker, party, nationality, date and agenda metadata.",
  },
  {
    title: "White House Remarks",
    status: "Candidate live feed",
    coverage: "Current administration",
    format: "HTML transcripts",
    url: "https://www.whitehouse.gov/remarks/",
    note: "Useful near-current source for official US executive rhetoric between major Miller Center archive refreshes.",
  },
  {
    title: "Podcast Transcript APIs",
    status: "Licensed source",
    coverage: "API dependent",
    format: "Search/transcript API",
    url: "https://podscan.fm/api-platform",
    note: "Add media diffusion tracking when a licensed transcript provider is chosen. Keep show, episode, host and date metadata.",
  },
];

const state = {
  route: normalizeRoute(location.pathname),
  selectedTerm: corpus.terms.find((term) => term.mentions > 0)?.term || corpus.terms[0].term,
  lens: "mentions",
  corpusQuery: "",
  president: "all",
  decade: "all",
  termQuery: "",
  category: "all",
  compareTerms: [],
};

const stopWords = new Set(
  "about above after again against also among because been before being between both could does doing down during each for from further have having here into itself just more most other over same should some such than that their them then there these they this those through under until very were what when where which while will with would your".split(
    " ",
  ),
);

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

boot();

function boot() {
  renderStaticControls();
  bindEvents();
  navigate(state.route, false);
  renderAll();
}

function bindEvents() {
  $$("[data-route]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      navigate(link.dataset.route);
    });
  });

  window.addEventListener("popstate", () => navigate(normalizeRoute(location.pathname), false));

  $("#themeToggle").addEventListener("click", () => {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  });

  $("#globalSearchButton").addEventListener("click", runGlobalSearch);
  $("#globalSearch").addEventListener("keydown", (event) => {
    if (event.key === "Enter") runGlobalSearch();
  });

  $("#dashboardTermSelect").addEventListener("change", (event) => {
    state.selectedTerm = event.target.value;
    syncTermSelects();
    renderDashboard();
    renderTermDetail();
    renderAiPack();
  });

  $("#lensSelect").addEventListener("change", (event) => {
    state.lens = event.target.value;
    renderWordCloud();
  });

  $("#corpusSearch").addEventListener("input", (event) => {
    state.corpusQuery = event.target.value;
    renderCorpusSearch();
  });
  $("#presidentFilter").addEventListener("change", (event) => {
    state.president = event.target.value;
    renderCorpusSearch();
  });
  $("#yearFilter").addEventListener("change", (event) => {
    state.decade = event.target.value;
    renderCorpusSearch();
  });
  $("#exportCorpusButton").addEventListener("click", exportCorpusResults);

  $("#termSearch").addEventListener("input", (event) => {
    state.termQuery = event.target.value;
    renderTermList();
  });
  $("#categoryFilter").addEventListener("change", (event) => {
    state.category = event.target.value;
    renderTermList();
  });

  ["#compareTermA", "#compareTermB", "#compareTermC", "#compareTermD"].forEach((selector, index) => {
    $(selector).addEventListener("change", (event) => {
      state.compareTerms[index] = event.target.value;
      renderCompare();
    });
  });

  $("#aiQuestion").addEventListener("input", renderAiPack);
  $("#aiTermSelect").addEventListener("change", (event) => {
    state.selectedTerm = event.target.value;
    syncTermSelects();
    renderDashboard();
    renderTermDetail();
    renderAiPack();
  });
  $("#copyPromptButton").addEventListener("click", copyPrompt);
  $("#analyzeTextButton").addEventListener("click", analyzeCustomText);
}

function navigate(route, push = true) {
  state.route = normalizeRoute(route);
  const routeMeta = routes[state.route] || routes["/dashboard"];
  $$(".page-view").forEach((view) => view.classList.toggle("is-active", view.dataset.page === state.route));
  $$("[data-route]").forEach((link) => link.classList.toggle("is-active", link.dataset.route === state.route));
  $("#pageTitle").textContent = routeMeta.title;
  $("#pageKicker").textContent = routeMeta.kicker;
  if (push && location.pathname !== state.route) history.pushState({}, "", state.route);
}

function normalizeRoute(route) {
  if (!route || route === "/") return "/dashboard";
  return routes[route] ? route : "/dashboard";
}

function renderAll() {
  renderMetrics();
  renderDashboard();
  renderCorpusSearch();
  renderTermList();
  renderTermDetail();
  renderCompare();
  renderSources();
  renderAiPack();
}

function renderStaticControls() {
  $("#datasetStatus").textContent = `${corpus.source.documentCount.toLocaleString()} speeches · ${compactNumber(corpus.source.totalWords)} words`;

  const sortedTerms = [...corpus.terms].sort((a, b) => b.mentions - a.mentions);
  [$("#dashboardTermSelect"), $("#aiTermSelect"), $("#compareTermA"), $("#compareTermB"), $("#compareTermC"), $("#compareTermD")].forEach((select) => {
    select.innerHTML = sortedTerms
      .map((term) => `<option value="${escapeHtml(term.term)}">${escapeHtml(term.term)}</option>`)
      .join("");
    select.value = state.selectedTerm;
  });

  state.compareTerms = sortedTerms.slice(0, 4).map((term) => term.term);
  ["#compareTermA", "#compareTermB", "#compareTermC", "#compareTermD"].forEach((selector, index) => {
    $(selector).value = state.compareTerms[index];
  });

  const presidents = [...corpus.presidents].sort((a, b) => a.president.localeCompare(b.president));
  $("#presidentFilter").innerHTML = `<option value="all">All presidents</option>${presidents
    .map((item) => `<option value="${escapeHtml(item.president)}">${escapeHtml(item.president)}</option>`)
    .join("")}`;

  const decades = [...new Set(corpus.documents.map((doc) => Math.floor(doc.year / 10) * 10))].sort((a, b) => b - a);
  $("#yearFilter").innerHTML = `<option value="all">All decades</option>${decades
    .map((decade) => `<option value="${decade}">${decade}s</option>`)
    .join("")}`;

  const categories = [...new Set(corpus.terms.map((term) => term.category))].sort();
  $("#categoryFilter").innerHTML = `<option value="all">All categories</option>${categories
    .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
    .join("")}`;
}

function syncTermSelects() {
  $("#dashboardTermSelect").value = state.selectedTerm;
  $("#aiTermSelect").value = state.selectedTerm;
}

function renderMetrics() {
  const fastest = [...corpus.terms].sort((a, b) => b.momentum - a.momentum)[0];
  const mostCommon = [...corpus.terms].sort((a, b) => b.mentions - a.mentions)[0];
  const metrics = [
    ["Speeches", corpus.source.documentCount.toLocaleString(), `${corpus.source.earliestYear}-${corpus.source.latestYear}`],
    ["Words", compactNumber(corpus.source.totalWords), "normalized by decade"],
    ["Indexed terms", corpus.terms.length.toString(), "tracked and discovered"],
    ["Fastest riser", fastest.term, `momentum ${formatSigned(fastest.momentum)}`],
    ["Most cited", mostCommon.term, `${mostCommon.mentions.toLocaleString()} mentions`],
  ];
  $("#metricGrid").innerHTML = metrics
    .map(
      ([label, value, meta]) => `
        <article class="metric-card">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
          <small>${escapeHtml(meta)}</small>
        </article>
      `,
    )
    .join("");
}

function renderDashboard() {
  const term = selectedTerm();
  $("#timelineTitle").textContent = `${term.term} over time`;
  renderTrendChart(term);
  renderWordCloud();
  renderBurstTable();
  renderEraBars();
}

function renderTrendChart(term) {
  const svg = $("#timelineChart");
  const width = 820;
  const height = 320;
  const pad = { top: 24, right: 26, bottom: 38, left: 48 };
  const series = term.series.usa;
  const max = Math.max(...series, 1) * 1.18;
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = "";

  [0, 0.25, 0.5, 0.75, 1].forEach((ratio) => {
    const y = pad.top + plotH * ratio;
    svg.appendChild(svgLine(pad.left, y, width - pad.right, y, "grid-line"));
  });

  const points = corpus.years.map((year, index) => {
    const x = pad.left + (index / (corpus.years.length - 1)) * plotW;
    const y = pad.top + plotH - (series[index] / max) * plotH;
    return [x, y, year, series[index]];
  });

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("class", "chart-line");
  path.setAttribute("d", points.map(([x, y], index) => `${index ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" "));
  svg.appendChild(path);

  points.forEach(([x, y, year, value], index) => {
    if (index % 2 === 0 || index === points.length - 1) {
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", x);
      dot.setAttribute("cy", y);
      dot.setAttribute("r", 4);
      dot.setAttribute("class", "chart-dot");
      dot.appendChild(svgTitle(`${year}: ${value.toFixed(2)} mentions per 10k words`));
      svg.appendChild(dot);
    }
    if (index % 3 === 0 || index === points.length - 1) {
      const label = svgText(x, height - 12, String(year), "chart-label");
      label.setAttribute("text-anchor", "middle");
      svg.appendChild(label);
    }
  });
}

function renderWordCloud() {
  const ranked = [...corpus.terms].sort((a, b) => {
    if (state.lens === "momentum") return b.momentum - a.momentum;
    if (state.lens === "intensity") return b.intensity - a.intensity;
    return b.mentions - a.mentions;
  });
  const max = Math.max(...ranked.slice(0, 24).map((term) => scoreTerm(term)), 1);
  $("#wordCloud").innerHTML = ranked
    .slice(0, 24)
    .map((term) => {
      const scale = 0.85 + (scoreTerm(term) / max) * 1.3;
      return `<button class="word-chip ${term.term === state.selectedTerm ? "is-active" : ""}" style="font-size:${scale.toFixed(2)}rem" data-term="${escapeHtml(term.term)}">${escapeHtml(term.term)}</button>`;
    })
    .join("");

  $$("#wordCloud [data-term]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedTerm = button.dataset.term;
      syncTermSelects();
      renderDashboard();
      renderTermList();
      renderTermDetail();
      renderAiPack();
    });
  });
}

function scoreTerm(term) {
  if (state.lens === "momentum") return Math.max(0.1, term.momentum + 1);
  if (state.lens === "intensity") return Math.max(0.1, term.intensity);
  return Math.max(0.1, term.mentions);
}

function renderBurstTable() {
  const ranked = [...corpus.terms].sort((a, b) => Math.abs(b.momentum) - Math.abs(a.momentum)).slice(0, 16);
  $("#burstTable").innerHTML = ranked
    .map(
      (term) => `
        <tr>
          <td><button class="text-button" data-term="${escapeHtml(term.term)}">${escapeHtml(term.term)}</button></td>
          <td><span class="pill">${term.momentum >= 0 ? "Rising" : "Fading"}</span></td>
          <td>${formatSigned(term.momentum)}</td>
          <td>${term.latest.toFixed(2)}</td>
        </tr>
      `,
    )
    .join("");
  bindTermButtons("#burstTable");
}

function renderEraBars() {
  const maxWords = Math.max(...corpus.periods.map((period) => period.words), 1);
  $("#eraBars").innerHTML = corpus.periods
    .map(
      (period) => `
        <div class="era-row">
          <strong>${period.decade}s</strong>
          <div class="era-track"><div class="era-fill" style="width:${Math.max(3, (period.words / maxWords) * 100).toFixed(1)}%"></div></div>
          <span>${compactNumber(period.words)}</span>
        </div>
      `,
    )
    .join("");
}

function renderCorpusSearch() {
  const rows = filteredDocuments();
  $("#corpusResultTitle").textContent = `${rows.length.toLocaleString()} speeches`;
  $("#corpusTable").innerHTML = rows
    .slice(0, 180)
    .map(
      (doc) => `
        <tr>
          <td>${escapeHtml(doc.title)}</td>
          <td>${escapeHtml(doc.president)}</td>
          <td>${doc.year}</td>
          <td>${compactNumber(doc.wordCount)}</td>
          <td><a href="${escapeHtml(doc.url)}" target="_blank" rel="noreferrer">Open</a></td>
        </tr>
      `,
    )
    .join("");
}

function filteredDocuments() {
  const query = state.corpusQuery.trim().toLowerCase();
  return corpus.documents.filter((doc) => {
    const decade = Math.floor(doc.year / 10) * 10;
    const text = `${doc.title} ${doc.president} ${doc.year}`.toLowerCase();
    return (
      (!query || text.includes(query)) &&
      (state.president === "all" || doc.president === state.president) &&
      (state.decade === "all" || String(decade) === state.decade)
    );
  });
}

function renderTermList() {
  const rows = filteredTerms();
  $("#termResultTitle").textContent = `${rows.length.toLocaleString()} terms`;
  $("#termList").innerHTML = rows
    .map(
      (term) => `
        <button class="term-row ${term.term === state.selectedTerm ? "is-active" : ""}" data-term="${escapeHtml(term.term)}">
          <span>
            <strong>${escapeHtml(term.term)}</strong>
            <small>${escapeHtml(term.category)} · first seen ${term.firstYear || "n/a"}</small>
          </span>
          <b>${term.mentions.toLocaleString()}</b>
        </button>
      `,
    )
    .join("");
  bindTermButtons("#termList");
}

function filteredTerms() {
  const query = state.termQuery.trim().toLowerCase();
  return corpus.terms
    .filter((term) => {
      const text = `${term.term} ${term.category} ${term.source}`.toLowerCase();
      return (!query || text.includes(query)) && (state.category === "all" || term.category === state.category);
    })
    .sort((a, b) => b.mentions - a.mentions);
}

function renderTermDetail() {
  const term = selectedTerm();
  $("#termDetailTitle").textContent = term.term;
  const topDocs = term.topDocuments?.length ? term.topDocuments : [];
  $("#termDetail").innerHTML = `
    <div class="detail-metrics">
      <div><span>Mentions</span><strong>${term.mentions.toLocaleString()}</strong></div>
      <div><span>Documents</span><strong>${term.documentCount.toLocaleString()}</strong></div>
      <div><span>First year</span><strong>${term.firstYear || "n/a"}</strong></div>
      <div><span>Momentum</span><strong>${formatSigned(term.momentum)}</strong></div>
    </div>
    <svg id="termSparkline" class="sparkline" role="img" aria-label="Selected term sparkline"></svg>
    <h3>Top source speeches</h3>
    <div class="evidence-list">
      ${
        topDocs.length
          ? topDocs
              .map(
                (doc) => `
                  <article class="evidence-item">
                    <span>${escapeHtml(doc.president)} · ${doc.year} · ${doc.count} hits</span>
                    <strong>${escapeHtml(doc.title)}</strong>
                    <a href="${escapeHtml(doc.url)}" target="_blank" rel="noreferrer">Open source</a>
                  </article>
                `,
              )
              .join("")
          : '<article class="evidence-item"><strong>No document-level evidence for this discovered phrase yet.</strong><span>It still appears in the aggregate decade index.</span></article>'
      }
    </div>
  `;
  renderSparkline($("#termSparkline"), term.series.usa);
}

function renderCompare() {
  const compared = state.compareTerms
    .map((name) => corpus.terms.find((term) => term.term === name))
    .filter(Boolean);
  renderCompareChart(compared);
  renderCompareCards(compared);
  renderCompareEvidence(compared);
}

function renderCompareChart(compared) {
  const svg = $("#compareChart");
  const width = 820;
  const height = 320;
  const pad = { top: 24, right: 32, bottom: 38, left: 48 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const max = Math.max(...compared.flatMap((term) => term.series.usa), 1) * 1.18;

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = "";

  [0, 0.25, 0.5, 0.75, 1].forEach((ratio) => {
    const y = pad.top + plotH * ratio;
    svg.appendChild(svgLine(pad.left, y, width - pad.right, y, "grid-line"));
  });

  corpus.years.forEach((year, index) => {
    if (index % 3 !== 0 && index !== corpus.years.length - 1) return;
    const x = pad.left + (index / (corpus.years.length - 1)) * plotW;
    const label = svgText(x, height - 12, String(year), "chart-label");
    label.setAttribute("text-anchor", "middle");
    svg.appendChild(label);
  });

  compared.forEach((term, termIndex) => {
    const color = compareColor(termIndex);
    const points = term.series.usa.map((value, index) => {
      const x = pad.left + (index / (corpus.years.length - 1)) * plotW;
      const y = pad.top + plotH - (value / max) * plotH;
      return [x, y, value, corpus.years[index]];
    });
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "chart-line compare-line");
    path.setAttribute("stroke", color);
    path.setAttribute("d", points.map(([x, y], index) => `${index ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" "));
    svg.appendChild(path);

    const last = points[points.length - 1];
    const label = svgText(width - pad.right, last[1] - 8, term.term, "chart-label");
    label.setAttribute("text-anchor", "end");
    label.setAttribute("fill", color);
    svg.appendChild(label);

    points.forEach(([x, y, value, year], index) => {
      if (index !== points.length - 1 && index % 4 !== 0) return;
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", x);
      dot.setAttribute("cy", y);
      dot.setAttribute("r", 3.5);
      dot.setAttribute("fill", color);
      dot.appendChild(svgTitle(`${term.term} ${year}: ${value.toFixed(2)}`));
      svg.appendChild(dot);
    });
  });
}

function renderCompareCards(compared) {
  $("#compareCards").innerHTML = compared
    .map(
      (term, index) => `
        <article class="compare-card" style="--compare-color:${compareColor(index)}">
          <span>${escapeHtml(term.category)}</span>
          <strong>${escapeHtml(term.term)}</strong>
          <dl>
            <div><dt>Mentions</dt><dd>${term.mentions.toLocaleString()}</dd></div>
            <div><dt>First seen</dt><dd>${term.firstYear || "n/a"}</dd></div>
            <div><dt>Latest</dt><dd>${term.latest.toFixed(2)}</dd></div>
            <div><dt>Momentum</dt><dd>${formatSigned(term.momentum)}</dd></div>
          </dl>
        </article>
      `,
    )
    .join("");
}

function renderCompareEvidence(compared) {
  $("#compareEvidence").innerHTML = compared
    .map(
      (term, index) => `
        <article class="compare-evidence-column" style="--compare-color:${compareColor(index)}">
          <h3>${escapeHtml(term.term)}</h3>
          ${
            term.topDocuments?.length
              ? term.topDocuments
                  .slice(0, 4)
                  .map(
                    (doc) => `
                      <a href="${escapeHtml(doc.url)}" target="_blank" rel="noreferrer">
                        <span>${escapeHtml(doc.president)} · ${doc.year} · ${doc.count} hits</span>
                        <strong>${escapeHtml(doc.title)}</strong>
                      </a>
                    `,
                  )
                  .join("")
              : '<p>No document-level evidence for this discovered phrase yet.</p>'
          }
        </article>
      `,
    )
    .join("");
}

function renderSparkline(svg, series) {
  const width = 620;
  const height = 120;
  const max = Math.max(...series, 1);
  const points = series.map((value, index) => [
    (index / (series.length - 1)) * width,
    height - (value / max) * (height - 12) - 6,
  ]);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = "";
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("class", "chart-line");
  path.setAttribute("d", points.map(([x, y], index) => `${index ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" "));
  svg.appendChild(path);
}

function renderSources() {
  $("#sourceGrid").innerHTML = sourceCatalog
    .map(
      (source) => `
        <a class="source-card" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">
          <span class="pill">${escapeHtml(source.status)}</span>
          <h3>${escapeHtml(source.title)}</h3>
          <p>${escapeHtml(source.note)}</p>
          <div class="source-meta">
            <span class="pill">${escapeHtml(source.coverage)}</span>
            <span class="pill">${escapeHtml(source.format)}</span>
          </div>
        </a>
      `,
    )
    .join("");
}

function renderAiPack() {
  const term = selectedTerm();
  const question = $("#aiQuestion").value.trim();
  const evidence = {
    generated_at: new Date().toISOString(),
    question,
    corpus: corpus.source,
    term: {
      term: term.term,
      category: term.category,
      mentions: term.mentions,
      document_count: term.documentCount,
      first_year: term.firstYear,
      peak_intensity_per_10k_words: term.intensity,
      latest_intensity_per_10k_words: term.latest,
      momentum: term.momentum,
      decade_series: corpus.years.map((year, index) => ({ year, value: term.series.usa[index] })),
      top_documents: term.topDocuments || [],
    },
  };

  $("#aiEvidence").value = [
    "You are analyzing dated political rhetoric. Use the evidence below to answer the research question.",
    `Question: ${question}`,
    "Be explicit about limitations: this pack currently includes Miller Center presidential speeches only, not UN/EU/podcast corpora yet.",
    JSON.stringify(evidence, null, 2),
  ].join("\n\n");
}

function analyzeCustomText() {
  const raw = $("#customText").value;
  const output = $("#customOutput");
  const tokens = raw
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 3 && !stopWords.has(token));

  if (tokens.length < 12) {
    output.textContent = "Paste at least one substantial paragraph to extract a useful signal.";
    return;
  }

  const counts = new Map();
  tokens.forEach((token) => counts.set(token, (counts.get(token) || 0) + 1));
  for (let index = 0; index < tokens.length - 1; index += 1) {
    const phrase = `${tokens[index]} ${tokens[index + 1]}`;
    counts.set(phrase, (counts.get(phrase) || 0) + 2);
  }
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  const overlaps = ranked.filter(([term]) => corpus.terms.some((indexed) => indexed.term.includes(term) || term.includes(indexed.term)));

  output.innerHTML = `
    <strong>${tokens.length.toLocaleString()} candidate words scanned</strong>
    <p>${overlaps.length ? `${overlaps.length} extracted terms overlap with the indexed corpus.` : "No direct indexed overlap found."}</p>
    <div class="mini-tags">
      ${ranked.map(([term, count]) => `<span class="pill">${escapeHtml(term)} · ${count}</span>`).join("")}
    </div>
  `;
}

function runGlobalSearch() {
  const query = $("#globalSearch").value.trim();
  if (!query) return;
  state.corpusQuery = query;
  state.termQuery = query;
  $("#corpusSearch").value = query;
  $("#termSearch").value = query;
  navigate("/corpus");
  renderCorpusSearch();
  renderTermList();
}

function exportCorpusResults() {
  const rows = filteredDocuments();
  const payload = JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      query: state.corpusQuery,
      president: state.president,
      decade: state.decade,
      count: rows.length,
      documents: rows,
    },
    null,
    2,
  );
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ordsalat-corpus-results.json";
  link.click();
  URL.revokeObjectURL(url);
}

async function copyPrompt() {
  const prompt = $("#aiEvidence").value;
  try {
    await navigator.clipboard.writeText(prompt);
  } catch {
    $("#aiEvidence").select();
    document.execCommand("copy");
  }
  $("#copyPromptButton").textContent = "Copied";
  setTimeout(() => {
    $("#copyPromptButton").textContent = "Copy Prompt";
  }, 1400);
}

function bindTermButtons(scope) {
  $$(`${scope} [data-term]`).forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedTerm = button.dataset.term;
      syncTermSelects();
      renderDashboard();
      renderTermList();
      renderTermDetail();
      renderAiPack();
      if (state.route !== "/terms" && scope !== "#wordCloud") navigate("/terms");
    });
  });
}

function selectedTerm() {
  return corpus.terms.find((term) => term.term === state.selectedTerm) || corpus.terms[0];
}

function svgLine(x1, y1, x2, y2, className) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("class", className);
  return line;
}

function svgText(x, y, value, className) {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y);
  text.setAttribute("class", className);
  text.textContent = value;
  return text;
}

function svgTitle(value) {
  const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
  title.textContent = value;
  return title;
}

function compactNumber(value) {
  return Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function formatSigned(value) {
  return `${value >= 0 ? "+" : ""}${Number(value).toFixed(2)}`;
}

function compareColor(index) {
  return ["#087f6f", "#b64b30", "#355c9f", "#8d6f22"][index % 4];
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
