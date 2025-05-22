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
  console.log("Initializing 3D scene...");
  try {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    const canvas = document.getElementById("canvas3d");
    if (!canvas) {
      console.error("Canvas 3D element not found!");
      return;
    }

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setClearColor(0xffffff);
    renderer.setSize(497, 497);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Better lighting
    const ambientLight = new THREE.AmbientLight(0x909090);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    // Add a subtle fill light from the opposite direction
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 0, -5);
    scene.add(fillLight);

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
    createObject("cube");
    
    // Hide loading screen
    const loadingElement = document.getElementById("loading3d");
    if (loadingElement) {
      loadingElement.style.display = "none";
    }
    
    console.log("3D scene initialized successfully");
  } catch (error) {
    console.error("Error initializing 3D scene:", error);
    // Show error in loading screen
    const loadingElement = document.getElementById("loading3d");
    if (loadingElement) {
      loadingElement.innerHTML = `
        <svg class="icon" style="color: #ff0000; width: 40px; height: 40px;">
          <use href="#error-icon"></use>
        </svg>
        <p>Error loading 3D scene. Please refresh the page.</p>
      `;
    }
  }
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
  if (!["cube", "tabung", "limas"].includes(type)) return;

  if (object) scene.remove(object);

  // Reset translation to center the new object
  translation = { x: 0, y: 0, z: 0 };

  let geometry;
  if (type === "cube") {
    geometry = new THREE.BoxGeometry(objectWidth, objectHeight, objectWidth);
  } else if (type === "tabung") {
    geometry = new THREE.CylinderGeometry(
      objectWidth,
      objectWidth,
      objectHeight,
      32
    );
  } else if (type === "limas") {
    geometry = new THREE.ConeGeometry(objectWidth, objectHeight, 4);
  }

  const colorValue = document.getElementById("color3d").value || "#00ff00";
  const isValidHex = /^#([0-9A-Fa-f]{3}){1,2}$/.test(colorValue);

  objectMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(isValidHex ? colorValue : "#00ff00"),
    metalness: 0.2,
    roughness: 0.5,
    reflectivity: 0.5,
    clearcoat: 0.3,
    clearcoatRoughness: 0.25,
  });

  object = new THREE.Mesh(geometry, objectMaterial);
  object.castShadow = true;
  object.receiveShadow = true;
  scene.add(object);
  resetTransform3d();
};

// Ukuran objek
window.updateSize = function () {
  const width = parseFloat(document.getElementById("inputWidth").value);
  const height = parseFloat(document.getElementById("inputHeight").value);

  if (width <= 0 || height <= 0 || isNaN(width) || isNaN(height)) return;

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

  if (direction === "left") object.rotation.y -= 0.1;
  else if (direction === "right") object.rotation.y += 0.1;
  else if (direction === "up") object.rotation.x -= 0.1;
  else if (direction === "down") object.rotation.x += 0.1;
};

// Translasi
window.translate3d = function (direction) {
  if (!object) return;

  const step = 0.4;
  if (direction === "up") translation.y += step;
  else if (direction === "down") translation.y -= step;
  else if (direction === "left") translation.x -= step;
  else if (direction === "right") translation.x += step;
};

// Skala
window.scale3d = function (factor) {
  const newScale = scale + factor;
  if (newScale <= 0.1) return;
  scale = newScale;
};

// Reset transformasi
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
  if (!/^#([0-9A-Fa-f]{3}){1,2}$/.test(colorValue)) return;
  if (object) {
    object.material.color.set(colorValue);
  }
};

// Toggle mode mouse
window.toggleTranslationMode = function () {
  isTranslating = !isTranslating;
  const button = document.getElementById("toggleModeBtn");
  const iconUse = button.querySelector('use');
  
  if (isTranslating) {
    button.innerHTML = `
      <svg class="icon">
        <use href="#move-icon"></use>
      </svg>
      Mode: Translasi
    `;
  } else {
    button.innerHTML = `
      <svg class="icon">
        <use href="#rotate-icon"></use>
      </svg>
      Mode: Rotasi
    `;
  }
};

// Explicitly make all functions available to the window object
window.createObject = createObject;
window.updateSize = updateSize;
window.resetAll = resetAll;
window.rotate3d = rotate3d;
window.translate3d = translate3d;
window.scale3d = scale3d;
window.resetTransform3d = resetTransform3d;
window.applyColor3d = applyColor3d;
window.toggleTranslationMode = toggleTranslationMode;

// Make sure init is called when window is loaded
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

console.log("3D script loaded successfully");
