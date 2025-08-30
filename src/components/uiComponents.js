/**
 * UI Component for displaying record details
 */
export class RecordDetail {
  constructor(container) {
    this.container = container
    this.currentRecord = null
    this.element = null
    this.init()
  }

  /**
   * Initialize the component
   */
  init() {
    this.element = document.createElement('div')
    this.element.className = 'record-detail'
    this.element.innerHTML = `
      <div class="record-detail-content">
        <button class="close-btn" aria-label="Close">&times;</button>
        <div class="record-image">
          <img src="" alt="Album artwork" />
        </div>
        <div class="record-info">
          <h2 class="song-title"></h2>
          <h3 class="artist-name"></h3>
          <p class="artwork-name"></p>
          <div class="metadata">
            <span class="genre"></span>
            <span class="mood"></span>
            <span class="year"></span>
          </div>
          <div class="colors"></div>
          <div class="tags"></div>
        </div>
      </div>
    `
    
    this.container.appendChild(this.element)
    this.setupEventListeners()
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    const closeBtn = this.element.querySelector('.close-btn')
    closeBtn.addEventListener('click', () => this.hide())
    
    this.element.addEventListener('click', (e) => {
      if (e.target === this.element) {
        this.hide()
      }
    })
  }

  /**
   * Show record details
   * @param {Object} record - Record data
   */
  show(record) {
    this.currentRecord = record
    
    // Update content
    const img = this.element.querySelector('img')
    const songTitle = this.element.querySelector('.song-title')
    const artistName = this.element.querySelector('.artist-name')
    const artworkName = this.element.querySelector('.artwork-name')
    const genre = this.element.querySelector('.genre')
    const mood = this.element.querySelector('.mood')
    const year = this.element.querySelector('.year')
    const colors = this.element.querySelector('.colors')
    const tags = this.element.querySelector('.tags')
    
    img.src = record.cover
    img.alt = `${record.artworkName} by ${record.artist}`
    songTitle.textContent = record.songTitle
    artistName.textContent = record.artist
    artworkName.textContent = record.artworkName
    genre.textContent = record.songGenre
    mood.textContent = record.mood
    year.textContent = record.year
    
    // Colors
    colors.innerHTML = record.colors.map(color => 
      `<span class="color-tag" style="background-color: ${this.getColorValue(color)}">${color}</span>`
    ).join('')
    
    // Tags
    tags.innerHTML = record.tags.map(tag => 
      `<span class="tag">${tag}</span>`
    ).join('')
    
    this.element.classList.add('visible')
  }

  /**
   * Hide record details
   */
  hide() {
    this.element.classList.remove('visible')
    this.currentRecord = null
  }

  /**
   * Get color value for display
   * @param {string} colorName - Color name
   * @returns {string} CSS color value
   */
  getColorValue(colorName) {
    const colorMap = {
      'red': '#ff4444',
      'green': '#44ff44',
      'blue': '#4444ff',
      'yellow': '#ffff44',
      'orange': '#ff8844',
      'purple': '#8844ff',
      'pink': '#ff44ff',
      'black': '#222222',
      'white': '#ffffff',
      'brown': '#8b4513',
      'gold': '#ffd700',
      'vibrant': '#ff6b35',
      'dark': '#333333',
      'cool': '#4a90e2',
      'warm': '#ff8c42'
    }
    
    return colorMap[colorName] || '#666666'
  }
}

/**
 * UI Component for filtering and searching
 */
export class FilterPanel {
  constructor(container) {
    this.container = container
    this.element = null
    this.onFilter = null
    this.filters = {
      search: '',
      genre: '',
      mood: '',
      color: ''
    }
    this.init()
  }

  /**
   * Initialize the component
   */
  init() {
    this.element = document.createElement('div')
    this.element.className = 'filter-panel'
    this.element.innerHTML = `
      <div class="filter-content">
        <h3>Dig Through Records</h3>
        <div class="search-box">
          <input type="text" id="search" placeholder="Search artist, song, or artwork..." />
        </div>
        <div class="filter-groups">
          <div class="filter-group">
            <label for="genre-filter">Genre</label>
            <select id="genre-filter">
              <option value="">All Genres</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="mood-filter">Mood</label>
            <select id="mood-filter">
              <option value="">All Moods</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="color-filter">Color</label>
            <select id="color-filter">
              <option value="">All Colors</option>
            </select>
          </div>
        </div>
        <button class="clear-filters">Clear All Filters</button>
        <div class="results-count">
          <span class="count">0</span> records found
        </div>
      </div>
    `
    
    this.container.appendChild(this.element)
    this.setupEventListeners()
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    const searchInput = this.element.querySelector('#search')
    const genreSelect = this.element.querySelector('#genre-filter')
    const moodSelect = this.element.querySelector('#mood-filter')
    const colorSelect = this.element.querySelector('#color-filter')
    const clearBtn = this.element.querySelector('.clear-filters')
    
    searchInput.addEventListener('input', (e) => {
      this.filters.search = e.target.value
      this.applyFilters()
    })
    
    genreSelect.addEventListener('change', (e) => {
      this.filters.genre = e.target.value
      this.applyFilters()
    })
    
    moodSelect.addEventListener('change', (e) => {
      this.filters.mood = e.target.value
      this.applyFilters()
    })
    
    colorSelect.addEventListener('change', (e) => {
      this.filters.color = e.target.value
      this.applyFilters()
    })
    
    clearBtn.addEventListener('click', () => {
      this.clearFilters()
    })
  }

  /**
   * Populate filter options
   * @param {Object} options - Filter options from data
   */
  populateOptions(options) {
    const genreSelect = this.element.querySelector('#genre-filter')
    const moodSelect = this.element.querySelector('#mood-filter')
    const colorSelect = this.element.querySelector('#color-filter')
    
    // Clear existing options (except first)
    genreSelect.innerHTML = '<option value="">All Genres</option>'
    moodSelect.innerHTML = '<option value="">All Moods</option>'
    colorSelect.innerHTML = '<option value="">All Colors</option>'
    
    // Add genre options
    options.genres.forEach(genre => {
      const option = document.createElement('option')
      option.value = genre
      option.textContent = genre
      genreSelect.appendChild(option)
    })
    
    // Add mood options
    options.moods.forEach(mood => {
      const option = document.createElement('option')
      option.value = mood
      option.textContent = mood
      moodSelect.appendChild(option)
    })
    
    // Add color options
    options.colors.forEach(color => {
      const option = document.createElement('option')
      option.value = color
      option.textContent = color.charAt(0).toUpperCase() + color.slice(1)
      colorSelect.appendChild(option)
    })
  }

  /**
   * Apply current filters
   */
  applyFilters() {
    if (this.onFilter) {
      this.onFilter(this.filters)
    }
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    this.filters = {
      search: '',
      genre: '',
      mood: '',
      color: ''
    }
    
    this.element.querySelector('#search').value = ''
    this.element.querySelector('#genre-filter').value = ''
    this.element.querySelector('#mood-filter').value = ''
    this.element.querySelector('#color-filter').value = ''
    
    this.applyFilters()
  }

  /**
   * Update results count
   * @param {number} count - Number of results
   */
  updateResultsCount(count) {
    const countElement = this.element.querySelector('.count')
    countElement.textContent = count
  }

  /**
   * Set filter callback
   * @param {Function} callback - Filter callback function
   */
  setOnFilter(callback) {
    this.onFilter = callback
  }
}

/**
 * Loading screen component
 */
export class LoadingScreen {
  constructor(container) {
    this.container = container
    this.element = null
    this.init()
  }

  /**
   * Initialize loading screen
   */
  init() {
    this.element = this.container.querySelector('#loading')
    
    if (!this.element) {
      this.element = document.createElement('div')
      this.element.id = 'loading'
      this.element.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Loading your cratedigger experience...</p>
      `
      this.container.appendChild(this.element)
    }
  }

  /**
   * Show loading screen
   */
  show() {
    this.element.style.display = 'flex'
  }

  /**
   * Hide loading screen
   */
  hide() {
    this.element.style.display = 'none'
  }

  /**
   * Update loading message
   * @param {string} message - Loading message
   */
  updateMessage(message) {
    const p = this.element.querySelector('p')
    if (p) {
      p.textContent = message
    }
  }
}