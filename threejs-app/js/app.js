/**
 * Main application entry point for DIGGGIN 3D Record Store
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
        
        // Configuration
        this.config = {
            csvPath: '../DiggerDB.csv',
            maxRecords: 100,
            enableCache: true,
            enableAnalytics: false
        };
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('Initializing DIGGGIN 3D Record Store...');
        
        try {
            // Check WebGL support
            if (!this.checkWebGLSupport()) {
                this.showError('WebGL is not supported in your browser. Please use a modern browser.');
                return;
            }

            // Initialize components in order
            await this.initializeComponents();
            
            // Load data
            await this.loadData();
            
            // Setup error handling
            this.setupErrorHandling();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            this.isInitialized = true;
            console.log('DIGGGIN 3D Record Store initialized successfully');
            
            // Show welcome message
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Failed to initialize the application. Please refresh the page.');
        }
    }

    /**
     * Check WebGL support
     * @returns {boolean} WebGL is supported
     */
    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    }

    /**
     * Initialize core components
     */
    async initializeComponents() {
        console.log('Initializing components...');
        
        // Initialize data processor
        this.dataProcessor = new DataProcessor();
        console.log('✓ Data processor initialized');
        
        // Initialize 3D scene
        const canvas = document.getElementById('threejs-canvas');
        if (!canvas) {
            throw new Error('Canvas element not found');
        }
        
        this.sceneManager = new SceneManager(canvas);
        console.log('✓ Scene manager initialized');
        
        // Initialize record manager
        this.recordManager = new RecordManager(this.sceneManager, this.dataProcessor);
        console.log('✓ Record manager initialized');
        
        // Initialize controls
        this.controlsManager = new ControlsManager(this.recordManager, this.sceneManager);
        console.log('✓ Controls manager initialized');
        
        // Set up cross-component communication
        this.setupComponentCommunication();
    }

    /**
     * Setup communication between components
     */
    setupComponentCommunication() {
        // Record selection events
        document.addEventListener('recordSelected', (event) => {
            this.onRecordSelected(event.detail);
        });

        // Filter change events
        document.addEventListener('filtersChanged', (event) => {
            this.onFiltersChanged(event.detail);
        });

        // Performance events
        document.addEventListener('performanceWarning', (event) => {
            this.onPerformanceWarning(event.detail);
        });
    }

    /**
     * Load CSV data and initialize records
     */
    async loadData() {
        console.log('Loading record data...');
        this.setLoadingState(true);
        
        try {
            // Fetch CSV data
            const response = await fetch(this.config.csvPath);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
            
            const csvData = await response.text();
            console.log('✓ CSV data loaded');
            
            // Process and load records
            await this.recordManager.loadRecords(csvData);
            console.log('✓ Records processed and loaded');
            
            // Update UI with stats
            this.updateInitialUI();
            
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load record data. Please check your connection and try again.');
            throw error;
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Update initial UI state
     */
    updateInitialUI() {
        const stats = this.recordManager.getStatistics();
        console.log('Dataset statistics:', stats);
        
        // Update title with record count
        const title = document.querySelector('title');
        if (title) {
            title.textContent = `DIGGGIN - 3D Record Store (${stats.totalRecords} records)`;
        }
        
        // Show a sample of records initially
        this.recordManager.getRandomSelection(50);
    }

    /**
     * Handle record selection
     * @param {Object} record - Selected record data
     */
    onRecordSelected(record) {
        console.log('Record selected:', record.artworkName, 'by', record.artist);
        
        // Analytics tracking (if enabled)
        if (this.config.enableAnalytics) {
            this.trackEvent('record_selected', {
                artist: record.artist,
                genre: record.genre,
                mood: record.mood
            });
        }
        
        // Update URL hash for deep linking
        this.updateURLHash(record);
    }

    /**
     * Handle filter changes
     * @param {Object} filters - Current filter state
     */
    onFiltersChanged(filters) {
        console.log('Filters changed:', filters);
        
        // Analytics tracking
        if (this.config.enableAnalytics) {
            this.trackEvent('filters_changed', filters);
        }
    }

    /**
     * Handle performance warnings
     * @param {Object} warning - Performance warning details
     */
    onPerformanceWarning(warning) {
        console.warn('Performance warning:', warning);
        
        // Could implement adaptive quality settings here
        if (warning.type === 'low_fps') {
            this.adjustPerformanceSettings();
        }
    }

    /**
     * Setup error handling
     */
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.trackError(event.error);
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.trackError(event.reason);
        });

        // Three.js specific error handling
        this.sceneManager.renderer.domElement.addEventListener('webglcontextlost', (event) => {
            console.error('WebGL context lost');
            event.preventDefault();
            this.showError('Graphics context lost. Please refresh the page.');
        });
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const monitorPerformance = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;
                
                // Check for performance issues
                if (fps < 30) {
                    document.dispatchEvent(new CustomEvent('performanceWarning', {
                        detail: { type: 'low_fps', fps: fps }
                    }));
                }
            }
            
            requestAnimationFrame(monitorPerformance);
        };
        
        requestAnimationFrame(monitorPerformance);
    }

    /**
     * Adjust performance settings for better performance
     */
    adjustPerformanceSettings() {
        console.log('Adjusting performance settings...');
        
        // Reduce shadow quality
        if (this.sceneManager.renderer.shadowMap.enabled) {
            this.sceneManager.renderer.shadowMap.type = THREE.BasicShadowMap;
        }
        
        // Reduce pixel ratio
        this.sceneManager.renderer.setPixelRatio(1);
        
        // Limit displayed records
        this.recordManager.maxDisplayRecords = 50;
        
        this.controlsManager.announceToScreenReader('Performance optimizations applied');
    }

    /**
     * Set loading state
     * @param {boolean} loading - Loading state
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
     * Show error message to user
     * @param {string} message - Error message
     */
    showError(message) {
        console.error('User error:', message);
        
        // Create or update error display
        let errorElement = document.getElementById('error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = 'error-message';
            errorElement.className = 'error-message';
            errorElement.innerHTML = `
                <div class="error-content">
                    <h3>Error</h3>
                    <p>${message}</p>
                    <button onclick="this.parentElement.parentElement.remove()">Close</button>
                </div>
            `;
            document.body.appendChild(errorElement);
        } else {
            errorElement.querySelector('p').textContent = message;
        }
        
        // Add error styles if not already added
        if (!document.getElementById('error-styles')) {
            const style = document.createElement('style');
            style.id = 'error-styles';
            style.textContent = `
                .error-message {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    z-index: 2000;
                    background: #ff4444;
                    color: white;
                    padding: 1rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    max-width: 400px;
                }
                .error-content button {
                    margin-top: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: rgba(255,255,255,0.2);
                    border: none;
                    border-radius: 4px;
                    color: white;
                    cursor: pointer;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        const stats = this.dataProcessor.getStats();
        
        this.controlsManager.announceToScreenReader(
            `Welcome to DIGGGIN 3D Record Store. ${stats.totalRecords} records loaded. Use mouse or touch to browse, keyboard shortcuts available.`
        );
        
        // Show brief instructions
        setTimeout(() => {
            if (!localStorage.getItem('digggin-tutorial-shown')) {
                this.showTutorial();
                localStorage.setItem('digggin-tutorial-shown', 'true');
            }
        }, 2000);
    }

    /**
     * Show tutorial for first-time users
     */
    showTutorial() {
        const tutorial = document.createElement('div');
        tutorial.className = 'tutorial-overlay';
        tutorial.innerHTML = `
            <div class="tutorial-content">
                <h3>Welcome to DIGGGIN 3D!</h3>
                <p>🎵 Browse ${this.dataProcessor.getStats().totalRecords} records in 3D</p>
                <p>🖱️ Click and drag to navigate the scene</p>
                <p>🔍 Use filters to find specific genres or moods</p>
                <p>📀 Click on records to see details</p>
                <p>⌨️ Press '?' for keyboard shortcuts</p>
                <button class="tutorial-btn" onclick="this.closest('.tutorial-overlay').remove()">
                    Start Exploring!
                </button>
            </div>
        `;
        
        document.body.appendChild(tutorial);
        
        // Add tutorial styles
        const style = document.createElement('style');
        style.textContent = `
            .tutorial-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 3000;
            }
            .tutorial-content {
                background: #1a1a1a;
                border: 2px solid #0084ff;
                border-radius: 12px;
                padding: 2rem;
                max-width: 400px;
                text-align: center;
                color: white;
            }
            .tutorial-content h3 {
                color: #0084ff;
                margin-bottom: 1rem;
            }
            .tutorial-content p {
                margin: 0.5rem 0;
                color: rgba(255,255,255,0.9);
            }
            .tutorial-btn {
                margin-top: 1.5rem;
                padding: 1rem 2rem;
                background: #0084ff;
                border: none;
                border-radius: 6px;
                color: white;
                font-size: 1rem;
                cursor: pointer;
                font-weight: bold;
            }
            .tutorial-btn:hover {
                background: #0066cc;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Update URL hash for deep linking
     * @param {Object} record - Record data
     */
    updateURLHash(record) {
        const hash = `#record-${record.id}`;
        if (window.location.hash !== hash) {
            window.history.pushState(null, '', hash);
        }
    }

    /**
     * Track analytics events
     * @param {string} event - Event name
     * @param {Object} data - Event data
     */
    trackEvent(event, data) {
        if (!this.config.enableAnalytics) return;
        
        // Could integrate with analytics service here
        console.log('Analytics event:', event, data);
    }

    /**
     * Track errors for debugging
     * @param {Error} error - Error object
     */
    trackError(error) {
        // Could integrate with error tracking service here
        console.error('Tracked error:', error);
    }

    /**
     * Get application status
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            isLoading: this.isLoading,
            recordCount: this.dataProcessor ? this.dataProcessor.records.length : 0,
            displayedRecords: this.recordManager ? this.recordManager.displayedRecords.length : 0,
            webglSupported: this.checkWebGLSupport()
        };
    }

    /**
     * Cleanup and dispose resources
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
    // Check for required dependencies
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        document.body.innerHTML = '<h1>Error: Three.js not loaded</h1><p>Please check your internet connection.</p>';
        return;
    }

    // Initialize app
    window.diggginApp = new DIGGGINApp();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.diggginApp) {
        window.diggginApp.dispose();
    }
});