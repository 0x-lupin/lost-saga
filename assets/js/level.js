// Level Module - Lost Saga

export class Level {
    constructor(scene) {
        this.scene = scene;
        this.platforms = [];
        this.arenaBounds = { minX: -18, maxX: 18, minZ: -8, maxZ: 8 };
    }
    
    create() {
        this.createGround();
        this.createPlatforms();
        this.createDecorations();
    }
    
    createGround() {
        const groundGeo = new THREE.BoxGeometry(40, 1, 20);
        const groundMat = new THREE.MeshStandardMaterial({ 
            color: 0x3d5a80,
            roughness: 0.8
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.position.y = -0.5;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        this.platforms.push({ 
            mesh: ground, 
            bounds: { minX: -20, maxX: 20, minZ: -10, maxZ: 10, y: 0 }
        });
    }
    
    createPlatforms() {
        const platformData = [
            { x: -12, y: 3, z: 0, w: 6, h: 0.5, d: 4 },
            { x: 12, y: 3, z: 0, w: 6, h: 0.5, d: 4 },
            { x: 0, y: 5, z: -5, w: 8, h: 0.5, d: 4 },
            { x: -8, y: 7, z: 3, w: 5, h: 0.5, d: 3 },
            { x: 8, y: 7, z: 3, w: 5, h: 0.5, d: 3 },
        ];
        
        platformData.forEach(p => {
            const geo = new THREE.BoxGeometry(p.w, p.h, p.d);
            const mat = new THREE.MeshStandardMaterial({ 
                color: 0x5c7a99,
                roughness: 0.6
            });
            const platform = new THREE.Mesh(geo, mat);
            platform.position.set(p.x, p.y, p.z);
            platform.castShadow = true;
            platform.receiveShadow = true;
            this.scene.add(platform);
            
            this.platforms.push({
                mesh: platform,
                bounds: {
                    minX: p.x - p.w/2, maxX: p.x + p.w/2,
                    minZ: p.z - p.d/2, maxZ: p.z + p.d/2,
                    y: p.y + p.h/2
                }
            });
        });
    }
    
    createDecorations() {
        // Pillars
        for (let i = 0; i < 6; i++) {
            const pillarGeo = new THREE.CylinderGeometry(0.5, 0.6, 4, 8);
            const pillarMat = new THREE.MeshStandardMaterial({ color: 0x4a6fa5 });
            const pillar = new THREE.Mesh(pillarGeo, pillarMat);
            pillar.position.set(
                (i % 2 === 0 ? -15 : 15),
                2,
                -8 + (Math.floor(i / 2) * 8)
            );
            pillar.castShadow = true;
            this.scene.add(pillar);
        }
    }
    
    getPlatforms() {
        return this.platforms;
    }
    
    getArenaBounds() {
        return this.arenaBounds;
    }
    
    getEnemySpawnPositions() {
        return [
            { x: -10, z: 0 },
            { x: 10, z: 0 },
            { x: 0, z: -5 },
            { x: -5, z: 3 },
            { x: 5, z: 3 }
        ];
    }
}
