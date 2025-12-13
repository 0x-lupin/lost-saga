// Training Dummy Prop - Lost Saga
// Reusable wooden dummy with collision

export function createDummy(scene, x, z) {
    const dummy = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.9 });
    
    // Post
    const postGeo = new THREE.CylinderGeometry(0.15, 0.2, 2.5, 8);
    const post = new THREE.Mesh(postGeo, woodMat);
    post.position.y = 1.25;
    post.castShadow = true;
    dummy.add(post);
    
    // Crossbar (arms)
    const armGeo = new THREE.BoxGeometry(1.5, 0.15, 0.15);
    const arms = new THREE.Mesh(armGeo, woodMat);
    arms.position.y = 2;
    arms.castShadow = true;
    dummy.add(arms);
    
    // Head (straw)
    const headGeo = new THREE.SphereGeometry(0.3, 8, 6);
    const strawMat = new THREE.MeshStandardMaterial({ color: 0xd4a574, roughness: 1 });
    const head = new THREE.Mesh(headGeo, strawMat);
    head.position.y = 2.6;
    head.castShadow = true;
    dummy.add(head);
    
    dummy.position.set(x, 0, z);
    scene.add(dummy);
    
    // Return collision data
    return { x, z, radius: 0.4 };
}
