# DIGGGIN
DISCDIGGER

## GitHub Pages Site

This repository contains a Jekyll-powered GitHub Pages site that showcases the DIGGGIN project.

### Site URL
🌐 [https://heneni.github.io/DIGGGIN](https://heneni.github.io/DIGGGIN)

### Local Development

To run the site locally:

```bash
# Install dependencies
bundle install

# Serve the site locally
bundle exec jekyll serve

# The site will be available at http://localhost:4000
```

### Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the `main` branch. The deployment workflow:

1. ✅ Builds the Jekyll site using Ruby 3.2
2. ✅ Uses modern GitHub Actions with proper permissions
3. ✅ Deploys to GitHub Pages automatically
4. ✅ Supports custom domains and SSL

### Manual GitHub Pages Setup

If you need to enable GitHub Pages manually:

1. Go to repository **Settings** → **Pages**
2. Set **Source** to "GitHub Actions"
3. The workflow will handle the deployment automatically
