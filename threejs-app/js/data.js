/**
 * Data processing utilities for DIGGGIN record database
 */

class DataProcessor {
    constructor() {
        this.records = [];
        this.genres = new Set();
        this.artists = new Set();
        this.moods = new Set();
        this.collections = new Set();
    }

    /**
     * Parse CSV data and convert to structured JSON
     * @param {string} csvData - Raw CSV string
     * @returns {Array} Processed records array
     */
    parseCSV(csvData) {
        const lines = csvData.trim().split('\n');
        const headers = this.parseCSVRow(lines[0]);
        
        console.log('CSV Headers:', headers);
        
        for (let i = 1; i < lines.length; i++) {
            const row = this.parseCSVRow(lines[i]);
            if (row.length >= headers.length) {
                const record = this.createRecord(headers, row, i);
                if (record) {
                    this.records.push(record);
                    this.extractMetadata(record);
                }
            }
        }
        
        console.log(`Processed ${this.records.length} records`);
        return this.records;
    }

    /**
     * Parse a CSV row handling quoted values
     * @param {string} row - CSV row string
     * @returns {Array} Parsed values
     */
    parseCSVRow(row) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < row.length; i++) {
            const char = row[i];
            
            if (char === '"' && (i === 0 || row[i-1] === ',')) {
                inQuotes = true;
            } else if (char === '"' && inQuotes && (i === row.length - 1 || row[i+1] === ',')) {
                inQuotes = false;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }

    /**
     * Create a structured record object
     * @param {Array} headers - CSV headers
     * @param {Array} row - CSV row data
     * @param {number} index - Record index
     * @returns {Object} Structured record
     */
    createRecord(headers, row, index) {
        try {
            const record = {
                id: index,
                cover: row[0] || '',
                artworkName: row[1] || '',
                genre: row[2] || '',
                artist: row[3] || '',
                songTitle: row[4] || '',
                artisticCategory: row[5] || '',
                mood: row[6] || '',
                colors: this.parseColors(row[7] || ''),
                collections: this.parseCollections(row[8] || ''),
                // Additional computed fields
                searchTerms: '',
                textureLoaded: false,
                visible: true
            };

            // Create search terms for filtering
            record.searchTerms = [
                record.artworkName,
                record.genre,
                record.artist,
                record.songTitle,
                record.artisticCategory,
                record.mood,
                ...record.colors,
                ...record.collections
            ].join(' ').toLowerCase();

            return record;
        } catch (error) {
            console.warn(`Error processing record ${index}:`, error);
            return null;
        }
    }

    /**
     * Parse color information from text
     * @param {string} colorText - Color description
     * @returns {Array} Array of color names
     */
    parseColors(colorText) {
        if (!colorText) return [];
        
        return colorText
            .toLowerCase()
            .split(',')
            .map(color => color.trim())
            .filter(color => color.length > 0);
    }

    /**
     * Parse collection tags from text
     * @param {string} collectionText - Collection description
     * @returns {Array} Array of collection tags
     */
    parseCollections(collectionText) {
        if (!collectionText) return [];
        
        return collectionText
            .toLowerCase()
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
    }

    /**
     * Extract metadata for filters
     * @param {Object} record - Record object
     */
    extractMetadata(record) {
        if (record.genre) this.genres.add(record.genre);
        if (record.artist) this.artists.add(record.artist);
        if (record.mood) this.moods.add(record.mood);
        record.collections.forEach(col => this.collections.add(col));
    }

    /**
     * Get filter options
     * @returns {Object} Filter options
     */
    getFilterOptions() {
        return {
            genres: Array.from(this.genres).sort(),
            artists: Array.from(this.artists).sort(),
            moods: Array.from(this.moods).sort(),
            collections: Array.from(this.collections).sort()
        };
    }

    /**
     * Filter records based on criteria
     * @param {Object} filters - Filter criteria
     * @returns {Array} Filtered records
     */
    filterRecords(filters = {}) {
        return this.records.filter(record => {
            // Text search - handle both searchTerms field and manual search
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                const searchableText = record.searchTerms || 
                    [record.artworkName, record.genre, record.artist, record.songTitle, 
                     record.artisticCategory, record.mood, 
                     ...(record.colors || []), ...(record.collections || [])].join(' ').toLowerCase();
                
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }

            // Genre filter
            if (filters.genre && record.genre !== filters.genre) {
                return false;
            }

            // Artist filter
            if (filters.artist && record.artist !== filters.artist) {
                return false;
            }

            // Mood filter
            if (filters.mood && record.mood !== filters.mood) {
                return false;
            }

            // Collection filter
            if (filters.collection && !(record.collections || []).includes(filters.collection)) {
                return false;
            }

            return true;
        });
    }

    /**
     * Get random records for initial display
     * @param {number} count - Number of records to return
     * @returns {Array} Random records
     */
    getRandomRecords(count = 50) {
        const shuffled = [...this.records].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    /**
     * Get records by genre for organized display
     * @returns {Object} Records grouped by genre
     */
    getRecordsByGenre() {
        const grouped = {};
        this.records.forEach(record => {
            if (!grouped[record.genre]) {
                grouped[record.genre] = [];
            }
            grouped[record.genre].push(record);
        });
        return grouped;
    }

    /**
     * Validate record data
     * @param {Object} record - Record to validate
     * @returns {boolean} Is valid
     */
    isValidRecord(record) {
        return record.cover && 
               record.artist && 
               record.songTitle && 
               record.genre;
    }

    /**
     * Get stats about the dataset
     * @returns {Object} Dataset statistics
     */
    getStats() {
        return {
            totalRecords: this.records.length,
            genres: this.genres.size,
            artists: this.artists.size,
            moods: this.moods.size,
            collections: this.collections.size,
            validRecords: this.records.filter(r => this.isValidRecord(r)).length
        };
    }
}

// Export for use in other modules
window.DataProcessor = DataProcessor;