const canvas2d = document.getElementById("canvas2d");
const ctx = canvas2d.getContext("2d");

// State
let selectedShape = "segitiga";
let angle = 0;
let offsetX = 0;
let offsetY = 0;
let scale = 1;

// Input ukuran sisi
let input1 = 100; // sisi/diameter
let input2 = 50;  // tinggi/jari-jari kecil
let input3 = 60;  // sisi miring atau tambahan dimensi

// --- Shape buttons ---


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
  if (selectedShape === "segitiga") {
    ctx.beginPath();
    ctx.moveTo(0, -input2); // atas
    ctx.lineTo(input1 / 2, input2);
    ctx.lineTo(-input1 / 2, input2);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();
  } else if (selectedShape === "lingkaran") {
    ctx.beginPath();
    ctx.arc(0, 0, input1 / 2, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
  } else if (selectedShape === "jajargenjang") {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(input1, 0);
    ctx.lineTo(input1 - input3, input2);
    ctx.lineTo(-input3, input2);
    ctx.closePath();
    ctx.fillStyle = "green";
    ctx.fill();
  }
}

//fungsi reset
function resetTransform() {
    angle = 0;
    offsetX = 0;
    offsetY = 0;
    scale = 1;
  
    // Reset ukuran bentuk ke default
    input1 = 100;
    input2 = 50;
    input3 = 60;
  
    // Update juga tampilan inputnya di HTML
    document.getElementById("input1").value = input1;
    document.getElementById("input2").value = input2;
    document.getElementById("input3").value = input3;
  
    draw();
  }
  
// Gambar pertama kali
draw();
