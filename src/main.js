import './style.css'
import { DataLoader } from './data/dataLoader.js'
import { CratediggerVisualizer } from './three/cratediggerVisualizer.js'
import { RecordDetail, FilterPanel, LoadingScreen } from './components/uiComponents.js'

/**
 * Main DIGGGIN Cratedigger Application
 */
class CratediggerApp {
  constructor() {
    this.dataLoader = new DataLoader()
    this.visualizer = null
    this.recordDetail = null
    this.filterPanel = null
    this.loadingScreen = null
    this.allData = []
    this.filteredData = []
    
    this.init()
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      // Setup UI components
      this.setupUI()
      
      // Load data
      this.loadingScreen.updateMessage('Loading music database...')
      this.allData = await this.dataLoader.loadData()
      this.filteredData = [...this.allData]
      
      // Setup filter options
      const filterOptions = this.dataLoader.getFilterOptions()
      this.filterPanel.populateOptions(filterOptions)
      this.filterPanel.updateResultsCount(this.allData.length)
      
      // Initialize 3D visualizer
      this.loadingScreen.updateMessage('Setting up 3D environment...')
      const visualizerContainer = document.getElementById('visualizer')
      this.visualizer = new CratediggerVisualizer(visualizerContainer)
      
      // Setup event handlers
      this.setupEventHandlers()
      
      // Load initial records
      this.visualizer.addRecords(this.filteredData)
      this.visualizer.start()
      
      // Hide loading screen
      this.loadingScreen.hide()
      
      console.log(`DIGGGIN loaded with ${this.allData.length} records`)
      
    } catch (error) {
      console.error('Failed to initialize DIGGGIN:', error)
      this.showError('Failed to load the cratedigger experience. Please refresh and try again.')
    }
  }

  /**
   * Setup UI components
   */
  setupUI() {
    const app = document.getElementById('app')
    
    // Clear default content and setup layout
    app.innerHTML = `
      <div id="loading">
        <div class="loading-spinner"></div>
        <p>Loading your cratedigger experience...</p>
      </div>
      
      <header class="app-header">
        <h1>DIGGGIN</h1>
        <p>Discover music through immersive artwork exploration</p>
      </header>
      
      <main class="app-main">
        <div class="left-panel">
          <div id="filter-panel"></div>
        </div>
        
        <div class="center-panel">
          <div id="visualizer"></div>
          <div class="instructions">
            <p>Mouse over records to preview • Click to explore • Use filters to dig deeper</p>
          </div>
        </div>
      </main>
      
      <div id="record-detail-container"></div>
    `
    
    // Initialize UI components
    this.loadingScreen = new LoadingScreen(app)
    this.filterPanel = new FilterPanel(document.getElementById('filter-panel'))
    this.recordDetail = new RecordDetail(document.getElementById('record-detail-container'))
  }

  /**
   * Setup event handlers
   */
  setupEventHandlers() {
    // Record selection from 3D visualizer
    this.visualizer.setOnRecordSelect((record) => {
      this.recordDetail.show(record)
    })
    
    // Filter changes
    this.filterPanel.setOnFilter((filters) => {
      this.applyFilters(filters)
    })
    
    // Window resize
    window.addEventListener('resize', () => {
      if (this.visualizer) {
        this.visualizer.handleResize()
      }
    })
  }

  /**
   * Apply filters to the data
   * @param {Object} filters - Filter criteria
   */
  applyFilters(filters) {
    let filtered = [...this.allData]
    
    // Apply search filter
    if (filters.search) {
      filtered = this.dataLoader.search(filters.search)
    }
    
    // Apply genre filter
    if (filters.genre) {
      filtered = filtered.filter(item => 
        item.songGenre.toLowerCase().includes(filters.genre.toLowerCase())
      )
    }
    
    // Apply mood filter
    if (filters.mood) {
      filtered = filtered.filter(item => 
        item.mood.toLowerCase().includes(filters.mood.toLowerCase())
      )
    }
    
    // Apply color filter
    if (filters.color) {
      filtered = filtered.filter(item => 
        item.colors.includes(filters.color.toLowerCase())
      )
    }
    
    this.filteredData = filtered
    this.filterPanel.updateResultsCount(filtered.length)
    
    // Update 3D visualization
    if (this.visualizer) {
      this.visualizer.addRecords(filtered)
    }
  }

  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    const app = document.getElementById('app')
    app.innerHTML = `
      <div class="error-screen">
        <h2>Oops! Something went wrong</h2>
        <p>${message}</p>
        <button onclick="window.location.reload()">Try Again</button>
      </div>
    `
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CratediggerApp()
})
