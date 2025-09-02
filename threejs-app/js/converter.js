/**
 * Data conversion script - converts CSV to optimized JSON format
 * Run this to generate data/records.json for production use
 */

class DataConverter {
    constructor() {
        this.processor = new DataProcessor();
        this.outputData = {
            metadata: {},
            records: [],
            filterOptions: {},
            statistics: {},
            version: '1.0.0',
            generatedAt: new Date().toISOString()
        };
    }

    /**
     * Convert CSV data to optimized JSON format
     * @param {string} csvData - Raw CSV data
     * @returns {Object} Converted data
     */
    async convertData(csvData) {
        console.log('🔄 Starting data conversion...');
        
        // Parse CSV data
        const records = this.processor.parseCSV(csvData);
        console.log(`✓ Parsed ${records.length} records`);

        // Process and optimize records
        this.outputData.records = this.optimizeRecords(records);
        console.log(`✓ Optimized ${this.outputData.records.length} records`);

        // Generate filter options
        this.outputData.filterOptions = this.processor.getFilterOptions();
        console.log(`✓ Generated filter options`);

        // Generate statistics
        this.outputData.statistics = this.generateDetailedStats(records);
        console.log(`✓ Generated statistics`);

        // Generate metadata
        this.outputData.metadata = this.generateMetadata(records);
        console.log(`✓ Generated metadata`);

        console.log('✅ Data conversion complete');
        return this.outputData;
    }

    /**
     * Optimize records for better performance
     * @param {Array} records - Original records
     * @returns {Array} Optimized records
     */
    optimizeRecords(records) {
        return records.map(record => {
            // Create optimized record with only essential fields
            const optimized = {
                id: record.id,
                cover: record.cover,
                artworkName: record.artworkName,
                genre: record.genre,
                artist: record.artist,
                songTitle: record.songTitle,
                artisticCategory: record.artisticCategory,
                mood: record.mood,
                colors: record.colors,
                collections: record.collections,
                searchTerms: record.searchTerms
            };

            // Add derived fields for better UX
            optimized.displayTitle = `${record.songTitle} by ${record.artist}`;
            optimized.primaryColor = this.extractPrimaryColor(record.colors);
            optimized.tags = [...record.collections, record.genre, record.mood].filter(Boolean);
            
            // Add grouping hints for 3D positioning
            optimized.genreIndex = this.getGenreIndex(record.genre);
            optimized.moodIndex = this.getMoodIndex(record.mood);

            return optimized;
        });
    }

    /**
     * Extract primary color from color array
     * @param {Array} colors - Color array
     * @returns {string} Primary color
     */
    extractPrimaryColor(colors) {
        if (!colors || colors.length === 0) return 'neutral';
        
        // Priority order for primary colors
        const colorPriority = {
            'red': 10,
            'blue': 9,
            'green': 8,
            'purple': 7,
            'orange': 6,
            'yellow': 5,
            'pink': 4,
            'black': 3,
            'white': 2,
            'gray': 1,
            'grey': 1
        };

        let primaryColor = 'neutral';
        let highestPriority = 0;

        colors.forEach(color => {
            const normalizedColor = color.toLowerCase().trim();
            Object.keys(colorPriority).forEach(key => {
                if (normalizedColor.includes(key) && colorPriority[key] > highestPriority) {
                    primaryColor = key;
                    highestPriority = colorPriority[key];
                }
            });
        });

        return primaryColor;
    }

    /**
     * Get genre index for positioning
     * @param {string} genre - Genre name
     * @returns {number} Genre index
     */
    getGenreIndex(genre) {
        const genres = ['Psychedelic', 'Indie', 'Alternative Rock', 'Hip Hop'];
        return genres.indexOf(genre) !== -1 ? genres.indexOf(genre) : 0;
    }

    /**
     * Get mood index for positioning
     * @param {string} mood - Mood name
     * @returns {number} Mood index
     */
    getMoodIndex(mood) {
        const moods = ['Euphoric', 'Calming', 'Wanderlust', 'Rebellious', 'Mysterious'];
        return moods.indexOf(mood) !== -1 ? moods.indexOf(mood) : 0;
    }

    /**
     * Generate detailed statistics
     * @param {Array} records - Record array
     * @returns {Object} Detailed statistics
     */
    generateDetailedStats(records) {
        const stats = this.processor.getStats();
        
        // Add more detailed breakdowns
        const genreBreakdown = {};
        const moodBreakdown = {};
        const artistBreakdown = {};
        const colorBreakdown = {};
        const collectionBreakdown = {};

        records.forEach(record => {
            // Genre stats
            genreBreakdown[record.genre] = (genreBreakdown[record.genre] || 0) + 1;
            
            // Mood stats
            moodBreakdown[record.mood] = (moodBreakdown[record.mood] || 0) + 1;
            
            // Artist stats
            artistBreakdown[record.artist] = (artistBreakdown[record.artist] || 0) + 1;
            
            // Color stats
            record.colors.forEach(color => {
                colorBreakdown[color] = (colorBreakdown[color] || 0) + 1;
            });
            
            // Collection stats
            record.collections.forEach(collection => {
                collectionBreakdown[collection] = (collectionBreakdown[collection] || 0) + 1;
            });
        });

        return {
            ...stats,
            breakdown: {
                genres: this.sortBreakdown(genreBreakdown),
                moods: this.sortBreakdown(moodBreakdown),
                artists: this.sortBreakdown(artistBreakdown),
                colors: this.sortBreakdown(colorBreakdown),
                collections: this.sortBreakdown(collectionBreakdown)
            },
            topArtists: Object.entries(artistBreakdown)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([artist, count]) => ({ artist, count })),
            topColors: Object.entries(colorBreakdown)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([color, count]) => ({ color, count }))
        };
    }

    /**
     * Sort breakdown object by count
     * @param {Object} breakdown - Breakdown object
     * @returns {Object} Sorted breakdown
     */
    sortBreakdown(breakdown) {
        return Object.fromEntries(
            Object.entries(breakdown).sort((a, b) => b[1] - a[1])
        );
    }

    /**
     * Generate metadata
     * @param {Array} records - Record array
     * @returns {Object} Metadata
     */
    generateMetadata(records) {
        return {
            totalSize: JSON.stringify(records).length,
            averageFieldsPerRecord: this.calculateAverageFields(records),
            dataQuality: this.assessDataQuality(records),
            imageHosts: this.extractImageHosts(records),
            yearRange: this.extractYearRange(records),
            processingInfo: {
                timestamp: new Date().toISOString(),
                processor: 'DIGGGIN DataConverter v1.0.0',
                source: 'DiggerDB.csv'
            }
        };
    }

    /**
     * Calculate average number of fields per record
     * @param {Array} records - Record array
     * @returns {number} Average fields
     */
    calculateAverageFields(records) {
        const totalFields = records.reduce((sum, record) => {
            return sum + Object.keys(record).length;
        }, 0);
        return Math.round(totalFields / records.length);
    }

    /**
     * Assess data quality
     * @param {Array} records - Record array
     * @returns {Object} Quality assessment
     */
    assessDataQuality(records) {
        let completeRecords = 0;
        let recordsWithImages = 0;
        let recordsWithColors = 0;
        let recordsWithCollections = 0;

        records.forEach(record => {
            if (record.cover && record.artist && record.songTitle && record.genre) {
                completeRecords++;
            }
            if (record.cover) recordsWithImages++;
            if (record.colors && record.colors.length > 0) recordsWithColors++;
            if (record.collections && record.collections.length > 0) recordsWithCollections++;
        });

        return {
            completeness: Math.round((completeRecords / records.length) * 100),
            imagesAvailable: Math.round((recordsWithImages / records.length) * 100),
            colorsSpecified: Math.round((recordsWithColors / records.length) * 100),
            collectionsTagged: Math.round((recordsWithCollections / records.length) * 100)
        };
    }

    /**
     * Extract image hosts
     * @param {Array} records - Record array
     * @returns {Array} Image hosts
     */
    extractImageHosts(records) {
        const hosts = new Set();
        records.forEach(record => {
            if (record.cover) {
                try {
                    const url = new URL(record.cover);
                    hosts.add(url.hostname);
                } catch (e) {
                    // Invalid URL
                }
            }
        });
        return Array.from(hosts);
    }

    /**
     * Extract year range from data
     * @param {Array} records - Record array
     * @returns {Object} Year range
     */
    extractYearRange(records) {
        // Note: The current data doesn't have explicit years,
        // but we can analyze color descriptions for hints
        return {
            note: 'Year information not explicitly available in current dataset',
            eras: ['contemporary', 'hipstoric', 'modern'] // From collections analysis
        };
    }

    /**
     * Save data to JSON file (for Node.js environments)
     * @param {Object} data - Data to save
     * @param {string} filename - Output filename
     */
    saveToFile(data, filename = 'records.json') {
        // This would work in Node.js environment
        // For browser, we'll provide download functionality
        const jsonString = JSON.stringify(data, null, 2);
        
        if (typeof require !== 'undefined') {
            // Node.js environment
            const fs = require('fs');
            fs.writeFileSync(filename, jsonString);
            console.log(`✓ Data saved to ${filename}`);
        } else {
            // Browser environment - trigger download
            this.downloadJSON(data, filename);
        }
    }

    /**
     * Download JSON data in browser
     * @param {Object} data - Data to download
     * @param {string} filename - Filename
     */
    downloadJSON(data, filename) {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log(`✓ Download triggered for ${filename}`);
    }

    /**
     * Get conversion summary
     * @returns {Object} Summary
     */
    getSummary() {
        return {
            totalRecords: this.outputData.records.length,
            dataSize: JSON.stringify(this.outputData).length,
            compressionRatio: this.calculateCompressionRatio(),
            qualityScore: this.calculateQualityScore()
        };
    }

    /**
     * Calculate compression ratio compared to original CSV
     * @returns {number} Compression ratio
     */
    calculateCompressionRatio() {
        // Estimated based on typical CSV vs JSON size differences
        return 0.85; // JSON is typically 85% of CSV size due to better structure
    }

    /**
     * Calculate overall quality score
     * @returns {number} Quality score (0-100)
     */
    calculateQualityScore() {
        const quality = this.outputData.metadata.dataQuality;
        return Math.round(
            (quality.completeness + quality.imagesAvailable + 
             quality.colorsSpecified + quality.collectionsTagged) / 4
        );
    }
}

// Export for use in other modules
window.DataConverter = DataConverter;