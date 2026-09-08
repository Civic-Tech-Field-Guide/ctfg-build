# CTFG Directory

Staging site for the next generation version of the CTFG's flagship search and explore app.

## Three ways to access the data

### MCP server

A hosted, read-only MCP server is live over **Streamable HTTP** (no API key):

```
POST https://civictech.guide/mcp
```

Tools: `search_projects`, `get_project`, `list_categories`.

Connect from Claude Code:

```bash
claude mcp add --transport http civictech-guide https://civictech.guide/mcp
```

From Claude Desktop / Cursor / any config-file client (bridge stdio → HTTP with `mcp-remote`; a native `@civictechguide/mcp` package is coming soon):

```json
"mcpServers": {
  "civictech-guide": {
    "command": "npx",
    "args": ["-y", "mcp-remote", "https://civictech.guide/mcp"]
  }
}
```

Once connected, your assistant can search listings, pull project detail, and traverse categories. Example queries:

- "Find active govtech projects in Kenya"
- "Open-source participatory budgeting tools"
- "Who works on election integrity?"

### REST API

Clean JSON over HTTPS. No key required for public reads. Base: `https://civictech.guide`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/projects/search` | Search and filter listings (`q, category, status, limit`) |
| GET | `/api/v1/projects/:slug` | Single project detail |
| GET | `/api/v1/projects/export` | Bulk export, paginated |
| GET | `/api/v1/categories` | Category index + counts |
| GET | `/api/v1/facets` | Filter option values |

```bash
curl "https://civictech.guide/api/v1/projects/search?q=participatory+budgeting&limit=5"
```

### Showcase

Apps already running on the dataset:

- **[CTFG Directory](https://civictech.guide)** — the flagship search and explore app
- **[CTFG PilotCity Mashup](https://luxury-syrniki-bfc3ca.netlify.app)** — Field Guide data blended with PilotCity for project-based learning
- **[CTFG Taxonomy Recommender](https://github.com/mstem/guidefinder)** — suggests categories and tags for any project using the directory's taxonomy

## Code & examples

Open-source packages are being prepared for release (coming soon):

| Package | What it is |
|---|---|
| `@civictechguide/mcp` | Native one-line MCP server (`npx`) — until it ships, use `mcp-remote` as above |
| `api-examples` | Copy-paste fetch snippets in curl, Python, and JS |
| `data` | Export scripts and JSON dumps of the full directory |
| `notebooks` | Jupyter notebooks for analysing the dataset |

## Getting started

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`.

## Building

```bash
npm run build
```

Output goes to `out/` as a fully static export. If the site is deployed at a sub-path:

```bash
NEXT_PUBLIC_BASE_PATH=/your-path npm run build
```

## Stack

- [Next.js 16](https://nextjs.org) with `output: "export"` (static)
- React 19
- TypeScript
- Tailwind CSS v4
- Google Fonts: Space Grotesk, Archivo, Inter

## License

The Field Guide dataset is [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — free to use and adapt with attribution.
