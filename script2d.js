const canvas2d = document.getElementById("canvas2d");
const ctx = canvas2d.getContext("2d");

// State
let selectedShape = "rumah";
let angle = 0;
let offsetX = 0;
let offsetY = 0;
let scale = 1;
let fillColor = "#ff0000"; // Warna default merah

//Interaksi mouse
let isDragging2d = false;
let lastMousePos2d = {
  x: 0,
  y: 0
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

  if (selectedShape === "rumah") {
    // Gambar rumah simpel: kotak + atap segitiga

    // Kotak rumah
    const width = input1;
    const height = input2;
    ctx.rect(-width / 2, 0, width, height);

    // Atap segitiga
    ctx.moveTo(-width / 2, 0);
    ctx.lineTo(0, -input3); // input3 jadi tinggi atap
    ctx.lineTo(width / 2, 0);
    ctx.closePath();
  } else if (selectedShape === "nuklir") {
    const radius = input1;
    const centerRadius = input2;
    const bladeWidth = input3;

    // Gambar 3 baling-baling (sector)
    for (let i = 0; i < 3; i++) {
      const angle = i * (2 * Math.PI / 3);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, angle - bladeWidth / 2 / radius, angle + bladeWidth / 2 / radius);
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

    // Gambar lingkaran tengah
    ctx.beginPath();
    ctx.arc(0, 0, centerRadius, 0, Math.PI * 2);
    ctx.fill();

  } else if (selectedShape === "bintang") {
 //conts spikes buat atur jumlah kakinya woy
  const outerRadius = input1 / 2;
  const innerRadius = input2 / 2;
  const spikes = 5;

  let rot = Math.PI / 2 * 3;
  let cx = 0;
  let cy = 0;
  let step = Math.PI / spikes;

  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    let x = cx + Math.cos(rot) * outerRadius;
    let y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
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



canvas2d.addEventListener("mousedown", (e) => {
  isDragging2d = true;
  lastMousePos2d = {
    x: e.clientX,
    y: e.clientY
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
    y: e.clientY
  };

  draw();
});

// Gambar pertama kali
draw();