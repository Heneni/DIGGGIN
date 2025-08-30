import cratedigger from './scripts/cratedigger.js';
import { CSVParser } from './scripts/csvParser.js';

// DOM elements
const bottomBar = document.getElementById('bottom-bar');
const buttonPrev = document.getElementById('button-prev');
const buttonShow = document.getElementById('button-show');
const buttonNext = document.getElementById('button-next');
const titleContainer = document.getElementById('cratedigger-record-title');
const artistContainer = document.getElementById('cratedigger-record-artist');
const coverContainer = document.getElementById('cratedigger-record-cover');

function bindEvents() {
  buttonPrev.addEventListener('click', (e) => {
    e.preventDefault();
    cratedigger.selectPrevRecord();
  }, false);

  buttonShow.addEventListener('click', (e) => {
    e.preventDefault();
    if (cratedigger.getSelectedRecord()) {
      cratedigger.flipSelectedRecord();
    } else {
      cratedigger.selectNextRecord();
    }
  }, false);

  buttonNext.addEventListener('click', (e) => {
    e.preventDefault();
    cratedigger.selectNextRecord();
  }, false);
}

function fillInfoPanel(record) {
  if (record.data.title) {
    titleContainer.innerHTML = record.data.title;
  }

  if (record.data.artist) {
    artistContainer.innerHTML = record.data.artist;
  }

  if (record.data.cover) {
    coverContainer.style.backgroundImage = 'url(' + record.data.cover + ')';
  }
}

async function loadAndStartApp() {
  try {
    // Initialize cratedigger
    cratedigger.init({
      debug: false,
      elements: {
        rootContainer: document.getElementById('cratedigger'),
        canvasContainer: document.getElementById('cratedigger-canvas'),
        loadingContainer: document.getElementById('cratedigger-loading'),
        infoContainer: document.getElementById('cratedigger-info'),
      },
      onInfoPanelOpened() {
        bottomBar.classList.add('closed');
        fillInfoPanel(cratedigger.getSelectedRecord());
      },

      onInfoPanelClosed() {
        bottomBar.classList.remove('closed');
      },
    });

    // Load records from CSV
    const recordsData = await CSVParser.loadCSV('/data/DigggerDB.csv');
    console.log('Loaded records:', recordsData.length);

    // Load records into the app
    cratedigger.loadRecords(recordsData, true, () => {
      bindEvents();
      console.log('DIGGGIN app initialized successfully!');
    });

  } catch (error) {
    console.error('Failed to initialize app:', error);
    
    // Fallback to demo data if CSV loading fails
    console.log('Falling back to demo data...');
    const fallbackData = [
      {
        "title": "So What",
        "artist": "Miles Davis",
        "cover": "http://cdn-images.deezer.com/images/cover/63bf5fe5f15f69bfeb097139fc34f3d7/400x400-000000-80-0-0.jpg",
        "year": "2001",
        "id": "SOBYBNV14607703ACA",
        "hasSleeve": false
      },
      {
        "title": "Blue Train",
        "artist": "John Coltrane",
        "cover": "http://cdn-images.deezer.com/images/cover/1d019d81f99c5213398791c8a0d6a2d1/400x400-000000-80-0-0.jpg",
        "year": "1957",
        "id": "SOACYSS145FEBAD8C6",
        "hasSleeve": false
      },
      {
        "title": "My Funny Valentine",
        "artist": "Chet Baker",
        "cover": "http://cdn-images.deezer.com/images/cover/d2f8b4d15a624333903c57b7d4aa5ab5/400x400-000000-80-0-0.jpg",
        "year": "1954",
        "id": "SOAAQIZ144C486A932",
        "hasSleeve": false
      }
    ];

    cratedigger.loadRecords(fallbackData, true, () => {
      bindEvents();
      console.log('DIGGGIN app initialized with fallback data');
    });
  }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAndStartApp);
} else {
  loadAndStartApp();
}