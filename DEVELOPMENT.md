# Development Guide

## Quick Setup

```bash
# Clone repository
git clone https://github.com/Heneni/DIGGGIN.git
cd DIGGGIN

# Install dependencies
npm install

# Start development server
npm run dev
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy:pages` - Deploy to GitHub Pages
- `npm run deploy:vercel` - Deploy to Vercel

## Development Notes

### Data Customization

Replace `public/data/DigggerDB.csv` with your vinyl collection. Format:
```csv
title,artist,cover,year,id,hasSleeve
"Album Title","Artist Name","http://cover-url.jpg","2024","UNIQUE_ID",false
```

### Asset Handling

- Images in `src/assets/images/` are automatically processed by Vite
- Use `import imageUrl from './path/to/image.jpg'` for proper bundling
- Public assets go in `public/` directory

### Configuration

Modify `src/scripts/constants.js` for:
- Number of crates and records per crate
- Camera settings and movement speed
- Visual appearance (colors, textures)
- Animation timing

### Three.js Version

Currently using Three.js v0.179.1. All deprecated APIs have been updated:
- `THREE.ImageUtils.loadTexture` → `THREE.TextureLoader`
- `renderer.getMaxAnisotropy()` → `renderer.capabilities.getMaxAnisotropy()`
- `setFromMatrixPosition()` → `getWorldPosition()`

## Browser Support

- Modern browsers with WebGL support
- Mobile responsive design included
- Progressive enhancement for older browsers via Vite legacy plugin

## Performance

- Assets are automatically optimized and compressed
- Code splitting with vendor chunk separation
- Gzip compression in production builds
- ~1.2MB total bundle size