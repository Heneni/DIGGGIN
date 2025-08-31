# DIGGGIN - Modern Cratedigger Experience

A modern, immersive web application for discovering music through interactive artwork exploration. Built with cutting-edge web technologies and real music data.

![DIGGGIN Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF)
![Three.js](https://img.shields.io/badge/Three.js-Latest-000000)
![Deployment](https://img.shields.io/badge/Deploy-GitHub%20Pages%20%2B%20Vercel-blue)

## 🎵 Features

- **Immersive 3D Experience**: Interactive record crates powered by Three.js
- **Real Music Database**: Curated collection of artwork and music data
- **Advanced Filtering**: Search by genre, mood, color, and more
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern Architecture**: Built with ES6+ modules and Vite
- **Zero Legacy Dependencies**: No jQuery, Bower, or Gulp

## 🚀 Live Demo

- **GitHub Pages**: [https://heneni.github.io/DIGGGIN](https://heneni.github.io/DIGGGIN)
- **Vercel**: [https://digggin.vercel.app](https://digggin.vercel.app)

## 🛠️ Technology Stack

- **Build System**: Vite 7.x
- **JavaScript**: ES6+ Modules
- **3D Graphics**: Three.js
- **Data Processing**: Papa Parse (CSV)
- **Styling**: Modern CSS with CSS Custom Properties
- **Deployment**: GitHub Actions + Vercel

## 📦 Installation & Development

### Prerequisites

- Node.js 18+ and npm

### Local Development

```bash
# Clone the repository
git clone https://github.com/Heneni/DIGGGIN.git
cd DIGGGIN

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

Built files will be output to the `dist/` directory.

## 🎮 Usage

### Exploring Records

1. **3D Navigation**: Mouse over records in the 3D environment to preview them
2. **Selection**: Click on any record to view detailed information
3. **Filtering**: Use the left panel to filter by genre, mood, color, or search terms
4. **Discovery**: Explore the connections between visual art and music

### Filter Options

- **Search**: Find specific artists, songs, or artwork
- **Genre**: Filter by music genre (Psychedelic, Indie, Alternative Rock, etc.)
- **Mood**: Browse by emotional tone (Euphoric, Calming, Rebellious, etc.)
- **Color**: Discover by color palette (Red, Blue, Vibrant, Dark, etc.)

## 📊 Data Structure

The application uses `DiggerDB.csv` containing:

- **Artwork Images**: High-resolution album covers and artwork
- **Music Metadata**: Artist names, song titles, genres
- **Visual Properties**: Color palettes, artistic categories
- **Mood Classifications**: Emotional categorization
- **Collection Tags**: Thematic groupings

## 🚀 Deployment

### GitHub Pages (Automatic)

Deployment to GitHub Pages happens automatically via GitHub Actions when pushing to the `main` branch.

### Vercel (Manual)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### Other Static Hosts

The `dist/` folder can be deployed to any static hosting service:

- Netlify
- AWS S3 + CloudFront
- Firebase Hosting
- Surge.sh

## 🏗️ Project Structure

```
DIGGGIN/
├── public/
│   ├── DiggerDB.csv          # Music database
│   └── vite.svg              # Favicon
├── src/
│   ├── components/
│   │   └── uiComponents.js   # UI components
│   ├── data/
│   │   └── dataLoader.js     # CSV processing
│   ├── three/
│   │   └── cratediggerVisualizer.js  # 3D visualization
│   ├── main.js               # Application entry point
│   └── style.css             # Modern CSS styles
├── .github/workflows/
│   └── deploy.yml            # GitHub Actions
├── dist/                     # Production build output
├── index.html                # Main HTML template
├── package.json              # Dependencies & scripts
├── vercel.json               # Vercel configuration
├── vite.config.js            # Vite configuration
└── README.md                 # This file
```

## 🎨 Design Philosophy

### Modern CSS Architecture

- **CSS Custom Properties**: Consistent theming and easy customization
- **No Preprocessors**: Modern CSS features eliminate need for LESS/SASS
- **Responsive First**: Mobile-optimized with progressive enhancement
- **Dark Theme**: Optimized for immersive music discovery

### JavaScript Architecture

- **ES6+ Modules**: Clean, maintainable code organization
- **Class-based Components**: Object-oriented UI components
- **Async/Await**: Modern asynchronous programming
- **No jQuery**: Vanilla JavaScript for better performance

### 3D Experience Design

- **Intuitive Controls**: Natural mouse interactions
- **Performance Optimized**: Efficient rendering and memory usage
- **Visual Feedback**: Clear hover and selection states
- **Ambient Animation**: Subtle motion for atmosphere

## 🔧 Configuration

### Environment Variables

No environment variables required - the application is fully self-contained.

### Customization

Edit `src/style.css` to customize:

- Color scheme (CSS custom properties in `:root`)
- Typography and spacing
- Animation timing and effects

## 📱 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **WebGL Required**: For 3D visualization features
- **ES6+ Support**: For modern JavaScript features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js Community**: For the amazing 3D library
- **Vite Team**: For the lightning-fast build tool
- **Music & Art Data**: Curated collection of creative works
- **Contributors**: Everyone who helped build this experience

## 📞 Support

For support, questions, or feature requests:

- Open an issue on [GitHub](https://github.com/Heneni/DIGGGIN/issues)
- Contact: [mark@heneniart.com](mailto:mark@heneniart.com)

---

**Made with ❤️ for music and art lovers everywhere**