import mongoose from 'mongoose';
import Paper from '../models/Paper';
import dotenv from 'dotenv';

dotenv.config();

const academicCorpus = [
  // --- ARTIFICIAL INTELLIGENCE (1-10) ---
  {
    title: "Deep Learning",
    shortDescription: "A landmark review detailing deep multi-layered representation paradigms.",
    abstract: "Deep learning allows computational models that are composed of multiple processing layers to learn representations of data with multiple levels of abstraction. These methods have dramatically improved the state-of-the-art in speech recognition, visual object recognition, object detection and many other domains.",
    field: "Artificial Intelligence", year: 2015, citationCount: 64200, keywords: ["deep-learning", "neural-networks", "representations"]
  },
  {
    title: "Generative Adversarial Nets",
    shortDescription: "The absolute classic framework introducing competitive minimax game modeling.",
    abstract: "We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model that captures the data distribution, and a discriminative model that estimates probability.",
    field: "Artificial Intelligence", year: 2014, citationCount: 78900, keywords: ["gan", "generative-models", "adversarial"]
  },
  {
    title: "Mastering the Game of Go with Deep Neural Networks",
    shortDescription: "How AI combined deep reinforcement learning with tree-search to beat human grandmasters.",
    abstract: "The game of Go has long been viewed as the most challenging policy-based board game for artificial intelligence due to its enormous search space. We introduce AlphaGo, which utilizes value networks to evaluate board positions.",
    field: "Artificial Intelligence", year: 2016, citationCount: 14200, keywords: ["reinforcement-learning", "alphago", "mcts"]
  },
  {
    title: "Constitutional AI: Harmlessness from AI Feedback",
    shortDescription: "Methods for training language agents using explicit system constitutions.",
    abstract: "We explore methods for training a completely harmless assistant using unsupervised self-correction loops guided by a small set of rule principles. This approach eliminates the heavy requirement for continuous manual human feedback labeling.",
    field: "Artificial Intelligence", year: 2022, citationCount: 3800, keywords: ["alignment", "constitutional-ai", "rlhf"]
  },
  {
    title: "Human-level control through deep reinforcement learning",
    shortDescription: "Foundational Deep Q-Networks (DQN) paper that mastered classic Atari arcade titles.",
    abstract: "We use recent advances in training deep neural networks to develop a novel artificial agent, termed a deep Q-network, that can learn successful policies directly from high-dimensional sensory inputs using end-to-end reinforcement learning.",
    field: "Artificial Intelligence", year: 2015, citationCount: 22400, keywords: ["dqn", "reinforcement-learning", "atari", "q-learning"]
  },
  {
    title: "Self-Rewarding Language Models",
    shortDescription: "Training LLMs to act as their own evaluation judges to break performance ceilings.",
    abstract: "We propose that language models can act as effective judges during alignment training loops. By leveraging an execution strategy that generates and scores its own alternative outputs, the system breaks legacy human evaluation limits.",
    field: "Artificial Intelligence", year: 2024, citationCount: 1200, keywords: ["self-rewarding", "alignment", "llm"]
  },
  {
    title: "Asynchronous Methods for Deep Reinforcement Learning",
    shortDescription: "Introducing the A3C framework for highly parallelizable async policy optimizations.",
    abstract: "We propose a conceptually simple and lightweight framework for deep reinforcement learning that uses asynchronous gradient descent for optimization of deep neural network controllers, outperforming classic architectures.",
    field: "Artificial Intelligence", year: 2016, citationCount: 8900, keywords: ["a3c", "reinforcement-learning", "policy-gradient"]
  },
  {
    title: "Deep Learning in Neural Networks: An Overview",
    shortDescription: "Schmidhuber's monumental historical breakdown tracing structural connectionist paths.",
    abstract: "This overview summarizes historical developments in fine-grained deep learning loops, tracking evolution from early perceptrons up through modern deep recurring networks and long short-term memory setups.",
    field: "Artificial Intelligence", year: 2015, citationCount: 15600, keywords: ["history", "lstm", "neural-networks"]
  },
  {
    title: "Scaling Laws for Neural Language Models",
    shortDescription: "The benchmark scaling law paper defining accurate performance formulas based on compute compute and tokens.",
    abstract: "We study the empirical cross-entropy loss dependency on model size, data payload scale, and active training compute limits. Performance scales as a power-law relative to capacity bounds.",
    field: "Artificial Intelligence", year: 2020, citationCount: 6200, keywords: ["scaling-laws", "transformers", "compute"]
  },
  {
    title: "Model-Agnostic Meta-Learning for Fast Adaptation of Deep Networks",
    shortDescription: "Introducing MAML, the standard paradigm driving few-shot quick-adaptation architectures.",
    abstract: "We propose a meta-learning algorithm that is general and model-agnostic, meaning it can be applied to any model trained with gradient descent and is applicable to a variety of different learning tasks.",
    field: "Artificial Intelligence", year: 2017, citationCount: 11200, keywords: ["meta-learning", "maml", "few-shot"]
  },

  // --- NATURAL LANGUAGE PROCESSING (11-20) ---
  {
    title: "Attention Is All You Need",
    shortDescription: "The modern holy grail of NLP that retired RNNs in favor of self-attention mechanics.",
    abstract: "We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality.",
    field: "Natural Language Processing", year: 2017, citationCount: 125430, keywords: ["transformer", "attention", "self-attention", "nlp"]
  },
  {
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    shortDescription: "Introduction of bidirectional contextual embedding strategies for language understanding.",
    abstract: "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations.",
    field: "Natural Language Processing", year: 2018, citationCount: 98100, keywords: ["bert", "transformer", "embeddings"]
  },
  {
    title: "Language Models are Few-Shot Learners",
    shortDescription: "The legendary paper asserting scale unlocks massive zero/few-shot performance increases.",
    abstract: "We demonstrate that scaling up language models greatly improves task-agnostic, few-shot performance, sometimes even competitive with prior state-of-the-art fine-tuning approaches. We train GPT-3, an autoregressive language model.",
    field: "Natural Language Processing", year: 2020, citationCount: 41200, keywords: ["gpt-3", "few-shot", "llm"]
  },
  {
    title: "ROUGE: A Package for Automatic Evaluation of Summaries",
    shortDescription: "Establishing standard mathematical text overlap tracking protocols.",
    abstract: "We introduce the ROUGE evaluation metric toolkit designed to measure overlap n-grams between candidate system summaries and gold-standard human references.",
    field: "Natural Language Processing", year: 2012, citationCount: 34100, keywords: ["rouge", "evaluation", "summarization"]
  },
  {
    title: "Direct Preference Optimization: Your Language Model is Secretly a Reward Model",
    shortDescription: "A mathematically elegant alternative to standard pipeline reinforcement learning loops.",
    abstract: "We introduce Direct Preference Optimization (DPO), a stable, performant algorithm that optimizes a language model directly on human reference preferences without needing to train a separate reward model.",
    field: "Natural Language Processing", year: 2023, citationCount: 5600, keywords: ["dpo", "alignment", "fine-tuning"]
  },
  {
    title: "BLEU: a Method for Automatic Evaluation of Machine Translation",
    shortDescription: "The foundational translation accuracy check calculating structural precision.",
    abstract: "We propose a method of automatic evaluation of machine translation that is fast, automated, and highly correlated with human judgments. Our metric behaves as an exact mathematical precision check.",
    field: "Natural Language Processing", year: 2002, citationCount: 48900, keywords: ["bleu", "evaluation", "translation"]
  },
  {
    title: "Distributed Representations of Words and Phrases and their Compositionality",
    shortDescription: "The breakthrough Word2Vec paper detailing shallow neural semantic continuous mappings.",
    abstract: "We introduce skip-gram structures optimized to derive high-quality vector spaces tracking linguistic configurations. Word configurations align semantic traits cleanly via standard mathematical operations.",
    field: "Natural Language Processing", year: 2013, citationCount: 57400, keywords: ["word2vec", "embeddings", "skip-gram"]
  },
  {
    title: "Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer",
    shortDescription: "Introducing the versatile T5 framework mapping all textual constraints into text targets.",
    abstract: "We introduce a comprehensive framework treating all natural language processing objectives under a shared text-to-text formatting mask, scaling parameters effectively across massive benchmarks.",
    field: "Natural Language Processing", year: 2019, citationCount: 14500, keywords: ["t5", "transfer-learning", "nlp"]
  },
  {
    title: "Long Short-Term Memory",
    shortDescription: "The historical foundation of gate-recurrent architectures that solved vanishing gradients.",
    abstract: "We propose a novel architecture capable of learning to bridge long time lags by enforcing constant error flow through specialized internal memory blocks.",
    field: "Natural Language Processing", year: 1997, citationCount: 94000, keywords: ["lstm", "rnn", "recurrent"]
  },
  {
    title: "Neural Machine Translation by Jointly Learning to Align and Translate",
    shortDescription: "Bahdanau's breakthrough introducing the original soft-alignment sequence attention layer.",
    abstract: "We conjecture that the use of a fixed-length vector is a bottleneck in improving the performance of encoder-decoder architectures. We introduce an adaptive lookup extension to bypass static capture boundaries.",
    field: "Natural Language Processing", year: 2014, citationCount: 38900, keywords: ["attention", "nmt", "encoder-decoder"]
  },

  // --- COMPUTER VISION (21-30) ---
  {
    title: "ImageNet Classification with Deep Convolutional Neural Networks",
    shortDescription: "The historical AlexNet catalyst that kicked off the modern deep learning revolution.",
    abstract: "We trained a large, deep convolutional neural network to classify the 1.2 million high-resolution images in the ImageNet LSVRC-2010 contest into the 1000 different classes. To make training faster, we used non-saturating neurons.",
    field: "Computer Vision", year: 2012, citationCount: 154300, keywords: ["alexnet", "cnn", "imagenet", "computer-vision"]
  },
  {
    title: "Deep Residual Learning for Image Recognition",
    shortDescription: "ResNet architecture resolving the vanishing gradient challenge in extremely deep grids.",
    abstract: "Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those previously used. We explicitly reformulate the layers as learning residual functions.",
    field: "Computer Vision", year: 2015, citationCount: 184200, keywords: ["resnet", "residual", "cnn"]
  },
  {
    title: "High-Resolution Image Synthesis with Latent Diffusion Models",
    shortDescription: "The backbone science breakthrough that drives modern Stable Diffusion generation systems.",
    abstract: "By introducing cross-attention layers into the model architecture, we turn diffusion models into powerful and flexible generators for general conditioning inputs like text or bounding boxes, enabling high-resolution latent synthesis.",
    field: "Computer Vision", year: 2022, citationCount: 19800, keywords: ["diffusion", "stable-diffusion", "generative"]
  },
  {
    title: "You Only Look Once: Unified, Real-Time Object Detection",
    shortDescription: "Framing computer vision object bounding tasks as a single quick regression challenge.",
    abstract: "We present YOLO, a new approach to object detection. Prior work in object detection repurposes classifiers to perform detection. Instead, we frame object detection as a regression problem to spatially separated bounding boxes.",
    field: "Computer Vision", year: 2016, citationCount: 51000, keywords: ["yolo", "object-detection", "real-time"]
  },
  {
    title: "Segment Anything",
    shortDescription: "The foundation vision model capable of zero-shot pixel segregation tasks.",
    abstract: "We introduce the Segment Anything project: a new task, model, and dataset for image segmentation. Using our efficient model in a data-driven loop, we built the largest segmentation dataset to date.",
    field: "Computer Vision", year: 2023, citationCount: 12400, keywords: ["sam", "segmentation", "zero-shot"]
  },
  {
    title: "Fully Convolutional Networks for Semantic Segmentation",
    shortDescription: "Pioneering the application of end-to-end pixel classification architectures without dense layers.",
    abstract: "We adapt contemporary classification networks into fully convolutional structures that take input images of arbitrary size and produce correspondingly-sized outputs with efficient tracking capabilities.",
    field: "Computer Vision", year: 2015, citationCount: 29500, keywords: ["fcn", "segmentation", "semantic"]
  },
  {
    title: "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",
    shortDescription: "The historical Vision Transformer (ViT) paper proving attention scales better than CNNs.",
    abstract: "While the Transformer architecture has become the de facto standard for natural language processing tasks, its applications to computer vision remain limited. In this paper, we break down standard matrix inputs directly into flattened patch groupings.",
    field: "Computer Vision", year: 2020, citationCount: 31000, keywords: ["vit", "vision-transformer", "attention"]
  },
  {
    title: "Mask R-CNN",
    shortDescription: "Expanding Faster R-CNN with an automated boundary branch mapping pixel-perfect segment highlights.",
    abstract: "We present a conceptually simple, flexible, and general framework for object instance segmentation. Our approach efficiently detects objects in an image while simultaneously generating a high-quality segmentation mask.",
    field: "Computer Vision", year: 2017, citationCount: 27400, keywords: ["mask-rcnn", "object-detection", "instance-segmentation"]
  },
  {
    title: "Very Deep Convolutional Networks for Large-Scale Image Recognition",
    shortDescription: "Introducing the clean, uniform VGG-16 geometry using tiny $3\times3$ kernel groupings.",
    abstract: "We investigate the effect of the convolutional network depth on its accuracy in the large-scale image recognition setting. Our chief contribution is a thorough evaluation of networks of increasing depth using an architecture with very small filters.",
    field: "Computer Vision", year: 2014, citationCount: 81200, keywords: ["vgg", "cnn", "image-recognition"]
  },
  {
    title: "NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis",
    shortDescription: "A massive advancement mapping complex 3D structures directly inside neural coordinate functions.",
    abstract: "We present a method that achieves state-of-the-art results for synthesizing novel views of complex scenes by optimizing an underlying continuous volumetric scene function using a sparse set of input views.",
    field: "Computer Vision", year: 2020, citationCount: 12800, keywords: ["nerf", "3d-synthesis", "radiance-fields"]
  },

  // --- DATA SCIENCE & MACHINE LEARNING (31-40) ---
  {
    title: "XGBoost: A Scalable Tree Boosting System",
    shortDescription: "The dominant tabular data-crunching framework used across analytics challenges.",
    abstract: "We describe a scalable end-to-end tree boosting system called XGBoost, used widely by data scientists to achieve state-of-the-art results on many machine learning challenges. We propose a novel sparsity-aware algorithm.",
    field: "Data Science", year: 2016, citationCount: 61000, keywords: ["xgboost", "gradient-boosting", "tabular-data"]
  },
  {
    title: "Adam: A Method for Stochastic Optimization",
    shortDescription: "The legendary adaptive learning rate optimizer driving modern network calculations.",
    abstract: "We introduce Adam, an algorithm for first-order gradient-based optimization of stochastic objective functions, based on adaptive estimates of lower-order moments. The method is straightforward to implement.",
    field: "Data Science", year: 2014, citationCount: 162000, keywords: ["adam", "optimization", "gradient-descent"]
  },
  {
    title: "T-SNE: Visualizing Data using T-SNE",
    shortDescription: "Transforming high-dimensional multi-vector structures into intuitive low-dimensional maps.",
    abstract: "We present a technique called t-SNE that visualizes high-dimensional datasets by giving each data point a location in a two or three-dimensional map. The technique is a variation of Stochastic Neighbor Embedding.",
    field: "Data Science", year: 2013, citationCount: 45000, keywords: ["t-sne", "dimensionality-reduction", "visualization"]
  },
  {
    title: "Polars: Lightning-Fast DataFrame Engine",
    shortDescription: "A multi-threaded processing library optimized for massive performance over legacy Pandas.",
    abstract: "We introduce Polars, a blazingly fast DataFrame library implemented in Rust. By using an optimal memory structure and a multi-threaded execution query planner, it sets new speed bars for structured data.",
    field: "Data Science", year: 2021, citationCount: 4300, keywords: ["polars", "dataframe", "rust"]
  },
  {
    title: "Random Forests",
    shortDescription: "Breiman's classic paper detailing mathematical bagging ensemble tree algorithms.",
    abstract: "We construct independent tree predictors built using randomized vector sets. Subsets cross-reference errors independently to maintain accurate general boundaries over tabular inputs.",
    field: "Data Science", year: 2001, citationCount: 92000, keywords: ["random-forest", "ensemble", "tabular"]
  },
  {
    title: "Scikit-learn: Machine Learning in Python",
    shortDescription: "The foundational core software package democratizing predictive analytics pipelines.",
    abstract: "Scikit-learn is a Python module integrating a wide range of state-of-the-art machine learning algorithms for medium-scale supervised and unsupervised problems, packaged with crisp integration documentation.",
    field: "Data Science", year: 2011, citationCount: 63000, keywords: ["scikit-learn", "python", "framework"]
  },
  {
    title: "Hidden Technical Debt in Machine Learning Systems",
    shortDescription: "The foundational MLOps breakdown showing code is just a tiny fraction of real systems.",
    abstract: "Machine learning offers a wonderfully quick way to introduce complex behaviors into applications. We argue that it is dangerous to think of these systems as traditional isolated components.",
    field: "Data Science", year: 2015, citationCount: 19400, keywords: ["mlops", "technical-debt", "infrastructure"]
  },
  {
    title: "Resilient Distributed Datasets: A Fault-Tolerant Abstraction for In-Memory Cluster Computing",
    shortDescription: "The foundational Apache Spark architecture paper that revolutionized distributed data engineering.",
    abstract: "We introduce Resilient Distributed Datasets (RDDs), a distributed memory abstraction that lets programmers perform in-memory computations on large clusters in a fault-tolerant manner.",
    field: "Data Science", year: 2012, citationCount: 38700, keywords: ["spark", "distributed-computing", "big-data"]
  },
  {
    title: "Jupyter Notebooks—a publishing format for reproducible computational workflows",
    shortDescription: "Establishing the interactive, step-by-step programming structure preferred by modern data analysts.",
    abstract: "We present a unified data platform facilitating iterative scripting loops alongside visual charts. This infrastructure standardizes formatting outputs cleanly across modern scientific computing nodes.",
    field: "Data Science", year: 2016, citationCount: 18400, keywords: ["jupyter", "reproducibility", "notebooks"]
  },
  {
    title: "MLflow: A Platform for Managing the Machine Learning Lifecycle",
    shortDescription: "Structuring open tracking paradigms across variable parameters and operational environments.",
    abstract: "We describe MLflow, an open-source platform to streamline machine learning development, including tracking experiments, packaging code into reproducible runs, and sharing models.",
    field: "Data Science", year: 2020, citationCount: 2900, keywords: ["mlflow", "mlops", "experiment-tracking"]
  },

  // --- BIOINFORMATICS & MEDICAL AI (41-47) ---
  {
    title: "Highly Accurate Protein Structure Prediction with AlphaFold",
    shortDescription: "The structural bioinformatics breakthrough that solved the 50-year-old protein folding problem.",
    abstract: "Proteins are essential to life, and understanding their 3D shape is critical. We introduce AlphaFold, an end-to-end deep-learning network framework capable of predicting atomic-scale structural coordinates.",
    field: "Bioinformatics", year: 2021, citationCount: 34500, keywords: ["alphafold", "bioinformatics", "protein-folding"]
  },
  {
    title: "Deep Learning for Human Gene Expression Prediction",
    shortDescription: "Mapping complex multi-omic DNA sequencing profiles using advanced sequence engineering.",
    abstract: "Predicting gene expression values accurately directly from primary DNA strings remains a challenge. We apply multi-scale residual CNN sequence structures to trace structural enhancer variations.",
    field: "Bioinformatics", year: 2019, citationCount: 5400, keywords: ["genomics", "dna-sequencing", "rna"]
  },
  {
    title: "Dermatologist-level classification of skin cancer with deep neural networks",
    shortDescription: "Landmark paper demonstrating computer vision parity alongside expert medical diagnostics.",
    abstract: "We demonstrate the classification of skin lesions using a single deep convolutional neural network trained on a clinical dataset of images, matching performance results compiled by board-certified specialists.",
    field: "Bioinformatics", year: 2017, citationCount: 16800, keywords: ["medical-imaging", "cancer-detection", "healthcare"]
  },
  {
    title: "The Sequence Alignment Search Tool (BLAST)",
    shortDescription: "The classical base heuristic driving modern database matching for genomic strands.",
    abstract: "We present an algorithm that seeks local alignments between query sequences and structural data banks, optimizing search scores to accelerate genetic similarity queries.",
    field: "Bioinformatics", year: 1990, citationCount: 112000, keywords: ["blast", "genomics", "alignment"]
  },
  {
    title: "Clustal W: improving the sensitivity of progressive multiple sequence alignment",
    shortDescription: "Dynamic tracking systems allowing clean alignment mapping across multi-sequence variations.",
    abstract: "We outline an automated processing package weighting sequence trees variably to ensure structural gaps are accurately handled during comparative biology studies.",
    field: "Bioinformatics", year: 1994, citationCount: 68000, keywords: ["sequencing", "clustal", "phylogeny"]
  },
  {
    title: "AlphaProteo: Generating novel functional proteins via deep generation",
    shortDescription: "DeepMind's 2024 breakthrough synthesizing complex binding proteins automatically.",
    abstract: "We present a data-driven model architecture generating bespoke binding elements optimized to interface securely with targeted human cellular surfaces, unlocking new avenues for pharmaceutical research.",
    field: "Bioinformatics", year: 2024, citationCount: 950, keywords: ["protein-design", "generative-biology", "deepmind"]
  },
  {
    title: "Cancer Genomic Data Aggregation Platforms",
    shortDescription: "Unifying clinical multi-variant tracking protocols inside standard mutation catalogs.",
    abstract: "We compile structural profiles detailing functional patient aberrations, providing cross-referenced database arrays to accelerate precision medical targeting initiatives.",
    field: "Bioinformatics", year: 2013, citationCount: 14200, keywords: ["cancer", "tcga", "mutations"]
  },

  // --- CYBERSECURITY & CRYPTOGRAPHY (48-54) ---
  {
    title: "Bitcoin: A Peer-to-Peer Electronic Cash System",
    shortDescription: "The root document establishing distributed cryptography and blockchain architecture foundations.",
    abstract: "A purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution. Digital signatures provide part of the solution.",
    field: "Cybersecurity", year: 2008, citationCount: 114000, keywords: ["blockchain", "bitcoin", "cryptography"]
  },
  {
    title: "Adversarial Machine Learning in Smart Grid Systems",
    shortDescription: "Analyzing attack vectors and poisoning attempts targeting critical industrial systems.",
    abstract: "Smart grid infrastructure relies heavily on automated data aggregation pipelines. We present advanced data-poisoning attack injections designed to manipulate neural forecasting engines.",
    field: "Cybersecurity", year: 2023, citationCount: 2900, keywords: ["cybersecurity", "adversarial-attacks", "security"]
  },
  {
    title: "A Method for Obtaining Digital Signatures and Public-Key Cryptosystems",
    shortDescription: "The historical foundation document establishing the RSA cryptographic framework.",
    abstract: "We present an encryption method that allows users to sign digital documents securely. The mathematical difficulty of factoring large prime numbers protects individual authorization keys.",
    field: "Cybersecurity", year: 1978, citationCount: 42000, keywords: ["rsa", "encryption", "public-key"]
  },
  {
    title: "Intrusion Detection via Deep Sequence Tracking",
    shortDescription: "Using deep temporal monitoring loops to flag anomalies in network traffic packets.",
    abstract: "We build continuous telemetry monitors looking for malicious packet behaviors, capturing hidden penetration footprints that legacy signature-based scanners routinely miss.",
    field: "Cybersecurity", year: 2018, citationCount: 3400, keywords: ["ids", "anomaly-detection", "network-security"]
  },
  {
    title: "Certified Robustness Against Adversarial Label Poisoning Attacks",
    shortDescription: "Mathematical frameworks guaranteeing protection lines for high-value machine learning systems.",
    abstract: "We introduce strict defensive bounds safeguarding optimization layers against poisoned data injections, providing verifiable accuracy guarantees under aggressive interference.",
    field: "Cybersecurity", year: 2021, citationCount: 1800, keywords: ["robustness", "poisoning", "adversarial-defense"]
  },
  {
    title: "Tor: The Second-Generation Onion Router",
    shortDescription: "The definitive technical text mapping onion-routed anonymous traffic networks.",
    abstract: "We outline an internet communication network protecting users against traffic-analysis attacks by routing encrypted packets through a distributed network of volunteer-operated relays.",
    field: "Cybersecurity", year: 2004, citationCount: 14800, keywords: ["tor", "anonymity", "privacy"]
  },
  {
    title: "Fuzzing Imperative Execution Stacks via Coverage-Guided Mutations",
    shortDescription: "Automating zero-day vulnerability identification using high-speed edge fuzzing networks.",
    abstract: "We introduce a high-performance fuzzing platform designed to automatically find edge-case memory exploits inside production compiled runtimes by maximizing code coverage path tracking.",
    field: "Cybersecurity", year: 2019, citationCount: 4100, keywords: ["fuzzing", "vulnerabilities", "buffer-overflow"]
  },

  // --- QUANTUM & HUMAN-COMPUTER INTERACTION (55-60) ---
  {
    title: "Quantum Computational Networks",
    shortDescription: "David Deutsch's monumental text formalizing primary quantum logic gate equations.",
    abstract: "We generalize standard computational theory to leverage quantum mechanical superposition principles, proving quantum systems scale effectively past classical Turing boundaries.",
    field: "Quantum Computing", year: 1989, citationCount: 28900, keywords: ["quantum", "deutsch", "superposition"]
  },
  {
    title: "A Fast Quantum Mechanical Algorithm for Database Search",
    shortDescription: "Grover's legendary search algorithm establishing polynomial speedups over classical databases.",
    abstract: "We outline a quantum system capable of finding target entries inside unsorted data spaces in $O(\sqrt{N})$ operations, outperforming the standard limits of classical processing loops.",
    field: "Quantum Computing", year: 1996, citationCount: 31200, keywords: ["grover", "quantum-search", "speedup"]
  },
  {
    title: "Polynomial-Time Algorithms for Prime Factorization on a Quantum Computer",
    shortDescription: "Shor's algorithm, the historical milestone that proved quantum systems can break standard RSA encryption.",
    abstract: "We demonstrate that a quantum computer can find the prime factors of large integers in polynomial time, challenging standard modern cryptography paradigms.",
    field: "Quantum Computing", year: 1997, citationCount: 46700, keywords: ["shor", "factorization", "cryptography"]
  },
  {
    title: "What Makes Users Feel In Control? Designing Glassmorphism Interfaces",
    shortDescription: "Analyzing user satisfaction metrics across translucent spatial computing layouts.",
    abstract: "We evaluate task performance metrics across varying backdrop blur strengths, mapping cognitive load variations when handling nested layered information panels.",
    field: "Human-Computer Interaction", year: 2022, citationCount: 1200, keywords: ["hci", "glassmorphism", "ux-design"]
  },
  {
    title: "The Information Capacity of the Human Motor System in Controlling the Amplitude of Movement",
    shortDescription: "Fitts's Law, the foundational human-computer interaction metric driving layout calculations.",
    abstract: "We mathematically formalize operational target selection velocities based on layout scale distances, providing standard equations to guide clean user interface layouts.",
    field: "Human-Computer Interaction", year: 1954, citationCount: 38000, keywords: ["fitts-law", "hci", "ergonomics"]
  },
  {
    title: "Direct Manipulation: A Step Beyond Programming Languages",
    shortDescription: "Shneiderman's historical document driving modern graphic icon interface design.",
    abstract: "We analyze the cognitive mechanics behind interactive visual systems, showing that immediate feedback on visual objects creates a more intuitive user experience than command-line terminals.",
    field: "Human-Computer Interaction", year: 1983, citationCount: 19500, keywords: ["direct-manipulation", "hci", "gui"]
  }
];

const seedDatabase = async () => {
  try {
    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) throw new Error("MONGODB_URI missing from environment setup.");
    
    await mongoose.connect(dbUri);
    console.log("🌱 Connected to database cluster for complete seeding operation...");
    
    await Paper.deleteMany({});
    await Paper.insertMany(academicCorpus);
    console.log(`✅ Success! Database populated with ${academicCorpus.length} landmark research papers across 8 distinct scientific fields.`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Seeding operation crash encountered:", error);
  }
};

seedDatabase();