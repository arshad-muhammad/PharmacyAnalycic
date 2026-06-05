/**
 * PharmaScan AI — Vanilla JavaScript Application
 * Converted from React/Tailwind/Framer Motion to vanilla JS/CSS/DOM.
 * Uses an IIFE module pattern with a centralized render loop.
 */
(function () {
  'use strict';

  // ─── Inline SVG Icons (Lucide equivalents) ────────────────────────────
  const ICONS = {
    pill: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 1.5 3 3"/><path d="M5.2 6.2 1.4 10a5.1 5.1 0 0 0 7.2 7.2l3.8-3.8"/><path d="m14.5 12.5 3-3"/><path d="m18.8 17.8 3.8-3.8a5.1 5.1 0 0 0-7.2-7.2L11.6 10.6"/></svg>`,
    pillLarge: `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 1.5 3 3"/><path d="M5.2 6.2 1.4 10a5.1 5.1 0 0 0 7.2 7.2l3.8-3.8"/><path d="m14.5 12.5 3-3"/><path d="m18.8 17.8 3.8-3.8a5.1 5.1 0 0 0-7.2-7.2L11.6 10.6"/></svg>`,
    home: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    camera: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
    cameraLarge: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
    cameraSmall: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
    imageUp: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.8 0L10.3 21z"/><path d="m14 19.5 3-3 3 3"/><path d="M17 22v-5.5"/><circle cx="9" cy="9" r="2"/></svg>`,
    rotateCcw: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    activity: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    alertTriangle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,
    alertTriangleLarge: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,
    shieldCheck: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,
    search: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    shoppingCart: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
    refreshCcw: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>`,
  };

  // ─── State ────────────────────────────────────────────────────────────
  let state = {
    isAnalyzing: false,
    medicineData: null,
    error: null,
    // Camera sub-state
    stream: null,
    isCameraActive: false,
    previewImage: null, // { url, mimeType }
    // Loading status sub-state
    loadingText: 'Scanning image / OCR...',
    _loadingTimers: [],
  };

  // ─── State helpers ────────────────────────────────────────────────────
  function setState(patch) {
    Object.assign(state, patch);
    render();
  }

  // ─── Camera Helpers ───────────────────────────────────────────────────
  function stopCamera() {
    if (state.stream) {
      state.stream.getTracks().forEach(function (t) { t.stop(); });
    }
    setState({ stream: null, isCameraActive: false });
  }

  async function startCamera() {
    try {
      var mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      state.stream = mediaStream;
      state.isCameraActive = true;
      state.previewImage = null;
      render();
      // Attach stream to video element after render
      var video = document.getElementById('camera-video');
      if (video) {
        video.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access camera. Please ensure permissions are granted.');
    }
  }

  function capturePhoto() {
    var video = document.getElementById('camera-video');
    if (!video) return;
    var canvas = document.createElement('canvas');
    var MAX = 1000;
    var w = video.videoWidth;
    var h = video.videoHeight;
    if (w > h) {
      if (w > MAX) { h *= MAX / w; w = MAX; }
    } else {
      if (h > MAX) { w *= MAX / h; h = MAX; }
    }
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, w, h);
      var dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      // Stop camera before setting state to avoid re-render issues
      if (state.stream) {
        state.stream.getTracks().forEach(function (t) { t.stop(); });
      }
      setState({
        stream: null,
        isCameraActive: false,
        previewImage: { url: dataUrl, mimeType: 'image/jpeg' },
      });
    }
  }

  function handleFileUpload(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onloadend = function () {
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement('canvas');
        var MAX = 1000;
        var w = img.width;
        var h = img.height;
        if (w > h) {
          if (w > MAX) { h *= MAX / w; w = MAX; }
        } else {
          if (h > MAX) { w *= MAX / h; h = MAX; }
        }
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          setState({
            previewImage: { url: canvas.toDataURL('image/jpeg', 0.8), mimeType: 'image/jpeg' },
            isCameraActive: false,
          });
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function retakeImage() {
    setState({ previewImage: null });
  }

  function submitImage() {
    if (state.previewImage) {
      handleCapture(state.previewImage.url, state.previewImage.mimeType);
    }
  }

  // ─── API / Actions ────────────────────────────────────────────────────
  async function handleCapture(base64, mimeType) {
    setState({ isAnalyzing: true, error: null });
    startLoadingStatus();
    try {
      var response = await fetch('/api/analyze-medicine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType: mimeType }),
      });
      if (!response.ok) {
        var errData = {};
        try { errData = await response.json(); } catch (_) { /* ignore */ }
        throw new Error(errData.error || 'Failed to analyze medicine');
      }
      var data = await response.json();
      clearLoadingTimers();
      setState({ medicineData: data, isAnalyzing: false, previewImage: null });
    } catch (err) {
      console.error(err);
      clearLoadingTimers();
      setState({ error: err.message || 'An unexpected error occurred.', isAnalyzing: false });
    }
  }

  function handleReset() {
    stopCameraSilent();
    clearLoadingTimers();
    setState({
      medicineData: null,
      error: null,
      previewImage: null,
      isCameraActive: false,
      stream: null,
      isAnalyzing: false,
    });
  }

  function stopCameraSilent() {
    if (state.stream) {
      state.stream.getTracks().forEach(function (t) { t.stop(); });
      state.stream = null;
    }
  }

  // ─── Loading Status Timer ─────────────────────────────────────────────
  function startLoadingStatus() {
    clearLoadingTimers();
    state.loadingText = 'Scanning image / OCR...';
    var t1 = setTimeout(function () {
      state.loadingText = 'Analyzing with Gemini AI...';
      var el = document.getElementById('loading-status-text');
      if (el) el.textContent = state.loadingText;
    }, 2000);
    var t2 = setTimeout(function () {
      state.loadingText = 'Structuring medicine data...';
      var el = document.getElementById('loading-status-text');
      if (el) el.textContent = state.loadingText;
    }, 4500);
    state._loadingTimers = [t1, t2];
  }

  function clearLoadingTimers() {
    if (state._loadingTimers) {
      state._loadingTimers.forEach(clearTimeout);
      state._loadingTimers = [];
    }
  }

  // ─── Escape HTML helper ───────────────────────────────────────────────
  function esc(str) {
    if (str == null) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
  }

  // ─── Build HTML Sections ──────────────────────────────────────────────

  function buildHeader() {
    var rightBtn = '';
    if (state.medicineData) {
      rightBtn = `
        <button id="btn-home" class="header-home-btn" title="Home">
          ${ICONS.home}
        </button>`;
    } else {
      rightBtn = `
        <button class="header-wallet-btn">Connect Wallet</button>`;
    }

    return `
    <header class="app-header">
      <div class="header-inner">
        <div class="logo-group" id="logo-click">
          <div class="logo-icon">
            ${ICONS.pill}
          </div>
          <span class="logo-text">PharmaScan <span class="logo-ai">AI</span></span>
        </div>
        <nav class="header-nav">
          <span class="nav-link nav-link--active">Scanner</span>
          <span class="nav-link">My Cabinet</span>
          <span class="nav-link">Safety Alerts</span>
        </nav>
        <div class="header-actions">
          ${rightBtn}
        </div>
      </div>
    </header>`;
  }

  function buildCaptureView() {
    var errorBlock = '';
    if (state.error) {
      errorBlock = `<div class="error-banner">${esc(state.error)}</div>`;
    }

    var cameraContent = '';

    // State 1: Initial (no camera, no preview)
    if (!state.isCameraActive && !state.previewImage) {
      cameraContent = `
        <div class="capture-card">
          <div class="capture-initial">
            <div class="capture-icon-circle">
              ${ICONS.cameraLarge}
            </div>
            <div>
              <h3 class="capture-title">Scan Medicine</h3>
              <p class="capture-subtitle">Capture the packaging, label, or tablet clearly.</p>
            </div>
            <div class="capture-buttons">
              <button id="btn-open-camera" class="btn-primary btn-full">
                ${ICONS.cameraSmall}
                Open Camera
              </button>
              <div class="or-divider">
                <div class="or-line"></div>
                <span class="or-text">or</span>
                <div class="or-line"></div>
              </div>
              <button id="btn-upload" class="btn-outline btn-full">
                ${ICONS.imageUp}
                Upload Image
              </button>
              <input type="file" id="file-input" accept="image/*" class="hidden" />
            </div>
          </div>
        </div>`;
    }

    // State 2: Camera active
    if (state.isCameraActive) {
      cameraContent = `
        <div class="capture-card">
          <div class="camera-feed">
            <video id="camera-video" autoplay playsinline class="camera-video"></video>
            <div class="viewfinder">
              <div class="viewfinder-h"></div>
              <div class="viewfinder-v"></div>
            </div>
            <div class="camera-controls">
              <button id="btn-close-camera" class="camera-close-btn">
                ${ICONS.x}
              </button>
              <button id="btn-capture" class="camera-capture-btn">
                <div class="camera-capture-inner"></div>
              </button>
              <div class="camera-spacer"></div>
            </div>
          </div>
        </div>`;
    }

    // State 3: Preview image
    if (state.previewImage) {
      var imgClass = state.isAnalyzing ? 'preview-img preview-img--loading' : 'preview-img';
      var overlay = '';
      if (state.isAnalyzing) {
        overlay = `
          <div class="loading-overlay">
            <div class="spinner"></div>
            <p id="loading-status-text" class="loading-status-text">${esc(state.loadingText)}</p>
          </div>`;
      } else {
        overlay = `
          <div class="preview-actions">
            <button id="btn-retake" class="btn-glass">
              ${ICONS.rotateCcw}
              Retake
            </button>
            <button id="btn-analyze" class="btn-primary-sm">
              ${ICONS.check}
              Analyze
            </button>
          </div>`;
      }
      cameraContent = `
        <div class="capture-card">
          <div class="preview-container">
            <img src="${state.previewImage.url}" alt="Preview" class="${imgClass}" />
            ${overlay}
          </div>
        </div>`;
    }

    return `
    <div class="capture-view anim-fade-scale-in">
      <div class="capture-hero">
        <h1 class="hero-title">Know your medicine instantly.</h1>
        <p class="hero-subtitle">Scan any medicine packaging or tablet to get detailed composition, safe usage instructions, potential side effects, and more.</p>
      </div>
      ${errorBlock}
      ${cameraContent}
      <div class="disclaimer">
        <p>Disclaimer: This tool uses AI for identification. Always consult a qualified healthcare professional.</p>
      </div>
    </div>`;
  }

  function buildMedicineNotIdentified() {
    return `
    <div class="anim-slide-up">
      <div class="not-identified-card">
        <div class="not-identified-icon">
          ${ICONS.alertTriangleLarge}
        </div>
        <h3 class="not-identified-title">Medicine Not Identified</h3>
        <p class="not-identified-text">We couldn't clearly identify a medicine from the provided image. Please try again with a clearer photo of the packaging, label, or tablet.</p>
        <button id="btn-try-again" class="btn-outline btn-full">
          ${ICONS.refreshCcw}
          Try Again
        </button>
      </div>
    </div>`;
  }

  function buildMedicineDetails() {
    var d = state.medicineData;
    if (!d) return '';
    if (!d.identified) return buildMedicineNotIdentified();

    var searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(d.purchaseQuery || 'buy ' + d.name);

    // Composition dots
    var compHtml = '';
    if (d.composition && d.composition.length > 0) {
      compHtml = d.composition.map(function (c) {
        return `<span class="comp-item"><span class="comp-dot"></span>${esc(c)}</span>`;
      }).join('');
    }

    // Precautions
    var precautionsHtml = '';
    if (d.precautions && d.precautions.length > 0) {
      var items = d.precautions.map(function (p) {
        return `<li class="precaution-item"><span class="precaution-bullet">•</span> ${esc(p)}</li>`;
      }).join('');
      precautionsHtml = `
        <div>
          <p class="section-sublabel">Precautions</p>
          <ul class="precaution-list">${items}</ul>
        </div>`;
    }

    // Side effects
    var sideEffectsHtml = '';
    if (d.sideEffects && d.sideEffects.length > 0) {
      var badges = d.sideEffects.map(function (e) {
        return `<span class="side-effect-badge">${esc(e)}</span>`;
      }).join('');
      sideEffectsHtml = `
        <div>
          <p class="section-sublabel section-sublabel--mt">Potential Side Effects</p>
          <div class="side-effects-wrap">${badges}</div>
        </div>`;
    }

    // Alternatives
    var alternativesHtml = '';
    if (d.alternatives && d.alternatives.length > 0) {
      var altItems = d.alternatives.map(function (a) {
        return `
          <div class="alt-item">
            <div class="alt-name">${esc(a)}</div>
            <div class="alt-badge">Alternative</div>
          </div>`;
      }).join('');
      alternativesHtml = `
        <div class="alt-card">
          <div class="alt-bg-circle"></div>
          <h3 class="alt-title">Verified Alternatives</h3>
          <div class="alt-list">${altItems}</div>
        </div>`;
    }

    return `
    <div class="anim-slide-up">
      <div class="medicine-card">
        <!-- Header -->
        <div class="medicine-header">
          <div class="medicine-header-bg">${ICONS.pillLarge}</div>
          <div class="medicine-header-content">
            <span class="id-badge">Current Identification</span>
            <h2 class="medicine-name">${esc(d.name)}</h2>
            <div class="comp-list">${compHtml}</div>
          </div>
        </div>

        <!-- Body -->
        <div class="medicine-body">
          <!-- Indications -->
          <section>
            <h3 class="section-heading">
              <span class="icon-activity">${ICONS.activity}</span>
              Indications &amp; Usage
            </h3>
            <div class="info-grid">
              <div class="info-box">
                <div class="info-label">Primary Use</div>
                <p class="info-value">${esc(d.usage)}</p>
              </div>
              <div class="info-box">
                <div class="info-label">General Dosage</div>
                <p class="info-value">${esc(d.dosage)}</p>
              </div>
            </div>
          </section>

          <!-- Safety Warnings -->
          <section>
            <h3 class="section-heading section-heading--warn">
              <span class="icon-warn">${ICONS.alertTriangle}</span>
              Safety Warnings
            </h3>
            <div class="warnings-content">
              ${precautionsHtml}
              ${sideEffectsHtml}
            </div>
          </section>

          <!-- Safety Profile -->
          <section>
            <div class="section-heading">
              <span class="icon-activity">${ICONS.shieldCheck}</span>
              Safety Profile &amp; Verified Alternatives
            </div>
            <div class="safety-rating-box">
              <div class="safety-dot"></div>
              <p class="safety-text">System Rating: <span class="safety-value">${esc(d.safetyRating)}</span></p>
            </div>
            ${alternativesHtml}
          </section>
        </div>

        <!-- Actions Footer -->
        <div class="medicine-footer">
          <button id="btn-scan-another" class="btn-outline btn-footer">
            ${ICONS.search}
            Scan Another
          </button>
          <a href="${searchUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary btn-footer btn-order">
            ${ICONS.shoppingCart}
            Order Delivery
          </a>
        </div>
      </div>
    </div>`;
  }

  function buildFooter() {
    return `
    <footer class="app-footer">
      <div class="footer-inner">
        <p class="footer-label">As a part of IDT Project built by Batch 9</p>
        <div class="footer-names">
          <span>G M AYSHATH AFEEZA</span>
          <span class="footer-sep">|</span>
          <span>GAMINI K</span>
          <span class="footer-sep">|</span>
          <span>HAMZATHUL KARRAR S H</span>
          <span class="footer-sep">|</span>
          <span>HANA FATHIMA SUDHARSHANA K</span>
          <span class="footer-sep">|</span>
          <span>SUJAN N</span>
        </div>
      </div>
    </footer>`;
  }

  // ─── Master Render ────────────────────────────────────────────────────
  function render() {
    var root = document.getElementById('root');
    if (!root) return;

    var mainContent = '';
    if (!state.medicineData) {
      mainContent = buildCaptureView();
    } else {
      mainContent = buildMedicineDetails();
    }

    root.innerHTML = `
      <div class="app-shell">
        ${buildHeader()}
        <main class="app-main">
          ${mainContent}
        </main>
        ${buildFooter()}
      </div>`;

    attachListeners();
  }

  // ─── Event Listeners ─────────────────────────────────────────────────
  function attachListeners() {
    // Logo / Home
    var logo = document.getElementById('logo-click');
    if (logo) logo.addEventListener('click', handleReset);

    var btnHome = document.getElementById('btn-home');
    if (btnHome) btnHome.addEventListener('click', handleReset);

    // Camera capture view
    var btnOpenCam = document.getElementById('btn-open-camera');
    if (btnOpenCam) btnOpenCam.addEventListener('click', startCamera);

    var btnUpload = document.getElementById('btn-upload');
    var fileInput = document.getElementById('file-input');
    if (btnUpload && fileInput) {
      btnUpload.addEventListener('click', function () { fileInput.click(); });
      fileInput.addEventListener('change', handleFileUpload);
    }

    var btnCloseCam = document.getElementById('btn-close-camera');
    if (btnCloseCam) btnCloseCam.addEventListener('click', stopCamera);

    var btnCapture = document.getElementById('btn-capture');
    if (btnCapture) btnCapture.addEventListener('click', capturePhoto);

    var btnRetake = document.getElementById('btn-retake');
    if (btnRetake) btnRetake.addEventListener('click', retakeImage);

    var btnAnalyze = document.getElementById('btn-analyze');
    if (btnAnalyze) btnAnalyze.addEventListener('click', submitImage);

    // Medicine detail actions
    var btnTryAgain = document.getElementById('btn-try-again');
    if (btnTryAgain) btnTryAgain.addEventListener('click', handleReset);

    var btnScanAnother = document.getElementById('btn-scan-another');
    if (btnScanAnother) btnScanAnother.addEventListener('click', handleReset);

    // Re-attach video stream if camera is active (stream survives re-render in state)
    if (state.isCameraActive && state.stream) {
      var video = document.getElementById('camera-video');
      if (video) video.srcObject = state.stream;
    }
  }

  // ─── Bootstrap ────────────────────────────────────────────────────────
  function init() {
    render();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
