import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";

let scene, camera, renderer;
let object;
let scale = 1;
let translation = { x: 0, y: 0, z: 0 };
let objectWidth = 1;  // Default diameter atau lebar
let objectHeight = 2; // Default tinggi
let lastObjectType = 'cube'; // Untuk menyimpan tipe terakhir

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

window.createObject = function(type) {
    if (object) scene.remove(object);

    lastObjectType = type;

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

    // Hitung skala berdasarkan ukuran objek
    const maxDim = Math.max(objectWidth, objectHeight);
    scale = 1;

    // Kamera otomatis mundur jika objek besar
    camera.position.z = maxDim > 2 ? maxDim * 1.5 : 5;

    object.scale.set(scale, scale, scale);
    scene.add(object);

    resetTransform3d();
};

window.updateSize = function() {
    const width = parseFloat(document.getElementById("inputWidth").value);
    const height = parseFloat(document.getElementById("inputHeight").value);

    objectWidth = width;
    objectHeight = height;

    if (object) {
        // Perbarui objek berdasarkan ukuran baru
        createObject(lastObjectType);
    }
};

window.resetAll = function() {
    // Reset ke ukuran dan transformasi awal
    objectWidth = 1;
    objectHeight = 2;
    scale = 1;
    translation = { x: 0, y: 0, z: 0 };

    if (object) {
        scene.remove(object);
        createObject(lastObjectType);
    }

    // Reset input form juga
    document.getElementById("inputWidth").value = 1;
    document.getElementById("inputHeight").value = 2;
};

window.rotate3d = function(direction) {
    if (!object) return;
    if (direction === 'left') object.rotation.y -= 0.1;
    else if (direction === 'right') object.rotation.y += 0.1;
    else if (direction === 'up') object.rotation.x -= 0.1;
    else if (direction === 'down') object.rotation.x += 0.1;
};

window.translate3d = function(direction) {
    const step = 0.2;
    if (direction === 'up') translation.y += step;
    else if (direction === 'down') translation.y -= step;
    else if (direction === 'left') translation.x -= step;
    else if (direction === 'right') translation.x += step;
};

window.scale3d = function(factor) {
    scale = Math.max(0.1, scale + factor);
};

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
