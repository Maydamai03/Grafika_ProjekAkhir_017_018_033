const canvas2d = document.getElementById("canvas2d");
const ctx = canvas2d.getContext("2d");

// State
let selectedShape = "segitiga";
let angle = 0;
let offsetX = 0;
let offsetY = 0;
let scale = 1;
let fillColor = "#ff0000"; // Warna default merah

// Input ukuran sisi
let input1 = 100; // sisi/diameter
let input2 = 50;  // tinggi/jari-jari kecil
let input3 = 60;  // sisi miring atau tambahan dimensi

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
  input1 = parseFloat(document.getElementById("input1").value);
  input2 = parseFloat(document.getElementById("input2").value);
  input3 = parseFloat(document.getElementById("input3").value);
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

  if (selectedShape === "segitiga") {
    ctx.moveTo(0, -input2); // atas
    ctx.lineTo(input1 / 2, input2);
    ctx.lineTo(-input1 / 2, input2);
    ctx.closePath();
  } else if (selectedShape === "lingkaran") {
    ctx.arc(0, 0, input1 / 2, 0, Math.PI * 2);
  } else if (selectedShape === "jajargenjang") {
    ctx.moveTo(0, 0);
    ctx.lineTo(input1, 0);
    ctx.lineTo(input1 - input3, input2);
    ctx.lineTo(-input3, input2);
    ctx.closePath();
  }

  ctx.fillStyle = fillColor;
  ctx.fill();
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

// Gambar pertama kali
draw();
