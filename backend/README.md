# Strapi Backend - Prikkerende Preken

Strapi v5 CMS backend for the sermon archive.

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run develop
```

Open Strapi admin at `http://localhost:1337/admin`

## Strapi Cloud Deployment

1. Create account at [cloud.strapi.io](https://cloud.strapi.io)
2. Connect your GitHub repository
3. Deploy from dashboard

## Configure Public Permissions

After setup, configure public API access:

1. Go to **Settings → Users & Permissions → Roles → Public**
2. Enable `find` and `findOne` for:
   - Sermon
   - Speaker
   - Theme

## API Endpoints

```
GET /api/sermons?populate=*
GET /api/sermons?filters[slug][$eq]=example&populate=*
GET /api/sermons?sort=date:desc&pagination[pageSize]=10
GET /api/speakers
GET /api/themes
```

## Content Types

### Sermon
- `title` - Title (required)
- `slug` - URL slug (auto-generated)
- `summary` - Short description
- `content` - Rich text content
- `date` - Sermon date
- `bibleText` - Scripture reference
- `audio` - Audio file
- `speaker` - Related speaker
- `themes` - Related themes

### Speaker
- `name` - Name (required)
- `slug` - URL slug
- `bio` - Biography

### Theme
- `name` - Name (required)
- `slug` - URL slug
