# Jekyll Workflow Configuration

This document outlines the changes made to fix the Jekyll build workflow and the additional configuration required.

## Changes Made

### 1. Updated Jekyll Workflow (`.github/workflows/jekyll.yml`)
- ✅ Uses Ruby version 3.2 (meets requirement for >= 3.2.0)
- ✅ Updates RubyGems using `gem update --system` (will update to >= 3.3.22)
- ✅ Installs Jekyll and Bundler via gem commands
- ✅ Builds the site using `bundle exec jekyll build`
- ✅ Deploys to GitHub Pages using `peaceiris/actions-gh-pages@v3`

### 2. Added Supporting Files
- ✅ Created `.gitignore` to exclude build artifacts and vendor dependencies
- ✅ Added `Gemfile.lock` for reproducible builds

## Required Repository Configuration

The following steps need to be completed in the GitHub repository settings:

### 1. GitHub Pages Source Configuration
1. Go to the repository **Settings** > **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Select **gh-pages** branch as the source
4. Select **/ (root)** as the folder
5. Click **Save**

### 2. GitHub Actions Permissions
1. Go to repository **Settings** > **Actions** > **General**
2. Under **Workflow permissions**, ensure one of the following is selected:
   - **Read and write permissions** (recommended)
   - OR **Read repository contents and packages permissions** with additional permissions for Pages

### 3. Branch Protection (if applicable)
If the `gh-pages` branch has protection rules:
1. Go to **Settings** > **Branches**
2. Edit the `gh-pages` branch protection rule
3. Allow GitHub Actions to push to this branch

## Testing the Workflow

Once the repository settings are configured:

1. The workflow will automatically run on any push to the `main` branch
2. Check the **Actions** tab to monitor the workflow execution
3. Verify that the site is deployed to GitHub Pages at `https://heneni.github.io/DIGGGIN`

## Local Testing

The Jekyll site can be built and tested locally:

```bash
# Install dependencies
bundle install

# Build the site
bundle exec jekyll build

# Serve locally (optional)
bundle exec jekyll serve
```

## Troubleshooting

### Permission Denied Error
If you see `Permission to Heneni/DIGGGIN.git denied to github-actions[bot]`:
- Check that GitHub Actions has write permissions (see section 2 above)
- Verify that the `GITHUB_TOKEN` has appropriate permissions
- Consider using a personal access token if the default token doesn't work

### Build Failures
The build process has been tested locally and works correctly with:
- Ruby 3.2.3
- Jekyll 4.4.1
- Bundler 2.7.1
- All dependencies specified in the Gemfile

Any build failures in the workflow are likely due to permission issues rather than code problems.