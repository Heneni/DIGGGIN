# DIGGGIN
DISCDIGGER

A Jekyll-powered website automatically deployed to GitHub Pages.

## Deployment

This site uses GitHub Actions to automatically build and deploy to GitHub Pages when changes are pushed to the `main` branch. The deployment workflow:

1. Builds the Jekyll site with all dependencies
2. Deploys to the `gh-pages` branch
3. Makes the site available at: https://heneni.github.io/DIGGGIN

## Local Development

To run the site locally:

```bash
bundle install
bundle exec jekyll serve
```

The site will be available at `http://localhost:4000`.
