# DreamTags wiki

User documentation for the DreamTags plugin, built with [VitePress](https://vitepress.dev).

This folder is **its own git repository**. It sits inside the DreamTags working
tree for convenience, but `wiki/` is listed in the plugin's `.gitignore`, so
nothing here is ever committed to the plugin repo.

## Running it locally

```bash
npm install
npm run docs:dev
```

The dev server prints a local URL and hot-reloads as you edit the Markdown.

## Building

```bash
npm run docs:build     # output goes to docs/.vitepress/dist
npm run docs:preview   # serve the built site to check it before publishing
```

The build **fails on broken internal links**, which makes it the quickest way to
verify the whole site after editing.

## Publishing

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push
to `main`. Two things have to match:

1. `base` in `docs/.vitepress/config.mts` must be `'/<repository-name>/'`
   (currently `'/DreamTags-wiki/'`). On a custom domain, set it to `'/'`.
2. In the repository settings, **Pages → Build and deployment → Source** must be
   set to **GitHub Actions**.

## Writing

- Pages live in `docs/`, one Markdown file per page.
- The sidebar and top nav are defined in `docs/.vitepress/config.mts`. A new page
  is not reachable until it is added there.
- Examples should come from the plugin's own `default` pack so readers can open
  the same file on their server and compare.
