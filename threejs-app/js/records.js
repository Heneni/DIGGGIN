/**
 * Record management and interaction for DIGGGIN 3D record store
 */

class RecordManager {
    constructor(sceneManager, dataProcessor) {
        this.scene = sceneManager;
        this.data = dataProcessor;
        this.currentRecords = [];
        this.displayedRecords = [];
        this.currentFilters = {};
        this.maxDisplayRecords = 100; // Limit for performance
        
        // State
        this.isLoading = false;
        this.selectedRecord = null;
        
        this.setupEventListeners();
    }

    /**
     * Load and display records from CSV data
     * @param {string} csvData - Raw CSV data
     */
    async loadRecords(csvData) {
        this.setLoading(true);
        
        try {
            // Process CSV data
            this.currentRecords = this.data.parseCSV(csvData);
            console.log('Loaded records:', this.currentRecords.length);
            
            // Get initial set of records to display
            this.displayedRecords = this.getRecordsToDisplay();
            
            // Position records in 3D scene
            this.scene.positionRecords(this.displayedRecords);
            
            // Update UI
            this.updateStats();
            this.populateFilterOptions();
            
            console.log('Records loaded and positioned successfully');
        } catch (error) {
            console.error('Error loading records:', error);
            this.showError('Failed to load records. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Get records to display based on current filters
     * @returns {Array} Records to display
     */
    getRecordsToDisplay() {
        let filteredRecords = this.data.filterRecords(this.currentFilters);
        
        // Shuffle for variety
        filteredRecords = filteredRecords.sort(() => 0.5 - Math.random());
        
        // Limit for performance
        return filteredRecords.slice(0, this.maxDisplayRecords);
    }

    /**
     * Apply filters and update display
     * @param {Object} filters - Filter criteria
     */
    applyFilters(filters) {
        this.currentFilters = { ...filters };
        this.displayedRecords = this.getRecordsToDisplay();
        
        // Update 3D scene
        this.scene.positionRecords(this.displayedRecords);
        
        // Update UI
        this.updateStats();
        
        console.log('Applied filters:', filters, 'Showing:', this.displayedRecords.length);
    }

    /**
     * Search records by text
     * @param {string} searchTerm - Search term
     */
    searchRecords(searchTerm) {
        this.applyFilters({
            ...this.currentFilters,
            search: searchTerm
        });
    }

    /**
     * Filter by genre
     * @param {string} genre - Genre name
     */
    filterByGenre(genre) {
        this.applyFilters({
            ...this.currentFilters,
            genre: genre || undefined
        });
    }

    /**
     * Filter by mood
     * @param {string} mood - Mood name
     */
    filterByMood(mood) {
        this.applyFilters({
            ...this.currentFilters,
            mood: mood || undefined
        });
    }

    /**
     * Filter by artist
     * @param {string} artist - Artist name
     */
    filterByArtist(artist) {
        this.applyFilters({
            ...this.currentFilters,
            artist: artist || undefined
        });
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.currentFilters = {};
        this.displayedRecords = this.getRecordsToDisplay();
        this.scene.positionRecords(this.displayedRecords);
        this.updateStats();
        this.updateFilterUI();
    }

    /**
     * Get a random selection of records
     * @param {number} count - Number of records
     */
    getRandomSelection(count = 50) {
        this.displayedRecords = this.data.getRandomRecords(count);
        this.scene.positionRecords(this.displayedRecords);
        this.updateStats();
    }

    /**
     * Get records by genre for organized browsing
     * @param {string} genre - Genre to display
     */
    browseByGenre(genre) {
        const genreRecords = this.currentRecords.filter(r => r.genre === genre);
        this.displayedRecords = genreRecords.slice(0, this.maxDisplayRecords);
        this.scene.positionRecords(this.displayedRecords);
        this.updateStats();
    }

    /**
     * Handle record selection from 3D scene
     * @param {Object} recordData - Selected record data
     */
    onRecordSelected(recordData) {
        this.selectedRecord = recordData;
        this.displayRecordDetails(recordData);
        
        // Emit event for other components
        const event = new CustomEvent('recordDetailsUpdated', {
            detail: recordData
        });
        document.dispatchEvent(event);
    }

    /**
     * Display record details in UI
     * @param {Object} record - Record data
     */
    displayRecordDetails(record) {
        const detailsElement = document.getElementById('record-details');
        if (!detailsElement) return;

        detailsElement.innerHTML = `
            <h3>Record Details</h3>
            <div class="record-info">
                <img src="${record.cover}" alt="${record.artworkName}" class="record-cover" 
                     onerror="this.style.display='none'">
                
                <div class="record-field">
                    <label>Artwork:</label>
                    <span class="value">${record.artworkName}</span>
                </div>
                
                <div class="record-field">
                    <label>Artist:</label>
                    <span class="value">${record.artist}</span>
                </div>
                
                <div class="record-field">
                    <label>Song:</label>
                    <span class="value">${record.songTitle}</span>
                </div>
                
                <div class="record-field">
                    <label>Genre:</label>
                    <span class="value">${record.genre}</span>
                </div>
                
                <div class="record-field">
                    <label>Mood:</label>
                    <span class="value">${record.mood}</span>
                </div>
                
                <div class="record-field">
                    <label>Category:</label>
                    <span class="value">${record.artisticCategory}</span>
                </div>
                
                ${record.colors.length > 0 ? `
                <div class="record-field">
                    <label>Colors:</label>
                    <span class="value">${record.colors.join(', ')}</span>
                </div>
                ` : ''}
                
                ${record.collections.length > 0 ? `
                <div class="record-field">
                    <label>Collections:</label>
                    <span class="value">${record.collections.join(', ')}</span>
                </div>
                ` : ''}
                
                <div class="record-actions">
                    <button onclick="recordManager.focusOnGenre('${record.genre}')" class="action-btn">
                        More ${record.genre}
                    </button>
                    <button onclick="recordManager.focusOnArtist('${record.artist}')" class="action-btn">
                        More by ${record.artist}
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Focus on a specific genre
     * @param {string} genre - Genre to focus on
     */
    focusOnGenre(genre) {
        this.filterByGenre(genre);
        document.getElementById('genre-filter').value = genre;
    }

    /**
     * Focus on a specific artist
     * @param {string} artist - Artist to focus on
     */
    focusOnArtist(artist) {
        this.filterByArtist(artist);
        // Update UI if there's an artist filter
    }

    /**
     * Update statistics display
     */
    updateStats() {
        const totalElement = document.getElementById('total-records');
        const filteredElement = document.getElementById('filtered-records');
        
        if (totalElement) {
            totalElement.textContent = this.currentRecords.length;
        }
        
        if (filteredElement) {
            filteredElement.textContent = this.displayedRecords.length;
        }
    }

    /**
     * Populate filter dropdown options
     */
    populateFilterOptions() {
        const filterOptions = this.data.getFilterOptions();
        
        // Update genre filter
        const genreSelect = document.getElementById('genre-filter');
        if (genreSelect) {
            this.updateSelectOptions(genreSelect, filterOptions.genres, 'All Genres');
        }
        
        // Update mood filter
        const moodSelect = document.getElementById('mood-filter');
        if (moodSelect) {
            this.updateSelectOptions(moodSelect, filterOptions.moods, 'All Moods');
        }
    }

    /**
     * Update select element options
     * @param {HTMLSelectElement} selectElement - Select element
     * @param {Array} options - Option values
     * @param {string} defaultText - Default option text
     */
    updateSelectOptions(selectElement, options, defaultText) {
        // Keep the default option
        const defaultOption = selectElement.querySelector('option[value=""]');
        selectElement.innerHTML = '';
        
        if (defaultOption) {
            selectElement.appendChild(defaultOption);
        } else {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = defaultText;
            selectElement.appendChild(option);
        }
        
        // Add options
        options.forEach(optionValue => {
            const option = document.createElement('option');
            option.value = optionValue;
            option.textContent = optionValue;
            selectElement.appendChild(option);
        });
    }

    /**
     * Update filter UI to reflect current filters
     */
    updateFilterUI() {
        const searchInput = document.getElementById('search');
        const genreSelect = document.getElementById('genre-filter');
        const moodSelect = document.getElementById('mood-filter');
        
        if (searchInput) {
            searchInput.value = this.currentFilters.search || '';
        }
        
        if (genreSelect) {
            genreSelect.value = this.currentFilters.genre || '';
        }
        
        if (moodSelect) {
            moodSelect.value = this.currentFilters.mood || '';
        }
    }

    /**
     * Set loading state
     * @param {boolean} loading - Loading state
     */
    setLoading(loading) {
        this.isLoading = loading;
        const loadingElement = document.getElementById('loading');
        
        if (loadingElement) {
            if (loading) {
                loadingElement.classList.remove('hidden');
            } else {
                loadingElement.classList.add('hidden');
            }
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        console.error(message);
        // Could add a toast notification or modal here
        alert(message);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for record selection from 3D scene
        document.addEventListener('recordSelected', (event) => {
            this.onRecordSelected(event.detail);
        });

        // Search input
        const searchInput = document.getElementById('search');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (event) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchRecords(event.target.value);
                }, 300); // Debounce search
            });
        }

        // Genre filter
        const genreSelect = document.getElementById('genre-filter');
        if (genreSelect) {
            genreSelect.addEventListener('change', (event) => {
                this.filterByGenre(event.target.value);
            });
        }

        // Mood filter
        const moodSelect = document.getElementById('mood-filter');
        if (moodSelect) {
            moodSelect.addEventListener('change', (event) => {
                this.filterByMood(event.target.value);
            });
        }
    }

    /**
     * Get current dataset statistics
     * @returns {Object} Statistics
     */
    getStatistics() {
        return {
            ...this.data.getStats(),
            displayed: this.displayedRecords.length,
            filtered: this.data.filterRecords(this.currentFilters).length
        };
    }
}

// Export for use in other modules
window.RecordManager = RecordManager;