# DIGGGIN
DISCDIGGER

Welcome to the DIGGGIN project site - a Jekyll-powered GitHub Pages site.

## GitHub Pages Setup

This repository uses Jekyll with automated deployment via GitHub Actions.

### Requirements

1. **GitHub Pages Source**: Repository must be configured to use "GitHub Actions" as Pages source
2. **Ruby Version**: 3.2+ 
3. **Jekyll**: 4.3+
4. **Theme**: Minima 2.5+

### Local Development

```bash
# Install dependencies
bundle install

# Build the site
bundle exec jekyll build

# Serve locally
bundle exec jekyll serve
```

### Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the `main` branch. The workflow:

1. Builds the Jekyll site with Ruby 3.2
2. Uses the Minima theme with custom styling
3. Deploys to GitHub Pages using modern GitHub Actions
4. Available at: https://heneni.github.io/DIGGGIN

### Troubleshooting

If deployment fails:
1. Check that Pages is configured to use "GitHub Actions" in repository settings
2. Verify workflow permissions are correct
3. Ensure all required files are present (Gemfile, _config.yml, etc.)

## Project Structure

- `index.md` - Homepage content
- `_config.yml` - Jekyll configuration
- `Gemfile` & `Gemfile.lock` - Dependencies
- `assets/main.scss` - Custom styling
- `.github/workflows/jekyll.yml` - Deployment workflow
