/**
 * UI controls and interaction management for DIGGGIN 3D record store
 */

class ControlsManager {
    constructor(recordManager, sceneManager) {
        this.recordManager = recordManager;
        this.sceneManager = sceneManager;
        
        // State
        this.isInitialized = false;
        this.shortcuts = new Map();
        
        this.init();
    }

    /**
     * Initialize controls and event listeners
     */
    init() {
        this.setupKeyboardShortcuts();
        this.setupUIControls();
        this.setupAccessibility();
        this.isInitialized = true;
        
        console.log('Controls manager initialized');
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        // Define keyboard shortcuts
        this.shortcuts.set('Escape', () => this.clearSelection());
        this.shortcuts.set('r', () => this.randomizeView());
        this.shortcuts.set('f', () => this.focusSearch());
        this.shortcuts.set('c', () => this.clearFilters());
        this.shortcuts.set('1', () => this.filterByGenre('Psychedelic'));
        this.shortcuts.set('2', () => this.filterByGenre('Indie'));
        this.shortcuts.set('3', () => this.filterByGenre('Alternative Rock'));
        this.shortcuts.set('4', () => this.filterByGenre('Hip Hop'));
        
        // Add keyboard event listener
        document.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });
    }

    /**
     * Handle keydown events
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyDown(event) {
        // Ignore if typing in input fields
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
            return;
        }

        const key = event.key;
        if (this.shortcuts.has(key)) {
            event.preventDefault();
            this.shortcuts.get(key)();
        }
    }

    /**
     * Setup UI control event listeners
     */
    setupUIControls() {
        // Add action buttons
        this.addActionButtons();
        
        // Setup help tooltip
        this.setupHelpTooltip();
        
        // Setup responsive controls
        this.setupResponsiveControls();
    }

    /**
     * Add action buttons to the UI
     */
    addActionButtons() {
        const controlPanel = document.querySelector('.control-panel');
        if (!controlPanel) return;

        // Create action buttons container
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'action-buttons';
        actionsContainer.innerHTML = `
            <div class="button-group">
                <button id="random-btn" class="action-btn primary" title="Show random records (R)">
                    🎲 Random
                </button>
                <button id="clear-filters-btn" class="action-btn" title="Clear all filters (C)">
                    ✨ Clear Filters
                </button>
                <button id="help-btn" class="action-btn" title="Show keyboard shortcuts">
                    ❓ Help
                </button>
            </div>
        `;

        // Insert before stats
        const statsElement = controlPanel.querySelector('.stats');
        if (statsElement) {
            controlPanel.insertBefore(actionsContainer, statsElement);
        } else {
            controlPanel.appendChild(actionsContainer);
        }

        // Add event listeners
        document.getElementById('random-btn').addEventListener('click', () => {
            this.randomizeView();
        });

        document.getElementById('clear-filters-btn').addEventListener('click', () => {
            this.clearFilters();
        });

        document.getElementById('help-btn').addEventListener('click', () => {
            this.showHelpModal();
        });
    }

    /**
     * Setup help tooltip system
     */
    setupHelpTooltip() {
        // Add CSS for action buttons
        const style = document.createElement('style');
        style.textContent = `
            .action-buttons {
                margin: 1.5rem 0;
            }
            
            .button-group {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .action-btn {
                padding: 0.75rem 1rem;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                color: #fff;
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.3s ease;
                text-align: left;
            }
            
            .action-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.4);
            }
            
            .action-btn.primary {
                background: rgba(0, 132, 255, 0.2);
                border-color: rgba(0, 132, 255, 0.4);
            }
            
            .action-btn.primary:hover {
                background: rgba(0, 132, 255, 0.3);
                border-color: rgba(0, 132, 255, 0.6);
            }
            
            .help-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
            }
            
            .help-content {
                background: #1a1a1a;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                padding: 2rem;
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
                color: #fff;
            }
            
            .help-content h3 {
                margin-bottom: 1rem;
                color: #0084ff;
            }
            
            .shortcut-list {
                list-style: none;
                padding: 0;
            }
            
            .shortcut-item {
                display: flex;
                justify-content: space-between;
                padding: 0.5rem 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .shortcut-key {
                background: rgba(255, 255, 255, 0.1);
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-family: monospace;
                font-size: 0.8rem;
            }
            
            .close-btn {
                margin-top: 1rem;
                padding: 0.75rem 1.5rem;
                background: #0084ff;
                border: none;
                border-radius: 4px;
                color: #fff;
                cursor: pointer;
                font-size: 0.9rem;
            }
            
            .close-btn:hover {
                background: #0066cc;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Setup responsive controls for mobile/tablet
     */
    setupResponsiveControls() {
        // Touch gesture support for mobile
        if ('ontouchstart' in window) {
            this.setupTouchControls();
        }

        // Responsive layout adjustments
        this.setupResponsiveLayout();
    }

    /**
     * Setup touch controls for mobile devices
     */
    setupTouchControls() {
        const canvas = this.sceneManager.canvas;
        let touchStartTime = 0;

        canvas.addEventListener('touchstart', (event) => {
            touchStartTime = Date.now();
        });

        canvas.addEventListener('touchend', (event) => {
            const touchDuration = Date.now() - touchStartTime;
            
            // Quick tap for selection (less than 200ms)
            if (touchDuration < 200) {
                // Convert touch to mouse coordinates and trigger click
                const touch = event.changedTouches[0];
                const mouseEvent = new MouseEvent('click', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                canvas.dispatchEvent(mouseEvent);
            }
        });
    }

    /**
     * Setup responsive layout adjustments
     */
    setupResponsiveLayout() {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        
        const handleResponsive = (e) => {
            const controlPanel = document.querySelector('.control-panel');
            const recordDetails = document.querySelector('.record-details');
            
            if (e.matches) {
                // Mobile layout
                if (controlPanel) {
                    controlPanel.style.padding = '1rem';
                }
                if (recordDetails) {
                    recordDetails.style.padding = '1rem';
                }
            } else {
                // Desktop layout
                if (controlPanel) {
                    controlPanel.style.padding = '2rem';
                }
                if (recordDetails) {
                    recordDetails.style.padding = '2rem';
                }
            }
        };

        mediaQuery.addListener(handleResponsive);
        handleResponsive(mediaQuery);
    }

    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        // Add ARIA labels
        this.addAriaLabels();
        
        // Setup focus management
        this.setupFocusManagement();
        
        // Add screen reader announcements
        this.setupScreenReaderSupport();
    }

    /**
     * Add ARIA labels for accessibility
     */
    addAriaLabels() {
        const canvas = this.sceneManager.canvas;
        canvas.setAttribute('role', 'application');
        canvas.setAttribute('aria-label', '3D record store - use mouse or touch to browse records');
        canvas.setAttribute('tabindex', '0');

        // Add labels to form controls
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.setAttribute('aria-describedby', 'search-help');
            
            const helpText = document.createElement('div');
            helpText.id = 'search-help';
            helpText.className = 'sr-only';
            helpText.textContent = 'Search records by artist, song, genre, or keyword';
            searchInput.parentNode.appendChild(helpText);
        }
    }

    /**
     * Setup focus management for keyboard navigation
     */
    setupFocusManagement() {
        // Focus trap for modals
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                this.handleTabNavigation(event);
            }
        });
    }

    /**
     * Handle tab navigation
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleTabNavigation(event) {
        const modal = document.querySelector('.help-modal');
        if (modal) {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }

    /**
     * Setup screen reader support
     */
    setupScreenReaderSupport() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-announcements';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);

        // Add CSS for screen reader only content
        const style = document.createElement('style');
        style.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     */
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-announcements');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    // Action methods

    /**
     * Clear current selection
     */
    clearSelection() {
        this.sceneManager.setSelectedRecord(null);
        const recordDetails = document.getElementById('record-details');
        if (recordDetails) {
            recordDetails.innerHTML = `
                <h3>Select a Record</h3>
                <p>Click on a record to view details</p>
            `;
        }
        this.announceToScreenReader('Selection cleared');
    }

    /**
     * Show random records
     */
    randomizeView() {
        this.recordManager.getRandomSelection(50);
        this.announceToScreenReader('Showing random selection of records');
    }

    /**
     * Focus on search input
     */
    focusSearch() {
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.focus();
        }
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.recordManager.clearFilters();
        this.announceToScreenReader('All filters cleared');
    }

    /**
     * Filter by genre
     * @param {string} genre - Genre to filter by
     */
    filterByGenre(genre) {
        this.recordManager.filterByGenre(genre);
        this.announceToScreenReader(`Filtered to ${genre} genre`);
    }

    /**
     * Show help modal
     */
    showHelpModal() {
        const modal = document.createElement('div');
        modal.className = 'help-modal';
        modal.innerHTML = `
            <div class="help-content">
                <h3>Keyboard Shortcuts</h3>
                <ul class="shortcut-list">
                    <li class="shortcut-item">
                        <span>Navigate 3D scene</span>
                        <span class="shortcut-key">Mouse/Touch</span>
                    </li>
                    <li class="shortcut-item">
                        <span>Search records</span>
                        <span class="shortcut-key">F</span>
                    </li>
                    <li class="shortcut-item">
                        <span>Random selection</span>
                        <span class="shortcut-key">R</span>
                    </li>
                    <li class="shortcut-item">
                        <span>Clear filters</span>
                        <span class="shortcut-key">C</span>
                    </li>
                    <li class="shortcut-item">
                        <span>Clear selection</span>
                        <span class="shortcut-key">Esc</span>
                    </li>
                    <li class="shortcut-item">
                        <span>Psychedelic genre</span>
                        <span class="shortcut-key">1</span>
                    </li>
                    <li class="shortcut-item">
                        <span>Indie genre</span>
                        <span class="shortcut-key">2</span>
                    </li>
                    <li class="shortcut-item">
                        <span>Alt Rock genre</span>
                        <span class="shortcut-key">3</span>
                    </li>
                    <li class="shortcut-item">
                        <span>Hip Hop genre</span>
                        <span class="shortcut-key">4</span>
                    </li>
                </ul>
                <button class="close-btn" onclick="this.closest('.help-modal').remove()">
                    Close
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        // Focus the close button
        modal.querySelector('.close-btn').focus();

        // Close on escape key
        modal.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                modal.remove();
            }
        });

        // Close on backdrop click
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * Get current control state
     * @returns {Object} Current state
     */
    getState() {
        return {
            isInitialized: this.isInitialized,
            shortcuts: Array.from(this.shortcuts.keys())
        };
    }
}

// Export for use in other modules
window.ControlsManager = ControlsManager;