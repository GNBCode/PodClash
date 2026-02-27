# PodClash

**Discover opposing views across popular podcasts on any topic.**

PodClash lets you search any topic and instantly see two well-known podcasts that have covered it from contrasting viewpoints — side by side, with stances, summaries, and a breakdown of where they differ.

---

## How It Works

1. Enter any topic in the search bar
2. PodClash queries an AI model to identify two real, popular podcasts with meaningfully different perspectives on that topic
3. Results are displayed in a versus layout with:
   - Each podcast's name, rank, listener count, episode, and hosts
   - Their stance and position detail
   - An in-depth summary of their argument
   - A "Where They Differ" comparison across 3 key dimensions

> **Disclaimer:** The summaries are AI-generated and provided for informational purposes only. They may not fully represent a podcast's views. Also, sometimes links to podcasts may not work.

---

## Tech Stack

| Layer | Details |
|---|---|
| Front-end | Single `index.html` — vanilla HTML, CSS, JavaScript (no framework) |
| API | `api/analyze.js` — Node.js serverless function |
| AI | [OpenRouter](https://openrouter.ai) (`openrouter/auto` model) |
| Hosting | [Vercel](https://vercel.com) |

---

## Project Structure

```
/
├── index.html          # Full front-end (UI, styles, client-side JS)
├── api/
│   └── analyze.js      # Serverless API handler — calls OpenRouter
├── package.json
├── vercel.json         # Vercel deployment config
└── README.md
```

---

## Local Development

**Prerequisites:** Node.js, a [Vercel](https://vercel.com) account, and an [OpenRouter](https://openrouter.ai) API key.

```bash
# Install Vercel CLI
npm install -g vercel

# Clone the repo
git clone https://github.com/GNBCode/PodClash.git
cd PodClash

# Add your OpenRouter API key as an environment variable
# Create a .env file (never commit this):
echo "OPENROUTER_API_KEY=your_key_here" > .env

# Run locally with Vercel dev server
vercel dev
```

Then open `http://localhost:3000` in your browser.

---

## Deployment

This project is configured for one-click deployment on Vercel.

1. Fork or push this repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add `OPENROUTER_API_KEY` as an environment variable in the Vercel dashboard
4. Deploy

---

## Environment Variables

| Variable | Description |
|---|---|
| `OPENROUTER_API_KEY` | Your API key from [openrouter.ai](https://openrouter.ai) |

---

## Powered by [GNB](https://www.gridnewsbureau.com)
