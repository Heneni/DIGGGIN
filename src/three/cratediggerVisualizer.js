import * as THREE from 'three'

/**
 * Three.js visualization for the cratedigger experience
 * Creates an immersive 3D environment for browsing music/artwork
 */
export class CratediggerVisualizer {
  constructor(container) {
    this.container = container
    this.scene = null
    this.camera = null
    this.renderer = null
    this.records = []
    this.animationId = null
    this.mouse = new THREE.Vector2()
    this.raycaster = new THREE.Raycaster()
    this.selectedRecord = null
    this.onRecordSelect = null
    
    this.init()
    this.setupEventListeners()
  }

  /**
   * Initialize the Three.js scene
   */
  init() {
    // Scene setup
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x0a0a0a)
    
    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    )
    this.camera.position.set(0, 5, 10)
    this.camera.lookAt(0, 0, 0)

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    })
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.container.appendChild(this.renderer.domElement)

    // Lighting setup
    this.setupLighting()
    
    // Create crate environment
    this.createCrateEnvironment()
  }

  /**
   * Setup lighting for the scene
   */
  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3)
    this.scene.add(ambientLight)

    // Main spotlight
    const spotLight = new THREE.SpotLight(0xffffff, 1, 100)
    spotLight.position.set(10, 20, 10)
    spotLight.castShadow = true
    spotLight.shadow.mapSize.width = 2048
    spotLight.shadow.mapSize.height = 2048
    this.scene.add(spotLight)

    // Colored accent lights
    const redLight = new THREE.PointLight(0xff3030, 0.5, 20)
    redLight.position.set(-8, 3, 5)
    this.scene.add(redLight)

    const blueLight = new THREE.PointLight(0x3030ff, 0.5, 20)
    blueLight.position.set(8, 3, -5)
    this.scene.add(blueLight)
  }

  /**
   * Create the record crate environment
   */
  createCrateEnvironment() {
    // Create wooden crate
    const crateGeometry = new THREE.BoxGeometry(12, 3, 8)
    const crateMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x8B4513,
      transparent: true,
      opacity: 0.8
    })
    const crate = new THREE.Mesh(crateGeometry, crateMaterial)
    crate.position.y = -1
    crate.receiveShadow = true
    this.scene.add(crate)

    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(50, 50)
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -3
    floor.receiveShadow = true
    this.scene.add(floor)
  }

  /**
   * Add records to the scene based on data
   * @param {Array} data - Array of music/artwork data
   */
  addRecords(data) {
    // Clear existing records
    this.clearRecords()

    const recordsToShow = Math.min(data.length, 20) // Limit for performance
    
    for (let i = 0; i < recordsToShow; i++) {
      const item = data[i]
      this.createRecord(item, i, recordsToShow)
    }
  }

  /**
   * Create a single record visualization
   * @param {Object} item - Data item
   * @param {number} index - Index in array
   * @param {number} total - Total number of records
   */
  createRecord(item, index, total) {
    // Create record geometry
    const recordGeometry = new THREE.CylinderGeometry(1, 1, 0.05, 32)
    
    // Create material based on genre/mood
    const color = this.getColorFromMood(item.mood)
    const recordMaterial = new THREE.MeshPhongMaterial({ 
      color: color,
      shininess: 100,
      transparent: true,
      opacity: 0.9
    })
    
    const record = new THREE.Mesh(recordGeometry, recordMaterial)
    
    // Position records in a semi-circle
    const angle = (index / (total - 1)) * Math.PI - Math.PI / 2
    const radius = 8
    record.position.x = Math.cos(angle) * radius
    record.position.z = Math.sin(angle) * radius
    record.position.y = 0.5 + Math.random() * 0.5 // Slight height variation
    
    // Slight rotation for realism
    record.rotation.y = angle + Math.PI / 2
    record.rotation.x = (Math.random() - 0.5) * 0.2
    
    // Store data reference
    record.userData = item
    record.castShadow = true
    
    // Add hover glow effect
    const glowGeometry = new THREE.CylinderGeometry(1.1, 1.1, 0.1, 32)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0
    })
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    glow.position.copy(record.position)
    glow.position.y -= 0.05
    record.glow = glow
    
    this.scene.add(record)
    this.scene.add(glow)
    this.records.push(record)
  }

  /**
   * Get color based on mood
   * @param {string} mood - Mood string
   * @returns {number} Color hex value
   */
  getColorFromMood(mood) {
    const moodColors = {
      'euphoric': 0xff6b35,
      'calming': 0x4a90e2,
      'rebellious': 0xff3030,
      'lonely': 0x6a4c93,
      'wanderlust': 0xf7dc6f,
      'energetic': 0xff9500,
      'neutral': 0x666666
    }
    
    const moodKey = Object.keys(moodColors).find(key => 
      mood.toLowerCase().includes(key)
    )
    
    return moodColors[moodKey] || moodColors.neutral
  }

  /**
   * Clear all records from the scene
   */
  clearRecords() {
    this.records.forEach(record => {
      this.scene.remove(record)
      if (record.glow) {
        this.scene.remove(record.glow)
      }
      record.geometry.dispose()
      record.material.dispose()
    })
    this.records = []
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Mouse move for interaction
    this.container.addEventListener('mousemove', (event) => {
      const rect = this.container.getBoundingClientRect()
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    })

    // Click for selection
    this.container.addEventListener('click', (event) => {
      this.handleRecordSelection()
    })

    // Window resize
    window.addEventListener('resize', () => {
      this.handleResize()
    })
  }

  /**
   * Handle record selection via raycasting
   */
  handleRecordSelection() {
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersects = this.raycaster.intersectObjects(this.records)
    
    if (intersects.length > 0) {
      const selected = intersects[0].object
      this.selectRecord(selected)
      
      if (this.onRecordSelect) {
        this.onRecordSelect(selected.userData)
      }
    }
  }

  /**
   * Select a record and apply visual feedback
   * @param {THREE.Mesh} record - Selected record
   */
  selectRecord(record) {
    // Reset previous selection
    if (this.selectedRecord) {
      this.selectedRecord.scale.set(1, 1, 1)
      if (this.selectedRecord.glow) {
        this.selectedRecord.glow.material.opacity = 0
      }
    }
    
    // Apply selection effects
    this.selectedRecord = record
    record.scale.set(1.2, 1.2, 1.2)
    if (record.glow) {
      record.glow.material.opacity = 0.3
    }
  }

  /**
   * Set callback for record selection
   * @param {Function} callback - Callback function
   */
  setOnRecordSelect(callback) {
    this.onRecordSelect = callback
  }

  /**
   * Handle window resize
   */
  handleResize() {
    const width = this.container.clientWidth
    const height = this.container.clientHeight
    
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  /**
   * Animation loop
   */
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate())
    
    // Hover effects
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersects = this.raycaster.intersectObjects(this.records)
    
    // Reset all hovers
    this.records.forEach(record => {
      if (record !== this.selectedRecord) {
        record.scale.set(1, 1, 1)
        if (record.glow) {
          record.glow.material.opacity = 0
        }
      }
    })
    
    // Apply hover effect
    if (intersects.length > 0 && intersects[0].object !== this.selectedRecord) {
      const hovered = intersects[0].object
      hovered.scale.set(1.1, 1.1, 1.1)
      if (hovered.glow) {
        hovered.glow.material.opacity = 0.2
      }
    }
    
    // Gentle rotation for ambiance
    this.records.forEach((record, index) => {
      record.rotation.y += 0.005 + (index * 0.001)
    })
    
    this.renderer.render(this.scene, this.camera)
  }

  /**
   * Start the animation loop
   */
  start() {
    this.animate()
  }

  /**
   * Stop the animation and cleanup
   */
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    
    this.clearRecords()
    
    if (this.renderer) {
      this.renderer.dispose()
    }
  }
}