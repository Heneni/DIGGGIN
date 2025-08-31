/**
 * Simple filter manager for fallback mode
 */

class SimpleFilterManager {
    constructor(app) {
        this.app = app;
        this.allRecords = [];
        this.filteredRecords = [];
        this.currentFilters = {};
        
        this.setupEventListeners();
    }

    /**
     * Set records to work with
     */
    setRecords(records) {
        this.allRecords = records;
        this.filteredRecords = [...records];
        this.updateDisplay();
    }

    /**
     * Setup event listeners for filter controls
     */
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('search');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (event) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.applyFilters({ ...this.currentFilters, search: event.target.value });
                }, 300);
            });
        }

        // Genre filter
        const genreSelect = document.getElementById('genre-filter');
        if (genreSelect) {
            genreSelect.addEventListener('change', (event) => {
                this.applyFilters({ ...this.currentFilters, genre: event.target.value || null });
            });
        }

        // Mood filter
        const moodSelect = document.getElementById('mood-filter');
        if (moodSelect) {
            moodSelect.addEventListener('change', (event) => {
                this.applyFilters({ ...this.currentFilters, mood: event.target.value || null });
            });
        }
    }

    /**
     * Apply filters to records
     */
    applyFilters(filters) {
        this.currentFilters = filters;
        
        this.filteredRecords = this.allRecords.filter(record => {
            // Search filter
            if (filters.search && filters.search.trim()) {
                const searchTerm = filters.search.toLowerCase();
                const searchableText = [
                    record.artworkName || record.artwork_name || '',
                    record.artist || '',
                    record.songTitle || record.song_title || '',
                    record.genre || '',
                    record.mood || '',
                    ...(record.colors || []),
                    ...(record.collections || [])
                ].join(' ').toLowerCase();
                
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }

            // Genre filter
            if (filters.genre && record.genre !== filters.genre) {
                return false;
            }

            // Mood filter  
            if (filters.mood && record.mood !== filters.mood) {
                return false;
            }

            return true;
        });

        this.updateDisplay();
    }

    /**
     * Update the display with filtered records
     */
    updateDisplay() {
        // Update grid
        this.app.displayRecordsGrid(this.filteredRecords.slice(0, 30));
        
        // Update stats
        this.app.updateStats(this.allRecords.length, this.filteredRecords.length);
        
        console.log(`Filtering: ${this.filteredRecords.length} of ${this.allRecords.length} records`);
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.currentFilters = {};
        this.filteredRecords = [...this.allRecords];
        
        // Reset UI
        const searchInput = document.getElementById('search');
        const genreSelect = document.getElementById('genre-filter');
        const moodSelect = document.getElementById('mood-filter');
        
        if (searchInput) searchInput.value = '';
        if (genreSelect) genreSelect.value = '';
        if (moodSelect) moodSelect.value = '';
        
        this.updateDisplay();
    }
}

// Export for use
window.SimpleFilterManager = SimpleFilterManager;