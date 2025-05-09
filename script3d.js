import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";

let scene, camera, renderer;
let object;
let scale = 1;
let translation = { x: 0, y: 0, z: 0 };
let objectWidth = 1;  // Default width (diameter for cylinder)
let objectHeight = 2; // Default height

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    const canvas = document.getElementById("canvas3d");
    renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(500, 500);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (object) {
        object.position.set(translation.x, translation.y, translation.z);
        object.scale.set(scale, scale, scale);
    }
    renderer.render(scene, camera);
}

// Fungsi untuk membuat objek 3D
window.createObject = function(type) {
    if (object) scene.remove(object);

    let geometry;
    if (type === 'cube') {
        geometry = new THREE.BoxGeometry(objectWidth, objectHeight, objectWidth);
    } else if (type === 'tabung') {
        geometry = new THREE.CylinderGeometry(objectWidth, objectWidth, objectHeight, 32);
    } else if (type === 'limas') {
        geometry = new THREE.ConeGeometry(objectWidth, objectHeight, 4);
    }

    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false });
    object = new THREE.Mesh(geometry, material);
    scene.add(object);

    resetTransform3d();
};

// Fungsi untuk mengubah ukuran objek berdasarkan input
window.updateSize = function() {
    const width = parseFloat(document.getElementById("inputWidth").value);
    const height = parseFloat(document.getElementById("inputHeight").value);

    objectWidth = width;
    objectHeight = height;

    if (object) {
        // Update object dimensions based on the new size
        createObject(object.type); // Recreate object with new size
    }
};

// Fungsi untuk mereset objek ke posisi, ukuran, dan rotasi awal
window.resetAll = function() {
    // Reset ukuran dan posisi
    objectWidth = 1;
    objectHeight = 2;
    scale = 1;
    translation = { x: 0, y: 0, z: 0 };

    if (object) {
        // Menghapus objek lama dan membuat objek baru dengan ukuran default
        scene.remove(object);
        createObject(object.type);
    }
    
    // Reset input ukuran ke default
    document.getElementById("inputWidth").value = 1;
    document.getElementById("inputHeight").value = 2;
};

// Fungsi untuk merotasi objek 3D
window.rotate3d = function(direction) {
    if (!object) return;
    if (direction === 'left') object.rotation.y -= 0.1;
    else if (direction === 'right') object.rotation.y += 0.1;
    else if (direction === 'up') object.rotation.x -= 0.1;
    else if (direction === 'down') object.rotation.x += 0.1;
};

// Fungsi untuk mentranslasi objek 3D
window.translate3d = function(direction) {
    const step = 0.2;
    if (direction === 'up') translation.y += step;
    else if (direction === 'down') translation.y -= step;
    else if (direction === 'left') translation.x -= step;
    else if (direction === 'right') translation.x += step;
};

// Fungsi untuk mengubah skala objek 3D
window.scale3d = function(factor) {
    scale = Math.max(0.1, scale + factor);
};

// Fungsi untuk mereset transformasi objek 3D
window.resetTransform3d = function() {
    translation = { x: 0, y: 0, z: 0 };
    scale = 1;
    if (object) {
        object.rotation.set(0, 0, 0);
        object.scale.set(1, 1, 1);
        object.position.set(0, 0, 0);
    }
};

window.onload = init;
