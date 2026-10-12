/**
 * Presentation App Controller
 * NLP Architecture Evolution over Time
 */

class PresentationApp {
  constructor() {
    this.currentSlideIndex = 0;
    this.totalSlides = PRESENTATION_DATA.papers.length + 2; // Slide 0 (Title/Intro) + 12 Papers + Final Synthesis (Total = 14)
    this.activeView = "slides"; // 'slides' or 'mindmap'
    this.autoplayInterval = null;
    this.isAutoplaying = false;
    this.activeModalPaper = null;
    this.showingFullPageInModal = false;

    this.simAnimations = new SlideAnimations();

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderThumbnailStrip();
    this.renderMindmap();
    this.goToSlide(0);
  }

  bindEvents() {
    // Nav buttons
    document.getElementById("btnPrevSlide").addEventListener("click", () => this.prevSlide());
    document.getElementById("btnNextSlide").addEventListener("click", () => this.nextSlide());

    // Header buttons
    document.getElementById("btnAutoPlay").addEventListener("click", () => this.toggleAutoplay());
    document.getElementById("btnFullscreen").addEventListener("click", () => this.toggleFullscreen());
    document.getElementById("btnHelp").addEventListener("click", () => this.openModal("shortcutsModal"));

    // View tabs (Slides vs Evolution Mindmap)
    document.getElementById("tabNavSlides").addEventListener("click", () => this.switchView("slides"));
    document.getElementById("tabNavMindmap").addEventListener("click", () => this.switchView("mindmap"));

    // Modal close handlers
    document.getElementById("modalCloseBtn").addEventListener("click", () => this.closeModal("snapshotModal"));
    document.getElementById("closeShortcutsBtn").addEventListener("click", () => this.closeModal("shortcutsModal"));
    document.getElementById("snapshotModal").addEventListener("click", (e) => {
      if (e.target.id === "snapshotModal") this.closeModal("snapshotModal");
    });
    document.getElementById("shortcutsModal").addEventListener("click", (e) => {
      if (e.target.id === "shortcutsModal") this.closeModal("shortcutsModal");
    });

    // Modal view mode toggle
    document.getElementById("modalToggleViewBtn").addEventListener("click", () => {
      this.toggleModalImageMode();
    });

    // Global keyboard navigation
    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
  }

  handleKeyDown(e) {
    if (e.key === "Escape") {
      this.closeModal("snapshotModal");
      this.closeModal("shortcutsModal");
      return;
    }

    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
      e.preventDefault();
      this.nextSlide();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      this.prevSlide();
    } else if (e.key === "Home") {
      e.preventDefault();
      this.goToSlide(0);
    } else if (e.key === "End") {
      e.preventDefault();
      this.goToSlide(this.totalSlides - 1);
    } else if (e.key.toLowerCase() === "f") {
      this.toggleFullscreen();
    } else if (e.key.toLowerCase() === "a") {
      this.toggleAutoplay();
    } else if (e.key === "1") {
      this.switchView("slides");
    } else if (e.key === "2") {
      this.switchView("mindmap");
    } else if (e.key === "?") {
      this.openModal("shortcutsModal");
    }
  }

  switchView(viewName) {
    this.activeView = viewName;

    const slidesTab = document.getElementById("tabNavSlides");
    const mindmapTab = document.getElementById("tabNavMindmap");
    const slidesView = document.getElementById("slidesView");
    const mindmapView = document.getElementById("mindmapView");

    if (viewName === "slides") {
      slidesTab.classList.add("active");
      mindmapTab.classList.remove("active");
      slidesView.style.display = "flex";
      mindmapView.classList.remove("active");
    } else {
      mindmapTab.classList.add("active");
      slidesTab.classList.remove("active");
      slidesView.style.display = "none";
      mindmapView.classList.add("active");
    }
  }

  goToSlide(index) {
    if (index < 0 || index >= this.totalSlides) return;
    this.currentSlideIndex = index;

    if (this.activeView !== "slides") {
      this.switchView("slides");
    }

    this.renderSlide(index);
    this.updateFooter();
    this.updateProgressBar();
    this.updateThumbnailActiveState();
  }

  nextSlide() {
    if (this.currentSlideIndex < this.totalSlides - 1) {
      this.goToSlide(this.currentSlideIndex + 1);
    } else if (this.isAutoplaying) {
      this.goToSlide(0);
    }
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.goToSlide(this.currentSlideIndex - 1);
    }
  }

  updateFooter() {
    const prevBtn = document.getElementById("btnPrevSlide");
    const nextBtn = document.getElementById("btnNextSlide");
    const counter = document.getElementById("slideCounterText");

    prevBtn.disabled = this.currentSlideIndex === 0;
    nextBtn.disabled = this.currentSlideIndex === this.totalSlides - 1;

    const displayNum = (this.currentSlideIndex + 1).toString().padStart(2, "0");
    const totalNum = this.totalSlides.toString().padStart(2, "0");
    counter.innerHTML = `Slide <span>${displayNum}</span> / ${totalNum}`;
  }

  updateProgressBar() {
    const pct = ((this.currentSlideIndex + 1) / this.totalSlides) * 100;
    document.getElementById("progressBar").style.width = `${pct}%`;
  }

  renderThumbnailStrip() {
    const strip = document.getElementById("thumbnailStrip");
    strip.innerHTML = "";

    const labels = [
      "Title", "P1 RNN", "P2 LSTM", "P3 GRU", "P4 Seq2Seq",
      "P5 Bahdanau", "P6 Luong", "P7 Transformer", "P8 BERT",
      "P9 T5", "P10 GPT-3", "Case 1", "Case 2", "Synthesis"
    ];

    for (let i = 0; i < this.totalSlides; i++) {
      const item = document.createElement("div");
      item.className = "thumb-item";
      item.textContent = labels[i] || (i + 1).toString();
      item.title = `Jump to Slide ${i + 1}`;
      item.addEventListener("click", () => this.goToSlide(i));
      strip.appendChild(item);
    }
  }

  updateThumbnailActiveState() {
    const items = document.querySelectorAll("#thumbnailStrip .thumb-item");
    items.forEach((item, idx) => {
      if (idx === this.currentSlideIndex) {
        item.classList.add("active");
        item.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      } else {
        item.classList.remove("active");
      }
    });
  }

  renderSlide(index) {
    const container = document.getElementById("slidesView");
    container.innerHTML = "";

    if (index === 0) {
      // First Slide: Clean Title Slide with Overview and Credits in lower right
      container.innerHTML = this.getTitleSlideHtml();
    } else if (index >= 1 && index <= PRESENTATION_DATA.papers.length) {
      // Paper Slides
      const paper = PRESENTATION_DATA.papers[index - 1];
      container.innerHTML = this.getPaperSlideHtml(paper, index);

      // Mount simulator directly in the lower-right area
      setTimeout(() => {
        this.simAnimations.mount(`simContainer_${paper.key}`, paper.animationType);
        this.bindPaperSlideEvents(paper);
      }, 40);
    } else {
      // Final Synthesis Slide
      container.innerHTML = this.getSynthesisSlideHtml();
    }
  }

  // Slide 1: Grand Title Slide with Credits in Lower Right Corner
  getTitleSlideHtml() {
    const meta = PRESENTATION_DATA.meta;
    return `
      <div class="title-slide-container">
        <!-- Top Hero Section -->
        <div class="title-hero">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-xs font-semibold uppercase tracking-wider mb-3">
            <span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            NLP Evolutionary Trajectory
          </div>
          
          <h1 class="title-main-heading">
            ${meta.title}
          </h1>
          
          <p class="title-subtitle">
            ${meta.subtitle}
          </p>

          <!-- Overview Cards (What these slides contain) -->
          <div class="overview-grid">
            <div class="overview-card">
              <div class="overview-card-num">PHASE 01</div>
              <div class="overview-card-title">Recurrent Foundations</div>
              <div class="overview-card-desc">RNN, LSTM, and GRU sequence processing and the 25-word memory barrier.</div>
            </div>

            <div class="overview-card">
              <div class="overview-card-num">PHASE 02</div>
              <div class="overview-card-title">Attention Alignment</div>
              <div class="overview-card-desc">Seq2Seq fixed vector bottleneck solved by Bahdanau and Luong dynamic attention.</div>
            </div>

            <div class="overview-card">
              <div class="overview-card-num">PHASE 03</div>
              <div class="overview-card-title">Transformer & LLMs</div>
              <div class="overview-card-desc">Parallel multi-head attention, bidirectional BERT, unified T5, and few-shot GPT-3.</div>
            </div>
          </div>
        </div>

        <!-- Bottom Row: Quick Start & Credits Card in Lower Right Corner -->
        <div class="title-bottom-row">
          <div class="title-action-box">
            <button class="nav-btn py-2 px-5 text-sm font-bold bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-0 shadow-lg shadow-sky-500/25" onclick="window.presentationApp.goToSlide(1)">
              <span>Explore Presentation</span>
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
            <button class="nav-btn py-2 px-4 text-xs" onclick="window.presentationApp.switchView('mindmap')">
              <span>View Mindmap</span>
            </button>
          </div>

          <!-- Lower Right Corner Presentation Credits -->
          <div class="credits-card">
            <div class="credits-header">
              <svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              <span>Presentaion by-</span>
            </div>
            <div class="credits-list">
              <div class="credits-item">
                <span class="credits-prn">202301070164-</span>
                <span class="credits-name">Aryan Kumar</span>
              </div>
              <div class="credits-item">
                <span class="credits-prn">202301070165-</span>
                <span class="credits-name">Amir Furquani</span>
              </div>
              <div class="credits-item">
                <span class="credits-prn">202301070166-</span>
                <span class="credits-name">Devesh patil</span>
              </div>
              <div class="credits-item">
                <span class="credits-prn">202301070167-</span>
                <span class="credits-name">Raviraj Sonar</span>
              </div>
            </div>
            <div class="credits-guide">
              <span class="text-slate-400">Guided by-</span>
              <span class="credits-name text-emerald-400">Dr. Smita Kulkarni</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Model Slides (No formulas list, clean advantages & limitations, and no blank space on lower right)
  getPaperSlideHtml(paper, slideNum) {
    return `
      <!-- LEFT COLUMN: Meta, Benchmarks, Advantages & Limitations -->
      <div class="slide-content-left">
        <div class="info-card">
          <div class="slide-badge-row">
            <span class="era-badge">${paper.era}</span>
            <span class="paper-year-badge">${paper.year}</span>
          </div>
          
          <h2 class="slide-title">${paper.name}</h2>
          
          <div class="paper-meta-row">
            <div class="meta-item">
              <span class="text-slate-400">Authors:</span>
              <strong>${paper.authors}</strong>
            </div>
            <div class="meta-item">
              <span class="text-slate-400">Affiliation:</span>
              <strong>${paper.affiliation}</strong>
            </div>
            <div class="meta-item">
              <span class="text-slate-400">Venue:</span>
              <span class="font-mono text-slate-300">${paper.venue}</span>
            </div>
            <a href="${paper.doi}" target="_blank" rel="noopener noreferrer" class="doi-link-btn" title="Open canonical DOI">
              <span>DOI ↗</span>
            </a>
          </div>

          <!-- Task & Dataset Section -->
          <div class="grid grid-cols-2 gap-3 mb-2">
            <div class="p-2.5 bg-slate-900/80 rounded border border-slate-800 text-xs">
              <div class="text-slate-400 font-semibold mb-0.5">Task Performed:</div>
              <div class="text-sky-300 font-medium">${paper.task}</div>
            </div>
            <div class="p-2.5 bg-slate-900/80 rounded border border-slate-800 text-xs">
              <div class="text-slate-400 font-semibold mb-0.5">Dataset & Benchmark:</div>
              <div class="text-amber-300 font-medium">${paper.dataset}</div>
              <div class="text-[10.5px] text-slate-400 mt-0.5">${paper.datasetSize}</div>
            </div>
          </div>

          <!-- Benchmark Metrics Grid -->
          <div class="metric-grid">
            ${paper.benchmarkResults.map(res => `
              <div class="metric-chip">
                <div class="metric-label truncate" title="${res.metric}">${res.metric}</div>
                <div class="metric-value">${res.value}</div>
                <div class="metric-note">${res.note}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Enhanced Advantages & Limitations Presentation (Clean & Prominent) -->
        <div class="feature-cards-grid">
          <!-- Advantages Card -->
          <div class="advantage-card">
            <div class="advantage-header">
              <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>Key Advantages & Capabilities</span>
            </div>
            <ul class="advantage-list">
              ${paper.advantages.map(adv => `
                <li class="advantage-item"><span>${adv}</span></li>
              `).join('')}
            </ul>
          </div>

          <!-- Limitations Card -->
          <div class="limitation-card">
            <div class="limitation-header">
              <svg class="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <span>Primary Limitations</span>
            </div>
            <ul class="limitation-list">
              ${paper.limitations.map(lim => `
                <li class="limitation-item"><span>${lim}</span></li>
              `).join('')}
            </ul>
          </div>

          <!-- Next Paper Transition / Solution Card -->
          <div class="next-transition-box">
            <span class="next-transition-badge">Solved In Next Model</span>
            <span class="leading-tight">${paper.solvedByNext}</span>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Architecture Diagram (Top) + Live Interactive Simulator (Lower Right) -->
      <!-- Completely filled top-to-bottom so no area feels blank -->
      <div class="slide-content-right">
        <!-- Top: Architecture Image Display -->
        <div class="architecture-showcase-card">
          <div class="arch-card-header">
            <div class="arch-card-title">
              <svg class="w-3.5 h-3.5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <span>Model Architecture</span>
            </div>
            <button class="sim-btn" id="zoomArchBtn_${paper.key}" title="Inspect full resolution">
              <span>Zoom Image</span>
            </button>
          </div>
          <div class="arch-img-frame" id="imgFrame_${paper.key}">
            <img src="${paper.imageSrc}" alt="${paper.name} Architecture" class="arch-display-img" id="archImg_${paper.key}">
          </div>
          <div class="arch-caption-bar" title="${paper.imageCaption}">${paper.imageCaption}</div>
        </div>

        <!-- Lower Right: Live Interactive Architectural Simulator / Animation -->
        <div class="live-sim-card">
          <div id="simContainer_${paper.key}" class="w-full h-full flex flex-col"></div>
        </div>
      </div>
    `;
  }

  // Final Synthesis Slide
  getSynthesisSlideHtml() {
    return `
      <div class="slide-content-left">
        <div class="info-card">
          <div class="slide-badge-row">
            <span class="era-badge">COMPREHENSIVE SYNTHESIS</span>
            <span class="paper-year-badge">1990 – 2024</span>
          </div>
          <h2 class="slide-title">Summary of Architectural Evolution</h2>
          <p class="text-sm text-slate-300 leading-relaxed mb-4">
            From early recurrent transitions to state-of-the-art foundation models, each milestone directly overcame the computational and structural bottleneck of its predecessor.
          </p>

          <div class="grid grid-cols-2 gap-3 text-xs mb-4">
            <div class="p-3 bg-slate-900 rounded border border-slate-800">
              <div class="text-sky-400 font-bold mb-1">1. Overcoming the 25-Word Limit</div>
              <div class="text-slate-400">LSTM introduced the Constant Error Carousel (CEC) to maintain constant gradient flow across time lags exceeding 1,000 steps.</div>
            </div>
            <div class="p-3 bg-slate-900 rounded border border-slate-800">
              <div class="text-indigo-400 font-bold mb-1">2. Breaking the Vector Bottleneck</div>
              <div class="text-slate-400">Attention eliminated the fixed-length vector C, giving decoders dynamic visibility over all source words.</div>
            </div>
            <div class="p-3 bg-slate-900 rounded border border-slate-800">
              <div class="text-amber-400 font-bold mb-1">3. Recurrence to Parallel Attention</div>
              <div class="text-slate-400">The Transformer replaced sequential loops with O(1) multi-head self-attention, unlocking massive GPU scaling.</div>
            </div>
            <div class="p-3 bg-slate-900 rounded border border-slate-800">
              <div class="text-emerald-400 font-bold mb-1">4. Pre-training to In-Context Learning</div>
              <div class="text-slate-400">From fine-tuned BERT and T5 to GPT-3 few-shot in-context learning without task parameter updates.</div>
            </div>
          </div>

          <div class="border-t border-slate-800 pt-3 flex items-center justify-between">
            <span class="text-xs text-slate-400">Interactive Map:</span>
            <button class="nav-btn py-1.5 px-4 text-xs font-bold" onclick="window.presentationApp.switchView('mindmap')">
              <span>Explore Interactive Evolution Mindmap →</span>
            </button>
          </div>
        </div>
      </div>

      <div class="slide-content-right">
        <div class="info-card">
          <div class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Model Progression Timeline</div>
          <div class="space-y-1.5 text-xs font-mono">
            <div class="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
              <span class="text-sky-300 font-bold">1990 · RNN</span>
              <span class="text-rose-400 text-[11px]">25-word memory limit</span>
            </div>
            <div class="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
              <span class="text-sky-300 font-bold">1997 · LSTM</span>
              <span class="text-emerald-400 text-[11px]">Constant Error Carousel</span>
            </div>
            <div class="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
              <span class="text-sky-300 font-bold">2014 · GRU</span>
              <span class="text-indigo-400 text-[11px]">Streamlined gating</span>
            </div>
            <div class="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
              <span class="text-sky-300 font-bold">2014 · Seq2Seq</span>
              <span class="text-rose-400 text-[11px]">Fixed vector bottleneck</span>
            </div>
            <div class="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
              <span class="text-sky-300 font-bold">2015 · Attention</span>
              <span class="text-emerald-400 text-[11px]">Dynamic alignment</span>
            </div>
            <div class="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
              <span class="text-sky-300 font-bold">2017 · Transformer</span>
              <span class="text-amber-400 text-[11px]">Parallel self-attention</span>
            </div>
            <div class="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
              <span class="text-sky-300 font-bold">2018 · BERT</span>
              <span class="text-cyan-400 text-[11px]">Bidirectional pretraining</span>
            </div>
            <div class="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
              <span class="text-sky-300 font-bold">2019 · T5</span>
              <span class="text-teal-400 text-[11px]">Unified text-to-text</span>
            </div>
            <div class="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
              <span class="text-sky-300 font-bold">2020 · GPT-3</span>
              <span class="text-emerald-400 text-[11px]">Few-shot in-context</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindPaperSlideEvents(paper) {
    const zoomBtn = document.getElementById(`zoomArchBtn_${paper.key}`);
    const imgFrame = document.getElementById(`imgFrame_${paper.key}`);

    if (zoomBtn) {
      zoomBtn.onclick = () => this.openSnapshotModal(paper);
    }
    if (imgFrame) {
      imgFrame.onclick = () => this.openSnapshotModal(paper);
    }
  }

  // Snapshot Modal Lightbox
  openSnapshotModal(paper) {
    this.activeModalPaper = paper;
    this.showingFullPageInModal = false;

    document.getElementById("modalPaperTitle").textContent = paper.name;
    document.getElementById("modalPaperBadge").textContent = `${paper.era} · ${paper.year}`;
    document.getElementById("modalPreviewImg").src = paper.imageSrc;
    document.getElementById("modalImgCaption").textContent = paper.imageCaption;
    document.getElementById("modalDoiLink").href = paper.doi;
    document.getElementById("modalToggleViewBtn").textContent = "View Original Paper Page";

    this.openModal("snapshotModal");
  }

  toggleModalImageMode() {
    if (!this.activeModalPaper) return;
    this.showingFullPageInModal = !this.showingFullPageInModal;
    const img = document.getElementById("modalPreviewImg");
    const btn = document.getElementById("modalToggleViewBtn");
    const caption = document.getElementById("modalImgCaption");

    if (this.showingFullPageInModal) {
      img.src = this.activeModalPaper.snapshotFull;
      btn.textContent = "View Architecture Diagram";
      caption.textContent = `Full primary source page view from ${this.activeModalPaper.title} (${this.activeModalPaper.venue})`;
    } else {
      img.src = this.activeModalPaper.imageSrc;
      btn.textContent = "View Original Paper Page";
      caption.textContent = this.activeModalPaper.imageCaption;
    }
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add("open");
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("open");
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn("Fullscreen error:", err);
      });
      document.getElementById("btnFullscreen").classList.add("active");
    } else {
      document.exitFullscreen();
      document.getElementById("btnFullscreen").classList.remove("active");
    }
  }

  toggleAutoplay() {
    this.isAutoplaying = !this.isAutoplaying;
    const btn = document.getElementById("btnAutoPlay");

    if (this.isAutoplaying) {
      btn.classList.add("active");
      this.autoplayInterval = setInterval(() => {
        this.nextSlide();
      }, 9000);
    } else {
      btn.classList.remove("active");
      clearInterval(this.autoplayInterval);
    }
  }

  // Render the Evolution Mindmap
  renderMindmap() {
    const container = document.getElementById("mindmapContainer");
    if (!container) return;

    let slideTarget = 1;
    container.innerHTML = PRESENTATION_DATA.evolutionMindmap.map((branch) => {
      const nodesHtml = branch.models.map((m) => {
        const targetIdx = slideTarget++;
        return `
          <div class="mindmap-node-card" onclick="window.presentationApp.goToSlide(${targetIdx})">
            <div class="mindmap-node-title">
              <span>${m.name}</span>
              <span class="text-xs text-sky-400 font-mono">Slide ${targetIdx + 1} →</span>
            </div>
            <div class="mindmap-node-desc">${m.desc}</div>
            <div class="mindmap-node-limit">
              <strong>Limitation:</strong> ${m.limitation}
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="mindmap-branch-row">
          <div class="mindmap-branch-header">
            <span class="mindmap-branch-badge" style="color:${branch.color}; border-color:${branch.color}; background:${branch.color}15;">
              ${branch.era}
            </span>
          </div>
          <div class="mindmap-nodes-container">
            ${nodesHtml}
          </div>
        </div>
      `;
    }).join('');
  }
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  window.presentationApp = new PresentationApp();
});
