# Next.js Frontend - Prikkerende Preken

Static Next.js frontend for the Prikkerende Preken sermon archive.
Deployed to GitHub Pages as a fully static site.

## Architecture

```
[ GitHub Pages (Static HTML/JS) ]
              ↓
        [ Strapi Cloud API ]
              ↓
          [ Database ]
```

## Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Update NEXT_PUBLIC_STRAPI_URL in .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
# Build static site
npm run build
```

Output is in the `out/` folder.

## Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_STRAPI_URL` | Strapi API URL | `https://your-project.strapiapp.com` |
| `NEXT_PUBLIC_REPO_NAME` | GitHub repo name (for basePath) | `PrikkelendePreken` |
| `NEXT_PUBLIC_SITE_URL` | GitHub Pages URL | `https://username.github.io` |

### GitHub Pages Setup

1. Go to repository **Settings → Pages**
2. Set **Source** to "GitHub Actions"
3. Add secret `STRAPI_URL` with your Strapi Cloud URL

### GitHub Actions

The workflow automatically:
1. Triggers on push to `main`
2. Builds the static site
3. Deploys to GitHub Pages

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with latest sermons |
| `/sermons` | All sermons (paginated) |
| `/sermons/[slug]` | Sermon detail page |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: GitHub Pages (static)
- **CMS**: Strapi Cloud (REST API)

## Key Features

- ✅ Static Site Generation (SSG)
- ✅ SEO-friendly (sitemap, robots.txt, meta tags)
- ✅ Accessible HTML5 audio player
- ✅ Pagination for sermon archive
- ✅ Responsive design
- ✅ Zero runtime dependencies
