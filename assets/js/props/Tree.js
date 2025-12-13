// Tree Prop - Lost Saga
// Reusable pine tree with collision

export function createTree(scene, x, z) {
    const tree = new THREE.Group();
    
    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 3, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.5;
    trunk.castShadow = true;
    tree.add(trunk);
    
    // Foliage layers
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x2d5a2d, roughness: 0.8 });
    
    const foliage1 = new THREE.Mesh(new THREE.ConeGeometry(2, 3, 8), foliageMat);
    foliage1.position.y = 4;
    foliage1.castShadow = true;
    tree.add(foliage1);
    
    const foliage2 = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2.5, 8), foliageMat);
    foliage2.position.y = 5.5;
    foliage2.castShadow = true;
    tree.add(foliage2);
    
    const foliage3 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 8), foliageMat);
    foliage3.position.y = 6.8;
    foliage3.castShadow = true;
    tree.add(foliage3);
    
    tree.position.set(x, 0, z);
    scene.add(tree);
    
    // Return collision data
    return { x, z, radius: 0.6 };
}
