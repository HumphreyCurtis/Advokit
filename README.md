# Advokit

Advokit helps people navigate UK welfare benefits and services with clear, accessible
guidance co-designed with people with aphasia.

Live at **[advokit.vercel.app](https://advokit.vercel.app/)**.

Most benefits guidance is written at a reading level that excludes the people who need it
most. Advokit presents the same information in short sections, plain language, and
read-aloud audio, alongside first-hand stories from people who have been through the
process themselves.

## Features

- **Benefit guides** — step-by-step pages covering 23 benefits and services (PIP,
  Attendance Allowance, Universal Credit, Blue Badge, Carer's Allowance, Motability,
  travel concessions and more), each with a printable summary and downloadable help
  sheets.
- **Benefit Buddy** — a chatbot (OpenAI `gpt-4o-mini`) that answers questions about
  eligibility and the application process in plain English.
- **Accessibility first** — Atkinson Hyperlegible typeface, read-aloud on every page via
  the Web Speech API, progressive disclosure of detail, and video/audio stories with
  full transcripts.
- **Comparison views** — sortable table and list views across all covered benefits.

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, PrimeReact |
| Data | `data/home.json` (benefit content), MongoDB (chat logs + feedback) |
| AI | OpenAI API |
| Hosting | Vercel |
| Analysis | Streamlit + pandas (`analysis/`) |

## Getting started

Requires Node.js 22+.

```bash
git clone https://github.com/HumphreyCurtis/Advokit.git
cd Advokit
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `OPENAI_API_KEY` | yes | Powers Benefit Buddy (`app/api/chatbot/route.ts`) |
| `MONGODB_URI` | yes | Chat log and feedback storage |
| `MONGODB_DB` | no | Database name, defaults to `advokit` |

`app/lib/mongodb.ts` throws at import time if `MONGODB_URI` is missing, so all three need
to be present before `npm run dev` or `npm run build` will work.

## Project structure

```
app/
  api/chatbot/     Benefit Buddy API route
  benefits/[slug]/ Individual benefit guides
  benefits-table/  Comparison table
  benefits-list/   Comparison list
  benefit-buddy/   Chatbot UI
  stories/         Video stories and transcripts
  components/      Shared UI (ReadAloud, AudioPlayer, ProgressiveTips, ...)
  lib/             Benefit data accessors and MongoDB client
data/home.json     Source of truth for all benefit content
public/            Images, PDF help sheets, transcripts
analysis/          Streamlit app for reviewing chat logs
a-resources/       Brand assets (logos, palettes) — not served
```

### Adding or editing a benefit

All benefit content lives in `data/home.json`, typed by `app/types/index.ts`. Add an entry
with a unique `slug` and the guide page, list and table views all pick it up
automatically — no component changes needed.

## Chat log analysis

`analysis/` is a separate Streamlit app for reviewing Benefit Buddy conversations. It
reads `.env.local` from the repo root.

```bash
conda env create -f analysis/environment.yml
conda activate advokit-logger
streamlit run analysis/app.py
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Disclaimer

Advokit was co-designed with people and communities living with aphasia in London. The
information here is general and may not fit every case — rules and forms change, and
councils or assessors may do things differently. This is not legal advice. Please check
official sources such as [GOV.UK — Benefits](https://www.gov.uk/browse/benefits) or
[Citizens Advice](https://www.citizensadvice.org.uk/), and speak to an adviser if you can.

## License

MIT — see [LICENSE](LICENSE).
