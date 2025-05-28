const canvas2d = document.getElementById("canvas2d");
const ctx = canvas2d.getContext("2d");

// State
let selectedShape = "X";
let angle = 0;
let offsetX = 0;
let offsetY = 0;
let scale = 1;
let fillColor = "#ff0000"; // Warna default merah
let outlineColor = "#000000"; // Warna outline default hitam
let showOutline = false; // Status outline (aktif/non-aktif)
let outlineWidth = 2; // Ketebalan outline default

// Interaksi mouse
let isDragging2d = false;
let lastMousePos2d = {
  x: 0,
  y: 0,
};

// Input ukuran sisi
let input1 = 100; // lebar huruf X
let input2 = 50; // tinggi huruf X
let input3 = 60; // ketebalan garis (dibagi 10)

// Mouse control mode state
let mouseMode = "translate"; // Default mode: 'translate', 'rotate', or 'scale'

// --- Fungsi utama ---
function setShape(shape) {
  selectedShape = shape;
  // Reset position to center when shape is changed
  offsetX = 0;
  offsetY = 0;

  // Set default values based on shape
  if (shape === "semicircle") {
    input3 = 180; // Default to 180 degrees for semicircle
  } else if (shape === "X") {
    input3 = 60; // Default thickness for X
  } else if (shape === "donut") {
    input3 = 20; // Default thickness for donut
  }

  // Update button styles to highlight selected shape
  updateSelectedButtonStyle();

  updateInputLabels(); // Update input labels based on selected shape
  draw();
}

// Function to update button styles based on selected shape
function updateSelectedButtonStyle() {
  // Get all shape buttons
  const buttons = document.querySelectorAll(".tool-section:first-child button");

  // Reset all button styles
  buttons.forEach((button) => {
    button.style.backgroundColor = "";
    button.style.color = "";
  });

  // Find and highlight the selected button
  buttons.forEach((button) => {
    // Extract shape from onclick attribute or data attribute
    let buttonShape = "";
    if (button.getAttribute("onclick")) {
      const onclickValue = button.getAttribute("onclick");
      // Extract shape name from setShape('shapeName')
      const match = onclickValue.match(/setShape\(['"]([^'"]+)['"]\)/);
      if (match && match[1]) {
        buttonShape = match[1];
      }
    }

    // If this is the selected shape, highlight it
    if (buttonShape === selectedShape) {
      button.style.backgroundColor = "black";
      button.style.color = "white";
    }
  });
}

// Function to update input labels based on selected shape
function updateInputLabels() {
  const label1 =
    document.querySelector('label[for="input1"]') ||
    document.querySelector("#controls2d .input-group:nth-child(1) label");
  const label2 =
    document.querySelector('label[for="input2"]') ||
    document.querySelector("#controls2d .input-group:nth-child(2) label");
  const label3 =
    document.querySelector('label[for="input3"]') ||
    document.querySelector("#controls2d .input-group:nth-child(3) label");
  const label4 =
    document.querySelector('label[for="input4"]') ||
    document.querySelector("#controls2d .input-group:nth-child(4) label");
  const input3Container = document.querySelector(
    'label[for="input3"]'
  ).parentNode;
  const input4Container = document.querySelector(
    'label[for="input4"]'
  ).parentNode;

  if (
    !label1 ||
    !label2 ||
    !label3 ||
    !label4 ||
    !input3Container ||
    !input4Container
  )
    return;

  switch (selectedShape) {
    case "X": // Huruf X
      label1.textContent = "Lebar X:";
      label2.textContent = "Tinggi X:";
      label3.textContent = "Ketebalan Garis:";
      label4.textContent = "Ketebalan Outline:";
      input3Container.style.display = "block";
      input4Container.style.display = "block";
      document.getElementById("input3").value = input3;
      document.getElementById("input4").value = outlineWidth;
      break;
    case "semicircle": // Setengah Lingkaran
      label1.textContent = "Radius:";
      label2.textContent = "Ketebalan Garis:";
      label3.textContent = "Sudut (derajat):";
      label4.textContent = "Ketebalan Outline:";
      input3Container.style.display = "block";
      input4Container.style.display = "block";
      document.getElementById("input3").value = 180; // Default to 180 degrees for semicircle
      document.getElementById("input4").value = outlineWidth;
      break;
    case "donut": // Donut
      label1.textContent = "Radius Luar:";
      label2.textContent = "Radius Dalam:";
      label3.textContent = "Ketebalan Garis:";
      label4.textContent = "Ketebalan Outline:";
      input3Container.style.display = "block";
      input4Container.style.display = "block";
      document.getElementById("input3").value = input3;
      document.getElementById("input4").value = outlineWidth;
      break;
  }
}

function rotate(dir) {
  angle += dir * (Math.PI / 18); // 10 derajat
  draw();
}

function move(dx, dy) {
  offsetX += dx;
  offsetY += dy;
  draw();
}

function changeScale(delta) {
  scale = Math.max(0.1, scale + delta); // mencegah skala negatif
  draw();
}

function updateInput() {
  const val1 = parseFloat(document.getElementById("input1").value);
  const val2 = parseFloat(document.getElementById("input2").value);
  const val3 = parseFloat(document.getElementById("input3").value);
  const val4 = parseFloat(document.getElementById("input4").value);

  // Validasi angka dan nilai positif
  if (isNaN(val1) || val1 <= 0) {
    alert("Input 1 harus berupa angka positif.");
    return;
  }

  // Validasi input berdasarkan bentuk yang dipilih
  if (selectedShape === "X") {
    if (isNaN(val2) || val2 <= 0) {
      alert("Tinggi X harus berupa angka positif.");
      return;
    }
    if (isNaN(val3) || val3 <= 0) {
      alert("Ketebalan garis harus berupa angka positif.");
      return;
    }
  } else if (selectedShape === "semicircle") {
    if (isNaN(val2) || val2 <= 0) {
      alert("Ketebalan garis harus berupa angka positif.");
      return;
    }
    if (isNaN(val3) || val3 < 0 || val3 > 360) {
      alert("Sudut harus berupa angka antara 0 dan 360.");
      return;
    }
  } else if (selectedShape === "donut") {
    if (isNaN(val2) || val2 <= 0) {
      alert("Radius dalam harus berupa angka positif.");
      return;
    }
    // Pastikan radius dalam lebih kecil dari radius luar
    if (val2 >= val1) {
      alert("Radius dalam harus lebih kecil dari radius luar.");
      return;
    }
    if (isNaN(val3) || val3 <= 0) {
      alert("Ketebalan garis harus berupa angka positif.");
      return;
    }
  }

  // Validasi ketebalan outline
  if (isNaN(val4) || val4 < 0) {
    alert("Ketebalan outline harus berupa angka positif.");
    return;
  }

  input1 = val1;
  input2 = val2;
  input3 = val3;
  outlineWidth = val4; // Make sure this is set properly

  draw();
}

// Fungsi untuk menerapkan warna dari input
function applyColor2d() {
  const colorInput = document.getElementById("color2d");
  fillColor = colorInput.value;
  draw();
}

// Fungsi untuk menerapkan warna outline dari input
function applyOutlineColor() {
  const colorInput = document.getElementById("outlineColor");
  outlineColor = colorInput.value;
  draw();
}

// Add this function to apply outline thickness
function applyOutlineThickness() {
  const thicknessInput = document.getElementById("input4");
  outlineWidth = parseInt(thicknessInput.value);

  // Validate input
  if (isNaN(outlineWidth) || outlineWidth < 0) {
    alert("Ketebalan outline harus berupa angka positif.");
    outlineWidth = 2; // Reset to default
    thicknessInput.value = outlineWidth;
    return;
  }

  draw();
}

// Update the toggleOutline function to also apply thickness
function toggleOutline() {
  showOutline = !showOutline;
  const toggleBtn = document.getElementById("toggleOutline");

  if (showOutline) {
    toggleBtn.textContent = "Nonaktifkan Outline";
    toggleBtn.classList.add("active");

    // Apply current thickness when turning on outline
    applyOutlineThickness();
  } else {
    toggleBtn.textContent = "Aktifkan Outline";
    toggleBtn.classList.remove("active");
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas2d.width, canvas2d.height);
  ctx.save();

  ctx.translate(canvas2d.width / 2 + offsetX, canvas2d.height / 2 + offsetY);
  ctx.rotate(angle);
  ctx.scale(scale, scale);

  drawSelectedShape();

  ctx.restore();
}

function drawSelectedShape() {
  ctx.beginPath();
  if (selectedShape === "X") {
    const width = input1;
    const height = input2;
    const lineWidth = input3 / 10; // Menggunakan input3 untuk ketebalan garis

    // Mengatur ketebalan garis
    ctx.lineWidth = lineWidth;

    // Menggambar huruf X dengan lebar dan tinggi yang berbeda
    // Garis dari kiri atas ke kanan bawah
    ctx.moveTo(-width / 2, -height / 2);
    ctx.lineTo(width / 2, height / 2);

    // Garis dari kanan atas ke kiri bawah
    ctx.moveTo(width / 2, -height / 2);
    ctx.lineTo(-width / 2, height / 2);

    // Mengatur warna
    ctx.strokeStyle = fillColor;
    ctx.stroke();

    // Menggambar outline jika aktif
    if (showOutline) {
      // Simpan path asli sebelum menggambar outline
      const savedPath = new Path2D();
      savedPath.moveTo(-width / 2, -height / 2);
      savedPath.lineTo(width / 2, height / 2);
      savedPath.moveTo(width / 2, -height / 2);
      savedPath.lineTo(-width / 2, height / 2);

      // Gambar outline dengan ketebalan yang lebih besar
      ctx.lineWidth = lineWidth + outlineWidth * 2;
      ctx.strokeStyle = outlineColor;
      ctx.stroke(savedPath);

      // Gambar kembali garis asli di atas outline
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = fillColor;
      ctx.stroke();
    }

    // Reset line width
    ctx.lineWidth = 1;
    return; // Skip default fill
  } else if (selectedShape === "semicircle") {
    // Gambar setengah lingkaran
    const radius = input1;
    const lineWidth = input2 / 10; // Ketebalan garis
    const angle = (input3 * Math.PI) / 180; // Konversi dari derajat ke radian

    // Simpan path untuk digunakan ulang
    const semicirclePath = new Path2D();
    semicirclePath.arc(0, 0, radius, 0, angle, false);

    if (angle >= Math.PI) {
      // Jika sudut lebih dari atau sama dengan 180 derajat, tutup jalur
      semicirclePath.closePath();
    } else {
      // Jika sudut kurang dari 180 derajat, gambar garis ke pusat
      semicirclePath.lineTo(0, 0);
      semicirclePath.closePath();
    }

    // Gambar outline jika aktif
    if (showOutline) {
      ctx.lineWidth = outlineWidth;
      ctx.strokeStyle = outlineColor;
      ctx.stroke(semicirclePath);
    }

    // Isi bentuk dengan warna fill
    ctx.fillStyle = fillColor;
    ctx.fill(semicirclePath);

    // Reset line width
    ctx.lineWidth = 1;
    return;
  } else if (selectedShape === "donut") {
    // Gambar donut (dua lingkaran)
    const outerRadius = input1;
    const innerRadius = input2;
    const lineWidth = input3 / 10; // Ketebalan garis

    // Buat path untuk donut
    const donutPath = new Path2D();

    // Lingkaran luar
    donutPath.arc(0, 0, outerRadius, 0, Math.PI * 2);

    // Lingkaran dalam (berlawanan arah jarum jam untuk membuat lubang)
    donutPath.moveTo(innerRadius, 0);
    donutPath.arc(0, 0, innerRadius, 0, Math.PI * 2, true);

    // Gambar outline jika aktif
    if (showOutline) {
      ctx.lineWidth = outlineWidth;
      ctx.strokeStyle = outlineColor;
      ctx.stroke(donutPath);
    }

    // Isi bentuk dengan warna fill
    ctx.fillStyle = fillColor;
    ctx.fill(donutPath);

    // Reset line width
    ctx.lineWidth = 1;
    return;
  }

  ctx.fillStyle = fillColor;
  ctx.fill();

  if (showOutline) {
    ctx.lineWidth = outlineWidth;
    ctx.strokeStyle = outlineColor;
    ctx.stroke();
  }
}

// Fungsi reset transformasi dan input
function resetTransform() {
  angle = 0;
  offsetX = 0;
  offsetY = 0;
  scale = 1;

  // Reset ukuran bentuk ke default sesuai dengan bentuk yang dipilih
  if (selectedShape === "X") {
    input1 = 100; // lebar X
    input2 = 50; // tinggi X
    input3 = 60; // ketebalan garis
  } else if (selectedShape === "semicircle") {
    input1 = 100; // radius
    input2 = 20; // ketebalan garis
    input3 = 180; // sudut (180 derajat = setengah lingkaran)
  } else if (selectedShape === "donut") {
    input1 = 100; // radius luar
    input2 = 50; // radius dalam
    input3 = 20; // ketebalan garis
  }

  // Reset warna
  fillColor = "#ff0000";
  document.getElementById("color2d").value = fillColor;

  // Reset outline
  outlineColor = "#000000";
  document.getElementById("outlineColor").value = outlineColor;
  outlineWidth = 2;
  showOutline = false;

  // Update toggle button appearance
  const toggleBtn = document.getElementById("toggleOutline");
  if (toggleBtn) {
    toggleBtn.textContent = "Aktifkan Outline";
    toggleBtn.classList.remove("active");
  }

  // Reset juga tampilan input di HTML
  document.getElementById("input1").value = input1;
  document.getElementById("input2").value = input2;
  document.getElementById("input3").value = input3;
  document.getElementById("input4").value = outlineWidth;

  // Update labels
  updateInputLabels();

  draw();
}

function clearCanvas() {
  const canvas = document.getElementById("canvas2d");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Add new comprehensive reset function for 2D
function resetAll2D() {
  // Reset transformations
  angle = 0;
  offsetX = 0;
  offsetY = 0;
  scale = 1;

  // Reset shape to default (X/X)
  selectedShape = "X";
  updateSelectedButtonStyle();

  // Reset ukuran bentuk ke default
  input1 = 100; // lebar X
  input2 = 50; // tinggi X
  input3 = 60; // ketebalan garis

  // Reset warna
  fillColor = "#ff0000";
  document.getElementById("color2d").value = fillColor;

  // Reset outline
  outlineColor = "#000000";
  document.getElementById("outlineColor").value = outlineColor;
  outlineWidth = 2;
  showOutline = false;

  // Update toggle button appearance
  const toggleBtn = document.getElementById("toggleOutline");
  if (toggleBtn) {
    toggleBtn.textContent = "Aktifkan Outline";
    toggleBtn.classList.remove("active");
  }

  // Reset juga tampilan input di HTML
  document.getElementById("input1").value = input1;
  document.getElementById("input2").value = input2;
  document.getElementById("input3").value = input3;
  document.getElementById("input4").value = outlineWidth;

  // Reset mouse mode to default (translate)
  mouseMode = "translate";
  updateMouseModeUI();
  updateCanvasCursor();

  // Update labels
  updateInputLabels();

  // Redraw with all resets applied
  draw();
}

// Function to set the mouse control mode
function setMouseMode(mode) {
  mouseMode = mode;
  updateMouseModeUI();
  updateCanvasCursor();
}

// Update the UI to show which mode is active
function updateMouseModeUI() {
  // Reset all button styles
  const modeButtons = document.querySelectorAll(".mouse-controls button");
  modeButtons.forEach((button) => {
    button.classList.remove("active");
  });

  // Highlight the active button
  let activeButton;
  switch (mouseMode) {
    case "translate":
      activeButton = document.getElementById("translateMode");
      break;
    case "rotate":
      activeButton = document.getElementById("rotateMode");
      break;
    case "scale":
      activeButton = document.getElementById("scaleMode");
      break;
  }

  if (activeButton) {
    activeButton.classList.add("active");
  }
}

// Update the canvas cursor based on the current mode
function updateCanvasCursor() {
  canvas2d.classList.remove(
    "canvas-translate",
    "canvas-rotate",
    "canvas-scale"
  );
  canvas2d.classList.add(`canvas-${mouseMode}`);
}

canvas2d.addEventListener("mousedown", (e) => {
  isDragging2d = true;
  lastMousePos2d = {
    x: e.clientX,
    y: e.clientY,
  };

  // Store the initial position for rotation and scaling calculations
  initialMousePos = {
    x: e.clientX - canvas2d.getBoundingClientRect().left,
    y: e.clientY - canvas2d.getBoundingClientRect().top,
  };

  // Calculate center of canvas
  canvasCenter = {
    x: canvas2d.width / 2,
    y: canvas2d.height / 2,
  };
});

canvas2d.addEventListener("mouseup", () => {
  isDragging2d = false;
});

canvas2d.addEventListener("mouseleave", () => {
  isDragging2d = false;
});

canvas2d.addEventListener("mousemove", (e) => {
  if (!isDragging2d) return;

  const deltaX = e.clientX - lastMousePos2d.x;
  const deltaY = e.clientY - lastMousePos2d.y;

  // Current mouse position
  const currentMousePos = {
    x: e.clientX - canvas2d.getBoundingClientRect().left,
    y: e.clientY - canvas2d.getBoundingClientRect().top,
  };

  switch (mouseMode) {
    case "translate":
      // Fix: Changed 'dy' to 'deltaY' - this was causing the translation issue
      offsetX += deltaX;
      offsetY += deltaY;
      break;

    case "rotate":
      // Calculate angles from center for rotation
      const initialAngle = Math.atan2(
        initialMousePos.y - canvasCenter.y,
        initialMousePos.x - canvasCenter.x
      );
      const currentAngle = Math.atan2(
        currentMousePos.y - canvasCenter.y,
        currentMousePos.x - canvasCenter.x
      );

      // Apply rotation (difference between angles)
      angle += currentAngle - initialAngle;

      // Update initial position for next move
      initialMousePos = currentMousePos;
      break;

    case "scale":
      // Calculate distances from center for scaling
      const initialDist = Math.hypot(
        initialMousePos.x - canvasCenter.x,
        initialMousePos.y - canvasCenter.y
      );
      const currentDist = Math.hypot(
        currentMousePos.x - canvasCenter.x,
        currentMousePos.y - canvasCenter.y
      );

      // Calculate scale factor based on distance change
      if (initialDist > 0) {
        const scaleFactor = currentDist / initialDist;
        scale *= scaleFactor;

        // Prevent negative or extremely small/large scale
        scale = Math.max(0.1, Math.min(scale, 10));
      }

      // Update initial position for next move
      initialMousePos = currentMousePos;
      break;
  }

  lastMousePos2d = {
    x: e.clientX,
    y: e.clientY,
  };

  draw();
});

// Initialize global variables for mouse position calculation
let initialMousePos = { x: 0, y: 0 };
let canvasCenter = { x: 0, y: 0 };

// Initialize mouse control UI on page load
document.addEventListener("DOMContentLoaded", function () {
  // Make sure canvas and context are properly initialized
  if (!ctx) {
    console.error("Canvas 2D context is not available");
    return;
  }

  updateInputLabels(); // Set initial input labels
  updateSelectedButtonStyle(); // Set initial button styles
  updateMouseModeUI();
  updateCanvasCursor();

  // Initial shape selection and drawing
  setShape("X"); // Start with default shape
  draw(); // Make sure we draw something initially

  console.log("2D canvas initialized");
});

// Add keyboard controls
document.addEventListener("keydown", (e) => {
  // Skip if we're in an input field
  if (e.target.tagName === "INPUT") return;

  // Scale controls: Ctrl+Shift+Plus and Ctrl+Shift+Minus
  if (e.ctrlKey && e.shiftKey) {
    // Plus key (+ or = key with shift)
    if (e.key === "+" || e.key === "=") {
      e.preventDefault(); // Prevent browser zoom
      changeScale(0.1);
      return;
    }

    // Minus key
    if (e.key === "-" || e.key === "_") {
      e.preventDefault(); // Prevent browser zoom
      changeScale(-0.1);
      return;
    }

    // Rotate left with Ctrl+Shift+R
    if (e.key === "R" || e.key === "r") {
      e.preventDefault();
      rotate(-1);
      return;
    }
  }

  // Rotate right with Ctrl+R
  if (e.ctrlKey && !e.shiftKey && (e.key === "R" || e.key === "r")) {
    e.preventDefault();
    rotate(1);
    return;
  }

  // Arrow key controls for translation
  switch (e.key) {
    case "ArrowUp":
      e.preventDefault();
      move(0, -10);
      break;
    case "ArrowDown":
      e.preventDefault();
      move(0, 10);
      break;
    case "ArrowLeft":
      e.preventDefault();
      move(-10, 0);
      break;
    case "ArrowRight":
      e.preventDefault();
      move(10, 0);
      break;
  }
});

// Add feedback to show keyboard shortcuts on the page
function addKeyboardShortcutsInfo() {
  const toolsSection = document.querySelector(".right-content-tools");
  if (!toolsSection) return;

  // Create a new section for keyboard shortcuts
  const shortcutsSection = document.createElement("div");
  shortcutsSection.classList.add("tool-section");
  shortcutsSection.innerHTML = `
    <h3>Keyboard Shortcuts</h3>
    <div class="shortcuts-info">
      <p><kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd> Translasi</p>
      <p><kbd>Ctrl</kbd>+<kbd>R</kbd> Rotasi Kanan</p>
      <p><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd> Rotasi Kiri</p>
      <p><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>+</kbd> Perbesar</p>
      <p><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>-</kbd> Perkecil</p>
    </div>
  `;

  // Add the shortcuts section to the right content tools
  toolsSection.appendChild(shortcutsSection);
}

// Call this function when the document is loaded
document.addEventListener("DOMContentLoaded", function () {
  // ...existing code...
  addKeyboardShortcutsInfo(); // Add keyboard shortcuts info
});
