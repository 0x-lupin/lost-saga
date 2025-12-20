// Camera Controller - Lost Saga
// Provides camera follow, shake, and mode functionality

export class CameraController {
    constructor(camera) {
        this.camera = camera;
        this.target = null;
        
        // Follow settings
        this.offset = { x: 0, y: 10, z: 12 };
        this.heightFactor = 0.5;
        this.smoothing = 1.0; // 1.0 = instant, lower = smoother
        this.lookAtOffset = { x: 0, y: 1, z: 0 }; // Offset for look target
        
        // Shake settings
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.shakeTimer = 0;
        this.shakeDecay = true;
        this.shakeOffset = { x: 0, y: 0 };
        
        // Mode: 'follow', 'fixed', 'cinematic'
        this.mode = 'follow';
        
        // Fixed mode settings
        this.fixedPosition = null;
        this.fixedLookAt = null;
        
        // Cinematic mode settings
        this.cinematicPath = [];
        this.cinematicProgress = 0;
        this.cinematicSpeed = 1.0;
        this.onCinematicComplete = null;
    }
    
    // === CONFIGURATION ===
    
    /**
     * Set the target to follow
     * @param {Object} target - Object with position property (e.g., player.mesh)
     */
    setTarget(target) {
        this.target = target;
    }
    
    /**
     * Set camera offset from target
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    setOffset(x, y, z) {
        this.offset.x = x;
        this.offset.y = y;
        this.offset.z = z;
    }
    
    /**
     * Configure follow behavior
     * @param {Object} config - { offset, heightFactor, smoothing, lookAtOffset }
     */
    configure(config) {
        if (config.offset) {
            this.offset = { ...this.offset, ...config.offset };
        }
        if (config.heightFactor !== undefined) {
            this.heightFactor = config.heightFactor;
        }
        if (config.smoothing !== undefined) {
            this.smoothing = config.smoothing;
        }
        if (config.lookAtOffset) {
            this.lookAtOffset = { ...this.lookAtOffset, ...config.lookAtOffset };
        }
    }
    
    // === MODE SWITCHING ===
    
    /**
     * Set camera mode
     * @param {'follow'|'fixed'|'cinematic'} mode 
     */
    setMode(mode) {
        this.mode = mode;
    }
    
    /**
     * Start following a target
     * @param {Object} target - Object with position property
     * @param {Object} offset - Optional { x, y, z }
     */
    follow(target, offset = null) {
        this.target = target;
        if (offset) {
            this.offset = { ...this.offset, ...offset };
        }
        this.mode = 'follow';
    }
    
    /**
     * Set fixed camera position and look target
     * @param {Object} position - { x, y, z }
     * @param {Object} lookAt - { x, y, z }
     */
    setFixed(position, lookAt) {
        this.fixedPosition = { ...position };
        this.fixedLookAt = { ...lookAt };
        this.mode = 'fixed';
    }
    
    /**
     * Play a cinematic camera path
     * @param {Array} path - Array of { position: {x,y,z}, lookAt: {x,y,z}, duration: number }
     * @param {Function} onComplete - Callback when cinematic ends
     */
    playCinematic(path, onComplete = null) {
        this.cinematicPath = path;
        this.cinematicProgress = 0;
        this.onCinematicComplete = onComplete;
        this.mode = 'cinematic';
    }
    
    // === SCREEN SHAKE ===
    
    /**
     * Trigger camera shake
     * @param {number} intensity - Shake magnitude (default 0.5)
     * @param {number} duration - Duration in seconds (default 0.3)
     * @param {boolean} decay - Whether to decay intensity over time (default true)
     */
    shake(intensity = 0.5, duration = 0.3, decay = true) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
        this.shakeTimer = 0;
        this.shakeDecay = decay;
    }
    
    /**
     * Stop any active shake
     */
    stopShake() {
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.shakeOffset = { x: 0, y: 0 };
    }
    
    // === UPDATE ===
    
    /**
     * Update camera - call each frame
     * @param {number} delta - Time delta in seconds
     */
    update(delta) {
        // Clear shake offset
        this.shakeOffset = { x: 0, y: 0 };
        
        // Update based on mode
        switch (this.mode) {
            case 'follow':
                this.updateFollow(delta);
                break;
            case 'fixed':
                this.updateFixed(delta);
                break;
            case 'cinematic':
                this.updateCinematic(delta);
                break;
        }
        
        // Apply shake on top of calculated position
        this.updateShake(delta);
    }
    
    updateFollow(delta) {
        if (!this.target) return;
        
        // Get target position
        const targetPos = this.target.position || this.target;
        
        // Calculate desired camera position
        const desiredX = targetPos.x + this.offset.x;
        const desiredY = this.offset.y + targetPos.y * this.heightFactor;
        const desiredZ = targetPos.z + this.offset.z;
        
        // Apply smoothing (lerp)
        const lerpFactor = Math.min(1, this.smoothing * delta * 10);
        
        if (this.smoothing >= 1) {
            // Instant follow
            this.camera.position.x = desiredX;
            this.camera.position.y = desiredY;
            this.camera.position.z = desiredZ;
        } else {
            // Smooth follow
            this.camera.position.x += (desiredX - this.camera.position.x) * lerpFactor;
            this.camera.position.y += (desiredY - this.camera.position.y) * lerpFactor;
            this.camera.position.z += (desiredZ - this.camera.position.z) * lerpFactor;
        }
        
        // Look at target with offset
        this.camera.lookAt(
            targetPos.x + this.lookAtOffset.x,
            targetPos.y + this.lookAtOffset.y,
            targetPos.z + this.lookAtOffset.z
        );
    }
    
    updateFixed(delta) {
        if (this.fixedPosition) {
            this.camera.position.set(
                this.fixedPosition.x,
                this.fixedPosition.y,
                this.fixedPosition.z
            );
        }
        if (this.fixedLookAt) {
            this.camera.lookAt(
                this.fixedLookAt.x,
                this.fixedLookAt.y,
                this.fixedLookAt.z
            );
        }
    }
    
    updateCinematic(delta) {
        if (this.cinematicPath.length === 0) {
            this.completeCinematic();
            return;
        }
        
        this.cinematicProgress += delta;
        
        // Calculate total duration
        let totalDuration = 0;
        for (const segment of this.cinematicPath) {
            totalDuration += segment.duration || 1;
        }
        
        // Check if complete
        if (this.cinematicProgress >= totalDuration) {
            this.completeCinematic();
            return;
        }
        
        // Find current segment
        let elapsed = 0;
        let currentSegment = null;
        let nextSegment = null;
        let segmentProgress = 0;
        
        for (let i = 0; i < this.cinematicPath.length; i++) {
            const segment = this.cinematicPath[i];
            const dur = segment.duration || 1;
            
            if (this.cinematicProgress < elapsed + dur) {
                currentSegment = segment;
                nextSegment = this.cinematicPath[i + 1] || segment;
                segmentProgress = (this.cinematicProgress - elapsed) / dur;
                break;
            }
            elapsed += dur;
        }
        
        if (!currentSegment) {
            this.completeCinematic();
            return;
        }
        
        // Ease function (smooth step)
        const ease = segmentProgress * segmentProgress * (3 - 2 * segmentProgress);
        
        // Interpolate position
        this.camera.position.x = this.lerp(currentSegment.position.x, nextSegment.position.x, ease);
        this.camera.position.y = this.lerp(currentSegment.position.y, nextSegment.position.y, ease);
        this.camera.position.z = this.lerp(currentSegment.position.z, nextSegment.position.z, ease);
        
        // Interpolate look at
        const lookX = this.lerp(currentSegment.lookAt.x, nextSegment.lookAt.x, ease);
        const lookY = this.lerp(currentSegment.lookAt.y, nextSegment.lookAt.y, ease);
        const lookZ = this.lerp(currentSegment.lookAt.z, nextSegment.lookAt.z, ease);
        this.camera.lookAt(lookX, lookY, lookZ);
    }
    
    completeCinematic() {
        this.mode = 'follow';
        if (this.onCinematicComplete) {
            this.onCinematicComplete();
            this.onCinematicComplete = null;
        }
    }
    
    updateShake(delta) {
        if (this.shakeDuration <= 0) return;
        
        this.shakeTimer += delta;
        
        if (this.shakeTimer >= this.shakeDuration) {
            this.stopShake();
            return;
        }
        
        // Calculate current intensity
        let intensity = this.shakeIntensity;
        if (this.shakeDecay) {
            const progress = this.shakeTimer / this.shakeDuration;
            intensity *= (1 - progress);
        }
        
        // Generate random offset
        this.shakeOffset.x = (Math.random() - 0.5) * 2 * intensity;
        this.shakeOffset.y = (Math.random() - 0.5) * 2 * intensity;
        
        // Apply offset to camera
        this.camera.position.x += this.shakeOffset.x;
        this.camera.position.y += this.shakeOffset.y;
    }
    
    // === UTILITIES ===
    
    lerp(a, b, t) {
        return a + (b - a) * t;
    }
    
    /**
     * Get current camera position
     * @returns {Object} { x, y, z }
     */
    getPosition() {
        return {
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z
        };
    }
    
    /**
     * Check if camera is currently shaking
     * @returns {boolean}
     */
    isShaking() {
        return this.shakeDuration > 0 && this.shakeTimer < this.shakeDuration;
    }
}
