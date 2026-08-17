# rectangulo.com.mx

Headless frontend for rectangulo.com.mx, built with [Faust.js](https://faustjs.org/) (Next.js + headless WordPress).

Scaffolded from the same tooling setup as the [cs-front](../cs-front) sibling project: FaustWP + Next.js pages/wp-templates, the `styles/` design-token SCSS architecture, and matching eslint/prettier/stylelint config. The bespoke visual layer from that project (fonts, smooth-scroll, shader effects, personal SEO content) was left out — this is the plain generic starter layer.

## Setup

```bash
npm install
# edit .env.local: set NEXT_PUBLIC_WORDPRESS_URL to the real WP backend, rotate FAUST_SECRET_KEY
npm run dev   # http://localhost:3000
```

### WordPress requirements

The connected WordPress install needs these plugins:

- **FaustWP**
- **WPGraphQL**

Once the backend is live, run `npm run generate` to fill in `possibleTypes.json` (currently a placeholder).

## Scripts

| Command               | Description                                                |
| --------------------- | ---------------------------------------------------------- |
| `npm run dev`         | Start the Next.js dev server                               |
| `npm run build`       | `faust build` — production build                           |
| `npm run start`       | `faust start` — serve the production build                 |
| `npm run generate`    | Regenerate `possibleTypes.json` from the WP GraphQL schema |
| `npm run lint`        | Lint JS/TS                                                 |
| `npm run lint:styles` | Lint SCSS                                                  |
| `npm run format`      | Format with Prettier                                       |
