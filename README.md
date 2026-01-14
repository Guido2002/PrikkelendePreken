# Prikkerende Preken - Preek Archief

A simple MVP sermon archive platform using Strapi (CMS) and Next.js (static frontend).

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Pages                          │
│              (Static Next.js Export)                     │
│                                                          │
│  ┌────────────┐ ┌────────────┐ ┌──────────────────┐     │
│  │   Home     │ │  Sermons   │ │  Sermon Detail   │     │
│  │   Page     │ │   List     │ │   [slug]         │     │
│  └────────────┘ └────────────┘ └──────────────────┘     │
└───────────────────────┬─────────────────────────────────┘
                        │ REST API (build time)
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   Strapi Cloud                           │
│                                                          │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│  │  Sermons   │ │  Speakers  │ │   Themes   │          │
│  └────────────┘ └────────────┘ └────────────┘          │
└─────────────────────────────────────────────────────────┘
```

## Project Structure

```
PrikkelendePreken/
├── backend/                 # Strapi CMS
│   ├── config/              # Strapi configuration
│   ├── src/
│   │   └── api/             # Content types
│   │       ├── sermon/
│   │       ├── speaker/
│   │       └── theme/
│   └── package.json
│
├── frontend/                # Next.js static site
│   ├── app/                 # App Router pages
│   │   ├── page.tsx         # Homepage
│   │   ├── sermons/
│   │   │   ├── page.tsx     # Sermon list
│   │   │   └── [slug]/      # Sermon detail
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/          # React components
│   ├── lib/                 # Strapi client
│   └── package.json
│
└── .github/
    └── workflows/
        └── deploy.yml       # GitHub Pages deployment
```

## Quick Start

### 1. Backend (Strapi)

```bash
cd backend
npm install
cp .env.example .env
npm run develop
```

Open http://localhost:1337/admin and:
1. Create admin account
2. Configure public permissions (find/findOne for Sermon, Speaker, Theme)
3. Add some sample content

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your Strapi URL
npm run dev
```

Open http://localhost:3000

### 3. Deploy

**Backend → Strapi Cloud:**
```bash
cd backend
npm run deploy
# Or connect via https://cloud.strapi.io
```

**Frontend → GitHub Pages:**
1. Push to `main` branch
2. GitHub Actions automatically builds and deploys

## Content Types

### Sermon
- `title` - Sermon title
- `slug` - URL-friendly identifier
- `summary` - Short description
- `content` - Rich text content
- `date` - Sermon date
- `bibleText` - Scripture reference
- `audio` - Audio file
- `speaker` - Related speaker
- `themes` - Related themes

### Speaker
- `name` - Speaker name
- `slug` - URL identifier
- `bio` - Biography

### Theme
- `name` - Theme name
- `slug` - URL identifier

## Environment Variables

### Frontend

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_STRAPI_URL` | Strapi API URL |
| `NEXT_PUBLIC_REPO_NAME` | GitHub repo name |
| `NEXT_PUBLIC_SITE_URL` | GitHub Pages base URL |

### GitHub Secrets

| Secret | Description |
|--------|-------------|
| `STRAPI_URL` | Strapi Cloud API URL |

## Features

- ✅ Static Site Generation (no server runtime)
- ✅ SEO optimized (sitemap, meta tags, semantic HTML)
- ✅ HTML5 audio player
- ✅ Pagination
- ✅ Responsive design
- ✅ Automatic GitHub Pages deployment

## Non-Goals (MVP)

- ❌ User authentication
- ❌ Search (Elasticsearch/Meilisearch)
- ❌ AI transcription
- ❌ Comments system
- ❌ Docker deployment

## License

MIT
