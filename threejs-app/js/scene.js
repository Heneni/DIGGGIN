/**
 * Three.js scene setup and management for DIGGGIN 3D record store
 */

class SceneManager {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.raycaster = null;
        this.mouse = new THREE.Vector2();
        
        // Scene objects
        this.crates = [];
        this.records = [];
        this.lights = [];
        
        // State
        this.selectedRecord = null;
        this.hoveredRecord = null;
        
        this.init();
        this.setupEventListeners();
    }

    /**
     * Initialize the Three.js scene
     */
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        this.scene.fog = new THREE.Fog(0x0a0a0a, 50, 200);

        // Create camera
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 15, 30);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Create controls
        this.controls = new THREE.OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 100;
        this.controls.target.set(0, 5, 0);

        // Create raycaster for mouse interaction
        this.raycaster = new THREE.Raycaster();

        // Setup lighting
        this.setupLighting();
        
        // Create environment
        this.createEnvironment();

        // Start render loop
        this.animate();
    }

    /**
     * Setup scene lighting
     */
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);

        // Main directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(10, 20, 10);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.1;
        mainLight.shadow.camera.far = 50;
        mainLight.shadow.camera.left = -20;
        mainLight.shadow.camera.right = 20;
        mainLight.shadow.camera.top = 20;
        mainLight.shadow.camera.bottom = -20;
        this.scene.add(mainLight);
        this.lights.push(mainLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0x4080ff, 0.3);
        fillLight.position.set(-10, 10, -10);
        this.scene.add(fillLight);
        this.lights.push(fillLight);

        // Point lights for atmosphere
        const pointLight1 = new THREE.PointLight(0xff6600, 0.5, 30);
        pointLight1.position.set(15, 8, 15);
        this.scene.add(pointLight1);
        this.lights.push(pointLight1);

        const pointLight2 = new THREE.PointLight(0x0066ff, 0.5, 30);
        pointLight2.position.set(-15, 8, -15);
        this.scene.add(pointLight2);
        this.lights.push(pointLight2);
    }

    /**
     * Create environment elements (floor, walls, etc.)
     */
    createEnvironment() {
        // Floor
        const floorGeometry = new THREE.PlaneGeometry(100, 100);
        const floorMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x1a1a1a,
            transparent: true,
            opacity: 0.8
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Grid
        const gridHelper = new THREE.GridHelper(100, 20, 0x444444, 0x222222);
        gridHelper.material.opacity = 0.3;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);

        // Create record crates
        this.createRecordCrates();
    }

    /**
     * Create record storage crates
     */
    createRecordCrates() {
        const crateGeometry = new THREE.BoxGeometry(8, 6, 12);
        const crateMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x654321,
            transparent: true,
            opacity: 0.7
        });

        // Create multiple crates in a grid
        for (let x = -20; x <= 20; x += 15) {
            for (let z = -20; z <= 20; z += 15) {
                const crate = new THREE.Mesh(crateGeometry, crateMaterial);
                crate.position.set(x, 3, z);
                crate.castShadow = true;
                crate.receiveShadow = true;
                this.scene.add(crate);
                this.crates.push(crate);
            }
        }
    }

    /**
     * Create a 3D record object
     * @param {Object} recordData - Record data
     * @param {THREE.Vector3} position - Position in 3D space
     * @returns {THREE.Group} Record 3D object
     */
    createRecord(recordData, position) {
        const recordGroup = new THREE.Group();
        recordGroup.userData = { recordData, originalPosition: position.clone() };

        // Record sleeve (album cover)
        const sleeveGeometry = new THREE.PlaneGeometry(3, 3);
        const sleeveMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x333333,
            transparent: true,
            opacity: 0.9
        });
        const sleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
        sleeve.castShadow = true;
        
        // Vinyl record (black disk)
        const vinylGeometry = new THREE.CylinderGeometry(1.4, 1.4, 0.1, 32);
        const vinylMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x111111,
            shininess: 30
        });
        const vinyl = new THREE.Mesh(vinylGeometry, vinylMaterial);
        vinyl.rotation.x = Math.PI / 2;
        vinyl.position.z = -0.05;
        vinyl.castShadow = true;

        // Record label (center)
        const labelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.11, 16);
        const labelMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x660000
        });
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.rotation.x = Math.PI / 2;
        label.position.z = -0.05;

        recordGroup.add(sleeve);
        recordGroup.add(vinyl);
        recordGroup.add(label);

        recordGroup.position.copy(position);
        recordGroup.scale.set(0.8, 0.8, 0.8);

        // Load album cover texture if available
        if (recordData.cover) {
            this.loadRecordTexture(recordData.cover, sleeve);
        }

        this.scene.add(recordGroup);
        this.records.push(recordGroup);

        return recordGroup;
    }

    /**
     * Load album cover texture
     * @param {string} imageUrl - Image URL
     * @param {THREE.Mesh} sleeve - Record sleeve mesh
     */
    loadRecordTexture(imageUrl, sleeve) {
        const loader = new THREE.TextureLoader();
        loader.crossOrigin = 'Anonymous';
        
        loader.load(
            imageUrl,
            (texture) => {
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                sleeve.material.map = texture;
                sleeve.material.color.setHex(0xffffff);
                sleeve.material.needsUpdate = true;
                sleeve.userData.textureLoaded = true;
            },
            undefined,
            (error) => {
                console.warn('Failed to load texture:', imageUrl, error);
                // Keep default color/texture
            }
        );
    }

    /**
     * Position records in crates
     * @param {Array} records - Array of record data
     */
    positionRecords(records) {
        // Clear existing records
        this.clearRecords();

        const recordsPerCrate = 20;
        let crateIndex = 0;
        let recordIndex = 0;

        records.forEach((recordData, index) => {
            if (recordIndex >= recordsPerCrate) {
                crateIndex++;
                recordIndex = 0;
            }

            if (crateIndex >= this.crates.length) {
                return; // Skip if we run out of crates
            }

            const crate = this.crates[crateIndex];
            const cratePosition = crate.position;
            
            // Position records within the crate
            const x = cratePosition.x + (recordIndex % 4 - 1.5) * 1.5;
            const y = cratePosition.y + 3.5;
            const z = cratePosition.z + (Math.floor(recordIndex / 4) - 2.5) * 1.2;

            const position = new THREE.Vector3(x, y, z);
            this.createRecord(recordData, position);

            recordIndex++;
        });

        console.log(`Positioned ${this.records.length} records in ${crateIndex + 1} crates`);
    }

    /**
     * Clear all records from the scene
     */
    clearRecords() {
        this.records.forEach(record => {
            this.scene.remove(record);
        });
        this.records = [];
        this.selectedRecord = null;
        this.hoveredRecord = null;
    }

    /**
     * Handle mouse movement for interaction
     * @param {MouseEvent} event - Mouse event
     */
    onMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.records, true);

        // Handle hover
        if (intersects.length > 0) {
            const intersectedRecord = intersects[0].object.parent;
            if (this.hoveredRecord !== intersectedRecord) {
                this.setHoveredRecord(intersectedRecord);
            }
        } else {
            this.setHoveredRecord(null);
        }
    }

    /**
     * Handle mouse click for selection
     * @param {MouseEvent} event - Mouse event
     */
    onMouseClick(event) {
        if (this.hoveredRecord) {
            this.setSelectedRecord(this.hoveredRecord);
        }
    }

    /**
     * Set hovered record
     * @param {THREE.Group} record - Record object
     */
    setHoveredRecord(record) {
        // Reset previous hovered record
        if (this.hoveredRecord) {
            this.hoveredRecord.scale.set(0.8, 0.8, 0.8);
        }

        this.hoveredRecord = record;

        // Highlight new hovered record
        if (this.hoveredRecord) {
            this.hoveredRecord.scale.set(0.9, 0.9, 0.9);
            this.canvas.style.cursor = 'pointer';
        } else {
            this.canvas.style.cursor = 'default';
        }
    }

    /**
     * Set selected record
     * @param {THREE.Group} record - Record object
     */
    setSelectedRecord(record) {
        // Reset previous selected record
        if (this.selectedRecord) {
            this.selectedRecord.scale.set(0.8, 0.8, 0.8);
        }

        this.selectedRecord = record;

        // Highlight selected record
        if (this.selectedRecord) {
            this.selectedRecord.scale.set(1.0, 1.0, 1.0);
            
            // Emit selection event
            const event = new CustomEvent('recordSelected', {
                detail: this.selectedRecord.userData.recordData
            });
            document.dispatchEvent(event);
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.onMouseClick(e));

        // Resize handling
        window.addEventListener('resize', () => this.onWindowResize());
    }

    /**
     * Handle window resize
     */
    onWindowResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    /**
     * Animation loop
     */
    animate() {
        requestAnimationFrame(() => this.animate());

        // Update controls
        this.controls.update();

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Clean up resources
     */
    dispose() {
        this.controls.dispose();
        this.renderer.dispose();
    }
}

// Export for use in other modules
window.SceneManager = SceneManager;