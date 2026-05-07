const years = Array.from({ length: 14 }, (_, index) => 2000 + index * 2);

const cohorts = [
  {
    id: "un",
    name: "UN",
    fullName: "United Nations",
    color: "#087f6f",
    documents: 10568,
    span: "1946-today",
  },
  {
    id: "eu",
    name: "EU",
    fullName: "European Parliament",
    color: "#355c9f",
    documents: 563696,
    span: "1999-2024",
  },
  {
    id: "usa",
    name: "USA",
    fullName: "US executive speeches",
    color: "#b64b30",
    documents: 1200,
    span: "1789-today",
  },
  {
    id: "podcasts",
    name: "Podcasts",
    fullName: "Podcast transcripts",
    color: "#8d6f22",
    documents: 4000000,
    span: "API dependent",
  },
];

const terms = [
  {
    term: "sustainable development",
    category: "policy",
    profiles: {
      un: { first: 2000, intensity: 9.4, momentum: 0.22 },
      eu: { first: 2000, intensity: 7.7, momentum: 0.18 },
      usa: { first: 2004, intensity: 3.9, momentum: 0.08 },
      podcasts: { first: 2014, intensity: 2.8, momentum: 0.1 },
    },
  },
  {
    term: "resilience",
    category: "systems",
    profiles: {
      un: { first: 2012, intensity: 8.4, momentum: 0.54 },
      eu: { first: 2010, intensity: 8.9, momentum: 0.5 },
      usa: { first: 2012, intensity: 5.5, momentum: 0.34 },
      podcasts: { first: 2018, intensity: 6.7, momentum: 0.64 },
    },
  },
  {
    term: "rules-based order",
    category: "geopolitics",
    profiles: {
      un: { first: 2014, intensity: 5.8, momentum: 0.4 },
      eu: { first: 2016, intensity: 6.4, momentum: 0.45 },
      usa: { first: 2012, intensity: 7.8, momentum: 0.28 },
      podcasts: { first: 2018, intensity: 4.2, momentum: 0.34 },
    },
  },
  {
    term: "stakeholders",
    category: "governance",
    profiles: {
      un: { first: 2002, intensity: 7.1, momentum: 0.16 },
      eu: { first: 2000, intensity: 8.2, momentum: 0.18 },
      usa: { first: 2008, intensity: 3.8, momentum: 0.08 },
      podcasts: { first: 2016, intensity: 3.5, momentum: 0.2 },
    },
  },
  {
    term: "misinformation",
    category: "media",
    profiles: {
      un: { first: 2016, intensity: 5.9, momentum: 0.62 },
      eu: { first: 2016, intensity: 8.6, momentum: 0.68 },
      usa: { first: 2016, intensity: 7.2, momentum: 0.54 },
      podcasts: { first: 2018, intensity: 8.2, momentum: 0.72 },
    },
  },
  {
    term: "artificial intelligence",
    category: "technology",
    profiles: {
      un: { first: 2018, intensity: 6.6, momentum: 0.88 },
      eu: { first: 2018, intensity: 9.5, momentum: 0.9 },
      usa: { first: 2018, intensity: 7.7, momentum: 0.78 },
      podcasts: { first: 2016, intensity: 10.2, momentum: 0.94 },
    },
  },
  {
    term: "climate emergency",
    category: "climate",
    profiles: {
      un: { first: 2018, intensity: 8.9, momentum: 0.52 },
      eu: { first: 2018, intensity: 9.1, momentum: 0.48 },
      usa: { first: 2020, intensity: 4.6, momentum: 0.2 },
      podcasts: { first: 2018, intensity: 6.1, momentum: 0.36 },
    },
  },
  {
    term: "green transition",
    category: "climate",
    profiles: {
      un: { first: 2014, intensity: 4.2, momentum: 0.36 },
      eu: { first: 2012, intensity: 9.7, momentum: 0.62 },
      usa: { first: 2020, intensity: 4.3, momentum: 0.24 },
      podcasts: { first: 2018, intensity: 5.6, momentum: 0.42 },
    },
  },
  {
    term: "equity",
    category: "society",
    profiles: {
      un: { first: 2008, intensity: 7.6, momentum: 0.34 },
      eu: { first: 2010, intensity: 5.7, momentum: 0.2 },
      usa: { first: 2014, intensity: 8.4, momentum: 0.56 },
      podcasts: { first: 2016, intensity: 6.5, momentum: 0.46 },
    },
  },
  {
    term: "inclusive growth",
    category: "economics",
    profiles: {
      un: { first: 2010, intensity: 7.9, momentum: 0.25 },
      eu: { first: 2010, intensity: 6.8, momentum: 0.2 },
      usa: { first: 2012, intensity: 3.6, momentum: 0.14 },
      podcasts: { first: 2018, intensity: 2.8, momentum: 0.16 },
    },
  },
  {
    term: "supply chains",
    category: "economics",
    profiles: {
      un: { first: 2020, intensity: 5.4, momentum: 0.5 },
      eu: { first: 2020, intensity: 6.9, momentum: 0.56 },
      usa: { first: 2020, intensity: 7.8, momentum: 0.62 },
      podcasts: { first: 2020, intensity: 7.1, momentum: 0.58 },
    },
  },
  {
    term: "digital sovereignty",
    category: "technology",
    profiles: {
      un: { first: 2020, intensity: 3.2, momentum: 0.4 },
      eu: { first: 2018, intensity: 8.3, momentum: 0.72 },
      usa: { first: 2020, intensity: 3.4, momentum: 0.28 },
      podcasts: { first: 2020, intensity: 4.9, momentum: 0.5 },
    },
  },
  {
    term: "human-centered",
    category: "technology",
    profiles: {
      un: { first: 2016, intensity: 5.2, momentum: 0.44 },
      eu: { first: 2016, intensity: 5.8, momentum: 0.48 },
      usa: { first: 2018, intensity: 4.5, momentum: 0.34 },
      podcasts: { first: 2016, intensity: 6.4, momentum: 0.52 },
    },
  },
  {
    term: "whole-of-society",
    category: "governance",
    profiles: {
      un: { first: 2018, intensity: 5.7, momentum: 0.58 },
      eu: { first: 2020, intensity: 4.6, momentum: 0.42 },
      usa: { first: 2020, intensity: 4.2, momentum: 0.5 },
      podcasts: { first: 2022, intensity: 2.4, momentum: 0.34 },
    },
  },
  {
    term: "polycrisis",
    category: "systems",
    profiles: {
      un: { first: 2022, intensity: 4.8, momentum: 0.88 },
      eu: { first: 2022, intensity: 5.5, momentum: 0.92 },
      usa: { first: 2022, intensity: 2.1, momentum: 0.52 },
      podcasts: { first: 2022, intensity: 7.4, momentum: 0.94 },
    },
  },
  {
    term: "democratic backsliding",
    category: "democracy",
    profiles: {
      un: { first: 2016, intensity: 4.3, momentum: 0.4 },
      eu: { first: 2014, intensity: 7.1, momentum: 0.52 },
      usa: { first: 2018, intensity: 5.8, momentum: 0.44 },
      podcasts: { first: 2018, intensity: 5.6, momentum: 0.5 },
    },
  },
];

const sources = [
  {
    title: "UN General Debate Corpus",
    status: "Primary",
    coverage: "1946-today",
    format: "Searchable transcripts",
    url: "https://www.ungdc.bham.ac.uk/",
    note: "Best first ingestion for long-run institutional language across countries and leaders.",
  },
  {
    title: "European Parliament Verbatim Reports",
    status: "Primary",
    coverage: "Current XML/HTML",
    format: "Official plenary records",
    url: "https://www.europarl.europa.eu/plenary/en/debates-video.html",
    note: "Use official XML/HTML for near-current EU speeches and link every result back to sitting dates.",
  },
  {
    title: "EUPDCorp 1999-2024",
    status: "Bulk",
    coverage: "1999-2024",
    format: "RDS dataset",
    url: "https://zenodo.org/records/15056399",
    note: "Large research corpus with speaker, party, nationality, date and agenda metadata.",
  },
  {
    title: "Miller Center Speeches",
    status: "Bulk",
    coverage: "1789-present",
    format: "JSON archive",
    url: "https://data.millercenter.org/",
    note: "Useful baseline for comparing institutional language against US presidential rhetoric.",
  },
  {
    title: "White House Remarks",
    status: "Live",
    coverage: "Current admin",
    format: "HTML transcripts",
    url: "https://www.whitehouse.gov/remarks/",
    note: "Near-current feed for official US remarks; archive older administrations through NARA.",
  },
  {
    title: "Podcast Transcript APIs",
    status: "Licensed",
    coverage: "API dependent",
    format: "Transcript search",
    url: "https://podscan.fm/api-platform",
    note: "Use licensed APIs for media diffusion tracking, especially when comparing official adoption versus commentary.",
  },
];

const stopWords = new Set(
  "about above after again against all also among and any are because been before being between both but can could did does doing down during each few for from further had has have having here how into its itself just more most other our out over own same should some such than that the their them then there these they this those through too under until very was were what when where which while who why will with would your".split(
    " ",
  ),
);

let activeCohorts = new Set(cohorts.map((cohort) => cohort.id));
let selectedTerm = "resilience";
let selectedLens = "frequency";

const $ = (selector) => document.querySelector(selector);

function getSeries(term, cohortId) {
  const profile = term.profiles[cohortId];
  return years.map((year, index) => {
    if (year < profile.first) return 0;
    const age = Math.max(0, year - profile.first);
    const adoption = 1 - Math.exp(-age / 5);
    const lateBoost = year >= 2020 ? 1 + profile.momentum * ((year - 2018) / 8) : 1;
    const cycle = 0.86 + Math.sin(index * 1.15 + profile.intensity) * 0.08;
    return Number((Math.max(0.18, profile.intensity * adoption * lateBoost * cycle)).toFixed(2));
  });
}

function getLatest(term, cohortIds = [...activeCohorts]) {
  const finalIndex = years.length - 1;
  const values = cohortIds.map((id) => getSeries(term, id)[finalIndex]);
  return average(values);
}

function getVelocity(term, cohortIds = [...activeCohorts]) {
  const values = cohortIds.map((id) => {
    const series = getSeries(term, id);
    return series[series.length - 1] - series[series.length - 4];
  });
  return average(values);
}

function getFirstAppearance(term, cohortId) {
  const profile = term.profiles[cohortId];
  return profile.first;
}

function getEarliest(term, cohortIds = [...activeCohorts]) {
  return cohortIds
    .map((cohortId) => ({
      cohortId,
      year: getFirstAppearance(term, cohortId),
    }))
    .sort((a, b) => a.year - b.year)[0];
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function getTermScore(term) {
  if (selectedLens === "velocity") return Math.max(0.4, getVelocity(term) * 1.8);
  if (selectedLens === "novelty") {
    const earliest = getEarliest(term).year;
    return Math.max(0.8, (earliest - 1998) / 3 + getVelocity(term));
  }
  return getLatest(term);
}

function renderCohortControls() {
  const container = $("#cohortControls");
  container.innerHTML = "";
  cohorts.forEach((cohort) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `segment-button ${activeCohorts.has(cohort.id) ? "is-active" : ""}`;
    button.textContent = cohort.name;
    button.style.setProperty("--cohort-color", cohort.color);
    button.addEventListener("click", () => {
      if (activeCohorts.has(cohort.id) && activeCohorts.size > 1) {
        activeCohorts.delete(cohort.id);
      } else {
        activeCohorts.add(cohort.id);
      }
      updateDashboard();
    });
    container.appendChild(button);
  });
}

function renderTermOptions() {
  const selects = [$("#termSelect"), $("#aiTermChoice")];
  selects.forEach((select) => {
    const currentValue = select.value || selectedTerm;
    select.innerHTML = "";
    terms.forEach((term) => {
      const option = document.createElement("option");
      option.value = term.term;
      option.textContent = term.term;
      select.appendChild(option);
    });
    select.value = terms.some((term) => term.term === currentValue) ? currentValue : selectedTerm;
  });
}

function renderMetrics() {
  $("#metricDocs").textContent = compactNumber(
    cohorts.filter((cohort) => activeCohorts.has(cohort.id)).reduce((total, cohort) => total + cohort.documents, 0),
  );
  $("#metricTerms").textContent = terms.length.toString();

  const riser = [...terms].sort((a, b) => getVelocity(b) - getVelocity(a))[0];
  $("#metricRiser").textContent = riser.term;
  $("#metricRiserMeta").textContent = `+${getVelocity(riser).toFixed(1)} index points`;

  const earliest = [...terms]
    .map((term) => ({ term, first: getEarliest(term) }))
    .sort((a, b) => a.first.year - b.first.year)[0];
  const cohort = cohorts.find((item) => item.id === earliest.first.cohortId);
  $("#metricEarliest").textContent = earliest.term.term;
  $("#metricEarliestMeta").textContent = `${cohort.name}, ${earliest.first.year}`;
}

function renderWordCloud() {
  const container = $("#wordCloud");
  const scored = [...terms]
    .map((term) => ({ term, score: getTermScore(term) }))
    .sort((a, b) => b.score - a.score);
  const max = Math.max(...scored.map((item) => item.score), 1);
  const positions = [
    [50, 48],
    [28, 30],
    [72, 30],
    [30, 67],
    [70, 68],
    [50, 20],
    [18, 50],
    [82, 50],
    [48, 76],
    [23, 15],
    [76, 15],
    [16, 78],
    [84, 80],
    [38, 48],
    [62, 52],
    [50, 90],
  ];
  container.innerHTML = "";
  scored.forEach((item, index) => {
    const button = document.createElement("button");
    const [left, top] = positions[index % positions.length];
    const size = 0.85 + (item.score / max) * 2.25;
    const color = categoryColor(item.term.category);
    button.type = "button";
    button.className = `word-token ${item.term.term === selectedTerm ? "is-selected" : ""}`;
    button.style.left = `${left}%`;
    button.style.top = `${top}%`;
    button.style.fontSize = `clamp(0.85rem, ${size}rem, 3.2rem)`;
    button.style.setProperty("--token-color", color);
    button.textContent = item.term.term;
    button.title = `${item.term.category}: ${item.score.toFixed(1)}`;
    button.addEventListener("click", () => {
      selectedTerm = item.term.term;
      $("#termSelect").value = selectedTerm;
      $("#aiTermChoice").value = selectedTerm;
      updateDashboard();
    });
    container.appendChild(button);
  });

  $("#activeCohortsLabel").textContent = cohorts
    .filter((cohort) => activeCohorts.has(cohort.id))
    .map((cohort) => cohort.name)
    .join(" + ");
}

function renderTimeline() {
  const svg = $("#timelineChart");
  const term = terms.find((item) => item.term === selectedTerm) || terms[0];
  $("#timelineTitle").textContent = `${term.term} trajectory`;
  const width = 720;
  const height = 300;
  const padding = { top: 24, right: 24, bottom: 36, left: 42 };
  const active = cohorts.filter((cohort) => activeCohorts.has(cohort.id));
  const allValues = active.flatMap((cohort) => getSeries(term, cohort.id));
  const maxValue = Math.max(...allValues, 1) * 1.18;
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = "";

  [0, 0.25, 0.5, 0.75, 1].forEach((ratio) => {
    const y = padding.top + plotHeight * ratio;
    svg.appendChild(line(padding.left, y, width - padding.right, y, "grid-line"));
  });

  svg.appendChild(line(padding.left, padding.top, padding.left, height - padding.bottom, "axis-line"));
  svg.appendChild(line(padding.left, height - padding.bottom, width - padding.right, height - padding.bottom, "axis-line"));

  years.forEach((year, index) => {
    if (index % 2 !== 0 && year !== 2026) return;
    const x = padding.left + (index / (years.length - 1)) * plotWidth;
    const label = text(x, height - 12, year.toString(), "chart-label");
    label.setAttribute("text-anchor", "middle");
    svg.appendChild(label);
  });

  active.forEach((cohort) => {
    const series = getSeries(term, cohort.id);
    const points = series.map((value, index) => {
      const x = padding.left + (index / (years.length - 1)) * plotWidth;
      const y = padding.top + plotHeight - (value / maxValue) * plotHeight;
      return [x, y, value];
    });

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "chart-line");
    path.setAttribute("stroke", cohort.color);
    path.setAttribute(
      "d",
      points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" "),
    );
    svg.appendChild(path);

    points.forEach(([x, y, value], index) => {
      if (index % 2 !== 0 && index !== points.length - 1) return;
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("class", "chart-dot");
      dot.setAttribute("cx", x);
      dot.setAttribute("cy", y);
      dot.setAttribute("r", 4);
      dot.setAttribute("fill", cohort.color);
      dot.appendChild(title(`${cohort.name} ${years[index]}: ${value.toFixed(1)}`));
      svg.appendChild(dot);
    });

    const last = points[points.length - 1];
    const label = text(last[0] - 6, last[1] - 10, cohort.name, "chart-label");
    label.setAttribute("text-anchor", "end");
    label.setAttribute("fill", cohort.color);
    svg.appendChild(label);
  });
}

function line(x1, y1, x2, y2, className) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", "line");
  element.setAttribute("x1", x1);
  element.setAttribute("y1", y1);
  element.setAttribute("x2", x2);
  element.setAttribute("y2", y2);
  element.setAttribute("class", className);
  return element;
}

function text(x, y, value, className) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", "text");
  element.setAttribute("x", x);
  element.setAttribute("y", y);
  element.setAttribute("class", className);
  element.textContent = value;
  return element;
}

function title(value) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", "title");
  element.textContent = value;
  return element;
}

function renderFirstAppearances() {
  const tbody = $("#firstAppearanceTable");
  const rows = [...terms]
    .map((term) => {
      const earliest = getEarliest(term);
      const cohort = cohorts.find((item) => item.id === earliest.cohortId);
      return {
        term,
        cohort,
        year: earliest.year,
        latest: getLatest(term),
      };
    })
    .sort((a, b) => a.year - b.year || b.latest - a.latest);
  tbody.innerHTML = "";
  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(row.term.term)}</td>
      <td><span class="pill">${escapeHtml(row.cohort.name)}</span></td>
      <td>${row.year}</td>
      <td>${row.latest.toFixed(1)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderSimilarity() {
  const container = $("#similarityMatrix");
  const activeTerms = [...terms].sort((a, b) => getLatest(b) - getLatest(a)).slice(0, 12);
  const header = ["", ...cohorts.map((cohort) => cohort.name)];
  container.innerHTML = "";
  header.forEach((labelText) => {
    const cell = document.createElement("div");
    cell.className = "matrix-cell label";
    cell.textContent = labelText;
    container.appendChild(cell);
  });

  cohorts.forEach((rowCohort) => {
    const rowLabel = document.createElement("div");
    rowLabel.className = "matrix-cell label";
    rowLabel.textContent = rowCohort.name;
    container.appendChild(rowLabel);

    cohorts.forEach((colCohort) => {
      const overlap = calculateOverlap(activeTerms, rowCohort.id, colCohort.id);
      const cell = document.createElement("div");
      cell.className = "matrix-cell";
      cell.textContent = `${Math.round(overlap * 100)}%`;
      cell.style.background = `color-mix(in srgb, ${rowCohort.color} ${Math.round(overlap * 45)}%, var(--bg))`;
      container.appendChild(cell);
    });
  });
}

function calculateOverlap(activeTerms, firstCohortId, secondCohortId) {
  if (firstCohortId === secondCohortId) return 1;
  const first = activeTerms.map((term) => getSeries(term, firstCohortId).at(-1));
  const second = activeTerms.map((term) => getSeries(term, secondCohortId).at(-1));
  const dot = first.reduce((total, value, index) => total + value * second[index], 0);
  const firstMagnitude = Math.sqrt(first.reduce((total, value) => total + value * value, 0));
  const secondMagnitude = Math.sqrt(second.reduce((total, value) => total + value * value, 0));
  return dot / Math.max(1, firstMagnitude * secondMagnitude);
}

function renderSources() {
  const grid = $("#sourceGrid");
  grid.innerHTML = "";
  sources.forEach((source) => {
    const card = document.createElement("a");
    card.className = "source-card";
    card.href = source.url;
    card.target = "_blank";
    card.rel = "noreferrer";
    card.innerHTML = `
      <span class="pill">${escapeHtml(source.status)}</span>
      <h3>${escapeHtml(source.title)}</h3>
      <p>${escapeHtml(source.note)}</p>
      <div class="source-meta">
        <span class="pill">${escapeHtml(source.coverage)}</span>
        <span class="pill">${escapeHtml(source.format)}</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderAiPack() {
  const term = terms.find((item) => item.term === $("#aiTermChoice").value) || terms.find((item) => item.term === selectedTerm);
  const question = $("#aiQuestion").value.trim();
  const evidence = cohorts.map((cohort) => {
    const series = getSeries(term, cohort.id);
    return {
      cohort: cohort.name,
      first_year: getFirstAppearance(term, cohort.id),
      latest_index: series.at(-1),
      velocity_since_2020: Number((series.at(-1) - series[10]).toFixed(2)),
      source_span: cohort.span,
    };
  });
  const pack = {
    generated_at: new Date().toISOString(),
    question,
    term: term.term,
    unit: "seed index, frequency per 10k words proxy",
    cohorts: evidence,
    source_notes: sources.map((source) => source.title),
  };

  $("#jsonPreview").textContent = JSON.stringify(pack, null, 2);
  $("#aiEvidence").value = [
    "You are analyzing dated rhetoric across institutions and media.",
    `Question: ${question}`,
    `Focus term: ${term.term}`,
    "Use the JSON evidence pack below. Compare first appearance, latest intensity, and velocity. Be explicit about source limitations and do not infer causation from sequence alone.",
    JSON.stringify(pack, null, 2),
  ].join("\n\n");
}

function analyzeCustomText() {
  const raw = $("#customText").value;
  const output = $("#customOutput");
  const words = raw
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));
  if (words.length < 10) {
    output.innerHTML = "<span>Add at least a paragraph of transcript text to extract a useful signal.</span>";
    return;
  }

  const counts = new Map();
  words.forEach((word) => counts.set(word, (counts.get(word) || 0) + 1));
  const bigrams = [];
  for (let index = 0; index < words.length - 1; index += 1) {
    if (stopWords.has(words[index]) || stopWords.has(words[index + 1])) continue;
    bigrams.push(`${words[index]} ${words[index + 1]}`);
  }
  bigrams.forEach((phrase) => counts.set(phrase, (counts.get(phrase) || 0) + 2));

  const ranked = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }));
  const knownHits = ranked.filter((item) => terms.some((term) => term.term.includes(item.word) || item.word.includes(term.term)));

  output.innerHTML = `
    <strong>${words.length.toLocaleString()} candidate words scanned</strong>
    <p>${knownHits.length ? `${knownHits.length} terms overlap with the seed rhetoric index.` : "No direct seed-index overlaps found. This may be a genuinely new vocabulary pocket."}</p>
    <ul>
      ${ranked.map((item) => `<li><strong>${escapeHtml(item.word)}</strong> <span class="pill">${item.count}</span></li>`).join("")}
    </ul>
  `;
}

function addTermFromSearch() {
  const value = $("#termSearch").value.trim().toLowerCase();
  if (!value) return;
  const existing = terms.find((term) => term.term === value);
  if (existing) {
    selectedTerm = existing.term;
  } else {
    terms.push({
      term: value,
      category: "custom",
      profiles: {
        un: { first: 2024, intensity: 2.6, momentum: 0.72 },
        eu: { first: 2024, intensity: 2.4, momentum: 0.66 },
        usa: { first: 2024, intensity: 2.2, momentum: 0.58 },
        podcasts: { first: 2022, intensity: 3.8, momentum: 0.86 },
      },
    });
    selectedTerm = value;
    renderTermOptions();
  }
  $("#termSearch").value = "";
  $("#termSelect").value = selectedTerm;
  $("#aiTermChoice").value = selectedTerm;
  updateDashboard();
}

function categoryColor(category) {
  const palette = {
    policy: "#087f6f",
    systems: "#7a4fb3",
    geopolitics: "#b64b30",
    governance: "#355c9f",
    media: "#c05a91",
    technology: "#0f8aa8",
    climate: "#2f8750",
    society: "#8d6f22",
    economics: "#a86624",
    democracy: "#5964b8",
    custom: "#1d2520",
  };
  return palette[category] || "#087f6f";
}

function compactNumber(value) {
  return Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function escapeHtml(value) {
  return value
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function updateDashboard() {
  renderCohortControls();
  renderMetrics();
  renderWordCloud();
  renderTimeline();
  renderFirstAppearances();
  renderSimilarity();
  renderAiPack();
}

function boot() {
  renderTermOptions();
  renderSources();
  updateDashboard();

  $("#termSelect").addEventListener("change", (event) => {
    selectedTerm = event.target.value;
    $("#aiTermChoice").value = selectedTerm;
    updateDashboard();
  });
  $("#lensSelect").addEventListener("change", (event) => {
    selectedLens = event.target.value;
    updateDashboard();
  });
  $("#addTermButton").addEventListener("click", addTermFromSearch);
  $("#termSearch").addEventListener("keydown", (event) => {
    if (event.key === "Enter") addTermFromSearch();
  });
  $("#analyzeTextButton").addEventListener("click", analyzeCustomText);
  $("#aiQuestion").addEventListener("input", renderAiPack);
  $("#aiTermChoice").addEventListener("change", (event) => {
    selectedTerm = event.target.value;
    $("#termSelect").value = selectedTerm;
    updateDashboard();
  });
  $("#copyPromptButton").addEventListener("click", async () => {
    const prompt = $("#aiEvidence").value;
    try {
      if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(prompt);
    } catch {
      $("#aiEvidence").select();
      document.execCommand("copy");
    }
    $("#copyPromptButton").textContent = "Copied";
    setTimeout(() => {
      $("#copyPromptButton").textContent = "Copy Prompt";
    }, 1400);
  });
  $("#themeToggle").addEventListener("click", () => {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  });
}

boot();
