const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageInput = document.getElementById('imageInput');
const cropBtn = document.getElementById('cropBtn');
const applyCropBtn = document.getElementById('applyCropBtn');
const croppedCanvas = document.getElementById('croppedCanvas');
const croppedCtx = croppedCanvas.getContext('2d');

let img = new Image();
let isDragging = false;
let startX = 0, startY = 0, endX = 0, endY = 0;

imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  startX = e.clientX - rect.left;
  startY = e.clientY - rect.top;
  isDragging = true;
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const rect = canvas.getBoundingClientRect();
  endX = Math.min(Math.max(e.clientX - rect.left, 0), canvas.width);
  endY = Math.min(Math.max(e.clientY - rect.top, 0), canvas.height);

  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
});

cropBtn.addEventListener('click', () => {
  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  const cropX = Math.max(0, Math.min(x, img.width));
  const cropY = Math.max(0, Math.min(y, img.height));
  const cropW = Math.min(width, img.width - cropX);
  const cropH = Math.min(height, img.height - cropY);

  croppedCanvas.width = cropW;
  croppedCanvas.height = cropH;
  croppedCtx.clearRect(0, 0, cropW, cropH);
  croppedCtx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
});

applyCropBtn.addEventListener('click', () => {
  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  const cropX = Math.max(0, Math.min(x, img.width));
  const cropY = Math.max(0, Math.min(y, img.height));
  const cropW = Math.min(width, img.width - cropX);
  const cropH = Math.min(height, img.height - cropY);

  console.log("🖼️ Original Image Size:", img.width + " x " + img.height);
  console.log("📐 Crop Selection:");
  console.log("X:", cropX);
  console.log("Y:", cropY);
  console.log("Width:", cropW);
  console.log("Height:", cropH);

  // Optional: Send this to backend
  // fetch('/api/crop', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ cropX, cropY, cropW, cropH })
  // });
});
