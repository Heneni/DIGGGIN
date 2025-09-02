/**
 * Main application entry point for DIGGGIN 3D Record Store
 * Simplified version with fallback support
 */

class DIGGGINApp {
    constructor() {
        // Core components
        this.dataProcessor = null;
        this.sceneManager = null;
        this.recordManager = null;
        this.controlsManager = null;
        
        // State
        this.isInitialized = false;
        this.isLoading = false;
        this.is3DMode = false;
        
        // Configuration
        this.config = {
            csvPath: '../DiggerDB.csv',
            jsonPath: 'data/sample-records.json',
            maxRecords: 100,
            enableCache: true,
            enableAnalytics: false,
            preferJSON: true // Try JSON first, fallback to CSV
        };
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('Initializing DIGGGIN Record Store...');
        
        try {
            // Check if Three.js is available for 3D mode
            if (this.hasRealThreeJS()) {
                console.log('Three.js available - initializing 3D mode');
                this.is3DMode = true;
                await this.init3DMode();
            } else {
                console.log('Three.js not available - initializing fallback mode');
                this.is3DMode = false;
                await this.initFallbackMode();
            }
            
            this.isInitialized = true;
            console.log('DIGGGIN initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Failed to initialize the application. Please refresh the page.');
        }
    }

    /**
     * Check if real Three.js (not fallback) is available
     */
    hasRealThreeJS() {
        try {
            // Check if THREE exists and is not our fallback
            if (typeof THREE === 'undefined' || THREE._isFallback) {
                return false;
            }
            
            // Check for essential Three.js components
            return THREE.Scene && 
                   typeof THREE.Scene === 'function' &&
                   THREE.WebGLRenderer &&
                   typeof THREE.WebGLRenderer === 'function' &&
                   THREE.PerspectiveCamera &&
                   typeof THREE.PerspectiveCamera === 'function' &&
                   THREE.OrbitControls &&
                   typeof THREE.OrbitControls === 'function';
        } catch (error) {
            console.log('Three.js detection failed:', error.message);
            return false;
        }
    }

    /**
     * Initialize 3D mode with Three.js
     */
    async init3DMode() {
        // Initialize components in order
        this.dataProcessor = new DataProcessor();
        
        const canvas = document.getElementById('threejs-canvas');
        if (!canvas) {
            throw new Error('Canvas element not found');
        }
        
        this.sceneManager = new SceneManager(canvas);
        this.recordManager = new RecordManager(this.sceneManager, this.dataProcessor);
        this.controlsManager = new ControlsManager(this.recordManager, this.sceneManager);
        
        // Load data
        await this.loadData();
        
        console.log('3D mode initialized successfully');
    }

    /**
     * Initialize fallback mode without Three.js
     */
    async initFallbackMode() {
        // Hide 3D canvas
        const canvas = document.getElementById('threejs-canvas');
        if (canvas) {
            canvas.style.display = 'none';
        }
        
        // Show fallback interface
        const canvasContainer = document.getElementById('canvas-container');
        if (canvasContainer) {
            canvasContainer.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: #fff;">
                    <h2>🎵 DIGGGIN Record Database</h2>
                    <p>Browse our comprehensive record collection! 3D features are not available in this environment.</p>
                    <div id="records-grid" style="
                        display: grid; 
                        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
                        gap: 1rem; 
                        margin-top: 2rem;
                        max-height: 60vh;
                        overflow-y: auto;
                    "></div>
                </div>
            `;
        }
        
        // Initialize data processor only
        this.dataProcessor = new DataProcessor();
        this.filterManager = new SimpleFilterManager(this);
        
        // Load data
        await this.loadDataFallback();
        
        console.log('Fallback mode initialized successfully');
    }

    /**
     * Load data for 3D mode
     */
    async loadData() {
        console.log('Loading record data...');
        this.setLoadingState(true);
        
        try {
            if (this.config.preferJSON) {
                try {
                    const response = await fetch(this.config.jsonPath);
                    if (response.ok) {
                        const jsonData = await response.json();
                        await this.recordManager.loadRecordsFromJSON(jsonData);
                        console.log('✓ Records loaded from JSON');
                        return;
                    }
                } catch (error) {
                    console.warn('JSON loading failed, falling back to CSV:', error.message);
                }
            }
            
            // Fallback to CSV
            const response = await fetch(this.config.csvPath);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            
            const csvData = await response.text();
            await this.recordManager.loadRecords(csvData);
            console.log('✓ Records loaded from CSV');
            
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load record data. Please check your connection.');
            throw error;
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Load data for fallback mode
     */
    async loadDataFallback() {
        this.setLoadingState(true);
        
        try {
            let records = [];
            
            // Try JSON first
            try {
                const response = await fetch(this.config.jsonPath);
                if (response.ok) {
                    const jsonData = await response.json();
                    records = jsonData.records || [];
                    console.log('✓ Loaded records from JSON:', records.length);
                }
            } catch (error) {
                console.warn('JSON loading failed, trying CSV');
                
                // Fallback to CSV
                const response = await fetch(this.config.csvPath);
                const csvData = await response.text();
                records = this.dataProcessor.parseCSV(csvData);
                console.log('✓ Loaded records from CSV:', records.length);
            }
            
            // Display records in grid
            this.displayRecordsGrid(records.slice(0, 30)); // Show first 30
            
            // Set up filtering
            this.filterManager.setRecords(records);
            
            // Update stats
            this.updateStats(records.length, Math.min(30, records.length));
            
        } catch (error) {
            console.error('Error loading data in fallback mode:', error);
            this.showError('Failed to load record data.');
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Display records in a 2D grid
     */
    displayRecordsGrid(records) {
        const grid = document.getElementById('records-grid');
        if (!grid) return;
        
        grid.innerHTML = records.map(record => `
            <div class="record-card" style="
                background: rgba(255,255,255,0.1);
                border-radius: 8px;
                padding: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 1px solid rgba(255,255,255,0.1);
            " onclick="window.showRecordDetails && window.showRecordDetails(${JSON.stringify(record).replace(/"/g, '&quot;')})">
                <img src="${record.cover}" alt="${record.artworkName || record.artwork_name || 'Album cover'}" style="
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                    border-radius: 4px;
                    margin-bottom: 0.5rem;
                    background: rgba(255,255,255,0.1);
                " onerror="this.style.display='none'; this.nextElementSibling.style.marginTop='0';">
                <h4 style="margin: 0.5rem 0; color: #fff; font-size: 0.9rem; line-height: 1.3;">
                    ${record.songTitle || record.song_title || 'Unknown Song'}
                </h4>
                <p style="margin: 0; color: #ccc; font-size: 0.8rem;">${record.artist || 'Unknown Artist'}</p>
                <p style="margin: 0.25rem 0 0 0; color: #0084ff; font-size: 0.7rem; text-transform: uppercase;">
                    ${record.genre || 'Unknown Genre'}
                </p>
            </div>
        `).join('');
        
        // Add hover effects and global record details function
        this.setupGridInteractions();
    }

    /**
     * Setup grid interactions and record details
     */
    setupGridInteractions() {
        // Add hover effects
        if (!document.getElementById('grid-styles')) {
            const style = document.createElement('style');
            style.id = 'grid-styles';
            style.textContent = `
                .record-card:hover {
                    background: rgba(255,255,255,0.2) !important;
                    transform: translateY(-2px);
                    border-color: rgba(0,132,255,0.5) !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Global function for record details
        window.showRecordDetails = (record) => {
            const detailsElement = document.getElementById('record-details');
            if (detailsElement) {
                detailsElement.innerHTML = `
                    <h3>Record Details</h3>
                    <div class="record-info">
                        <img src="${record.cover}" alt="${record.artworkName || record.artwork_name || 'Album cover'}" 
                             class="record-cover" onerror="this.style.display='none'">
                        
                        <div class="record-field">
                            <label>Artwork:</label>
                            <span class="value">${record.artworkName || record.artwork_name || 'Unknown'}</span>
                        </div>
                        
                        <div class="record-field">
                            <label>Artist:</label>
                            <span class="value">${record.artist || 'Unknown Artist'}</span>
                        </div>
                        
                        <div class="record-field">
                            <label>Song:</label>
                            <span class="value">${record.songTitle || record.song_title || 'Unknown Song'}</span>
                        </div>
                        
                        <div class="record-field">
                            <label>Genre:</label>
                            <span class="value">${record.genre || 'Unknown Genre'}</span>
                        </div>
                        
                        <div class="record-field">
                            <label>Mood:</label>
                            <span class="value">${record.mood || 'Unknown Mood'}</span>
                        </div>
                        
                        ${record.artisticCategory ? `
                        <div class="record-field">
                            <label>Category:</label>
                            <span class="value">${record.artisticCategory}</span>
                        </div>
                        ` : ''}
                    </div>
                `;
            }
        };
    }

    /**
     * Update statistics display
     */
    updateStats(total, displayed) {
        const totalElement = document.getElementById('total-records');
        const filteredElement = document.getElementById('filtered-records');
        
        if (totalElement) totalElement.textContent = total;
        if (filteredElement) filteredElement.textContent = displayed;
    }

    /**
     * Set loading state
     */
    setLoadingState(loading) {
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
     */
    showError(message) {
        console.error('User error:', message);
        
        // Simple error display
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 10000;
            max-width: 300px;
        `;
        errorDiv.innerHTML = `
            <strong>Error:</strong> ${message}
            <button onclick="this.parentElement.remove()" style="
                margin-left: 10px;
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 2px 8px;
                border-radius: 3px;
                cursor: pointer;
            ">×</button>
        `;
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.parentElement.removeChild(errorDiv);
            }
        }, 5000);
    }

    /**
     * Get application status
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            isLoading: this.isLoading,
            is3DMode: this.is3DMode,
            hasThreeJS: typeof THREE !== 'undefined'
        };
    }

    /**
     * Cleanup resources
     */
    dispose() {
        if (this.sceneManager) {
            this.sceneManager.dispose();
        }
        console.log('DIGGGIN application disposed');
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing DIGGGIN app...');
    window.diggginApp = new DIGGGINApp();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.diggginApp) {
        window.diggginApp.dispose();
    }
});