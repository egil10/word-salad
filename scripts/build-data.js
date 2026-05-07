const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const speechesDir = path.join(root, "data", "raw", "speeches");
const outputDir = path.join(root, "data", "processed");
const jsonPath = path.join(outputDir, "ordsalat-data.json");
const jsPath = path.join(outputDir, "ordsalat-data.js");

const trackedTerms = [
  ["artificial intelligence", "technology"],
  ["automation", "technology"],
  ["algorithm", "technology"],
  ["digital", "technology"],
  ["cyber", "technology"],
  ["innovation", "technology"],
  ["supply chains", "economics"],
  ["inflation", "economics"],
  ["globalization", "economics"],
  ["middle class", "economics"],
  ["jobs", "economics"],
  ["prosperity", "economics"],
  ["stakeholders", "governance"],
  ["accountability", "governance"],
  ["transparency", "governance"],
  ["whole-of-government", "governance"],
  ["security", "geopolitics"],
  ["terrorism", "geopolitics"],
  ["nuclear", "geopolitics"],
  ["allies", "geopolitics"],
  ["rules-based order", "geopolitics"],
  ["democracy", "democracy"],
  ["freedom", "democracy"],
  ["liberty", "democracy"],
  ["rights", "democracy"],
  ["constitution", "democracy"],
  ["climate", "climate"],
  ["clean energy", "climate"],
  ["energy independence", "climate"],
  ["environment", "climate"],
  ["resilience", "systems"],
  ["crisis", "systems"],
  ["pandemic", "systems"],
  ["recovery", "systems"],
  ["opportunity", "society"],
  ["equity", "society"],
  ["justice", "society"],
  ["families", "society"],
  ["education", "society"],
  ["health care", "society"],
  ["misinformation", "media"],
  ["fake news", "media"],
  ["press", "media"],
  ["truth", "media"],
  ["sustainable development", "policy"],
  ["human-centered", "technology"],
  ["inclusive growth", "economics"],
  ["green transition", "climate"],
  ["democratic backsliding", "democracy"],
  ["polycrisis", "systems"],
  ["digital sovereignty", "technology"],
];

const stopWords = new Set(
  "able about above after again against almost alone along already also although always among american americans amount another anyone anything around because become became been before being between both cannot certain chief civil come comes country could day days did does doing done down during each either enough even ever every few first for from further general give given gives good government great had has have having here herself high himself history however human important into itself just know known large last later life like little long made make makes many might more most much must nation national never only order other ought over people political president public rather right said same should since small some speech state states still such than that their them then there these they thing things think this those though through time today together under united until very want wanted wants were what when where whether which while white whole will with within without world would year years your".split(
    " ",
  ),
);

function main() {
  if (!fs.existsSync(speechesDir)) {
    throw new Error(`Missing ${speechesDir}. Download and extract the Miller Center archive first.`);
  }

  fs.mkdirSync(outputDir, { recursive: true });
  const files = fs.readdirSync(speechesDir).filter((file) => file.endsWith(".json"));
  const documents = files
    .map((file) => readSpeech(path.join(speechesDir, file)))
    .filter((speech) => speech && speech.year && speech.text.length > 200);

  const years = decadeYears(documents);
  const termStats = buildTermStats(documents, years);
  const discovered = discoverTerms(documents, years, termStats);
  const terms = [...termStats.values(), ...discovered]
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 74);

  const presidents = summarizePresidents(documents);
  const periods = summarizePeriods(documents);
  const dataset = {
    generatedAt: new Date().toISOString(),
    source: {
      id: "miller-center",
      name: "Miller Center Presidential Speeches",
      url: "https://data.millercenter.org/",
      citation:
        'Miller Center of Public Affairs, University of Virginia. "Presidential Speeches: Downloadable Data."',
      documentCount: documents.length,
      earliestYear: Math.min(...documents.map((doc) => doc.year)),
      latestYear: Math.max(...documents.map((doc) => doc.year)),
      totalWords: documents.reduce((total, doc) => total + doc.wordCount, 0),
    },
    years,
    cohorts: {
      usa: {
        documents: documents.length,
        totalWords: documents.reduce((total, doc) => total + doc.wordCount, 0),
        earliestYear: Math.min(...documents.map((doc) => doc.year)),
        latestYear: Math.max(...documents.map((doc) => doc.year)),
      },
    },
    terms,
    presidents,
    periods,
    documents: documents
      .sort((a, b) => b.year - a.year)
      .slice(0, 140)
      .map(({ id, title, president, year, date, url, wordCount }) => ({
        id,
        title,
        president,
        year,
        date,
        url,
        wordCount,
      })),
  };

  fs.writeFileSync(jsonPath, `${JSON.stringify(dataset, null, 2)}\n`);
  fs.writeFileSync(jsPath, `window.ORDSALAT_DATA = ${JSON.stringify(dataset, null, 2)};\n`);
  console.log(`Processed ${documents.length} speeches into ${path.relative(root, jsonPath)}`);
}

function readSpeech(filePath) {
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const text = cleanText([raw.title, raw.introduction, raw.transcript].filter(Boolean).join("\n"));
    const date = raw.date || "";
    const year = Number(date.slice(0, 4));
    const words = tokenize(text);
    return {
      id: path.basename(filePath, ".json"),
      title: raw.title || "Untitled speech",
      president: raw.president || "Unknown",
      date,
      year,
      url: raw.url || "",
      text,
      tokens: words,
      wordCount: words.length,
    };
  } catch (error) {
    console.warn(`Skipping ${filePath}: ${error.message}`);
    return null;
  }
}

function cleanText(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;|&#8212;/g, "-")
    .replace(/&ldquo;|&rdquo;|&quot;/g, '"')
    .replace(/&lsquo;|&rsquo;|&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function decadeYears(documents) {
  const min = Math.floor(Math.min(...documents.map((doc) => doc.year)) / 10) * 10;
  const max = Math.ceil(Math.max(...documents.map((doc) => doc.year)) / 10) * 10;
  const years = [];
  for (let year = min; year <= max; year += 10) years.push(year);
  return years;
}

function buildTermStats(documents, years) {
  const stats = new Map(
    trackedTerms.map(([term, category]) => [
      term,
      {
        term,
        category,
        source: "Miller Center",
        mentions: 0,
        documentCount: 0,
        firstYear: null,
        topDocuments: [],
        series: { usa: years.map(() => 0) },
      },
    ]),
  );

  const totalsByBucket = years.map((bucket) =>
    documents
      .filter((doc) => bucketForYear(doc.year, years) === bucket)
      .reduce((total, doc) => total + doc.wordCount, 0),
  );

  documents.forEach((doc) => {
    const text = ` ${doc.tokens.join(" ")} `;
    const bucketIndex = years.indexOf(bucketForYear(doc.year, years));
    stats.forEach((stat, term) => {
      const count = countTerm(text, term);
      if (!count) return;
      stat.mentions += count;
      stat.documentCount += 1;
      stat.firstYear = stat.firstYear ? Math.min(stat.firstYear, doc.year) : doc.year;
      stat.series.usa[bucketIndex] += count;
      stat.topDocuments.push({
        title: doc.title,
        president: doc.president,
        year: doc.year,
        url: doc.url,
        count,
      });
    });
  });

  stats.forEach((stat) => {
    stat.series.usa = stat.series.usa.map((count, index) =>
      totalsByBucket[index] ? Number(((count / totalsByBucket[index]) * 10000).toFixed(2)) : 0,
    );
    stat.intensity = Number(Math.max(...stat.series.usa).toFixed(2));
    stat.latest = stat.series.usa.at(-1);
    stat.momentum = Number((stat.latest - stat.series.usa[Math.max(0, stat.series.usa.length - 4)]).toFixed(2));
    stat.firstYear = stat.firstYear || null;
    stat.topDocuments = stat.topDocuments.sort((a, b) => b.count - a.count).slice(0, 5);
  });

  return stats;
}

function discoverTerms(documents, years, existingStats) {
  const phraseCounts = new Map();
  const docHits = new Map();
  const totalsByBucket = years.map(() => 0);
  const seriesCounts = new Map();

  documents.forEach((doc) => {
    const bucketIndex = years.indexOf(bucketForYear(doc.year, years));
    totalsByBucket[bucketIndex] += doc.wordCount;
    const phrasesInDoc = new Set();
    for (let index = 0; index < doc.tokens.length - 1; index += 1) {
      const first = doc.tokens[index];
      const second = doc.tokens[index + 1];
      if (first.length < 4 || second.length < 4 || stopWords.has(first) || stopWords.has(second)) continue;
      const phrase = `${first} ${second}`;
      if (existingStats.has(phrase)) continue;
      phraseCounts.set(phrase, (phraseCounts.get(phrase) || 0) + 1);
      phrasesInDoc.add(phrase);
      if (!seriesCounts.has(phrase)) seriesCounts.set(phrase, years.map(() => 0));
      seriesCounts.get(phrase)[bucketIndex] += 1;
    }
    phrasesInDoc.forEach((phrase) => docHits.set(phrase, (docHits.get(phrase) || 0) + 1));
  });

  return [...phraseCounts.entries()]
    .filter(([phrase, count]) => count >= 14 && docHits.get(phrase) >= 5 && !phrase.includes("--"))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 24)
    .map(([phrase, count]) => {
      const rawSeries = seriesCounts.get(phrase);
      const series = rawSeries.map((value, index) =>
        totalsByBucket[index] ? Number(((value / totalsByBucket[index]) * 10000).toFixed(2)) : 0,
      );
      const firstBucket = years[rawSeries.findIndex(Boolean)];
      return {
        term: phrase,
        category: "discovered",
        source: "Miller Center",
        mentions: count,
        documentCount: docHits.get(phrase),
        firstYear: firstBucket,
        intensity: Number(Math.max(...series).toFixed(2)),
        latest: series.at(-1),
        momentum: Number((series.at(-1) - series[Math.max(0, series.length - 4)]).toFixed(2)),
        topDocuments: [],
        series: { usa: series },
      };
    });
}

function countTerm(text, term) {
  const normalized = term.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").trim();
  const pattern = new RegExp(`\\b${escapeRegExp(normalized).replace(/\s+/g, "\\s+")}\\b`, "g");
  return (text.match(pattern) || []).length;
}

function bucketForYear(year, years) {
  const decade = Math.floor(year / 10) * 10;
  if (decade < years[0]) return years[0];
  if (decade > years.at(-1)) return years.at(-1);
  return decade;
}

function summarizePresidents(documents) {
  const byPresident = new Map();
  documents.forEach((doc) => {
    const stat = byPresident.get(doc.president) || {
      president: doc.president,
      documents: 0,
      words: 0,
      firstYear: doc.year,
      latestYear: doc.year,
    };
    stat.documents += 1;
    stat.words += doc.wordCount;
    stat.firstYear = Math.min(stat.firstYear, doc.year);
    stat.latestYear = Math.max(stat.latestYear, doc.year);
    byPresident.set(doc.president, stat);
  });
  return [...byPresident.values()].sort((a, b) => b.documents - a.documents);
}

function summarizePeriods(documents) {
  const byDecade = new Map();
  documents.forEach((doc) => {
    const decade = Math.floor(doc.year / 10) * 10;
    const stat = byDecade.get(decade) || { decade, documents: 0, words: 0 };
    stat.documents += 1;
    stat.words += doc.wordCount;
    byDecade.set(decade, stat);
  });
  return [...byDecade.values()].sort((a, b) => a.decade - b.decade);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

main();
