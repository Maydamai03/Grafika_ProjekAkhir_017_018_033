import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";

let scene, camera, renderer;
let object;
let scale = 1;
let translation = { x: 0, y: 0, z: 0 };
let objectWidth = 1;
let objectHeight = 2;
let objectMaterial;
let isTranslating = false;

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Inisialisasi scene
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    const canvas = document.getElementById("canvas3d");
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(500, 500);

    // Tambah pencahayaan
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // cahaya lembut
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(ambientLight, directionalLight);

    canvas.addEventListener("mousedown", (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener("mouseup", () => {
        isDragging = false;
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!isDragging || !object) return;

        const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y,
        };

        const deltaX = deltaMove.x * 0.01;
        const deltaY = deltaMove.y * 0.01;

        if (isTranslating) {
            translation.x += deltaX;
            translation.y -= deltaY;
        } else {
            object.rotation.y += deltaX;
            object.rotation.x += deltaY;
        }

        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    animate();
}

// Loop render
function animate() {
    requestAnimationFrame(animate);
    if (object) {
        object.position.set(translation.x, translation.y, translation.z);
        object.scale.set(scale, scale, scale);
    }
    renderer.render(scene, camera);
}

// Buat objek 3D
window.createObject = function (type) {
    if (object) scene.remove(object);

    let geometry;
    if (type === 'cube') {
        geometry = new THREE.BoxGeometry(objectWidth, objectHeight, objectWidth);
    } else if (type === 'tabung') {
        geometry = new THREE.CylinderGeometry(objectWidth, objectWidth, objectHeight, 32);
    } else if (type === 'limas') {
        geometry = new THREE.ConeGeometry(objectWidth, objectHeight, 4);
    }

    const colorValue = document.getElementById("color3d").value || "#00ff00";
    objectMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color(colorValue), metalness: 0.3, roughness: 0.6 });

    object = new THREE.Mesh(geometry, objectMaterial);
    scene.add(object);
    resetTransform3d();
};

// Ukuran objek
window.updateSize = function () {
    const width = parseFloat(document.getElementById("inputWidth").value);
    const height = parseFloat(document.getElementById("inputHeight").value);

    objectWidth = width;
    objectHeight = height;

    if (object) {
        const currentType = object.geometry.type;
        let type;
        if (currentType.includes("Box")) type = "cube";
        else if (currentType.includes("Cylinder")) type = "tabung";
        else if (currentType.includes("Cone")) type = "limas";
        createObject(type);
    }
};

// Reset semua
window.resetAll = function () {
    objectWidth = 1;
    objectHeight = 2;
    scale = 1;
    translation = { x: 0, y: 0, z: 0 };

    if (object) {
        scene.remove(object);
        createObject("cube");
    }

    document.getElementById("inputWidth").value = 1;
    document.getElementById("inputHeight").value = 2;
    document.getElementById("color3d").value = "#00ff00";
};

// Kontrol rotasi
window.rotate3d = function (direction) {
    if (!object) return;
    if (direction === 'left') object.rotation.y -= 0.1;
    else if (direction === 'right') object.rotation.y += 0.1;
    else if (direction === 'up') object.rotation.x -= 0.1;
    else if (direction === 'down') object.rotation.x += 0.1;
};

// Translasi
window.translate3d = function (direction) {
    const step = 0.2;
    if (direction === 'up') translation.y += step;
    else if (direction === 'down') translation.y -= step;
    else if (direction === 'left') translation.x -= step;
    else if (direction === 'right') translation.x += step;
};

// Skala
window.scale3d = function (factor) {
    scale = Math.max(0.1, scale + factor);
};

// Reset transform
window.resetTransform3d = function () {
    translation = { x: 0, y: 0, z: 0 };
    scale = 1;
    if (object) {
        object.rotation.set(0, 0, 0);
        object.scale.set(1, 1, 1);
        object.position.set(0, 0, 0);
    }
};

// Ganti warna
window.applyColor3d = function () {
    const colorValue = document.getElementById("color3d").value;
    if (object) {
        object.material.color.set(colorValue);
    }
};

// Toggle mode mouse
window.toggleTranslationMode = function () {
    isTranslating = !isTranslating;
    const button = document.getElementById("toggleModeBtn");
    button.innerText = isTranslating ? "Mode: Translasi 🖱️" : "Mode: Rotasi 🖱️";
};

window.onload = init;
