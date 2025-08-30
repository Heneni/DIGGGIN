import Papa from 'papaparse'

/**
 * Data loader for DiggerDB.csv 
 * Parses and processes the music/artwork database
 */
export class DataLoader {
  constructor() {
    this.data = []
    this.isLoaded = false
  }

  /**
   * Load and parse the CSV data
   * @returns {Promise<Array>} Parsed data array
   */
  async loadData() {
    try {
      const response = await fetch('/DiggerDB.csv')
      const csvText = await response.text()
      
      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => {
            // Clean up header names
            return header.trim().toLowerCase().replace(/\s+/g, '_')
          },
          transform: (value, field) => {
            // Clean up data values
            if (typeof value === 'string') {
              return value.trim()
            }
            return value
          },
          complete: (results) => {
            if (results.errors.length > 0) {
              console.warn('CSV parsing warnings:', results.errors)
            }
            
            this.data = this.processData(results.data)
            this.isLoaded = true
            resolve(this.data)
          },
          error: (error) => {
            reject(new Error(`Failed to parse CSV: ${error.message}`))
          }
        })
      })
    } catch (error) {
      throw new Error(`Failed to load data: ${error.message}`)
    }
  }

  /**
   * Process and enhance the raw CSV data
   * @param {Array} rawData - Raw parsed CSV data
   * @returns {Array} Processed data
   */
  processData(rawData) {
    return rawData
      .filter(row => row.cover && row.artist && row.song_title) // Filter out incomplete entries
      .map((row, index) => ({
        id: index,
        cover: row.cover,
        artworkName: row.artwork_name || 'Untitled',
        songGenre: row.song_genre || 'Unknown',
        artist: row.artist,
        songTitle: row.song_title,
        artisticCategory: row.artistic_category || 'abstract',
        mood: row.mood || 'neutral',
        year: row.year || 'Unknown',
        collections: this.parseCollections(row.collections),
        colors: this.parseColors(row.year), // The year field seems to contain color info
        tags: this.parseTags(row.collections)
      }))
  }

  /**
   * Parse collections field into array
   * @param {string} collections - Collections string
   * @returns {Array} Array of collection tags
   */
  parseCollections(collections) {
    if (!collections) return []
    return collections.split(',').map(tag => tag.trim().toLowerCase())
  }

  /**
   * Parse color information
   * @param {string} colorInfo - Color information string
   * @returns {Array} Array of colors
   */
  parseColors(colorInfo) {
    if (!colorInfo) return []
    // Extract colors from descriptions like "Pink, green, blue, cool tone"
    const colorRegex = /\b(red|green|blue|yellow|orange|purple|pink|black|white|brown|gold|vibrant|dark|cool|warm)\b/gi
    const matches = colorInfo.match(colorRegex) || []
    return [...new Set(matches.map(color => color.toLowerCase()))]
  }

  /**
   * Parse tags from collections
   * @param {string} collections - Collections string
   * @returns {Array} Array of unique tags
   */
  parseTags(collections) {
    if (!collections) return []
    const tags = collections.split(',').map(tag => tag.trim().toLowerCase())
    return [...new Set(tags)]
  }

  /**
   * Get all data
   * @returns {Array} All loaded data
   */
  getData() {
    return this.data
  }

  /**
   * Filter data by genre
   * @param {string} genre - Genre to filter by
   * @returns {Array} Filtered data
   */
  filterByGenre(genre) {
    return this.data.filter(item => 
      item.songGenre.toLowerCase().includes(genre.toLowerCase())
    )
  }

  /**
   * Filter data by mood
   * @param {string} mood - Mood to filter by
   * @returns {Array} Filtered data
   */
  filterByMood(mood) {
    return this.data.filter(item => 
      item.mood.toLowerCase().includes(mood.toLowerCase())
    )
  }

  /**
   * Filter data by color
   * @param {string} color - Color to filter by
   * @returns {Array} Filtered data
   */
  filterByColor(color) {
    return this.data.filter(item => 
      item.colors.includes(color.toLowerCase())
    )
  }

  /**
   * Search data by text
   * @param {string} query - Search query
   * @returns {Array} Matching data
   */
  search(query) {
    const q = query.toLowerCase()
    return this.data.filter(item => 
      item.artist.toLowerCase().includes(q) ||
      item.songTitle.toLowerCase().includes(q) ||
      item.artworkName.toLowerCase().includes(q) ||
      item.songGenre.toLowerCase().includes(q) ||
      item.mood.toLowerCase().includes(q) ||
      item.tags.some(tag => tag.includes(q))
    )
  }

  /**
   * Get unique values for filtering
   * @returns {Object} Object with arrays of unique values
   */
  getFilterOptions() {
    const genres = [...new Set(this.data.map(item => item.songGenre))]
    const moods = [...new Set(this.data.map(item => item.mood))]
    const artists = [...new Set(this.data.map(item => item.artist))]
    const colors = [...new Set(this.data.flatMap(item => item.colors))]
    const tags = [...new Set(this.data.flatMap(item => item.tags))]

    return { genres, moods, artists, colors, tags }
  }
}