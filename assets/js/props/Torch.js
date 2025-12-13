// Torch Prop - Lost Saga
// Reusable torch with light and collision

export function createTorch(scene, x, z) {
    const torch = new THREE.Group();
    
    // Base
    const baseGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.15, 8);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.075;
    base.castShadow = true;
    base.receiveShadow = true;
    torch.add(base);
    
    // Pole
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.12, 2.5, 6);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 1.4;
    pole.castShadow = true;
    torch.add(pole);
    
    // Flame holder
    const holderGeo = new THREE.CylinderGeometry(0.15, 0.1, 0.3, 6);
    const holderMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5 });
    const holder = new THREE.Mesh(holderGeo, holderMat);
    holder.position.y = 2.8;
    holder.castShadow = true;
    torch.add(holder);
    
    // Flame (glowing)
    const flameGeo = new THREE.ConeGeometry(0.12, 0.4, 6);
    const flameMat = new THREE.MeshStandardMaterial({ 
        color: 0xff6600,
        emissive: 0xff4400,
        emissiveIntensity: 1
    });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.y = 3.1;
    torch.add(flame);
    
    // Point light
    const light = new THREE.PointLight(0xff6600, 0.5, 8);
    light.position.y = 3;
    torch.add(light);
    
    torch.position.set(x, 0, z);
    scene.add(torch);
    
    // Return collision data
    return { x, z, radius: 0.3 };
}
