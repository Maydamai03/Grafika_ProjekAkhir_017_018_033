const canvas2d = document.getElementById("canvas2d");
const ctx = canvas2d.getContext("2d");

// State
let selectedShape = "bendera";
let angle = 0;
let offsetX = 0;
let offsetY = 0;
let scale = 1;
let fillColor = "#ff0000"; // Warna default merah

//Interaksi mouse
let isDragging2d = false;
let lastMousePos2d = {
  x: 0,
  y: 0,
};

// Input ukuran sisi
let input1 = 100; // sisi/diameter
let input2 = 50; // tinggi/jari-jari kecil
let input3 = 60; // sisi miring atau tambahan dimensi

// --- Fungsi utama ---
function setShape(shape) {
  selectedShape = shape;
  draw();
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

  // Validasi angka dan nilai positif
  if (isNaN(val1) || val1 <= 0) {
    alert("Input 1 harus berupa angka positif.");
    return;
  }

  if (isNaN(val2) || val2 <= 0) {
    alert("Input 2 harus berupa angka positif.");
    return;
  }

  if (isNaN(val3) || val3 <= 0) {
    alert("Input 3 harus berupa angka positif.");
    return;
  }

  input1 = val1;
  input2 = val2;
  input3 = val3;

  draw();
}

// Fungsi untuk menerapkan warna dari input
function applyColor2d() {
  const colorInput = document.getElementById("color2d");
  fillColor = colorInput.value;
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
  if (selectedShape === "bendera") {
    const width = input1;
    const height = input2;
    const poleHeight = input3;

    // Tiang bendera
    ctx.moveTo(-width / 2, -height);
    ctx.lineTo(-width / 2, poleHeight);
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.lineWidth = 1;

    // Kain bendera
    ctx.beginPath();
    ctx.rect(-width / 2, -height, width, height);

    // Menggambar bagian merah (atas)
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(-width / 2, -height, width, height / 2);

    // Menggambar bagian putih (bawah)
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(-width / 2, -height / 2, width, height / 2);

    ctx.strokeStyle = "#000";
    ctx.stroke();
    return; // Skip default fill
  } else if (selectedShape === "semicircle") {
    // Gambar setengah lingkaran
    const radius = input1;
    ctx.arc(0, 0, radius, 0, Math.PI, true);
    ctx.closePath();
  } else if (selectedShape === "donut") {
    // Gambar donut (dua lingkaran)
    const outerRadius = input1;
    const innerRadius = input2;

    // Lingkaran luar
    ctx.arc(0, 0, outerRadius, 0, Math.PI * 2);

    // Lingkaran dalam (berlawanan arah jarum jam untuk membuat lubang)
    ctx.moveTo(innerRadius, 0);
    ctx.arc(0, 0, innerRadius, 0, Math.PI * 2, true);
  }

  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.stroke(); // Adding stroke to make the details visible
}

// Fungsi reset transformasi dan input
function resetTransform() {
  angle = 0;
  offsetX = 0;
  offsetY = 0;
  scale = 1;

  // Reset ukuran bentuk ke default
  input1 = 100;
  input2 = 50;
  input3 = 60;

  // Reset warna
  fillColor = "#ff0000";
  document.getElementById("color2d").value = fillColor;

  // Reset juga tampilan input di HTML
  document.getElementById("input1").value = input1;
  document.getElementById("input2").value = input2;
  document.getElementById("input3").value = input3;

  draw();
}

canvas2d.addEventListener("mousedown", (e) => {
  isDragging2d = true;
  lastMousePos2d = {
    x: e.clientX,
    y: e.clientY,
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

  offsetX += deltaX;
  offsetY += deltaY;

  lastMousePos2d = {
    x: e.clientX,
    y: e.clientY,
  };

  draw();
});

// Gambar pertama kali
draw();
