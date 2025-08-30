# DIGGGIN 🎵

**3D Vinyl Records Exploration & Crate Digging Experience**

A modern, production-ready static web application featuring 3D WebGL vinyl record visualization using Three.js. Browse your vinyl collection in an immersive 3D environment with realistic crate digging mechanics.

![DIGGGIN Demo](https://github.com/risq/cratedigger/blob/master/src/images/demo.gif?raw=true)

## ✨ Features

- **3D WebGL Visualization**: Immersive vinyl record exploration using Three.js
- **Interactive Crate Digging**: Navigate through records with realistic physics
- **CSV Data Integration**: Load your own record collection from DigggerDB.csv
- **Responsive Design**: Works on desktop and mobile devices
- **Modern Architecture**: Built with Vite for fast development and optimal production builds
- **Multi-platform Deployment**: Ready for GitHub Pages and Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Heneni/DIGGGIN.git
   cd DIGGGIN
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production build will be created in the `dist/` directory.

## 📊 Data Format

Replace the sample data in `src/assets/data/DigggerDB.csv` with your own vinyl collection. The CSV should follow this format:

```csv
title,artist,cover,year,id,hasSleeve
"So What","Miles Davis","http://example.com/cover.jpg","2001","UNIQUE_ID",false
"Blue Train","John Coltrane","http://example.com/cover2.jpg","1957","UNIQUE_ID2",false
```

### CSV Fields

- **title**: Album/track title
- **artist**: Artist name
- **cover**: URL to album cover image (400x400px recommended)
- **year**: Release year
- **id**: Unique identifier for the record
- **hasSleeve**: Boolean indicating if the record has a sleeve texture

## 🌐 Deployment

### GitHub Pages

1. **Enable GitHub Pages**
   - Go to your repository Settings
   - Navigate to Pages
   - Select "GitHub Actions" as the source

2. **Push to main branch**
   ```bash
   git push origin main
   ```

The GitHub Actions workflow will automatically build and deploy your site.

### Vercel

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   # Using Vercel CLI
   npm run deploy:vercel
   
   # Or connect your GitHub repository at vercel.com
   ```

### Manual Deployment

```bash
npm run build
# Upload the dist/ folder to your hosting provider
```

## 🎮 Controls

- **Mouse**: Rotate camera around the crates
- **PREVIOUS**: Navigate to previous record
- **SHOW**: Flip the selected record to view details
- **NEXT**: Navigate to next record
- **Click anywhere**: Close info panel

## 🛠️ Development

### Project Structure

```
DIGGGIN/
├── src/
│   ├── assets/
│   │   ├── data/
│   │   │   └── DigggerDB.csv     # Your vinyl collection data
│   │   └── images/               # Texture files
│   ├── scripts/
│   │   ├── cratedigger.js        # Main 3D engine
│   │   ├── record.js             # Record object implementation
│   │   ├── cameraManager.js      # Camera controls
│   │   ├── constants.js          # Configuration
│   │   └── csvParser.js          # CSV data parser
│   ├── styles/
│   │   └── main.css              # Application styles
│   └── main.js                   # Application entry point
├── public/                       # Static assets
├── .github/workflows/            # GitHub Actions
└── dist/                        # Production build (generated)
```

### Technologies Used

- **Three.js**: 3D rendering and WebGL
- **Vite**: Build tool and development server
- **Vanilla JavaScript**: ES6+ modules
- **CSS3**: Modern styling with responsive design

### Modernization Notes

This project has been migrated from the original [@risq/cratedigger](https://github.com/risq/cratedigger) to use modern tooling:

- ✅ Replaced Gulp with Vite
- ✅ Removed Bower dependency management
- ✅ Removed jQuery dependencies
- ✅ Updated to modern Three.js API
- ✅ Converted to ES6 modules
- ✅ Added CSV data integration
- ✅ Implemented responsive design
- ✅ Added deployment configurations

## 🔧 Configuration

Modify `src/scripts/constants.js` to customize:

- Number of crates and records per crate
- Camera movement sensitivity
- Animation timing
- Colors and textures
- Debug options

## 📝 License

MIT License - see the original [cratedigger.js](https://github.com/risq/cratedigger) project for details.

## 🙏 Credits

- Original concept by [@risq](https://github.com/risq)
- Modernized and enhanced by [@Heneni](https://github.com/Heneni)
- Built with [Three.js](https://threejs.org/)

## 🐛 Issues & Contributing

Found a bug or want to contribute? Please open an issue or submit a pull request.

## 📚 Learn More

- [Three.js Documentation](https://threejs.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Original Cratedigger Project](https://github.com/risq/cratedigger)
