# Ordsalat

Ordsalat is a static Vercel-ready dashboard for tracking language drift across institutions, countries, media, and uploaded transcript corpora.

The first version ships with an interactive seed dataset so the product can be reviewed immediately. It is designed to ingest larger corpora such as UN General Debate transcripts, European Parliament debates, US presidential speeches, Congressional Record text, White House remarks, and podcast transcript APIs.

## Run Locally

Open `index.html` directly in a browser, or serve the folder with any static server:

```powershell
npx serve .
```

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
