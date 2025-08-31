# DIGGGIN
DISCDIGGER - A Modern Art Gallery Experience

A modern, responsive art gallery built with Next.js, showcasing a curated collection of psychedelic and contemporary artwork connected to music. Each piece tells a story that transcends visual boundaries and connects with sound.

## 🚀 Features

- **Modern Framework**: Built with Next.js 15 for optimal performance and developer experience
- **Responsive Design**: Fully responsive gallery that works seamlessly across all devices
- **Rich Data Visualization**: Interactive gallery showcasing 1000+ artworks with detailed metadata
- **Advanced Filtering**: Search and filter by genre, mood, artistic category, and collections
- **Optimized Performance**: Static site generation for lightning-fast loading
- **Accessibility**: Modern web standards with full keyboard navigation and screen reader support

## 🎨 The Collection

Explore over 1000 unique artworks featuring:
- **Psychedelic Art**: Trippy, surreal visuals with vibrant colors
- **Contemporary Pieces**: Modern abstract and urban art
- **Musical Connections**: Each artwork is paired with music metadata
- **Mood-Based Browsing**: Filter by euphoric, calming, rebellious, and more
- **Color Palettes**: Organized by warm, cool, and vibrant color schemes

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS for modern, responsive design
- **TypeScript**: Full type safety and better developer experience
- **Data Processing**: CSV parsing with PapaParse
- **Deployment**: GitHub Actions with static export to GitHub Pages
- **Performance**: Optimized images and lazy loading

## 🏃‍♂️ Local Development

To run the site locally:

```bash
# Install dependencies
npm install

# Generate artwork data from CSV
node -e "
const fs = require('fs');
const Papa = require('papaparse');

const csvContent = fs.readFileSync('DiggerDB.csv', 'utf-8');
const results = Papa.parse(csvContent, {
  header: true,
  skipEmptyLines: true,
  transformHeader: (header) => {
    const headerMap = {
      'cover': 'cover',
      'artwork name': 'artworkName',
      'song genre': 'songGenre', 
      'artist': 'artist',
      'song title': 'songTitle',
      'artistic category': 'artisticCategory',
      'mood': 'mood',
      'year': 'year',
      'collections': 'collections'
    };
    return headerMap[header.toLowerCase()] || header;
  }
});

const artworks = results.data
  .filter(item => item.cover && item.artworkName)
  .map(item => ({
    cover: item.cover || '',
    artworkName: item.artworkName || '',
    songGenre: item.songGenre || '',
    artist: item.artist || '',
    songTitle: item.songTitle || '',
    artisticCategory: item.artisticCategory || '',
    mood: item.mood || '',
    year: item.year || '',
    collections: item.collections || ''
  }));

fs.writeFileSync('public/artworks.json', JSON.stringify(artworks, null, 2));
console.log('Generated artworks.json with', artworks.length, 'artworks');
"

# Start development server
npm run dev
```

The site will be available at `http://localhost:3000`.

## 📊 Data Structure

The artwork data includes:
- Cover image URLs
- Artwork and song titles
- Artist information
- Musical genres and moods
- Artistic categories
- Color palette descriptions
- Collection tags

## 🚀 Deployment

This site uses GitHub Actions to automatically build and deploy to GitHub Pages when changes are pushed to the `main` branch. The deployment workflow:

1. Sets up Node.js environment
2. Installs dependencies
3. Generates artwork data from CSV
4. Builds the Next.js application with static export
5. Deploys to GitHub Pages

The site is available at: https://heneni.github.io/DIGGGIN

## 🔄 Migration from Jekyll

This project was modernized from Jekyll to Next.js to provide:
- ⚡ Better performance with modern build tools
- 🎨 Enhanced user experience with React components
- 📱 Improved responsive design
- 🔍 Advanced search and filtering capabilities
- 🛠️ Better developer experience and maintainability
- 🚀 Modern deployment practices

## 📝 License

This project showcases artwork and music data for educational and portfolio purposes.
