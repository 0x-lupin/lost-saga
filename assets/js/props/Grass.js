// Grass Prop - Lost Saga
// Decorative grass patch (no collision)

export function createGrass(scene, x, z) {
    const grassMat = new THREE.MeshStandardMaterial({ 
        color: 0x4a7c4a, 
        side: THREE.DoubleSide 
    });
    
    for (let i = 0; i < 3; i++) {
        const bladeGeo = new THREE.PlaneGeometry(0.1, 0.4);
        const blade = new THREE.Mesh(bladeGeo, grassMat);
        blade.position.set(
            x + (Math.random() - 0.5) * 0.3,
            0.2,
            z + (Math.random() - 0.5) * 0.3
        );
        blade.rotation.y = Math.random() * Math.PI;
        blade.rotation.x = -0.2;
        scene.add(blade);
    }
    
    // No collision for grass
    return null;
}
