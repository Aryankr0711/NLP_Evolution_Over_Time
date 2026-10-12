/**
 * Interactive Architectural Simulators & Animations for NLP Evolution Slides
 * Built with HTML5 Canvas and SVG for smooth, responsive 60fps animations
 */

class SlideAnimations {
  constructor() {
    this.activeSimulators = {};
  }

  // Mount simulator based on type
  mount(containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    // Clear any previous simulator running on this container
    if (this.activeSimulators[containerId]) {
      this.activeSimulators[containerId].destroy();
      delete this.activeSimulators[containerId];
    }

    let sim = null;
    switch (type) {
      case "rnn_unfold":
        sim = new RnnUnfoldingSim(container);
        break;
      case "lstm_gates":
        sim = new LstmCellSim(container);
        break;
      case "gru_gates":
        sim = new GruCellSim(container);
        break;
      case "enc_dec_bottleneck":
        sim = new EncDecBottleneckSim(container);
        break;
      case "attention_alignment":
        sim = new AttentionAlignmentSim(container);
        break;
      case "luong_global_local":
        sim = new LuongAttentionSim(container);
        break;
      case "transformer_attention":
        sim = new TransformerAttentionSim(container);
        break;
      case "bert_masked":
        sim = new BertMlmSim(container);
        break;
      case "t5_text2text":
        sim = new T5Text2TextSim(container);
        break;
      case "gpt3_prompt":
        sim = new Gpt3InContextSim(container);
        break;
      case "aitken_decomposition":
        sim = new AitkenDecompositionSim(container);
        break;
      case "app_sentiment_pipeline":
        sim = new AppSentimentPipelineSim(container);
        break;
      default:
        container.innerHTML = `<div class="p-4 text-center text-slate-400">Interactive architecture visualizer ready.</div>`;
    }

    if (sim) {
      this.activeSimulators[containerId] = sim;
    }
  }
}

// 1. RNN Unfolding & Vanishing Gradient Simulator
class RnnUnfoldingSim {
  constructor(container) {
    this.container = container;
    this.isUnfolded = true;
    this.animating = true;
    this.t = 0;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-header">
          <div class="sim-title">
            <span class="sim-badge">INTERACTIVE SIMULATION</span>
            <span>RNN Temporal Unfolding & Gradient Flow</span>
          </div>
          <div class="sim-controls">
            <button class="sim-btn" id="rnnToggleFold">Fold / Unfold</button>
            <button class="sim-btn" id="rnnToggleFlow">Toggle BPTT Gradient</button>
          </div>
        </div>
        <canvas id="rnnCanvas" width="560" height="260" class="sim-canvas"></canvas>
        <div class="sim-footer">
          <span class="sim-legend-item"><span class="legend-dot" style="background:#38bdf8;"></span> Forward State (h_t)</span>
          <span class="sim-legend-item"><span class="legend-dot" style="background:#f43f5e;"></span> Vanishing Gradient Flow (∂L/∂h_1)</span>
          <span class="sim-note">Notice how gradient vanishes exponentially after ~20 words!</span>
        </div>
      </div>
    `;

    this.canvas = document.getElementById("rnnCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.showGradient = true;

    document.getElementById("rnnToggleFold").onclick = () => {
      this.isUnfolded = !this.isUnfolded;
    };
    document.getElementById("rnnToggleFlow").onclick = () => {
      this.showGradient = !this.showGradient;
    };

    this.loop = () => {
      this.render();
      this.t += 0.04;
      if (this.animating) {
        this.raf = requestAnimationFrame(this.loop);
      }
    };
    this.raf = requestAnimationFrame(this.loop);
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (!this.isUnfolded) {
      // Folded single cell
      const cx = w / 2;
      const cy = h / 2;

      // Recurrent loop
      ctx.beginPath();
      ctx.arc(cx, cy - 35, 25, 0.2 * Math.PI, 1.8 * Math.PI);
      ctx.strokeStyle = "#818cf8";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Recurrent weight label
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "12px JetBrains Mono";
      ctx.fillText("W_hh", cx + 30, cy - 40);

      // Input x_t
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy + 80);
      ctx.lineTo(cx, cy + 30);
      ctx.stroke();
      ctx.fillText("x_t", cx - 10, cy + 95);

      // Output y_t
      ctx.beginPath();
      ctx.moveTo(cx, cy - 30);
      ctx.lineTo(cx, cy - 80);
      ctx.stroke();
      ctx.fillText("y_t", cx - 10, cy - 90);

      // Cell body
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(cx - 35, cy - 25, 70, 50, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px Inter";
      ctx.fillText("RNN Cell", cx - 28, cy - 2);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px JetBrains Mono";
      ctx.fillText("h_t = tanh", cx - 26, cy + 14);

    } else {
      // Unfolded across time steps t=1..5
      const steps = 5;
      const startX = 60;
      const gapX = (w - 120) / (steps - 1);
      const cy = h / 2;

      // Draw horizontal recurrent transitions
      for (let i = 0; i < steps - 1; i++) {
        const x1 = startX + i * gapX + 28;
        const x2 = startX + (i + 1) * gapX - 28;

        // Forward arrow
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x1, cy);
        ctx.lineTo(x2, cy);
        ctx.stroke();

        // Arrow head
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.moveTo(x2, cy);
        ctx.lineTo(x2 - 6, cy - 4);
        ctx.lineTo(x2 - 6, cy + 4);
        ctx.fill();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px JetBrains Mono";
        ctx.fillText("W_hh", (x1 + x2) / 2 - 12, cy - 8);

        // Animated pulse
        const pulsePos = (Math.sin(this.t * 2 - i * 0.8) + 1) / 2;
        const px = x1 + (x2 - x1) * pulsePos;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(px, cy, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Vanishing gradient backward arrow (red)
        if (this.showGradient) {
          const gradAlpha = Math.pow(0.45, (steps - 1 - i));
          ctx.strokeStyle = `rgba(244, 63, 94, ${Math.max(0.08, gradAlpha)})`;
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 3]);
          ctx.beginPath();
          ctx.moveTo(x2, cy + 16);
          ctx.lineTo(x1, cy + 16);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = `rgba(244, 63, 94, ${gradAlpha})`;
          ctx.font = "9px JetBrains Mono";
          ctx.fillText(`∂L/${(steps-1-i)}`, (x1 + x2) / 2 - 10, cy + 28);
        }
      }

      // Draw each step cell
      for (let i = 0; i < steps; i++) {
        const x = startX + i * gapX;

        // Input x_t
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, cy + 65);
        ctx.lineTo(x, cy + 25);
        ctx.stroke();

        ctx.fillStyle = "#38bdf8";
        ctx.font = "11px JetBrains Mono";
        ctx.fillText(`x_${i + 1}`, x - 10, cy + 80);

        // Output y_t
        ctx.beginPath();
        ctx.moveTo(x, cy - 25);
        ctx.lineTo(x, cy - 65);
        ctx.stroke();

        ctx.fillStyle = "#a855f7";
        ctx.font = "11px JetBrains Mono";
        ctx.fillText(`y_${i + 1}`, x - 10, cy - 72);

        // Cell body
        ctx.fillStyle = "#1e293b";
        ctx.strokeStyle = "#818cf8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x - 26, cy - 22, 52, 44, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px Inter";
        ctx.fillText(`h_${i + 1}`, x - 10, cy + 4);
      }
    }
  }

  destroy() {
    this.animating = false;
    cancelAnimationFrame(this.raf);
  }
}

// 2. LSTM Memory Cell Gating Simulator
class LstmCellSim {
  constructor(container) {
    this.container = container;
    this.fGate = 0.85; // Forget gate
    this.iGate = 0.70; // Input gate
    this.cPrev = 0.60; // Previous cell state
    this.cCand = 0.90; // Candidate memory
    this.oGate = 0.80; // Output gate
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-header">
          <div class="sim-title">
            <span class="sim-badge" style="background:#10b981; color:#022c22;">INTERACTIVE GATES</span>
            <span>LSTM Constant Error Carousel (CEC) Simulator</span>
          </div>
        </div>
        <div class="lstm-grid">
          <div class="lstm-sliders">
            <div class="slider-group">
              <label>Forget Gate (f_t): <span id="fVal" class="val-badge text-amber-400">0.85</span></label>
              <input type="range" id="fSlider" min="0" max="1" step="0.05" value="0.85" class="sim-slider">
              <small class="text-slate-400 text-xs">Controls how much of past memory C_{t-1} is retained.</small>
            </div>
            <div class="slider-group">
              <label>Input Gate (i_t): <span id="iVal" class="val-badge text-sky-400">0.70</span></label>
              <input type="range" id="iSlider" min="0" max="1" step="0.05" value="0.70" class="sim-slider">
              <small class="text-slate-400 text-xs">Controls how much new candidate ~C_t is written.</small>
            </div>
            <div class="slider-group">
              <label>Output Gate (o_t): <span id="oVal" class="val-badge text-emerald-400">0.80</span></label>
              <input type="range" id="oSlider" min="0" max="1" step="0.05" value="0.80" class="sim-slider">
              <small class="text-slate-400 text-xs">Controls hidden state exposure h_t = o_t · tanh(C_t).</small>
            </div>
          </div>
          <div class="lstm-calc-panel">
            <div class="math-box">
              <div class="math-title">Memory Cell Equation:</div>
              <div class="math-formula">C_t = f_t ⊙ C_{t-1} + i_t ⊙ ~C_t</div>
              <div id="cMathResult" class="math-calc font-mono text-sm text-sky-300">
                C_t = (0.85 × 0.60) + (0.70 × 0.90) = 1.14
              </div>
            </div>
            <div class="math-box mt-3">
              <div class="math-title">Hidden State Output:</div>
              <div class="math-formula">h_t = o_t ⊙ tanh(C_t)</div>
              <div id="hMathResult" class="math-calc font-mono text-sm text-emerald-300">
                h_t = 0.80 × tanh(1.14) = 0.652
              </div>
            </div>
            <div class="cec-status mt-3 p-2 rounded bg-slate-900 border border-slate-700 text-xs text-slate-300">
              <strong class="text-emerald-400">CEC Principle:</strong> Because updates are ADDITIVE rather than purely multiplicative matrix products, error signals flow without exponential decay across 1,000+ steps!
            </div>
          </div>
        </div>
      </div>
    `;

    const fSlider = document.getElementById("fSlider");
    const iSlider = document.getElementById("iSlider");
    const oSlider = document.getElementById("oSlider");

    const update = () => {
      this.fGate = parseFloat(fSlider.value);
      this.iGate = parseFloat(iSlider.value);
      this.oGate = parseFloat(oSlider.value);

      document.getElementById("fVal").textContent = this.fGate.toFixed(2);
      document.getElementById("iVal").textContent = this.iGate.toFixed(2);
      document.getElementById("oVal").textContent = this.oGate.toFixed(2);

      const retained = this.fGate * this.cPrev;
      const written = this.iGate * this.cCand;
      const cTotal = retained + written;
      const hOut = this.oGate * Math.tanh(cTotal);

      document.getElementById("cMathResult").textContent =
        `C_t = (${this.fGate.toFixed(2)} × ${this.cPrev.toFixed(2)}) + (${this.iGate.toFixed(2)} × ${this.cCand.toFixed(2)}) = ${cTotal.toFixed(3)}`;

      document.getElementById("hMathResult").textContent =
        `h_t = ${this.oGate.toFixed(2)} × tanh(${cTotal.toFixed(3)}) = ${hOut.toFixed(3)}`;
    };

    fSlider.oninput = update;
    iSlider.oninput = update;
    oSlider.oninput = update;
  }

  destroy() {}
}

// 3. GRU Gated Recurrent Unit Simulator
class GruCellSim {
  constructor(container) {
    this.container = container;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-header">
          <div class="sim-title">
            <span class="sim-badge" style="background:#8b5cf6; color:#ffffff;">GRU GATING</span>
            <span>Reset (r_t) & Update (z_t) Blending</span>
          </div>
        </div>
        <div class="gru-layout p-3 bg-slate-900/60 rounded border border-slate-800">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-xs text-slate-300 font-semibold">Update Gate (z_t): <span id="zVal" class="text-purple-400 font-mono">0.60</span></label>
              <input type="range" id="zSlider" min="0" max="1" step="0.05" value="0.60" class="sim-slider w-full">
              <p class="text-xs text-slate-400 mt-1">Balances previous state (1 - z_t) vs new candidate (z_t).</p>
            </div>
            <div>
              <label class="text-xs text-slate-300 font-semibold">Reset Gate (r_t): <span id="rVal" class="text-pink-400 font-mono">0.75</span></label>
              <input type="range" id="rSlider" min="0" max="1" step="0.05" value="0.75" class="sim-slider w-full">
              <p class="text-xs text-slate-400 mt-1">Controls how much previous state h_{t-1} affects candidate ~h_t.</p>
            </div>
          </div>
          <div class="mt-4 p-3 bg-slate-950 rounded border border-purple-900/40 font-mono text-xs">
            <div class="text-slate-400">1. Candidate state: ~h_t = tanh(W · [r_t ⊙ h_{t-1}, x_t])</div>
            <div class="text-purple-300 mt-1">2. State interpolation: h_t = (1 - z_t) ⊙ h_{t-1} + z_t ⊙ ~h_t</div>
            <div id="gruBlendResult" class="text-emerald-400 mt-2 font-bold">
              h_t = (0.40 × Past Memory) + (0.60 × New Candidate)
            </div>
          </div>
          <div class="mt-3 text-xs text-slate-400">
            <strong>Key Difference from LSTM:</strong> No distinct memory cell C_t; only 2 gates (update & reset) instead of 3, yielding ~25% fewer parameters and faster training convergence.
          </div>
        </div>
      </div>
    `;

    const zSlider = document.getElementById("zSlider");
    const rSlider = document.getElementById("rSlider");

    const update = () => {
      const z = parseFloat(zSlider.value);
      const r = parseFloat(rSlider.value);
      document.getElementById("zVal").textContent = z.toFixed(2);
      document.getElementById("rVal").textContent = r.toFixed(2);
      const pastWeight = (1 - z).toFixed(2);
      const newWeight = z.toFixed(2);
      document.getElementById("gruBlendResult").textContent =
        `h_t = (${pastWeight} × Past Memory) + (${newWeight} × New Candidate)`;
    };

    zSlider.oninput = update;
    rSlider.oninput = update;
  }

  destroy() {}
}

// 4. Encoder-Decoder Fixed-Length Bottleneck Simulator
class EncDecBottleneckSim {
  constructor(container) {
    this.container = container;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-header">
          <div class="sim-title">
            <span class="sim-badge" style="background:#e11d48; color:#fff;">THE BOTTLENECK</span>
            <span>Why Classical Seq2Seq Fails on Long Sequences</span>
          </div>
        </div>
        <div class="p-3 bg-slate-900/70 rounded border border-slate-800">
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs text-slate-300 font-semibold">Sentence Length: <span id="seqLenVal" class="text-rose-400 font-mono font-bold text-sm">35 words</span></label>
            <span id="bleuEstimate" class="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">BLEU: 18.2 (Severely Degraded)</span>
          </div>
          <input type="range" id="seqSlider" min="5" max="60" step="5" value="35" class="sim-slider w-full">
          
          <div class="bottleneck-vis mt-3 flex items-center justify-between bg-slate-950 p-3 rounded border border-slate-800">
            <div class="text-center w-1/3">
              <div class="text-xs text-sky-400 font-bold mb-1">Source Words (x_1 .. x_T)</div>
              <div id="wordCountBadge" class="text-sm font-mono text-slate-300">35 tokens input</div>
              <div class="text-[10px] text-slate-500 mt-1">Multi-clause syntactic richness</div>
            </div>
            
            <div class="bottleneck-tube text-center px-2 py-1 rounded bg-rose-950/60 border border-rose-600/50">
              <div class="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Fixed Vector C</div>
              <div class="font-mono text-xs text-white">512 Dim</div>
              <div id="infoLossWarning" class="text-[10px] text-rose-300 animate-pulse mt-0.5">⚠️ ~48% Info Lost</div>
            </div>
            
            <div class="text-center w-1/3">
              <div class="text-xs text-purple-400 font-bold mb-1">Decoder Generation</div>
              <div class="text-sm font-mono text-slate-300">y_1 .. y_T</div>
              <div id="decoderStatus" class="text-[10px] text-rose-400 mt-1">Hallucinates / drops verbs</div>
            </div>
          </div>
          
          <div class="mt-3 p-2 bg-slate-900 rounded border border-slate-700 text-xs text-slate-300">
            <strong class="text-sky-400">The Problem Solved by Attention:</strong> Forcing a 50-word compound sentence into a single 512-dimensional vector creates an inescapable information bottleneck. Bahdanau Attention eliminates this by retaining ALL encoder states!
          </div>
        </div>
      </div>
    `;

    const slider = document.getElementById("seqSlider");
    const update = () => {
      const len = parseInt(slider.value);
      document.getElementById("seqLenVal").textContent = `${len} words`;
      document.getElementById("wordCountBadge").textContent = `${len} tokens input`;

      const bleuBadge = document.getElementById("bleuEstimate");
      const infoLoss = document.getElementById("infoLossWarning");
      const decStatus = document.getElementById("decoderStatus");

      if (len <= 15) {
        bleuBadge.textContent = "BLEU: 29.8 (Excellent)";
        bleuBadge.className = "px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800";
        infoLoss.textContent = "✓ Minimal Loss (<5%)";
        infoLoss.className = "text-[10px] text-emerald-400";
        decStatus.textContent = "Faithful translation";
        decStatus.className = "text-[10px] text-emerald-400 mt-1";
      } else if (len <= 25) {
        bleuBadge.textContent = "BLEU: 26.5 (Moderate)";
        bleuBadge.className = "px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800";
        infoLoss.textContent = "⚠️ ~18% Info Lost";
        infoLoss.className = "text-[10px] text-amber-400";
        decStatus.textContent = "Minor dropped modifiers";
        decStatus.className = "text-[10px] text-amber-400 mt-1";
      } else {
        const bleu = Math.max(12.0, (30 - (len - 25) * 0.45)).toFixed(1);
        bleuBadge.textContent = `BLEU: ${bleu} (Severely Degraded)`;
        bleuBadge.className = "px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800";
        infoLoss.textContent = `⚠️ ~${Math.min(75, Math.round(len * 1.3))}% Info Lost`;
        infoLoss.className = "text-[10px] text-rose-300 animate-pulse mt-0.5";
        decStatus.textContent = "Drops distant clauses & verbs";
        decStatus.className = "text-[10px] text-rose-400 mt-1";
      }
    };
    slider.oninput = update;
  }

  destroy() {}
}

// 5. Bahdanau Additive Attention Alignment Heatmap Simulator
class AttentionAlignmentSim {
  constructor(container) {
    this.container = container;
    this.sourceWords = ["The", "European", "Economic", "Area", "agreement", "was", "signed"];
    this.targetWords = ["L'", "accord", "sur", "la", "zone", "économique", "européenne", "a", "été", "signé"];
    // Realistic attention weight matrix
    this.weights = [
      [0.85, 0.05, 0.02, 0.03, 0.01, 0.02, 0.02], // L'
      [0.02, 0.04, 0.05, 0.06, 0.78, 0.03, 0.02], // accord
      [0.05, 0.03, 0.04, 0.08, 0.65, 0.10, 0.05], // sur
      [0.82, 0.04, 0.03, 0.05, 0.02, 0.02, 0.02], // la
      [0.02, 0.05, 0.08, 0.78, 0.03, 0.02, 0.02], // zone
      [0.02, 0.08, 0.81, 0.04, 0.02, 0.02, 0.01], // économique
      [0.02, 0.84, 0.06, 0.03, 0.02, 0.02, 0.01], // européenne
      [0.02, 0.02, 0.02, 0.02, 0.02, 0.85, 0.05], // a
      [0.01, 0.01, 0.02, 0.02, 0.02, 0.82, 0.10], // été
      [0.01, 0.01, 0.01, 0.02, 0.02, 0.08, 0.85]  // signé
    ];
    this.selectedTargetIdx = 4; // default "zone"
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-header">
          <div class="sim-title">
            <span class="sim-badge" style="background:#0284c7; color:#fff;">ATTENTION MATRIX</span>
            <span>Interactive Alignment Heatmap (En → Fr)</span>
          </div>
          <span class="text-xs text-sky-400">Click any French word below</span>
        </div>
        <div class="p-3 bg-slate-900/80 rounded border border-slate-800">
          <div class="flex flex-wrap gap-1 mb-3" id="targetWordChips"></div>
          
          <div class="heatmap-panel bg-slate-950 p-3 rounded border border-slate-800">
            <div class="text-xs text-slate-300 font-semibold mb-2">
              Decoder generating: <span id="activeTargetWord" class="text-sky-300 font-bold font-mono">zone</span>
            </div>
            <div class="source-bars space-y-1.5" id="sourceWeightBars"></div>
            
            <div class="mt-3 p-2 bg-slate-900 rounded font-mono text-xs text-slate-300 flex justify-between items-center">
              <span>Dynamic Context: c_i = ∑ α_{ij} · h_j</span>
              <span id="topAttendedToken" class="text-emerald-400 font-bold">Top Source: "Area" (78%)</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.renderChips();
    this.renderBars();
  }

  renderChips() {
    const chipsDiv = document.getElementById("targetWordChips");
    chipsDiv.innerHTML = "";
    this.targetWords.forEach((word, idx) => {
      const btn = document.createElement("button");
      btn.className = `px-2 py-0.5 rounded text-xs font-mono transition-all ${
        idx === this.selectedTargetIdx
          ? "bg-sky-500 text-white font-bold shadow-md shadow-sky-500/30 ring-1 ring-sky-300"
          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
      }`;
      btn.textContent = word;
      btn.onclick = () => {
        this.selectedTargetIdx = idx;
        this.renderChips();
        this.renderBars();
      };
      chipsDiv.appendChild(btn);
    });
  }

  renderBars() {
    const barsDiv = document.getElementById("sourceWeightBars");
    barsDiv.innerHTML = "";
    document.getElementById("activeTargetWord").textContent = `"${this.targetWords[this.selectedTargetIdx]}"`;

    const weights = this.weights[this.selectedTargetIdx];
    let maxWeight = 0;
    let maxWord = "";

    this.sourceWords.forEach((srcWord, sIdx) => {
      const w = weights[sIdx];
      if (w > maxWeight) {
        maxWeight = w;
        maxWord = srcWord;
      }
      const pct = Math.round(w * 100);

      const row = document.createElement("div");
      row.className = "flex items-center text-xs";
      row.innerHTML = `
        <span class="w-20 text-slate-400 font-mono text-right pr-2 truncate">${srcWord}</span>
        <div class="flex-1 bg-slate-800 h-4 rounded-sm overflow-hidden relative">
          <div class="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-sm transition-all duration-300" style="width: ${pct}%"></div>
          <span class="absolute right-1 top-0 text-[10px] font-mono text-slate-200">${pct}%</span>
        </div>
      `;
      barsDiv.appendChild(row);
    });

    document.getElementById("topAttendedToken").textContent = `Top Source: "${maxWord}" (${Math.round(maxWeight * 100)}%)`;
  }

  destroy() {}
}

// 6. Luong Global vs Local Attention Simulator
class LuongAttentionSim {
  constructor(container) {
    this.container = container;
    this.mode = "global"; // global or local
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-header">
          <div class="sim-title">
            <span class="sim-badge" style="background:#4f46e5; color:#fff;">LUONG ATTENTION</span>
            <span>Global vs. Local (Gaussian Window) Focus</span>
          </div>
          <div class="sim-controls">
            <button class="sim-btn" id="toggleGlobal">Global Attention</button>
            <button class="sim-btn" id="toggleLocal">Local Attention</button>
          </div>
        </div>
        <div class="p-3 bg-slate-900/80 rounded border border-slate-800">
          <div id="luongDesc" class="text-xs text-indigo-300 font-mono mb-2">
            Mode: GLOBAL ATTENTION — Softmax computed over ALL source words across the entire document.
          </div>
          <div class="source-window flex justify-between gap-1 p-2 bg-slate-950 rounded border border-slate-800" id="luongTokens"></div>
          
          <div class="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div class="p-2 bg-slate-900 rounded border border-slate-800">
              <div class="text-slate-400">Dot Product</div>
              <div class="text-emerald-400 font-bold mt-1">h_t^T · h_s</div>
              <div class="text-[10px] text-slate-500">0 Parameters</div>
            </div>
            <div class="p-2 bg-slate-900 rounded border border-slate-800">
              <div class="text-slate-400">General</div>
              <div class="text-sky-400 font-bold mt-1">h_t^T · W_a · h_s</div>
              <div class="text-[10px] text-slate-500">d × d Matrix</div>
            </div>
            <div class="p-2 bg-slate-900 rounded border border-slate-800">
              <div class="text-slate-400">Concat</div>
              <div class="text-purple-400 font-bold mt-1">v_a^T · tanh(...)</div>
              <div class="text-[10px] text-slate-500">Additive style</div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("toggleGlobal").onclick = () => {
      this.mode = "global";
      this.render();
    };
    document.getElementById("toggleLocal").onclick = () => {
      this.mode = "local";
      this.render();
    };

    this.render();
  }

  render() {
    const tokensDiv = document.getElementById("luongTokens");
    tokensDiv.innerHTML = "";
    const words = ["In", "1997", "Hochreiter", "introduced", "LSTM", "for", "long", "sequences", "in", "NLP"];
    const desc = document.getElementById("luongDesc");

    if (this.mode === "global") {
      desc.textContent = "GLOBAL ATTENTION: All 10 source tokens attended simultaneously. High fidelity, but O(T_x) compute per decode step.";
      words.forEach((w) => {
        const d = document.createElement("div");
        d.className = "flex-1 text-center py-2 px-1 rounded bg-indigo-950/80 border border-indigo-700 text-indigo-200 text-xs font-mono truncate";
        d.textContent = w;
        tokensDiv.appendChild(d);
      });
    } else {
      desc.textContent = "LOCAL ATTENTION: Gaussian window centered at aligned position p_t = 4 with window radius D = 2. Saves computation on long texts.";
      words.forEach((w, idx) => {
        const inWindow = Math.abs(idx - 4) <= 2;
        const d = document.createElement("div");
        d.className = `flex-1 text-center py-2 px-1 rounded text-xs font-mono truncate ${
          inWindow
            ? "bg-emerald-950/90 border border-emerald-500 text-emerald-200 font-bold ring-1 ring-emerald-400/50"
            : "bg-slate-900 border border-slate-800 text-slate-600 opacity-40"
        }`;
        d.textContent = w;
        tokensDiv.appendChild(d);
      });
    }
  }

  destroy() {}
}

// 7. Transformer Multi-Head Self-Attention Simulator
class TransformerAttentionSim {
  constructor(container) {
    this.container = container;
    this.activeHead = 1;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-header">
          <div class="sim-title">
            <span class="sim-badge" style="background:#eab308; color:#422006;">TRANSFORMER</span>
            <span>Multi-Head Self-Attention & Parallel Execution</span>
          </div>
          <div class="sim-controls">
            <span class="text-xs text-amber-400 font-mono">Head:</span>
            <button class="sim-btn" id="head1">Head 1 (Syntactic)</button>
            <button class="sim-btn" id="head2">Head 2 (Coreference)</button>
            <button class="sim-btn" id="head3">Head 3 (Global Context)</button>
          </div>
        </div>
        <div class="p-3 bg-slate-900/80 rounded border border-slate-800">
          <div class="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800 font-mono text-xs">
            <div class="text-slate-300">
              Formula: <span class="text-amber-400 font-bold">Attention(Q, K, V) = softmax(Q · K^T / √d_k) · V</span>
            </div>
            <div class="text-slate-400 text-[11px]">8 Parallel Heads (d_k = 64)</div>
          </div>
          
          <div class="mt-3 p-3 bg-slate-950 rounded border border-slate-800">
            <div id="headDescription" class="text-xs text-amber-300 font-semibold mb-2">
              Head 1: Tracks immediate verb-object grammatical agreements in parallel.
            </div>
            <div class="grid grid-cols-4 gap-2 text-center text-xs font-mono" id="attentionPairs"></div>
          </div>
          
          <div class="mt-3 flex justify-between items-center text-xs text-slate-400">
            <span><strong>O(1) Sequential Operations:</strong> All pairwise relationships computed in a single GPU tensor matrix multiplication!</span>
          </div>
        </div>
      </div>
    `;

    document.getElementById("head1").onclick = () => this.setHead(1);
    document.getElementById("head2").onclick = () => this.setHead(2);
    document.getElementById("head3").onclick = () => this.setHead(3);

    this.setHead(1);
  }

  setHead(h) {
    this.activeHead = h;
    const desc = document.getElementById("headDescription");
    const pairsDiv = document.getElementById("attentionPairs");
    pairsDiv.innerHTML = "";

    const data = {
      1: {
        text: "Head 1 (Syntactic Role): High attention between subject and governing verb.",
        pairs: [
          { q: "model", k: "achieves", score: "0.92" },
          { q: "attention", k: "replaces", score: "0.88" },
          { q: "gradient", k: "flows", score: "0.79" },
          { q: "tokens", k: "interact", score: "0.85" }
        ]
      },
      2: {
        text: "Head 2 (Coreference Resolution): Links pronouns back to antecedent entity nouns.",
        pairs: [
          { q: "it", k: "Transformer", score: "0.94" },
          { q: "they", k: "models", score: "0.91" },
          { q: "its", k: "attention", score: "0.89" },
          { q: "which", k: "architecture", score: "0.86" }
        ]
      },
      3: {
        text: "Head 3 (Global Context / Document Topic): Broad attention pooling to [CLS] or sentence boundary.",
        pairs: [
          { q: "NLP", k: "Task", score: "0.68" },
          { q: "sequence", k: "memory", score: "0.71" },
          { q: "accuracy", k: "benchmark", score: "0.75" },
          { q: "BLEU", k: "translation", score: "0.82" }
        ]
      }
    };

    desc.textContent = data[h].text;
    data[h].pairs.forEach((p) => {
      const box = document.createElement("div");
      box.className = "p-2 bg-slate-900 rounded border border-amber-900/40";
      box.innerHTML = `
        <div class="text-slate-400 text-[10px]">${p.q} → ${p.k}</div>
        <div class="text-amber-400 font-bold text-sm mt-0.5">${p.score}</div>
      `;
      pairsDiv.appendChild(box);
    });
  }

  destroy() {}
}

// 8. BERT Masked Language Model Simulator
class BertMlmSim {
  constructor(container) {
    this.container = container;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-header">
          <div class="sim-title">
            <span class="sim-badge" style="background:#06b6d4; color:#fff;">BERT PRE-TRAINING</span>
            <span>Masked Language Model (MLM) & Bidirectional Attention</span>
          </div>
        </div>
        <div class="p-3 bg-slate-900/80 rounded border border-slate-800">
          <div class="text-xs text-slate-300 mb-2">Input Sentence with Masked Token:</div>
          <div class="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800 font-mono text-sm">
            <span class="text-slate-400">[CLS]</span>
            <span class="text-sky-300">The</span>
            <span class="text-sky-300">transformer</span>
            <span class="text-sky-300">architecture</span>
            <span class="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold animate-pulse">[MASK]</span>
            <span class="text-sky-300">all</span>
            <span class="text-sky-300">recurrent</span>
            <span class="text-sky-300">loops</span>
            <span class="text-slate-400">[SEP]</span>
          </div>
          
          <div class="mt-3 p-3 bg-slate-950 rounded border border-slate-800">
            <div class="text-xs text-cyan-400 font-semibold mb-2">Top Predicted Tokens for [MASK] (Conditioned Bidirectionally):</div>
            <div class="space-y-1 text-xs font-mono">
              <div class="flex justify-between items-center p-1 rounded bg-cyan-950/50 text-cyan-200">
                <span>1. "replaces"</span>
                <span class="font-bold text-cyan-400">76.4% probability</span>
              </div>
              <div class="flex justify-between items-center p-1 rounded bg-slate-900 text-slate-300">
                <span>2. "eliminates"</span>
                <span class="font-bold text-slate-400">14.2% probability</span>
              </div>
              <div class="flex justify-between items-center p-1 rounded bg-slate-900 text-slate-400">
                <span>3. "discards"</span>
                <span class="font-bold text-slate-500">6.1% probability</span>
              </div>
            </div>
          </div>
          <div class="mt-2 text-xs text-slate-400">
            <strong>Bidirectional Power:</strong> Unlike OpenAI GPT-1 which only sees left context, BERT attends to BOTH left ('transformer architecture') and right ('all recurrent loops') simultaneously.
          </div>
        </div>
      </div>
    `;
  }

  destroy() {}
}

// 9. T5 Unified Text-to-Text Simulator
class T5Text2TextSim {
  constructor(container) {
    this.container = container;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-header">
          <div class="sim-title">
            <span class="sim-badge" style="background:#14b8a6; color:#fff;">T5 FRAMEWORK</span>
            <span>Unified Text-to-Text Multi-Task Routing</span>
          </div>
        </div>
        <div class="p-3 bg-slate-900/80 rounded border border-slate-800">
          <div class="flex gap-2 mb-3">
            <button class="sim-btn" id="t5Translate">Translation Task</button>
            <button class="sim-btn" id="t5Sentiment">Sentiment Task</button>
            <button class="sim-btn" id="t5Summarize">Summarization Task</button>
          </div>
          <div class="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs space-y-2">
            <div>
              <span class="text-slate-500 uppercase text-[10px] font-bold block">Input Text Stream:</span>
              <span id="t5InText" class="text-teal-300">translate English to German: That is good.</span>
            </div>
            <div class="pt-2 border-t border-slate-800">
              <span class="text-slate-500 uppercase text-[10px] font-bold block">T5 Model Output:</span>
              <span id="t5OutText" class="text-emerald-400 font-bold text-sm">Das ist gut.</span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("t5Translate").onclick = () => {
      document.getElementById("t5InText").textContent = "translate English to German: That is good.";
      document.getElementById("t5OutText").textContent = "Das ist gut.";
    };
    document.getElementById("t5Sentiment").onclick = () => {
      document.getElementById("t5InText").textContent = "sst2 sentence: The animation and architectural flow are absolutely stunning.";
      document.getElementById("t5OutText").textContent = "positive";
    };
    document.getElementById("t5Summarize").onclick = () => {
      document.getElementById("t5InText").textContent = "summarize: Recurrent neural networks suffer from vanishing gradients across 25 words which LSTM and Transformers solved.";
      document.getElementById("t5OutText").textContent = "Transformers and LSTMs resolve RNN vanishing gradients.";
    };
  }

  destroy() {}
}

// 10. GPT-3 In-Context Learning Playground
class Gpt3InContextSim {
  constructor(container) {
    this.container = container;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-header">
          <div class="sim-title">
            <span class="sim-badge" style="background:#10b981; color:#022c22;">IN-CONTEXT LEARNING</span>
            <span>Zero-Shot vs One-Shot vs Few-Shot Prompting</span>
          </div>
          <div class="sim-controls">
            <button class="sim-btn" id="btnZeroShot">Zero-Shot</button>
            <button class="sim-btn" id="btnOneShot">One-Shot</button>
            <button class="sim-btn" id="btnFewShot">Few-Shot</button>
          </div>
        </div>
        <div class="p-3 bg-slate-900/80 rounded border border-slate-800">
          <div class="font-mono text-xs bg-slate-950 p-3 rounded border border-slate-800" id="promptDisplay"></div>
          <div class="mt-2 text-xs text-slate-400">
            <strong>Key Insight:</strong> Zero gradient updates! The 175B model infers the task rule purely through in-context pattern completion during the forward pass.
          </div>
        </div>
      </div>
    `;

    document.getElementById("btnZeroShot").onclick = () => this.show(0);
    document.getElementById("btnOneShot").onclick = () => this.show(1);
    document.getElementById("btnFewShot").onclick = () => this.show(5);
    this.show(5);
  }

  show(shots) {
    const p = document.getElementById("promptDisplay");
    if (shots === 0) {
      p.innerHTML = `
        <div class="text-slate-500">// Zero-Shot (No prior demonstrations provided)</div>
        <div class="text-slate-300 mt-1">Translate English to French:</div>
        <div class="text-sky-300">cheese =></div>
        <div class="text-emerald-400 font-bold mt-1">fromage</div>
      `;
    } else if (shots === 1) {
      p.innerHTML = `
        <div class="text-slate-500">// One-Shot (1 example demonstration)</div>
        <div class="text-slate-300 mt-1">Translate English to French:</div>
        <div class="text-slate-400">sea otter => loutre de mer</div>
        <div class="text-sky-300 mt-1">cheese =></div>
        <div class="text-emerald-400 font-bold mt-1">fromage</div>
      `;
    } else {
      p.innerHTML = `
        <div class="text-slate-500">// Few-Shot (Multiple context demonstrations)</div>
        <div class="text-slate-300 mt-1">Translate English to French:</div>
        <div class="text-slate-400">sea otter => loutre de mer</div>
        <div class="text-slate-400">peppermint => menthe poivrée</div>
        <div class="text-slate-400">plush giraffe => girafe en peluche</div>
        <div class="text-sky-300 mt-1">cheese =></div>
        <div class="text-emerald-400 font-bold mt-1">fromage [96.8% accuracy]</div>
      `;
    }
  }

  destroy() {}
}

// 11. Case Study 1: Aitken Decomposition
class AitkenDecompositionSim {
  constructor(container) {
    this.container = container;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-header">
          <div class="sim-title">
            <span class="sim-badge" style="background:#6366f1; color:#fff;">CASE STUDY 1</span>
            <span>Aitken et al. (2021) Hidden State Dynamics Decomposition</span>
          </div>
        </div>
        <div class="p-3 bg-slate-900/80 rounded border border-slate-800 font-mono text-xs space-y-3">
          <div class="p-2 bg-slate-950 rounded border border-indigo-900/50">
            <span class="text-indigo-400 font-bold block mb-1">Mathematical State Decomposition:</span>
            <div class="text-slate-300">h_t = h_t^{temp} + h_t^{seq}</div>
            <div class="text-[11px] text-slate-500 mt-1">h_t^{temp} encodes time offset; h_t^{seq} encodes semantic token identities.</div>
          </div>
          <div class="grid grid-cols-2 gap-2 text-[11px]">
            <div class="p-2 bg-rose-950/40 border border-rose-800 rounded">
              <strong class="text-rose-400 block">Vanilla Seq2Seq (VED):</strong>
              Must store both time and token content in one recurrent channel. Manifold collapses past 20 tokens (eSCAN acc: 14.1%).
            </div>
            <div class="p-2 bg-emerald-950/40 border border-emerald-800 rounded">
              <strong class="text-emerald-400 block">Attention Seq2Seq (AED):</strong>
              Cross-attention acts as a geometric router, completely relieving recurrent states of sequence order storage (eSCAN acc: 98.2%).
            </div>
          </div>
        </div>
      </div>
    `;
  }
  destroy() {}
}

// 12. Case Study 2: App Sentiment Analysis Pipeline
class AppSentimentPipelineSim {
  constructor(container) {
    this.container = container;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-header">
          <div class="sim-title">
            <span class="sim-badge" style="background:#ec4899; color:#fff;">CASE STUDY 2</span>
            <span>Shah et al. (2024) Real-World App Review ABSA</span>
          </div>
        </div>
        <div class="p-3 bg-slate-900/80 rounded border border-slate-800 text-xs">
          <div class="text-slate-300 font-mono mb-1">Sample User Review (EverNote / Dropbox):</div>
          <div class="p-2 bg-slate-950 rounded border border-slate-800 font-mono text-slate-200">
            "The <span class="bg-indigo-950 px-1 rounded text-indigo-300 border border-indigo-500 font-bold">cloud sync feature</span> is amazing, but the <span class="bg-rose-950 px-1 rounded text-rose-300 border border-rose-500 font-bold">dark mode toggle</span> crashes constantly!"
          </div>
          
          <div class="mt-3 grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div class="p-2 bg-slate-950 rounded border border-slate-800">
              <span class="text-sky-400 font-bold block">Aspect 1: [cloud sync feature]</span>
              <div class="text-emerald-400 font-bold mt-1">Sentiment: Positive (F1: 74%)</div>
              <div class="text-slate-500 text-[10px]">Top Model: GPT-4</div>
            </div>
            <div class="p-2 bg-slate-950 rounded border border-slate-800">
              <span class="text-rose-400 font-bold block">Aspect 2: [dark mode toggle]</span>
              <div class="text-rose-400 font-bold mt-1">Sentiment: Negative (F1: 50.4%)</div>
              <div class="text-slate-500 text-[10px]">Top Model: LLama-2-70B</div>
            </div>
          </div>
          
          <div class="mt-2 p-2 bg-slate-950 rounded border border-slate-800 text-[11px] text-amber-300 font-mono">
            <strong>Key Finding:</strong> Fine-tuned BERT still beat 0-shot GPT-4 by 14% on exact aspect boundary extraction!
          </div>
        </div>
      </div>
    `;
  }
  destroy() {}
}

window.SlideAnimations = SlideAnimations;
