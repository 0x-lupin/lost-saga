// Rock Prop - Lost Saga
// Reusable rock with collision

export function createRock(scene, x, z, scale = 1.0) {
    const rockGeo = new THREE.DodecahedronGeometry(scale, 0);
    const rockMat = new THREE.MeshStandardMaterial({ 
        color: 0x6b6b6b, 
        roughness: 0.9,
        flatShading: true
    });
    const rock = new THREE.Mesh(rockGeo, rockMat);
    rock.position.set(x, scale * 0.5, z);
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    rock.castShadow = true;
    rock.receiveShadow = true;
    scene.add(rock);
    
    // Return collision data
    return { x, z, radius: scale * 0.8 };
}
