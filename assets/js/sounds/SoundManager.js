// Sound Manager - Lost Saga
// Scalable Web Audio API sound system with registry pattern

export class SoundManager {
    constructor() {
        this.context = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.currentMusic = null;
        this.currentMusicName = null;
        
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.muted = false;
        
        // Registries - sounds register themselves
        this.sfx = {};
        this.music = {};
    }
    
    init() {
        if (this.context) return;
        
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        
        this.musicGain = this.context.createGain();
        this.musicGain.gain.value = this.musicVolume;
        this.musicGain.connect(this.context.destination);
        
        this.sfxGain = this.context.createGain();
        this.sfxGain.gain.value = this.sfxVolume;
        this.sfxGain.connect(this.context.destination);
    }
    
    resume() {
        if (this.context?.state === 'suspended') {
            this.context.resume();
        }
    }
    
    /**
     * Register a sound effect
     * @param {string} name - Sound identifier
     * @param {Function} playFn - Function(ctx, output, pitch) that plays the sound
     */
    registerSfx(name, playFn) {
        this.sfx[name] = playFn;
    }
    
    /**
     * Register background music
     * @param {string} name - Music identifier
     * @param {Object} musicModule - { play: Function(ctx, output), stop: Function(state) }
     */
    registerMusic(name, musicModule) {
        this.music[name] = musicModule;
    }
    
    /**
     * Play a registered sound effect
     */
    play(name, options = {}) {
        if (!this.context || this.muted) return;
        
        const playFn = this.sfx[name];
        if (!playFn) {
            console.warn(`SFX not registered: ${name}`);
            return;
        }
        
        const variation = options.variation ?? 0;
        const pitch = 1 + (Math.random() - 0.5) * 2 * variation;
        
        playFn(this.context, this.sfxGain, pitch);
    }
    
    playVaried(name, variation = 0.1) {
        this.play(name, { variation });
    }
    
    /**
     * Play registered background music
     */
    playMusic(name) {
        if (!this.context || this.muted) return;
        
        // Don't restart if same music already playing
        if (this.currentMusicName === name && this.currentMusic) return;
        
        this.stopMusic();
        
        const musicModule = this.music[name];
        if (!musicModule) {
            console.warn(`Music not registered: ${name}`);
            return;
        }
        
        this.currentMusic = musicModule.play(this.context, this.musicGain);
        this.currentMusicName = name;
    }
    
    stopMusic() {
        if (this.currentMusic && this.music[this.currentMusicName]) {
            this.music[this.currentMusicName].stop(this.currentMusic);
        }
        this.currentMusic = null;
        this.currentMusicName = null;
    }
    
    fadeOutMusic(duration = 1) {
        if (!this.musicGain || !this.currentMusic) return;
        
        const now = this.context.currentTime;
        this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
        this.musicGain.gain.linearRampToValueAtTime(0, now + duration);
        
        setTimeout(() => {
            this.stopMusic();
            this.musicGain.gain.value = this.musicVolume;
        }, duration * 1000);
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.musicGain) this.musicGain.gain.value = this.musicVolume;
    }
    
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        if (this.sfxGain) this.sfxGain.gain.value = this.sfxVolume;
    }
    
    toggleMute() {
        this.muted = !this.muted;
        if (this.musicGain) this.musicGain.gain.value = this.muted ? 0 : this.musicVolume;
        if (this.sfxGain) this.sfxGain.gain.value = this.muted ? 0 : this.sfxVolume;
        if (this.muted) this.stopMusic();
        return this.muted;
    }
    
    /** Check if SFX is registered */
    hasSfx(name) {
        return !!this.sfx[name];
    }
    
    /** Check if music is registered */
    hasMusic(name) {
        return !!this.music[name];
    }
}
