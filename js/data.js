/**
 * Presentation Data Model
 * NLP Architecture Evolution over Time
 */

const PRESENTATION_DATA = {
  meta: {
    title: "NLP Architecture Evolution over Time",
    subtitle: "A Journey from Recurrent Networks to Foundation Models",
    guide: "Dr. Smita Kulkarni",
    presenters: [
      { prn: "202301070164", name: "Aryan Kumar" },
      { prn: "202301070165", name: "Amir Furquani" },
      { prn: "202301070166", name: "Devesh Patil" },
      { prn: "202301070167", name: "Raviraj Sonar" }
    ],
    overviewPoints: [
      "Sequential processing foundations: RNN, LSTM, and GRU memory units",
      "Sequence-to-Sequence transformation and the fixed-vector information bottleneck",
      "The Attention revolution: Additive (Bahdanau) and Multiplicative (Luong) dynamic alignment",
      "The Transformer architecture: Discarding recurrence for parallel multi-head self-attention",
      "Pre-trained contextual models: Deep bidirectional BERT and unified text-to-text T5",
      "Foundation scale: GPT-3 and emergent few-shot in-context learning",
      "Empirical Case Studies: Attention geometry dynamics and real-world app review sentiment analysis"
    ]
  },

  papers: [
    {
      id: "P1",
      key: "rnn",
      era: "Recurrent Neural Network",
      name: "RNN (Recurrent Neural Network)",
      title: "Recurrent Neural Networks (RNNs): A Gentle Introduction and Overview",
      year: "1990",
      authors: "Robin M. Schmidt / Jeffrey Elman",
      affiliation: "University of Tübingen / UC San Diego",
      venue: "arXiv:1912.05911 / Cognitive Science",
      doi: "https://doi.org/10.48550/arXiv.1912.05911",
      task: "Sequential Language Modeling & Next-Token Prediction",
      dataset: "Penn Treebank (PTB)",
      datasetSize: "~1M tokens benchmark corpus",
      imageSrc: "images/RNN.png",
      imageCaption: "Architecture of Recurrent Neural Network (RNN) unfolded across time steps t.",
      snapshotFull: "assets/snapshots/p1_rnn_architecture.png",
      benchmarkResults: [
        { metric: "Short-Seq Accuracy (<10 tokens)", value: "91.4%", note: "Strong immediate word capture" },
        { metric: "Effective Memory Span", value: "~15–20 tokens", note: "Empirical vanishing threshold" },
        { metric: "Perplexity @ 25 words", value: "> 142.8", note: "Rapid semantic breakdown" }
      ],
      advantages: [
        "Processes arbitrary, variable-length sequence inputs with shared recurrent weight matrices.",
        "Maintains an internal hidden state memory across sequential time steps.",
        "Compact parameter footprint compared to feedforward networks."
      ],
      limitations: [
        "THE 25-WORD BARRIER: Suffers from severe exponential vanishing & exploding gradients during backpropagation through time.",
        "Catastrophic forgetting: Information beyond 20–25 tokens decays completely, losing long-distance context.",
        "Strictly sequential computation prohibits modern GPU hardware parallelization."
      ],
      solvedByNext: "Solved by LSTM (1997) introducing the Constant Error Carousel (CEC) with input, forget, and output gating.",
      animationType: "rnn_unfold"
    },
    {
      id: "P2",
      key: "lstm",
      era: "Gated Memory Cell",
      name: "LSTM (Long Short-Term Memory)",
      title: "Long Short-Term Memory",
      year: "1997",
      authors: "Sepp Hochreiter & Jürgen Schmidhuber",
      affiliation: "Technische Universität München / IDSIA",
      venue: "Neural Computation (MIT Press)",
      doi: "https://doi.org/10.1162/neco.1997.9.8.1735",
      task: "Long Time-Lag Sequence Learning & Artificial Grammars",
      dataset: "Embedded Reber Grammar & Temporal Order Benchmarks",
      datasetSize: "Synthetic benchmarks with time lags T = 100 to 1,000+ steps",
      imageSrc: "images/lstm.png",
      imageCaption: "LSTM Memory Cell Architecture with Constant Error Carousel and Gating Units.",
      snapshotFull: "assets/snapshots/p2_lstm_architecture.png",
      benchmarkResults: [
        { metric: "Max Solved Time Lag", value: "> 1,000 steps", note: "RNN failed completely past 20-25 steps" },
        { metric: "Reber Grammar Accuracy", value: "100.0%", note: "Zero classification errors" },
        { metric: "Training Convergence Speed", value: "9x Faster", note: "Over prior recurrent learning methods" }
      ],
      advantages: [
        "Constant Error Carousel (CEC) enforces additive cell state updates, eliminating vanishing gradient decay.",
        "Selectively remembers, writes, and forgets information using specialized multiplicative gates.",
        "Successfully maintains temporal context across sequences exceeding 1,000 steps."
      ],
      limitations: [
        "High computational complexity: 4 separate weight matrices per memory cell.",
        "Strictly sequential O(T) recurrence cannot be parallelized across time steps on GPUs.",
        "Slow training convergence and high VRAM demand on large modern text datasets."
      ],
      solvedByNext: "Solved by GRU (2014) which merged the cell state and reduced gate complexity by 25%.",
      animationType: "lstm_gates"
    },
    {
      id: "P3",
      key: "gru",
      era: "Streamlined Gated Unit",
      name: "GRU (Gated Recurrent Unit)",
      title: "Empirical Evaluation of Gated Recurrent Neural Networks on Sequence Modeling",
      year: "2014",
      authors: "Junyoung Chung, Caglar Gulcehre, KyungHyun Cho, Yoshua Bengio",
      affiliation: "Université de Montréal, Canada",
      venue: "NIPS Workshop on Deep Learning",
      doi: "https://doi.org/10.48550/arXiv.1412.3555",
      task: "Polyphonic Music Modeling & Raw Speech Signal Modeling",
      dataset: "Nottingham, JSB Chorales, MuseData, & Ubisoft Speech",
      datasetSize: "4 Polyphonic Music datasets + Ubisoft industrial speech corpus",
      imageSrc: "images/gru.jpg",
      imageCaption: "Gated Recurrent Unit (GRU) cell architecture with coupled Reset and Update gates.",
      snapshotFull: "assets/snapshots/p3_gru_architecture.png",
      benchmarkResults: [
        { metric: "Nottingham Neg Log-Likelihood", value: "3.20", note: "Beats LSTM (3.25) & tanh-RNN (3.91)" },
        { metric: "Ubisoft Speech Log-Likelihood", value: "-3.47", note: "Matches LSTM (-3.48), beats RNN (-4.26)" },
        { metric: "Parameter Reduction", value: "~25% fewer", note: "Faster training and lower GPU memory" }
      ],
      advantages: [
        "Merges cell state and hidden state, eliminating the separate memory conduit.",
        "Couples input and forget functionality into a single Update Gate (z_t) and Reset Gate (r_t).",
        "Achieves comparable or superior performance to LSTM with 25% fewer parameters and faster convergence."
      ],
      limitations: [
        "Still fundamentally bound by sequential recurrence (h_t depends on h_{t-1}).",
        "Cannot directly map variable-length input sequences to variable-length output sequences.",
        "Information from the start of long documents still gradually dilutes."
      ],
      solvedByNext: "Solved by Sequence-to-Sequence Encoder-Decoder frameworks for variable-length translation.",
      animationType: "gru_gates"
    },
    {
      id: "P4",
      key: "seq2seq",
      era: "Encoder-Decoder",
      name: "Seq2Seq (Encoder-Decoder)",
      title: "Sequence to Sequence Learning with Neural Networks",
      year: "2014",
      authors: "Ilya Sutskever, Oriol Vinyals, Quoc V. Le / KyungHyun Cho et al.",
      affiliation: "Google Brain & Université de Montréal",
      venue: "NeurIPS 2014 / EMNLP 2014",
      doi: "https://doi.org/10.48550/arXiv.1409.3215",
      task: "Neural Machine Translation (English-to-French)",
      dataset: "WMT'14 English-to-French Translation Corpus",
      datasetSize: "12 Million parallel sentence pairs (348M words)",
      imageSrc: "images/encoder_decoder.png",
      imageCaption: "Encoder-Decoder framework: Source sequence compressed into context vector C, decoded autoregressively.",
      snapshotFull: "assets/snapshots/p1_rnn_architecture.png",
      benchmarkResults: [
        { metric: "WMT'14 Short Sentences (<20 words)", value: "28.5 BLEU", note: "Strong fluent translation" },
        { metric: "WMT'14 Long Sentences (>40 words)", value: "15.0 BLEU", note: "Severe 47% performance collapse" },
        { metric: "Context Vector Dimension", value: "512 / 1024", note: "Fixed vector bottleneck" }
      ],
      advantages: [
        "Decoupled source and target lengths, enabling end-to-end Neural Machine Translation.",
        "First viable neural architecture to outperform traditional phrase-based statistical MT systems.",
        "Generalized framework for any sequence-to-sequence conversion task."
      ],
      limitations: [
        "THE FIXED-LENGTH BOTTLENECK: The entire source sentence is compressed into a single fixed vector C.",
        "Severe performance degradation on sentences longer than 20 words as information gets lost.",
        "The decoder lacks direct visibility into individual source tokens during generation."
      ],
      solvedByNext: "Solved by Bahdanau Additive Attention (2014/15) allowing the decoder to look at all encoder states.",
      animationType: "enc_dec_bottleneck"
    },
    {
      id: "P5",
      key: "bahdanau",
      era: "Additive Attention",
      name: "Bahdanau Attention (Additive Attention)",
      title: "Neural Machine Translation by Jointly Learning to Align and Translate",
      year: "2015",
      authors: "Dzmitry Bahdanau, KyungHyun Cho, Yoshua Bengio",
      affiliation: "Jacobs University Bremen & Université de Montréal",
      venue: "ICLR 2015",
      doi: "https://doi.org/10.48550/arXiv.1409.0473",
      task: "Neural Machine Translation (English-to-French)",
      dataset: "WMT'14 Bilingual Corpus (Europarl, News, UN)",
      datasetSize: "348 Million words (30,000 word vocabulary)",
      imageSrc: "images/attention_1.png",
      imageCaption: "Bidirectional RNN encoder with Additive Attention mechanism computing alignment scores e_ij.",
      snapshotFull: "assets/snapshots/p4_bahdanau_attention.png",
      benchmarkResults: [
        { metric: "RNNsearch-50 (50-word sentences)", value: "36.15 BLEU", note: "Maintained performance without drop" },
        { metric: "RNNencdec-50 Baseline", value: "15.0 BLEU", note: "Standard Seq2Seq collapsed" },
        { metric: "Sentence Length Robustness", value: "Flat BLEU curve", note: "Completely solved the length penalty" }
      ],
      advantages: [
        "Permanently eliminated the fixed-length vector bottleneck by retaining all encoder states.",
        "Computes dynamic, soft-alignment weights α_ij allowing the decoder to selectively focus on relevant words.",
        "Provides visual alignment heatmaps explaining model translation decisions."
      ],
      limitations: [
        "Additive score function v_a^T tanh(W s + U h) requires expensive feedforward matrix multiplication.",
        "Global attention attends to all source tokens at every decoding step, scaling with O(T_x · T_y).",
        "Still tied to sequential recurrent RNN/LSTM backbones."
      ],
      solvedByNext: "Solved by Luong Attention (2015) introducing multiplicative dot-product attention and local Gaussian windowing.",
      animationType: "attention_alignment"
    },
    {
      id: "P6",
      key: "luong",
      era: "Multiplicative Attention",
      name: "Luong Attention (Dot / General / Local)",
      title: "Effective Approaches to Attention-based Neural Machine Translation",
      year: "2015",
      authors: "Minh-Thang Luong, Hieu Pham, Christopher D. Manning",
      affiliation: "Stanford University, USA",
      venue: "EMNLP 2015",
      doi: "https://doi.org/10.18653/v1/D15-1166",
      task: "Neural Machine Translation (English-to-German)",
      dataset: "WMT'14 English-German Translation Benchmark",
      datasetSize: "4.5 Million parallel sentence pairs (116M English words)",
      imageSrc: "images/attention_2.jpg",
      imageCaption: "Luong Global vs. Local attention models with input-feeding decoding connections.",
      snapshotFull: "assets/snapshots/p5_luong_attention.png",
      benchmarkResults: [
        { metric: "Global Dot Attention", value: "25.9 BLEU", note: "+5.0 BLEU gain over non-attentive baseline" },
        { metric: "Local Gaussian Attention", value: "25.3 BLEU", note: "Significantly reduced computation on long text" },
        { metric: "8-Model Ensemble BLEU", value: "33.0 BLEU", note: "State-of-the-art on WMT'14 English-German" }
      ],
      advantages: [
        "Introduced ultra-fast Multiplicative Dot-Product scoring (h_t^T h_s) requiring zero additional parameters.",
        "Introduced Local Attention using Gaussian windowing centered at aligned position p_t to slash computation.",
        "Input-feeding architecture propagates past alignment information to future decoding steps."
      ],
      limitations: [
        "The underlying engine remains strictly RECURRENT (stacked LSTMs).",
        "Cannot compute time step t until time step t-1 is complete, blocking GPU parallelism.",
        "Training still required days/weeks on recurrent hardware loops."
      ],
      solvedByNext: "Solved by the Transformer (2017) discarding recurrence completely in favor of multi-head self-attention.",
      animationType: "luong_global_local"
    },
    {
      id: "P7",
      key: "transformer",
      era: "Self-Attention Transformer",
      name: "The Transformer ('Attention Is All You Need')",
      title: "Attention Is All You Need",
      year: "2017",
      authors: "Ashish Vaswani, Noam Shazeer, Niki Parmar et al.",
      affiliation: "Google Brain & Google Research",
      venue: "NeurIPS 2017",
      doi: "https://doi.org/10.48550/arXiv.1706.03762",
      task: "Parallelized Neural Machine Translation (En-De & En-Fr)",
      dataset: "WMT 2014 English-German (4.5M) & English-French (36M)",
      datasetSize: "4.5M and 36M parallel sentence pairs",
      imageSrc: "assets/crops/fig6_transformer_arch.png",
      imageCaption: "The Transformer architecture: Multi-head self-attention, positional encoding, and feedforward blocks.",
      snapshotFull: "assets/snapshots/p6_transformer_architecture.png",
      benchmarkResults: [
        { metric: "WMT 2014 En-De BLEU", value: "28.4 BLEU", note: "+2.0 BLEU over best previous ensemble" },
        { metric: "WMT 2014 En-Fr BLEU", value: "41.8 BLEU", note: "New state-of-the-art single model" },
        { metric: "Training Time (8 GPUs)", value: "3.5 Days", note: "Fraction of prior recurrent training cost" }
      ],
      advantages: [
        "Complete elimination of recurrence: O(1) sequential training operations enable massive GPU parallelism.",
        "Multi-Head Self-Attention attends to different representation subspaces simultaneously.",
        "Constant path length O(1) between any two token positions allows smooth gradient propagation."
      ],
      limitations: [
        "Trained from scratch for individual tasks; lacked universal self-supervised pre-training representations.",
        "Quadratic computational complexity O(N^2) with respect to sequence length N.",
        "Requires massive quantities of labeled parallel data to train effectively."
      ],
      solvedByNext: "Solved by BERT (2018/19) introducing deep bidirectional masked pre-training for universal language transfer.",
      animationType: "transformer_attention"
    },
    {
      id: "P8",
      key: "bert",
      era: "Deep Bidirectional Pre-training",
      name: "BERT (Bidirectional Encoder Representations)",
      title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
      year: "2018",
      authors: "Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova",
      affiliation: "Google AI Language",
      venue: "NAACL-HLT 2019 (Best Paper Award)",
      doi: "https://doi.org/10.18653/v1/N19-1423",
      task: "Universal Language Representation & Downstream Task Transfer",
      dataset: "BooksCorpus (800M words) + English Wikipedia (2,500M words)",
      datasetSize: "3.3 Billion words of unannotated text",
      imageSrc: "assets/crops/fig7_bert_pretrain.png",
      imageCaption: "BERT pre-training (Masked LM & NSP) and downstream fine-tuning procedures.",
      snapshotFull: "assets/snapshots/p7_bert_architecture.png",
      benchmarkResults: [
        { metric: "GLUE Score (BERT_LARGE)", value: "82.1%", note: "Outperformed OpenAI GPT (72.8%) by +9.3%" },
        { metric: "SQuAD v1.1 F1 Score", value: "93.2%", note: "Exceeded human baseline (91.2% F1)" },
        { metric: "SQuAD v2.0 F1 Score", value: "83.1%", note: "New SOTA on unanswerable questions" }
      ],
      advantages: [
        "Deep bidirectional representations: Conditions on both left and right context in all layers simultaneously.",
        "Self-supervised pre-training on 3.3B words of raw text, transferrable to any NLP task with minimal fine-tuning.",
        "Single unified architecture dominates 11 diverse NLP benchmark tasks."
      ],
      limitations: [
        "Encoder-only masked architecture: Incapable of open-ended natural autoregressive text generation.",
        "Requires task-specific architectural classification heads for each downstream task format.",
        "Discrepancy between pre-training (with [MASK] tokens) and fine-tuning (without [MASK])."
      ],
      solvedByNext: "Solved by T5 (2019/20) casting every NLP task into a unified Text-to-Text format.",
      animationType: "bert_masked"
    },
    {
      id: "P9",
      key: "t5",
      era: "Unified Text-to-Text",
      name: "T5 (Text-to-Text Transfer Transformer)",
      title: "Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer",
      year: "2019",
      authors: "Colin Raffel, Noam Shazeer, Adam Roberts et al.",
      affiliation: "Google",
      venue: "Journal of Machine Learning Research (JMLR 2020)",
      doi: "https://doi.org/10.48550/arXiv.1910.10683",
      task: "Unified Text-to-Text Framework (Classification, QA, Summarization, Translation)",
      dataset: "Colossal Clean Crawled Corpus (C4)",
      datasetSize: "750 Gigabytes of clean, filtered English web text",
      imageSrc: "assets/crops/fig8_t5_framework.png",
      imageCaption: "Unified text-to-text framework: Every NLP task formatted as text input feeding to text output.",
      snapshotFull: "assets/snapshots/p8_t5_architecture.png",
      benchmarkResults: [
        { metric: "GLUE Score (T5-11B)", value: "89.7", note: "Global state-of-the-art across all 9 tasks" },
        { metric: "SuperGLUE Score", value: "89.7", note: "Nearly matched human performance (89.8)" },
        { metric: "SQuAD v1.1 EM / F1", value: "89.7 / 94.8", note: "Dominant reading comprehension score" }
      ],
      advantages: [
        "Universal Text-to-Text interface: One model, loss function, and decoding pipeline solves every distinct NLP task.",
        "Introduced C4 (750GB clean web text) and systematic ablation of transfer learning techniques.",
        "Seamless multi-task training across classification, generation, and extraction."
      ],
      limitations: [
        "Still adheres to the fine-tuning paradigm: Downstream tasks require updating 11B parameters and saving separate weights.",
        "High computational serving cost for enterprise deployment.",
        "Cannot perform complex tasks purely on-the-fly without gradient backpropagation."
      ],
      solvedByNext: "Solved by GPT-3 (2020) which scaled to 175B parameters to enable zero-shot and few-shot in-context learning.",
      animationType: "t5_text2text"
    },
    {
      id: "P10",
      key: "gpt3",
      era: "Few-Shot Foundation Model",
      name: "GPT-3 (Generative Pre-trained Transformer 3)",
      title: "Language Models are Few-Shot Learners",
      year: "2020",
      authors: "Tom B. Brown, Benjamin Mann, Nick Ryder et al.",
      affiliation: "OpenAI",
      venue: "NeurIPS 2020",
      doi: "https://doi.org/10.48550/arXiv.2005.14165",
      task: "Zero-Shot, One-Shot, and Few-Shot In-Context NLP Problem Solving",
      dataset: "Common Crawl, WebText2, Books, Wikipedia",
      datasetSize: "300 Billion tokens of training text; 175 Billion parameters",
      imageSrc: "assets/crops/fig9_gpt3_prompting.png",
      imageCaption: "Comparison of fine-tuning (gradient updates) vs. Zero-Shot, One-Shot, and Few-Shot in-context learning.",
      snapshotFull: "assets/snapshots/p9_gpt3_prompting.png",
      benchmarkResults: [
        { metric: "LAMBADA Few-Shot Accuracy", value: "86.4%", note: "Outperformed fine-tuned SOTA (68.0%)" },
        { metric: "TriviaQA Few-Shot Accuracy", value: "64.3%", note: "Outperformed fine-tuned T5-11B without updates" },
        { metric: "SuperGLUE Few-Shot Score", value: "71.8%", note: "Competitive with fine-tuned BERT-large" }
      ],
      advantages: [
        "Emergent in-context meta-learning: Solves novel language tasks from prompt instructions without fine-tuning.",
        "Zero gradient updates at test time: Adapts dynamically during the forward pass.",
        "Extremely broad versatility across reasoning, translation, arithmetic, and code generation."
      ],
      limitations: [
        "Massive inference memory footprint (~350 GB VRAM in FP16) and latency.",
        "Susceptible to factual hallucinations and prompt sensitivity.",
        "Sub-optimal on exact token-level boundary extraction compared to fine-tuned specialized encoders."
      ],
      solvedByNext: "Analyzed in empirical case studies on attention mechanics and specialized domain fine-tuning.",
      animationType: "gpt3_prompt"
    },
    {
      id: "P11",
      key: "aitken_case1",
      era: "Mechanistic Interpretability",
      name: "Case Study 1: Aitken et al. (Attention Dynamics)",
      title: "Understanding How Encoder-Decoder Architectures Attend",
      year: "2021",
      authors: "Kyle Aitken, Vinay V. Ramasesh et al.",
      affiliation: "University of Washington & Google Research",
      venue: "arXiv:2110.15253",
      task: "Mechanistic Analysis of Attention Dynamics & Sequence Alignment",
      dataset: "eSCAN Compositional Benchmark & En-Fr Translation",
      datasetSize: "Compositional reasoning sequences & parallel translation pairs",
      imageSrc: "assets/crops/fig10_aitken_schematic.png",
      imageCaption: "Architectural comparison: Vanilla Encoder-Decoder, Attention Encoder-Decoder, and Attention-Only.",
      snapshotFull: "assets/snapshots/p10_encdec_attention_analysis.png",
      benchmarkResults: [
        { metric: "eSCAN Accuracy (Attention Seq2Seq)", value: "98.2%", note: "Robust compositional generalization" },
        { metric: "eSCAN Accuracy (Vanilla Seq2Seq)", value: "14.1%", note: "Catastrophic collapse without attention" },
        { metric: "Hidden State Dynamics", value: "Decomposed", note: "Proved temporal vs. sequence orthogonality" }
      ],
      advantages: [
        "Provides mathematical proof that cross-attention acts as an exact geometric coordinate router.",
        "Decomposes hidden state dynamics into temporal offset and sequence identity components.",
        "Explains rigorously why non-attentive seq2seq manifolds collapse after length 20."
      ],
      limitations: [
        "Conducted primarily on synthetic and sequence-to-sequence evaluation setups.",
        "Focuses on architectural attention routing rather than massive billion-parameter transformer scaling."
      ],
      solvedByNext: "Complemented by Case Study 2 analyzing modern LLMs on real-world informal app user reviews.",
      animationType: "aitken_decomposition"
    },
    {
      id: "P12",
      key: "shah_case2",
      era: "Real-World LLM Application",
      name: "Case Study 2: Shah et al. (App Review Sentiment)",
      title: "A Fine-Grained Sentiment Analysis of App Reviews Using Large Language Models: An Evaluation Study",
      year: "2024",
      authors: "Faiz Ali Shah, Ahmed Sabir, Rajesh Sharma",
      affiliation: "University of Tartu, Institute of Computer Science, Estonia",
      venue: "IEEE / arXiv:2409.07162 (September 2024)",
      task: "Aspect-Based Sentiment Analysis (ABSA) on Mobile App Reviews",
      dataset: "Mobile App Reviews Dataset (Evernote, Dropbox, TripAdvisor, WhatsApp)",
      datasetSize: "5,000+ Human-annotated reviews with aspect terms & polarities",
      imageSrc: "assets/crops/fig11_shah_pipeline.png",
      imageCaption: "Evaluation pipeline of zero-shot, 1-shot, and 5-shot LLMs for app review feature-sentiment extraction.",
      snapshotFull: "assets/snapshots/p11_llm_sentiment_study.png",
      benchmarkResults: [
        { metric: "GPT-4 Zero-Shot Feature Extraction F1", value: "+23.6% gain", note: "Over traditional rule-based baselines" },
        { metric: "GPT-4 Positive Sentiment F1", value: "74.0%", note: "Highest across all evaluated models" },
        { metric: "LLaMA-2-70B Negative Sentiment F1", value: "50.4%", note: "Top open-weights performance" },
        { metric: "Fine-Tuned BERT vs. Zero-Shot GPT-4", value: "+14.0% F1", note: "Fine-tuned BERT STILL beats zero-shot LLM!" }
      ],
      advantages: [
        "Demonstrates real-world software engineering value of LLMs on noisy informal user feedback without manual training.",
        "Proves 5-shot in-context prompting boosts sentiment F1 scores significantly across all LLM families.",
        "Provides direct head-to-head empirical comparison between proprietary LLMs, open-source models, and fine-tuned BERT."
      ],
      limitations: [
        "High API query cost and token latency when streaming millions of real-time store reviews.",
        "Zero-shot LLMs trail specialized fine-tuned BERT by 14% on strict exact aspect boundary extraction.",
        "Motivates hybrid architectures: lightweight fine-tuned encoders for boundary extraction + LLMs for reasoning."
      ],
      solvedByNext: "Points to future lightweight hybrid architectures and on-device compact models (Mamba / SLMs).",
      animationType: "app_sentiment_pipeline"
    }
  ],

  evolutionMindmap: [
    {
      era: "Sequential Recurrence (1990–2014)",
      color: "#38bdf8",
      models: [
        { name: "RNN (1990)", desc: "Recurrent weight sharing across time", limitation: "25-word memory barrier & vanishing gradient" },
        { name: "LSTM (1997)", desc: "Constant Error Carousel + 3 gates", limitation: "4 weight matrices per cell, strictly sequential O(T)" },
        { name: "GRU (2014)", desc: "Merged cell state + Reset/Update gates", limitation: "Still sequential O(T), lacks seq2seq length mapping" }
      ]
    },
    {
      era: "The Attention Revolution (2014–2015)",
      color: "#818cf8",
      models: [
        { name: "Seq2Seq (2014)", desc: "Encoder compresses into context vector C", limitation: "Fixed-length bottleneck drops BLEU past 20 tokens" },
        { name: "Bahdanau Attention (2015)", desc: "Dynamic additive alignment scores e_ij", limitation: "Additive scoring computationally heavy O(T_x · T_y)" },
        { name: "Luong Attention (2015)", desc: "Multiplicative dot-product & Local Gaussian window", limitation: "Recurrent backbone still prevents GPU parallel training" }
      ]
    },
    {
      era: "The Parallel Transformer Era (2017)",
      color: "#fbbf24",
      models: [
        { name: "The Transformer (2017)", desc: "Pure Multi-Head Self-Attention, O(1) operations", limitation: "Trained from scratch per task, lacks pre-trained transfer" }
      ]
    },
    {
      era: "Universal Pre-training & Foundation LLMs (2018–2020)",
      color: "#34d399",
      models: [
        { name: "BERT (2018)", desc: "Deep bidirectional Masked LM pretraining", limitation: "Encoder-only, cannot naturally generate open text" },
        { name: "T5 (2019)", desc: "Universal Text-to-Text format for all NLP tasks", limitation: "Requires fine-tuning weights for each separate task" },
        { name: "GPT-3 (2020)", desc: "175B causal decoder, few-shot in-context learning", limitation: "High inference cost, hallucinations, trails BERT on exact spans" }
      ]
    },
    {
      era: "Empirical Case Studies (2021–2024)",
      color: "#f43f5e",
      models: [
        { name: "Case Study 1 (2021)", desc: "Aitken et al.: Attention acts as geometric coordinate router", limitation: "Evaluated primarily on synthetic & seq2seq translation" },
        { name: "Case Study 2 (2024)", desc: "Shah et al.: LLM app review sentiment vs. fine-tuned BERT", limitation: "Fine-tuned BERT still beats 0-shot LLMs by 14% on boundaries" }
      ]
    }
  ]
};
