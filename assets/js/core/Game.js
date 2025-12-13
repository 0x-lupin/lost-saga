// Game Core - Manages renderer, scene, camera, and game loop

import { Controls } from '../controls.js';
import { UI } from './UI.js';
import { SoundManager } from '../sounds/SoundManager.js';
import { registerAllSounds } from '../sounds/index.js';
import { MainMenu } from '../scenes/MainMenu.js';
import { Level1 } from '../levels/Level1.js';

export class Game {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.ui = null;
        this.sound = null;
        this.currentLevel = null;
        this.mainMenu = null;
        this.gameState = 'menu'; // 'menu', 'playing', 'paused'
        this.isRunning = false;
        this.clock = new THREE.Clock();
        
        this.setupRenderer();
        this.setupScene();
        this.setupCamera();
        this.setupLights();
        this.setupControls();
        this.ui = new UI();
        this.sound = new SoundManager();
        registerAllSounds(this.sound);
        this.setupUIEvents();
    }
    
    setupRenderer() {
        this.canvas = document.getElementById('game-canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        window.addEventListener('resize', () => this.onResize());
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.scene.fog = new THREE.Fog(0x1a1a2e, 20, 80);
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            60, window.innerWidth / window.innerHeight, 0.1, 1000
        );
        this.camera.position.set(0, 10, 12);
        this.camera.lookAt(0, 0, 0);
    }
    
    setupLights() {
        const ambientLight = new THREE.AmbientLight(0x404080, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        this.scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0xff6600, 0.8, 30);
        pointLight.position.set(-5, 5, 5);
        this.scene.add(pointLight);
    }
    
    setupControls() {
        this.controls = new Controls();
    }
    
    setupUIEvents() {
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('fullscreen-btn').addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('next-btn').addEventListener('click', () => this.nextLevel());
        
        // Main menu events
        document.getElementById('menu-start-btn')?.addEventListener('click', () => this.onMenuStart());
        document.getElementById('menu-options-btn')?.addEventListener('click', () => this.showOptions());
        document.getElementById('menu-credits-btn')?.addEventListener('click', () => this.showCredits());
        document.getElementById('options-back-btn')?.addEventListener('click', () => this.hideOptions());
        document.getElementById('credits-back-btn')?.addEventListener('click', () => this.hideCredits());
        document.getElementById('menu-btn')?.addEventListener('click', () => this.returnToMenu());
        
        // Volume sliders
        document.getElementById('music-volume')?.addEventListener('input', (e) => {
            this.sound.setMusicVolume(e.target.value / 100);
        });
        document.getElementById('sfx-volume')?.addEventListener('input', (e) => {
            this.sound.setSfxVolume(e.target.value / 100);
        });
    }
    
    showMainMenu() {
        this.gameState = 'menu';
        this.clearScene();
        this.setupLights();
        
        document.getElementById('main-menu-screen').classList.remove('hidden');
        document.getElementById('main-menu-screen').classList.remove('fade-out');
        document.getElementById('main-menu-buttons').classList.remove('hidden');
        document.getElementById('options-panel').classList.add('hidden');
        document.getElementById('credits-panel').classList.add('hidden');
        document.getElementById('ui-overlay').classList.add('hidden');
        
        this.mainMenu = new MainMenu(this);
        this.mainMenu.init();
        this.isRunning = true;
    }
    
    onMenuStart() {
        // Initialize audio on user interaction
        this.sound.init();
        this.sound.resume();
        this.sound.play('hit');
        this.startLevel1();
    }
    
    startLevel1() {
        this.gameState = 'playing';
        this.clearScene();
        this.setupLights();
        
        document.getElementById('main-menu-screen').classList.add('hidden');
        document.getElementById('ui-overlay').classList.remove('hidden');
        
        this.loadLevel(Level1);
        this.isRunning = true;
        this.clock.start();
        if (this.currentLevel) {
            this.currentLevel.onStart();
        }
    }
    
    clearScene() {
        // Properly destroy current scene objects
        if (this.mainMenu) {
            this.mainMenu.destroy();
            this.mainMenu = null;
        }
        if (this.currentLevel) {
            this.currentLevel.destroy();
            this.currentLevel = null;
        }
        
        // Remove all objects from scene
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
    }
    
    showOptions() {
        document.getElementById('options-panel').classList.remove('hidden');
        document.getElementById('main-menu-buttons').classList.add('hidden');
    }
    
    hideOptions() {
        document.getElementById('options-panel').classList.add('hidden');
        document.getElementById('main-menu-buttons').classList.remove('hidden');
    }
    
    showCredits() {
        document.getElementById('credits-panel').classList.remove('hidden');
        document.getElementById('main-menu-buttons').classList.add('hidden');
    }
    
    hideCredits() {
        document.getElementById('credits-panel').classList.add('hidden');
        document.getElementById('main-menu-buttons').classList.remove('hidden');
    }
    
    returnToMenu() {
        this.sound.fadeOutMusic(0.5);
        this.ui.hideGameOver();
        this.ui.hideLevelComplete();
        this.showMainMenu();
    }
    
    nextLevel() {
        this.ui.hideLevelComplete();
        // For now, restart current level (Level 2 can be added later)
        if (this.currentLevel) {
            this.currentLevel.restart();
        }
        this.isRunning = true;
    }
    
    loadLevel(LevelClass) {
        // Note: clearScene() should be called before this to properly cleanup
        this.currentLevel = new LevelClass(this);
        this.currentLevel.init();
    }
    
    start() {
        this.showMainMenu();
        this.animate();
    }
    
    restartGame() {
        if (this.currentLevel) {
            this.currentLevel.restart();
        }
        this.ui.hideGameOver();
        this.isRunning = true;
    }
    
    toggleFullscreen() {
        const container = document.getElementById('game-container');
        if (!document.fullscreenElement) {
            if (container.requestFullscreen) container.requestFullscreen();
            else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
            else if (container.msRequestFullscreen) container.msRequestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        }
    }
    
    gameOver(score) {
        this.isRunning = false;
        this.sound.play('gameOver');
        this.sound.fadeOutMusic(1);
        this.ui.showGameOver(score);
    }
    
    levelComplete(score) {
        this.isRunning = false;
        this.sound.play('levelComplete');
        this.sound.fadeOutMusic(1);
        this.ui.showLevelComplete(score);
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = Math.min(this.clock.getDelta(), 0.1);
        
        if (this.isRunning) {
            if (this.gameState === 'menu' && this.mainMenu) {
                this.mainMenu.update(delta);
            } else if (this.gameState === 'playing' && this.currentLevel) {
                this.currentLevel.update(delta);
            }
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}
