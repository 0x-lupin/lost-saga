// Game Core - Manages renderer, scene, camera, and game loop

import { Controls } from '../controls.js';

export class Game {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.currentLevel = null;
        this.isRunning = false;
        this.clock = new THREE.Clock();
        
        this.setupRenderer();
        this.setupScene();
        this.setupCamera();
        this.setupLights();
        this.setupControls();
        this.setupUI();
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
    
    setupUI() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('fullscreen-btn').addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('next-btn').addEventListener('click', () => this.nextLevel());
    }
    
    nextLevel() {
        document.getElementById('level-complete-screen').classList.add('hidden');
        // For now, restart current level (Level 2 can be added later)
        if (this.currentLevel) {
            this.currentLevel.restart();
        }
        this.isRunning = true;
    }
    
    loadLevel(LevelClass) {
        if (this.currentLevel) {
            this.currentLevel.destroy();
        }
        this.currentLevel = new LevelClass(this);
        this.currentLevel.init();
    }
    
    start() {
        this.animate();
    }
    
    startGame() {
        document.getElementById('start-screen').classList.add('hidden');
        this.isRunning = true;
        this.clock.start();
        if (this.currentLevel) {
            this.currentLevel.onStart();
        }
    }
    
    restartGame() {
        if (this.currentLevel) {
            this.currentLevel.restart();
        }
        document.getElementById('game-over-screen').classList.add('hidden');
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
        document.getElementById('final-score').textContent = score;
        document.getElementById('game-over-screen').classList.remove('hidden');
    }
    
    levelComplete(score) {
        this.isRunning = false;
        document.getElementById('level-score').textContent = score;
        document.getElementById('level-complete-screen').classList.remove('hidden');
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = Math.min(this.clock.getDelta(), 0.1);
        
        if (this.isRunning && this.currentLevel) {
            this.currentLevel.update(delta);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}
