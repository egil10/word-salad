# Ordsalat

Ordsalat is a static Vercel-ready dashboard for tracking language drift across institutions, countries, media, and uploaded transcript corpora.

The first version ships with an interactive seed dataset so the product can be reviewed immediately. It is designed to ingest larger corpora such as UN General Debate transcripts, European Parliament debates, US presidential speeches, Congressional Record text, White House remarks, and podcast transcript APIs.

## Run Locally

Serve the folder with any static server:

```powershell
npx serve .
```

The app uses Vercel-style routes such as `/dashboard`, `/corpus`, `/terms`, `/compare`, `/sources`, `/ai`, and `/method`, so local testing should use a static server instead of opening the file directly.

## Deploy On Vercel

This is a dependency-free static site. Vercel can deploy it as-is from the repository root. The included `vercel.json` rewrites all routes back to `index.html`.

## Data Sources To Wire In

- UN General Debate Corpus: https://www.ungdc.bham.ac.uk/
- European Parliament verbatim reports/XML: https://www.europarl.europa.eu/plenary/en/debates-video.html
- EUPDCorp 1999-2024 dataset: https://zenodo.org/records/15056399
- Miller Center presidential speeches bulk data: https://data.millercenter.org/
- White House remarks archive: https://www.whitehouse.gov/remarks/
- Congressional Record: https://www.congress.gov/congressional-record
- Podcast transcript APIs: Podchaser, Podscan, spoken.md, or equivalent licensed transcript feeds

## Planned Ingestion Shape

Normalize every document into:

```json
{
  "source": "UN",
  "speaker": "Representative / host / president",
  "organization": "United Nations",
  "country": "USA",
  "date": "2024-09-24",
  "title": "Address before the 79th UN General Assembly",
  "url": "https://...",
  "text": "full transcript"
}
```

The frontend expects yearly term-frequency series per cohort and can be backed by a generated JSON file or an API route later.

## Current Processed Corpus

The deployed static site includes `data/processed/ordsalat-data.js` and `data/processed/ordsalat-data.json`, generated from the Miller Center presidential speeches archive.

- 1,057 speeches
- 4.26M processed words
- Coverage from 1789 to 2026
- 70+ tracked or discovered terms
- Per-decade frequency series, first appearances, top source speeches, president coverage, and full speech metadata for corpus search

## App Pages

- `/dashboard`: high-level corpus metrics, trend chart, word cloud, burst table, and decade volume map
- `/corpus`: searchable table for every processed source speech
- `/terms`: searchable term index with first-year, momentum, and source-backed evidence
- `/compare`: compare 2-4 words by timeline, first appearance, intensity, momentum, and source evidence
- `/sources`: corpus resource library and ingestion status
- `/ai`: prompt/evidence pack builder plus pasted-text analyzer
- `/method`: concise explanation of the normalization and analysis method

Raw downloaded files are intentionally ignored under `data/raw/`.

## Refresh Data

Download and extract the Miller Center archive:

```powershell
Invoke-WebRequest -Uri https://data.millercenter.org/miller_center_speeches.tgz -OutFile data\raw\miller_center_speeches.tgz
tar -xzf data\raw\miller_center_speeches.tgz -C data\raw
```

Build the static processed dataset:

```powershell
node scripts\build-data.js
```

Future importers should emit the same shape as `data/processed/ordsalat-data.json` so the frontend can merge UN, EU, USA, and podcast cohorts without changing the UI.
