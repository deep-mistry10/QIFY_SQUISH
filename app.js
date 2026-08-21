const themeToggle =
  document.getElementById("themeToggle");

const themeIcon =
  document.getElementById("themeIcon");

const themeLabel =
  document.getElementById("themeLabel");

function applyTheme(theme){

  if(theme === "dark"){
    document.documentElement.classList.add("dark");
    themeIcon.textContent = "☀";
    themeLabel.textContent = "Light";
    themeToggle.setAttribute(
      "aria-label",
      "Switch to light mode"
    );
  }else{
    document.documentElement.classList.remove("dark");
    themeIcon.textContent = "☾";
    themeLabel.textContent = "Dark";
    themeToggle.setAttribute(
      "aria-label",
      "Switch to dark mode"
    );
  }
  localStorage.setItem(
    "squish-theme",
    theme
  );
}

function getInitialTheme(){

  const saved =
    localStorage.getItem("squish-theme");
  if(saved === "dark" || saved === "light"){
    return saved;
  }
  return window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches
    ? "dark"
    : "light";
}

applyTheme(getInitialTheme());

themeToggle.addEventListener(
  "click",
  () => {
    const isDark =
      document.documentElement.classList.contains("dark");
    applyTheme(
      isDark ? "light" : "dark"
    );
  }
);

(function initPageSkeleton(){
  const skeleton =
    document.getElementById("pageSkeleton");
  document.body.classList.add("is-loading");

  const SKELETON_TIME = 700;
  function hideSkeleton(){
  if(!skeleton) return;
  setTimeout(() => {
    skeleton.classList.add("is-hidden");
    setTimeout(() => {
      skeleton.remove();
      document.body.classList.remove("is-loading");
    }, 320);
  }, SKELETON_TIME);

}

  if(document.readyState === "complete"){
    requestAnimationFrame(hideSkeleton);
  } else {
    window.addEventListener(
      "load",
      hideSkeleton,
      { once:true }
    );
  }
})();



let originalFile = null;
let originalDataURL = null;
let currentUnit = 'KB';
let currentFormat = 'image/jpeg';
let minimumSizeToken = 0;

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');

dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragging'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragging'));
dropZone.addEventListener('drop', e => {
  e.preventDefault(); dropZone.classList.remove('dragging');
  const f = e.dataTransfer.files[0];
  if (f && f.type.startsWith('image/')) loadFile(f);
  else showStatus('error', '✗ Please drop a valid image file.');
});
fileInput.addEventListener('change', e => { if (e.target.files[0]) loadFile(e.target.files[0]); });


async function updateMinimumSize() {
  const token = ++minimumSizeToken;

  if (!originalDataURL) return;

  const box = document.getElementById("minimumSizeBox");
  const value = document.getElementById("minimumSizeValue");
  const text = document.getElementById("minimumSizeText");

  box.classList.add("visible");
  value.innerHTML = '<span class="minimum-size-loading">checking…</span>';

  if (currentFormat === "image/png") {
    try {
      const img = await loadImage(originalDataURL);
      if (token !== minimumSizeToken) return;

      const canvas = document.getElementById("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const blob = await toBlob(canvas, "image/png", 1);
      if (token !== minimumSizeToken) return;

      value.textContent = fmt(blob.size);
      text.textContent =
        "PNG is lossless, so this is the smallest export this browser produced.";
    } catch (error) {
      if (token !== minimumSizeToken) return;
      value.textContent = "—";
      text.textContent = "Unable to estimate the minimum PNG size.";
    }
    return;
  }

  try {
    const img = await loadImage(originalDataURL);
    if (token !== minimumSizeToken) return;

    const canvas = document.getElementById("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const blob = await toBlob(canvas, currentFormat, 0.01);
    if (token !== minimumSizeToken) return;

    value.textContent = fmt(blob.size);

    const label =
      currentFormat === "image/webp"
        ? "WEBP"
        : "JPEG";

    text.textContent =
      `${label} at the lowest encoder quality available here. ` +
      "The exact result can vary by browser.";
  } catch (error) {
    if (token !== minimumSizeToken) return;
    value.textContent = "—";
    text.textContent = "Unable to estimate the minimum size.";
  }
}

function loadFile(file) {
  originalFile = file;
  const reader = new FileReader();
  reader.onload = e => {
    originalDataURL = e.target.result;
    document.getElementById('fileThumb').src = e.target.result;
    document.getElementById('fileName').textContent = file.name;
    const img = new Image();
    img.onload = () => {
      document.getElementById('fileMeta').textContent = `${img.width} × ${img.height} px  ·  ${fmt(file.size)}`;
    };
    img.src = e.target.result;
    document.getElementById('fileInfo').classList.add('visible');
    document.getElementById('controls').classList.add('visible');
    document.getElementById('resultCard').classList.remove('visible');
    hideStatus(); hideProgress();
    updateMinimumSize();
  };
  reader.readAsDataURL(file);
}


function setQuickTarget(size) {
  const input = document.getElementById("targetSize");

  currentUnit = "KB";
  input.value = size;
  document.getElementById("unitLabel").textContent = "KB";

  document.getElementById("btnKB").classList.add("active");
  document.getElementById("btnMB").classList.remove("active");

  syncQuickTargetState();
  input.focus();
}

function syncQuickTargetState() {
  const input = document.getElementById("targetSize");
  const currentValue = Number(input.value);

  document.querySelectorAll(".quick-target").forEach(button => {
    button.classList.toggle(
      "active",
      currentUnit === "KB" &&
      Number(button.dataset.size) === currentValue
    );
  });
}

document.getElementById("targetSize").addEventListener("input", syncQuickTargetState);

function setUnit(u) {
  currentUnit = u;
  document.getElementById('unitLabel').textContent = u;
  document.getElementById('btnKB').classList.toggle('active', u === 'KB');
  document.getElementById('btnMB').classList.toggle('active', u === 'MB');

  syncQuickTargetState();
}

function setFormat(btn) {
  currentFormat = btn.dataset.fmt;
  document.querySelectorAll('.fmt-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('pngNote').style.display = currentFormat === 'image/png' ? 'block' : 'none';

  if (originalDataURL) {
    updateMinimumSize();
  }
}

async function compress() {
  const tv = parseFloat(document.getElementById('targetSize').value);
  if (!originalFile || isNaN(tv) || tv <= 0) {
    showStatus('error', '✗ Load an image and enter a valid target size.'); return;
  }
  const targetBytes = currentUnit === 'MB' ? tv * 1024 * 1024 : tv * 1024;
  const origSize = originalFile.size;

  document.getElementById('compressBtn').disabled = true;
  document.getElementById('resultCard').classList.remove('visible');
  hideStatus();
  showProgress(5, 'Loading image...');

  try {
    const img = await loadImage(originalDataURL);
    const canvas = document.getElementById('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    if (currentFormat === 'image/png') {
      showProgress(80, 'Exporting PNG...');
      const blob = await toBlob(canvas, 'image/png', 1);
      if (blob.size > targetBytes) {
        showStatus('warn',
          `⚠ Cannot reach ${fmt(targetBytes)} with PNG — PNG is lossless.\n` +
          `Smallest PNG possible: ${fmt(blob.size)} (${fmt(blob.size - targetBytes)} over target).\n` +
          `Switch to JPEG or WEBP for precise size control.`
        );
      } else {
        showStatus('success', `✓ PNG exported at ${fmt(blob.size)} — within your target.`);
      }
      finalize(blob, origSize); return;
    }

    // Binary search quality for JPEG / WEBP
    let lo = 0.01, hi = 1.0, bestBlob = null, bestQ = null;
    const ITERS = 18;
    for (let i = 0; i < ITERS; i++) {
      const mid = (lo + hi) / 2;
      showProgress(10 + Math.round((i / ITERS) * 80), `Testing quality ${Math.round(mid * 100)}%...`);
      const blob = await toBlob(canvas, currentFormat, mid);
      if (blob.size <= targetBytes) { bestBlob = blob; bestQ = mid; lo = mid; }
      else { hi = mid; }
      if (hi - lo < 0.003) break;
      await tick();
    }

    showProgress(96, 'Finalizing...');
    await tick();

    if (!bestBlob) {
      const minBlob = await toBlob(canvas, currentFormat, 0.01);
      showStatus('error',
        `✗ Cannot compress to ${fmt(targetBytes)}.\n` +
        `Minimum achievable size is ~${fmt(minBlob.size)} at lowest quality.\n` +
        `Try setting a larger target size, or switch to WEBP for better compression.`
      );
      finalize(minBlob, origSize);
    } else {
      const pct = Math.round((1 - bestBlob.size / origSize) * 100);
      if (bestBlob.size >= origSize) {
        showStatus('warn', `⚠ Image already well optimized. Output: ${fmt(bestBlob.size)} — not smaller than original.`);
      } else {
        showStatus('success', `✓ Compressed to ${fmt(bestBlob.size)} at quality ${Math.round(bestQ * 100)}% — ${pct}% smaller!`);
      }
      finalize(bestBlob, origSize);
    }
  } catch(err) {
    showStatus('error', `✗ Error: ${err.message}`);
    hideProgress();
    document.getElementById('compressBtn').disabled = false;
  }
}

function finalize(blob, origSize) {
  showProgress(100, 'Done!');
  setTimeout(() => {
    hideProgress();
    document.getElementById('compressBtn').disabled = false;
    document.getElementById('statBefore').textContent = fmt(origSize);
    document.getElementById('statAfter').textContent = fmt(blob.size);
    const saved = origSize - blob.size;
    const sv = document.getElementById('statSaved');
    sv.textContent = saved > 0 ? fmt(saved) : '+' + fmt(Math.abs(saved));
    sv.style.color = saved > 0 ? 'var(--accent)' : 'var(--accent2)';
    const ext = currentFormat === 'image/jpeg'
  ? 'jpg'
  : currentFormat === 'image/webp'
    ? 'webp'
    : 'png';

const base = originalFile.name.replace(/\.[^.]+$/, '');
const sizeLabel = fmt(blob.size);

const url = URL.createObjectURL(blob);

const dl = document.getElementById('downloadBtn');

dl.href = url;
dl.download = `qify squished ${sizeLabel} ${base}.${ext}`;
    document.getElementById('resultCard').classList.add('visible');
  }, 300);
}

function loadImage(src) {
  return new Promise((res, rej) => {
    const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src;
  });
}
function toBlob(canvas, type, q) {
  return new Promise((res, rej) => canvas.toBlob(b => b ? res(b) : rej(new Error('toBlob failed')), type, q));
}
function tick() { return new Promise(r => setTimeout(r, 0)); }

function fmt(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function showStatus(type, msg) {
  const b = document.getElementById('statusBox');
  b.className = `status-box ${type} visible`; b.textContent = msg;
}
function hideStatus() { document.getElementById('statusBox').className = 'status-box'; }
function showProgress(pct, lbl) {
  document.getElementById('progressWrap').classList.add('visible');
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = lbl;
}
function hideProgress() { document.getElementById('progressWrap').classList.remove('visible'); }

function resetTool() {
  originalFile = null; originalDataURL = null;
  fileInput.value = '';
  document.getElementById('controls').classList.remove('visible');
  document.getElementById('fileInfo').classList.remove('visible');
  document.getElementById('resultCard').classList.remove('visible');
  document.getElementById('minimumSizeBox').classList.remove('visible');
  document.getElementById('minimumSizeValue').textContent = '—';
  document.getElementById('minimumSizeText').textContent = 'Checking the browser encoder...';
  minimumSizeToken++;
  document.getElementById('targetSize').value = '';
  document.querySelectorAll(".quick-target").forEach(button => button.classList.remove("active"));
  hideStatus(); hideProgress();
}