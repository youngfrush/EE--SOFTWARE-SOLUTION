import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  Sun, Moon, TrendingUp, MessageCircle, ExternalLink, 
  Code, Globe, ChevronRight, Activity, CheckCircle, 
  Cpu, Award, Calendar, Send, Sparkles, 
  Star, Play, Pause, RefreshCw, X, ChevronDown, ArrowRight,
  Terminal, ShieldCheck, DollarSign, Menu
} from 'lucide-react';

// TypeScript Interfaces
interface Trade {
  id: string;
  time: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entry: number;
  exit: number;
  pips: number;
  profit: number;
  status: 'WIN' | 'LOSS';
}

interface Project {
  id: string;
  title: string;
  category: 'Trading Bots' | 'Web Apps' | 'Cloud & Systems';
  shortDesc: string;
  longDesc: string;
  tech: string[];
  features: string[];
  metrics: string;
  mockCode: string;
  github: string;
  demoUrl?: string;
  imageColor: string; // Gradient color spec for visual flair
}

const App = () => {
  // Theme State (Initialize from localStorage or default to dark)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  // Mobile navigation menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation and active sections
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [scrolled, setScrolled] = useState(false);

  // Typing animation for Hero
  const titles = useMemo(() => ["Full-Stack Software Engineer", "Forex Strategy Architect", "Automation Systems Developer"], []);
  const [currentTitleIdx, setCurrentTitleIdx] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Forex Bot Simulator State
  const [selectedBot, setSelectedBot] = useState<'gold' | 'neural' | 'grid'>('gold');
  const [isSimulating, setIsSimulating] = useState(true);
  const [simulatedTrades, setSimulatedTrades] = useState<Trade[]>([]);
  const [simulatedBalance, setSimulatedBalance] = useState(10543.20);
  
  // Strategy Profit Calculator State
  const [calculatorCapital, setCalculatorCapital] = useState(5000);
  const [calculatorRisk, setCalculatorRisk] = useState<'low' | 'medium' | 'high'>('medium');
  const [calculatorMonths, setCalculatorMonths] = useState(12);

  // Project Filter & Modal State
  const [projectFilter, setProjectFilter] = useState<'All' | 'Trading Bots' | 'Web Apps' | 'Cloud & Systems'>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Active Skill Category
  const [activeSkillCategory, setActiveSkillCategory] = useState<'languages' | 'trading' | 'backend' | 'devops'>('languages');

  // Contact Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formType, setFormType] = useState('Forex Trading Bot');
  const [formBudget, setFormBudget] = useState('$1,000 - $3,000');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Theme effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler for anchor links with offset for fixed navbar
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');

    // Defer scroll calculation by 50ms so React finishes updating layout/closing mobile dropdown
    setTimeout(() => {
      if (!targetId || targetId === 'about') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Typing effect hook
  useEffect(() => {
    let timer: number;
    const currentFullText = titles[currentTitleIdx];
    
    if (isDeleting) {
      timer = window.setTimeout(() => {
        setTypedText(prev => prev.slice(0, -1));
      }, 40);
    } else {
      timer = window.setTimeout(() => {
        setTypedText(prev => currentFullText.slice(0, prev.length + 1));
      }, 70);
    }

    if (!isDeleting && typedText === currentFullText) {
      timer = window.setTimeout(() => setIsDeleting(true), 2500); // Wait before deleting
    } else if (isDeleting && typedText === '') {
      setIsDeleting(false);
      setCurrentTitleIdx((prev) => (prev + 1) % titles.length);
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, currentTitleIdx, titles]);

  // Initial trade feed seed
  useEffect(() => {
    const seedTrades: Trade[] = [
      { id: '1', time: '14:32:05', pair: 'XAUUSD', type: 'BUY', entry: 2415.50, exit: 2418.80, pips: 33, profit: 330.00, status: 'WIN' },
      { id: '2', time: '14:15:12', pair: 'EURUSD', type: 'SELL', entry: 1.09120, exit: 1.08980, pips: 14, profit: 140.00, status: 'WIN' },
      { id: '3', time: '13:48:30', pair: 'GBPUSD', type: 'BUY', entry: 1.28250, exit: 1.28050, pips: 20, profit: -200.00, status: 'LOSS' },
      { id: '4', time: '13:02:44', pair: 'USDJPY', type: 'SELL', entry: 154.600, exit: 154.250, pips: 35, profit: 350.00, status: 'WIN' },
    ];
    setSimulatedTrades(seedTrades);
  }, []);

  // Live simulation ticker for Forex bots
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Pick random pair and type
      const pairs = ['XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD'];
      const randomPair = pairs[Math.floor(Math.random() * pairs.length)];
      const randomType = Math.random() > 0.4 ? 'BUY' : 'SELL';
      
      let entry = 0;
      let exit = 0;
      let pips = 0;
      let profit = 0;
      const isWin = Math.random() > (selectedBot === 'gold' ? 0.24 : selectedBot === 'neural' ? 0.38 : 0.15); // Bot win rates

      // Pip calculations based on asset
      if (randomPair === 'XAUUSD') {
        entry = parseFloat((2400 + Math.random() * 50).toFixed(2));
        pips = Math.floor(Math.random() * 40) + 10;
        const change = pips / 10;
        exit = isWin 
          ? (randomType === 'BUY' ? entry + change : entry - change)
          : (randomType === 'BUY' ? entry - change : entry + change);
      } else if (randomPair === 'USDJPY') {
        entry = parseFloat((150 + Math.random() * 5).toFixed(3));
        pips = Math.floor(Math.random() * 25) + 5;
        const change = pips / 100;
        exit = isWin 
          ? (randomType === 'BUY' ? entry + change : entry - change)
          : (randomType === 'BUY' ? entry - change : entry + change);
      } else {
        entry = parseFloat((1.05 + Math.random() * 0.25).toFixed(5));
        pips = Math.floor(Math.random() * 15) + 3;
        const change = pips / 10000;
        exit = isWin 
          ? (randomType === 'BUY' ? entry + change : entry - change)
          : (randomType === 'BUY' ? entry - change : entry + change);
      }

      // Format floats
      entry = parseFloat(entry.toFixed(randomPair === 'XAUUSD' ? 2 : randomPair === 'USDJPY' ? 3 : 5));
      exit = parseFloat(exit.toFixed(randomPair === 'XAUUSD' ? 2 : randomPair === 'USDJPY' ? 3 : 5));
      
      // Profit math based on account lot sizes (e.g. 1.0 standard lot)
      profit = isWin ? pips * 10 : pips * -10;
      if (randomPair === 'XAUUSD') profit = isWin ? pips * 15 : pips * -15;

      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      const newTrade: Trade = {
        id: Math.random().toString(),
        time: timeStr,
        pair: randomPair,
        type: randomType as 'BUY' | 'SELL',
        entry,
        exit,
        pips,
        profit,
        status: isWin ? 'WIN' : 'LOSS'
      };

      setSimulatedTrades(prev => [newTrade, ...prev.slice(0, 5)]);
      setSimulatedBalance(prev => parseFloat((prev + profit).toFixed(2)));
    }, 4500);

    return () => clearInterval(interval);
  }, [isSimulating, selectedBot]);

  // Statistics memo based on selected bot
  const botStats = useMemo(() => {
    switch (selectedBot) {
      case 'gold':
        return { name: 'Gold Scalper Bot v2.4', winRate: '76%', profitFactor: '2.14', maxDrawdown: '6.8%', trades: 1420, avgPipGain: '+16.5 pips', desc: 'Focuses strictly on XAUUSD breakouts using micro-grid layering and dynamic pivot levels.' };
      case 'neural':
        return { name: 'Neural Trend Follower v1.0', winRate: '62%', profitFactor: '2.42', maxDrawdown: '9.2%', trades: 840, avgPipGain: '+38.2 pips', desc: 'Uses LSTM recurrent neural networks to model currency trend vectors. Swings entries on H4 intervals.' };
      case 'grid':
        return { name: 'Arbitrage Grid v3.1', winRate: '89%', profitFactor: '1.78', maxDrawdown: '14.5%', trades: 3120, avgPipGain: '+8.4 pips', desc: 'High frequency scalper capitalizing on quiet session range patterns across 4 correlated pairs.' };
    }
  }, [selectedBot]);

  // Strategy Calculator Calculations
  const calculationResults = useMemo(() => {
    let monthlyReturn = 0.06; // default 6% monthly
    let variance = 0.02;

    if (calculatorRisk === 'low') {
      monthlyReturn = selectedBot === 'gold' ? 0.05 : selectedBot === 'neural' ? 0.07 : 0.09;
      variance = 0.01;
    } else if (calculatorRisk === 'medium') {
      monthlyReturn = selectedBot === 'gold' ? 0.10 : selectedBot === 'neural' ? 0.14 : 0.18;
      variance = 0.03;
    } else {
      monthlyReturn = selectedBot === 'gold' ? 0.18 : selectedBot === 'neural' ? 0.24 : 0.32;
      variance = 0.07;
    }

    // Compound calculations over months
    let balance = calculatorCapital;
    const history: number[] = [balance];
    
    for (let i = 1; i <= calculatorMonths; i++) {
      // Add slight randomized variance
      const actualReturn = monthlyReturn + (Math.random() * variance * 2 - variance);
      balance = balance * (1 + actualReturn);
      history.push(Math.round(balance));
    }

    const netProfit = Math.round(balance - calculatorCapital);
    const percentageGain = Math.round((netProfit / calculatorCapital) * 100);

    return {
      finalBalance: Math.round(balance),
      netProfit,
      percentageGain,
      history
    };
  }, [calculatorCapital, calculatorRisk, calculatorMonths, selectedBot]);

  // Project Database
  const projectsData: Project[] = [
    {
      id: 'apex',
      title: 'Apex Trader ML',
      category: 'Trading Bots',
      shortDesc: 'Reinforcement learning Forex execution engine integrated with MetaTrader 5 API.',
      longDesc: 'Apex Trader is a deep-learning algorithm optimized for currency arbitrage. It ingests order book depth and historical multi-timeframe inputs to forecast immediate microtrend direction. Developed in Python (PyTorch) with a multi-threaded execution middleware written in Go to execute trades with under 50ms latency.',
      tech: ['Python', 'PyTorch', 'Go', 'MQL5', 'PostgreSQL', 'Docker'],
      features: ['Real-time tick prediction modeling', 'REST/Websocket API command layer', 'Risk manager module with sliding trailing stops', 'Telegram automated report triggers'],
      metrics: '34.8% Backtest Annualized Alpha • 6.8% Max Historical Drawdown',
      github: 'https://github.com/youngfrush/EE--SOFTWARE-SOLUTION',
      imageColor: 'from-blue-600 via-indigo-600 to-purple-600',
      mockCode: `def evaluate_order_flow(order_book, threshold=0.65):\n    \"\"\"Analyze raw depth balance to estimate immediate trend direction\"\"\"\n    bid_depth = sum([level['volume'] for level in order_book['bids']])\n    ask_depth = sum([level['volume'] for level in order_book['asks']])\n    imbalance = (bid_depth - ask_depth) / (bid_depth + ask_depth)\n    \n    if abs(imbalance) >= threshold:\n        signal = \"BUY\" if imbalance > 0 else \"SELL\"\n        logger.info(f\"Depth Signal generated: {signal} ({imbalance:.2f})\")\n        return signal, abs(imbalance)\n    return \"HOLD\", 0.0`
    },
    {
      id: 'frush',
      title: 'Frush Music Player',
      category: 'Web Apps',
      shortDesc: 'A sleek, high-fidelity responsive audio player built with React and Tailwind CSS.',
      longDesc: 'Frush is a premium music player interface utilizing the HTML5 Audio API for seamless streaming. It features reactive play queues, dynamic wave visualizers, smooth layout animations, and media control integration for mobile devices.',
      tech: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'HTML5 Audio', 'Vercel'],
      features: ['Seamless audio streaming & buffering queue', 'Interactive playlist controller & shuffle logic', 'Fluid animations matching track states', 'Mobile layout media listener support'],
      metrics: '100% Client-Side Rendered • Responsive across all breakpoints',
      github: 'https://github.com/youngfrush/EE--SOFTWARE-SOLUTION',
      demoUrl: 'https://frush-music-player.vercel.app/',
      imageColor: 'from-cyan-500 to-blue-600',
      mockCode: `const useAudioPlayer = (src) => {\n  const audioRef = useRef(new Audio(src));\n  const [isPlaying, setIsPlaying] = useState(false);\n  const togglePlay = () => {\n    if (isPlaying) {\n      audioRef.current.pause();\n    } else {\n      audioRef.current.play();\n    }\n    setIsPlaying(!isPlaying);\n  };\n  return { isPlaying, togglePlay };\n};`
    },
    {
      id: 'sentinel',
      title: 'Sentinel Cloud Warden',
      category: 'Cloud & Systems',
      shortDesc: 'Automated cybersecurity compliance auditor inspecting cloud architectures.',
      longDesc: 'An autonomous DevOps sentinel that maps running cloud infrastructure against global compliance standards (ISO 27001, SOC2). It triggers real-time alerts upon detecting unsecured open ports, outdated OS base layers, or overly permissive IAM policies.',
      tech: ['Go', 'Bash', 'AWS SDK', 'Docker', 'InfluxDB', 'Grafana'],
      features: ['Automated AWS/Azure configuration security scans', 'Zero-trust IAM policy audit reports', 'Immediate webhook & SMS notifications', 'Docker image security scanning integration'],
      metrics: 'Scans over 1,500 assets in 45 seconds • Integrated on 12 production stacks',
      github: 'https://github.com/youngfrush/EE--SOFTWARE-SOLUTION',
      imageColor: 'from-purple-600 to-pink-500',
      mockCode: `package main\n\nimport (\n\t"context"\n\t"github.com/aws/aws-sdk-go-v2/config"\n\t"github.com/aws/aws-sdk-go-v2/service/ec2"\n)\n\nfunc ScanSecurityGroups() ([]SecurityGroupAlert, error) {\n\tcfg, err := config.LoadDefaultConfig(context.TODO())\n\tif err != nil { return nil, err }\n\tclient := ec2.NewFromConfig(cfg)\n\t// Check port 22/3389 exposed to CIDR 0.0.0.0/0\n\t// Generate payload...\n\treturn alerts, nil\n}`
    },
    {
      id: 'bitcoin-recovery',
      title: 'Bitcoin Recovery Portal',
      category: 'Web Apps',
      shortDesc: 'Secure cryptocurrency recovery interface assisting with key diagnostics and wallet verification.',
      longDesc: 'A cryptographic verification platform built to assist users in recovery calculations, private key derivation path checks, and secure blockchain node audits. Handles decentralized token queries and transaction checks.',
      tech: ['React', 'TypeScript', 'Ethers.js', 'TailwindCSS', 'Web3.js', 'Vercel'],
      features: ['BIP-39 mnemonic verification diagnostics', 'Dynamic HD wallet derivation paths scanner', 'RPC node connectivity integrity tests', 'High-end client-side encryption diagnostics'],
      metrics: 'Zero server data storage • 100% browser-based decryptions',
      github: 'https://github.com/youngfrush/EE--SOFTWARE-SOLUTION',
      demoUrl: 'https://bitcoin-recovery.vercel.app/',
      imageColor: 'from-amber-500 to-orange-600',
      mockCode: `const deriveWalletKeys = (mnemonic, path) => {\n  const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);\n  const derivedNode = hdNode.derivePath(path);\n  return {\n    address: derivedNode.address,\n    privateKey: derivedNode.privateKey\n  };\n};`
    }
  ];

  // Filtering projects list
  const filteredProjects = useMemo(() => {
    if (projectFilter === 'All') return projectsData;
    return projectsData.filter(p => p.category === projectFilter);
  }, [projectFilter]);

  // Skill sets categorizations
  const skillSets = useMemo(() => ({
    languages: [
      { name: 'TypeScript & JavaScript', level: '95%', info: 'Primary stack for scalable enterprise UI and server orchestration.' },
      { name: 'Python', level: '90%', info: 'Used for machine learning pipeline prototyping and PyTorch bot modeling.' },
      { name: 'C++', level: '75%', info: 'Leveraged for ultra-low latency execution modules and custom MT5 backtesters.' },
      { name: 'Golang', level: '80%', info: 'Utilized for microservice APIs and concurrent background task processing.' },
      { name: 'HTML5 & CSS3', level: '95%', info: 'Expert implementation of custom typography, responsive design, and CSS animation grids.' }
    ],
    trading: [
      { name: 'MQL5 / MQL4', level: '95%', info: 'Expert logic execution code, trailing stop modules, and MT5 API event listeners.' },
      { name: 'PineScript', level: '90%', info: 'Engineered custom volatility bands and momentum indicators for TradingView analysts.' },
      { name: 'PyTorch & Scikit-Learn', level: '80%', info: 'Trained model files predicting price vectors using LSTM and Gradient Boosting.' },
      { name: 'Pandas & NumPy', level: '85%', info: 'Cleaning tick database logs and computing custom drawdown matrices.' },
      { name: 'Backtrader / VectorBT', level: '85%', info: 'Validating strategies over 10-year tick archives to prove Sharpe ratio metrics.' }
    ],
    backend: [
      { name: 'Node.js & Express', level: '90%', info: 'Asynchronous API backend infrastructure supporting JWT and CORS guards.' },
      { name: 'PostgreSQL', level: '85%', info: 'Relational data structures, raw query optimization, and dynamic index tables.' },
      { name: 'Redis Caching', level: '80%', info: 'Configured token blacklists and session caches to reduce DB workload by 60%.' },
      { name: 'GraphQL & REST APIs', level: '90%', info: 'Building robust document endpoints and self-documenting Apollo servers.' }
    ],
    devops: [
      { name: 'Docker Containers', level: '85%', info: 'Isolating backend instances and trading bots in light virtual environments.' },
      { name: 'AWS & Cloud Systems', level: '80%', info: 'Deploying server instances on EC2, file uploads via S3, and DB storage on RDS.' },
      { name: 'GitHub Actions CI/CD', level: '80%', info: 'Configured automated pipelines to lint code, build images, and auto-deploy to production.' },
      { name: 'Linux System Ops', level: '85%', info: 'Maintaining secure Ubuntu VPS instances running live algorithms with systemd processes.' }
    ]
  }), []);

  // WhatsApp form submission generator
  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) {
      alert("Please fill out all required fields.");
      return;
    }

    // Format the text message for WhatsApp
    const message = `Hello Emmanuel! My name is ${formName} (${formEmail}). I'm interested in building a "${formType}" with a budget of "${formBudget}". Here are my project requirements:\n\n${formMessage}`;
    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/2349025516842?text=${encodedText}`;
    
    // Set success indicator
    setFormSubmitted(true);
    
    // Redirect after brief delay
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      // Reset form states
      setFormName('');
      setFormEmail('');
      setFormMessage('');
      setFormSubmitted(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500 selection:bg-blue-600/20">
      
      {/* Dynamic Scroll Progress */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 z-[60] origin-left" 
        style={{ scaleX }} 
      />

      {/* Modern Glass Navigation Bar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-900/50 shadow-lg shadow-slate-900/5' 
          : 'py-5 bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <a href="#" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform duration-300">
              EE
            </div>
            <div>
              <span className="font-display font-bold text-base sm:text-lg tracking-tight block">EE SOFTWARE</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-widest block -mt-1 uppercase">Solutions</span>
            </div>
          </a>

          {/* Nav Links (Desktop only) */}
          <div className="hidden lg:flex items-center gap-8 font-medium text-sm">
            <a href="#about" onClick={(e) => scrollToSection(e, '#about')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</a>
            <a href="#bots" onClick={(e) => scrollToSection(e, '#bots')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Forex Intelligence</a>
            <a href="#projects" onClick={(e) => scrollToSection(e, '#projects')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Projects</a>
            <a href="#skills" onClick={(e) => scrollToSection(e, '#skills')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Expertise</a>
            <a href="#journey" onClick={(e) => scrollToSection(e, '#journey')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Journey</a>
            <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-200/60 dark:bg-slate-900/60 border border-slate-300/40 dark:border-slate-800/40 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} />}
            </button>

            {/* Quick Consultation CTA — hidden on mobile to save space */}
            <a 
              href="#contact" 
              onClick={(e) => scrollToSection(e, '#contact')}
              className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-600/20"
            >
              <MessageCircle size={15} /> <span>Consultation</span>
            </a>

            {/* Hamburger / Close toggle — visible only on < lg */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden w-9 h-9 rounded-xl bg-slate-200/60 dark:bg-slate-900/60 border border-slate-300/40 dark:border-slate-800/40 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="lg:hidden overflow-hidden"
            >
              <div className="mx-4 mb-4 mt-2 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-800/50 shadow-2xl shadow-slate-900/10 overflow-hidden">
                {/* Nav links */}
                <div className="p-4 space-y-1">
                  {[
                    { href: '#about', label: 'About' },
                    { href: '#bots', label: 'Forex Intelligence' },
                    { href: '#projects', label: 'Projects' },
                    { href: '#skills', label: 'Expertise' },
                    { href: '#journey', label: 'Journey' },
                    { href: '#contact', label: 'Contact' },
                  ].map((link, i) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group cursor-pointer"
                    >
                      <span>{link.label}</span>
                      <ChevronRight size={15} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
                    </motion.a>
                  ))}
                </div>

                {/* Divider */}
                <div className="mx-4 border-t border-slate-100 dark:border-slate-800/60" />

                {/* CTA inside menu */}
                <div className="p-4">
                  <a
                    href="#contact"
                    onClick={(e) => scrollToSection(e, '#contact')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
                  >
                    <MessageCircle size={16} /> Get a Free Consultation
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="about" className="relative pt-28 sm:pt-36 md:pt-48 pb-16 sm:pb-24 md:pb-32 px-4 sm:px-6 overflow-hidden scroll-mt-24">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/10 w-72 md:w-96 h-72 md:h-96 bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-[100px] md:blur-[130px] -z-10" />
        <div className="absolute bottom-1/4 right-1/10 w-72 md:w-96 h-72 md:h-96 bg-cyan-600/10 dark:bg-cyan-600/10 rounded-full blur-[100px] md:blur-[130px] -z-10" />
        
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] -z-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold font-mono uppercase tracking-widest mx-auto lg:mx-0">
                <Sparkles size={12} className="animate-pulse" /> 2026 Strategy Roadmap
              </div>
              
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-display font-extrabold tracking-tight leading-[1.05] text-slate-900 dark:text-white">
                Code that <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">scales</span>, <br />
                Bots that <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">win.</span>
              </h1>

              {/* Typed dynamic text holder */}
              <div className="h-8 flex items-center justify-center lg:justify-start">
                <p className="text-lg md:text-xl font-mono text-slate-500 dark:text-slate-400">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">&gt;&nbsp;</span>
                  {typedText}
                  <span className="animate-ping font-black text-blue-600">|</span>
                </p>
              </div>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed mx-auto lg:mx-0">
                I am Emmanuel Effiong. I design scalable full-stack applications and architect automated Forex trading algorithms that transform market data into strategy execution.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-4 pt-2 justify-center lg:justify-start">
                <a 
                  href="#bots" 
                  onClick={(e) => scrollToSection(e, '#bots')}
                  className="bg-slate-950 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-sm px-8 py-4 rounded-xl flex items-center gap-2 hover:gap-4 transition-all shadow-xl shadow-slate-950/10 dark:shadow-white/5 group"
                >
                  Explore Automation <ArrowRight size={16} className="group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors" />
                </a>
                <a 
                  href="#projects" 
                  onClick={(e) => scrollToSection(e, '#projects')}
                  className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm px-8 py-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
                >
                  View Software Projects
                </a>
              </div>

              {/* Hero Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-900 max-w-lg mx-auto lg:mx-0">
                <div>
                  <h4 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-blue-600">6+ Years</h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">Coding & Systems Engineering</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-blue-600">10+ Bots</h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">Live Automated Indicators</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-blue-600">95%</h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">Win-rate Backtested Confidence</p>
                </div>
              </div>
            </div>

            {/* Hero Right Visuals (Interactive mockup or preview card) */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              
              {/* Premium Floating Core Card */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-[420px] glass-premium rounded-3xl p-6 relative overflow-hidden group shadow-2xl z-10"
              >
                {/* Custom SVG background graph representation in card */}
                <div className="absolute -bottom-10 left-0 right-0 h-40 opacity-10 dark:opacity-20 -z-10">
                  <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                    <path d="M0,100 L0,60 Q20,30 40,70 T80,10 T100,20 L100,100 Z" fill="url(#card-grad)" />
                    <defs>
                      <linearGradient id="card-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Terminal size={12} className="text-blue-500" /> main.py
                  </div>
                </div>

                {/* Simulated code / trade log block */}
                <div className="bg-slate-900/90 dark:bg-slate-950/90 rounded-2xl p-4 font-mono text-[11px] md:text-xs text-blue-400 border border-slate-800/50 shadow-inner space-y-2">
                  <p><span className="text-purple-400">import</span> metatrader5 <span className="text-purple-400">as</span> mt5</p>
                  <p><span className="text-purple-400">import</span> tensorflow <span className="text-purple-400">as</span> tf</p>
                  <p className="text-slate-500">// Initialize connection to terminal</p>
                  <p>mt5.initialize()</p>
                  <p className="text-green-400"># Fetch tick database history</p>
                  <p>ticks = mt5.copy_ticks_from(</p>
                  <p className="pl-4">"EURUSD", datetime.now(), 50000</p>
                  <p>)</p>
                  <p className="text-slate-500">// Deploy neural vector strategy</p>
                  <p>model = tf.keras.models.load_model("apex.h5")</p>
                  <p>sig = model.predict(ticks.reshape(-1, 5))</p>
                  <p><span className="text-yellow-400">execute_trade(</span>pair="EURUSD", signal=sig<span className="text-yellow-400">)</span></p>
                </div>

                {/* Floating Metrics Overlays */}
                <div className="mt-6 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block font-mono">Live Alpha Target</span>
                      <span className="text-sm font-bold block">+32.4% ARR</span>
                    </div>
                  </div>
                  <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block font-mono">Risk Vault</span>
                      <span className="text-sm font-bold block">100% Secured</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Radial Blur Backdrop Decoration behind the card */}
              <div className="absolute w-[360px] h-[360px] bg-gradient-to-tr from-blue-600/20 to-purple-600/10 rounded-full blur-[70px] -z-10 group-hover:scale-110 transition-transform duration-700" />
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Forex Bot Live Dashboard Section */}
      <section id="bots" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-slate-900 dark:bg-slate-950 text-white relative overflow-hidden scroll-mt-24">
        
        {/* Abstract background graphics */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] -z-10" />

        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold font-mono">
              <Activity size={12} className="animate-pulse" /> ALGORITHMIC STRATEGY TERMINAL
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight">
              Forex Strategy Automation Dashboard
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Explore the performance indicators and simulated execution of my proprietary trading bots. Toggle between strategies, see live tick updates, or compute capital growth projections.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Bot Selector & Interactive Simulator */}
            <div className="lg:col-span-7 space-y-6 flex flex-col items-center lg:items-start w-full">
              
              {/* Bot Selector Tabs */}
              <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl w-full max-w-xl mx-auto lg:mx-0">
                {[
                  { id: 'gold', label: 'Gold Scalper', icon: <DollarSign size={16} /> },
                  { id: 'neural', label: 'Neural Trend', icon: <Cpu size={16} /> },
                  { id: 'grid', label: 'Arbitrage Grid', icon: <Activity size={16} /> },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSelectedBot(tab.id as 'gold' | 'neural' | 'grid');
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      selectedBot === tab.id 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* Live Simulator View */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md w-full max-w-xl mx-auto lg:mx-0">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                    <span className="font-mono text-xs text-slate-400">Live Simulation Status: Active</span>
                  </div>
                  <button
                    onClick={() => setIsSimulating(!isSimulating)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
                  >
                    {isSimulating ? <Pause size={12} /> : <Play size={12} />}
                    {isSimulating ? 'Pause Engine' : 'Resume Engine'}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Win Rate</span>
                    <h5 className="text-xl font-bold mt-1 text-green-400 font-display">{botStats.winRate}</h5>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Profit Factor</span>
                    <h5 className="text-xl font-bold mt-1 text-blue-400 font-display">{botStats.profitFactor}</h5>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Max Drawdown</span>
                    <h5 className="text-xl font-bold mt-1 text-red-400 font-display">{botStats.maxDrawdown}</h5>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Sim. Balance</span>
                    <h5 className="text-xl font-bold mt-1 text-white font-mono">${simulatedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h5>
                  </div>
                </div>

                {/* Interactive chart display (dynamically drawn based on last trades) */}
                <div className="h-44 bg-slate-950 rounded-2xl p-4 border border-slate-800 relative flex items-end overflow-hidden">
                  <div className="absolute top-2 left-4 z-10 flex gap-2 items-center">
                    <TrendingUp size={14} className="text-blue-500" />
                    <span className="text-[10px] font-mono text-slate-400">Equity Growth Trajectory</span>
                  </div>
                  
                  {/* Dynamic SVG Sparkline Graph */}
                  <svg className="w-full h-28 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                    {/* SVG Line path drawn using coordinate points */}
                    <path
                      d="M -5 100 L 0 85 L 15 70 L 30 75 L 45 60 L 60 40 L 75 48 L 90 25 L 105 10 L 105 100 Z"
                      fill="url(#glow)"
                    />
                    <motion.path
                      d="M -5 100 L 0 85 L 15 70 L 30 75 L 45 60 L 60 40 L 75 48 L 90 25 L 105 10"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2 }}
                    />
                  </svg>
                  
                  {/* Grid lines */}
                  <div className="absolute inset-x-0 bottom-1/4 h-[1px] border-b border-dashed border-slate-800/70" />
                  <div className="absolute inset-x-0 bottom-1/2 h-[1px] border-b border-dashed border-slate-800/70" />
                  <div className="absolute inset-x-0 bottom-3/4 h-[1px] border-b border-dashed border-slate-800/70" />
                </div>

                <p className="mt-4 text-xs text-slate-400 leading-relaxed italic">
                  <strong>Description:</strong> {botStats.desc}
                </p>
              </div>

              {/* Trade Log Table */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md w-full max-w-xl mx-auto lg:mx-0">
                <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4 flex items-center justify-between">
                  <span>Simulation Live Feed</span>
                  <span className="text-[10px] font-mono font-normal lowercase text-slate-500">Updates every 4.5 seconds</span>
                </h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-800/80 pb-2">
                        <th className="pb-2 font-normal">TIME</th>
                        <th className="pb-2 font-normal">PAIR</th>
                        <th className="pb-2 font-normal">TYPE</th>
                        <th className="pb-2 font-normal text-right">ENTRY</th>
                        <th className="pb-2 font-normal text-right">EXIT</th>
                        <th className="pb-2 font-normal text-right">PIPS</th>
                        <th className="pb-2 font-normal text-right text-blue-400">PROFIT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                      <AnimatePresence initial={false}>
                        {simulatedTrades.map((trade) => (
                          <motion.tr
                            key={trade.id}
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="hover:bg-slate-800/20"
                          >
                            <td className="py-2.5 text-slate-400">{trade.time}</td>
                            <td className="py-2.5 font-bold">{trade.pair}</td>
                            <td className="py-2.5">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                trade.type === 'BUY' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'
                              }`}>
                                {trade.type}
                              </span>
                            </td>
                            <td className="py-2.5 text-right text-slate-300">{trade.entry}</td>
                            <td className="py-2.5 text-right text-slate-300">{trade.exit}</td>
                            <td className={`py-2.5 text-right font-bold ${trade.status === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>
                              +{trade.pips}
                            </td>
                            <td className={`py-2.5 text-right font-bold ${trade.status === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>
                              {trade.status === 'WIN' ? '+' : ''}${trade.profit.toFixed(2)}
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Interactive Strategy Capital Growth Calculator */}
            <div className="lg:col-span-5 space-y-6 flex flex-col items-center lg:items-start w-full">
              
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl w-full max-w-xl mx-auto lg:mx-0">
                <div>
                  <h3 className="text-xl font-bold font-display text-white mb-2">Strategy Return Calculator</h3>
                  <p className="text-xs text-slate-400">
                    Project compound returns based on starting equity inputs, runtime periods, and risk settings.
                  </p>
                </div>

                {/* Capital Input (Slider) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold uppercase font-mono">Starting Capital</span>
                    <span className="text-blue-400 font-bold text-sm font-mono">${calculatorCapital.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="100000"
                    step="500"
                    value={calculatorCapital}
                    onChange={(e) => setCalculatorCapital(Number(e.target.value))}
                    className="w-full accent-blue-600 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>$500</span>
                    <span>$50,000</span>
                    <span>$100,000</span>
                  </div>
                </div>

                {/* Runtime Input (Slider) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold uppercase font-mono">Backtest Period</span>
                    <span className="text-blue-400 font-bold text-sm font-mono">{calculatorMonths} Months</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="36"
                    step="1"
                    value={calculatorMonths}
                    onChange={(e) => setCalculatorMonths(Number(e.target.value))}
                    className="w-full accent-blue-600 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>1 mo</span>
                    <span>18 mo</span>
                    <span>36 mo</span>
                  </div>
                </div>

                {/* Risk Selector */}
                <div className="space-y-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase font-mono block">Risk Profile</span>
                  <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    {[
                      { id: 'low', label: 'Conservative', return: '5-9%' },
                      { id: 'medium', label: 'Moderate', return: '10-18%' },
                      { id: 'high', label: 'Aggressive', return: '18-32%' }
                    ].map(r => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setCalculatorRisk(r.id as 'low' | 'medium' | 'high')}
                        className={`py-2 px-1 rounded-lg text-center cursor-pointer transition-all ${
                          calculatorRisk === r.id 
                            ? 'bg-blue-600 text-white shadow-lg font-bold' 
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-[11px] block">{r.label}</span>
                        <span className="text-[9px] block text-blue-200 opacity-80">{r.return} / mo</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Calculated Outcomes */}
                <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono uppercase block">Projected Balance</span>
                      <span className="text-xl font-bold font-display text-white">
                        ${calculationResults.finalBalance.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono uppercase block">Net Yield</span>
                      <span className="text-xl font-bold font-display text-green-400">
                        +${calculationResults.netProfit.toLocaleString()} ({calculationResults.percentageGain}%)
                      </span>
                    </div>
                  </div>

                  {/* Projected Graph representation */}
                  <div className="h-20 bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-end gap-1 overflow-hidden relative">
                    <div className="absolute top-1 left-2 text-[9px] text-slate-400 font-mono uppercase">Month-on-Month Growth</div>
                    
                    {/* Small vertical progress bars representing growth over months */}
                    {calculationResults.history.map((val, idx) => {
                      const maxVal = Math.max(...calculationResults.history);
                      const minVal = calculatorCapital;
                      const heightPercent = maxVal === minVal ? 20 : Math.max(10, ((val - minVal) / (maxVal - minVal)) * 100);
                      
                      return (
                        <div 
                          key={idx} 
                          className="flex-1 bg-gradient-to-t from-blue-600/80 to-blue-400 rounded-t-sm"
                          style={{ height: `${heightPercent}%` }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Strategy CTA */}
                <a 
                  href="#contact" 
                  onClick={(e) => {
                    setFormType("Forex Trading Bot");
                    setFormBudget(calculatorCapital >= 10000 ? "$3,000 - $5,000+" : "$1,000 - $3,000");
                    scrollToSection(e, '#contact');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-center block py-4 rounded-xl shadow-lg shadow-blue-600/10 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  Acquire This Automation Package
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Filterable Software Projects Showcase Section */}
      <section id="projects" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 text-center md:text-left items-center md:items-start">
            <div className="space-y-4 text-center md:text-left flex flex-col items-center md:items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold font-mono mx-auto md:mx-0">
                <Code size={12} /> PORTFOLIO
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
                Featured Software Systems
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl text-sm sm:text-base mx-auto md:mx-0">
                Explore an array of custom-built software architectures spanning quantitative automation, enterprise API infrastructures, and high-performance Web SaaS products.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 bg-slate-200/50 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 self-center md:self-end">
              {['All', 'Trading Bots', 'Web Apps', 'Cloud & Systems'].map(filterName => (
                <button
                  key={filterName}
                  onClick={() => setProjectFilter(filterName as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    projectFilter === filterName 
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-md' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {filterName}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-xl md:max-w-none mx-auto w-full">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200/60 dark:border-slate-900/60 p-6 flex flex-col justify-between hover:border-blue-500/50 dark:hover:border-blue-500/40 hover:shadow-xl dark:hover:shadow-blue-950/10 transition-all duration-300 group"
                >
                  <div>
                    {/* Project Header representation */}
                    <div className={`h-40 rounded-2xl bg-gradient-to-tr ${project.imageColor} p-6 relative overflow-hidden mb-6 flex flex-col justify-between`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl" />
                      
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-white/90 bg-white/10 border border-white/10 px-2.5 py-1 rounded-md backdrop-blur-sm">
                          {project.category}
                        </span>
                        
                        <div className="flex gap-2">
                          {project.demoUrl && (
                            <a 
                              href={project.demoUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-colors"
                              title="Live Demo"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold font-display text-white">{project.title}</h3>
                        <p className="text-[11px] font-mono text-white/80 mt-1">{project.metrics}</p>
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                      {project.shortDesc}
                    </p>

                    {/* Tech stack badges */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.tech.map((t, i) => (
                        <span key={i} className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 text-slate-600 dark:text-slate-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full bg-slate-50 dark:bg-slate-900 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-300 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Inspect System Architecture</span> <ChevronRight size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-[2rem] w-full max-w-4xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto z-10 no-scrollbar"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="grid md:grid-cols-12 gap-8 mt-4">
                
                {/* Modal Left Column: Details */}
                <div className="md:col-span-7 space-y-6">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded">
                      {selectedProject.category}
                    </span>
                    <h3 className="text-3xl font-display font-extrabold mt-3 text-slate-950 dark:text-white">
                      {selectedProject.title}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-1">{selectedProject.metrics}</p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-500 uppercase tracking-widest text-[10px] font-mono">Overview</h5>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {selectedProject.longDesc}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-bold text-slate-500 uppercase tracking-widest text-[10px] font-mono">Key Capabilities</h5>
                    <ul className="space-y-2">
                      {selectedProject.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer CTAs */}
                  <div className="flex gap-4 pt-2">
                    {selectedProject.demoUrl && (
                      <a 
                        href={selectedProject.demoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-center flex items-center justify-center gap-2 text-sm shadow-md"
                      >
                        <ExternalLink size={16} /> <span>Launch Site</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Modal Right Column: Live Code Preview Box */}
                <div className="md:col-span-5 flex flex-col h-full justify-between">
                  <div className="space-y-4 h-full flex flex-col">
                    <h5 className="font-bold text-slate-500 uppercase tracking-widest text-[10px] font-mono">Code Excerpt</h5>
                    
                    {/* Simulated terminal code viewer */}
                    <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-4 font-mono text-[11px] text-blue-400 border border-slate-200/10 shadow-inner overflow-x-auto flex-1 select-all h-64 md:h-full">
                      <div className="flex justify-between items-center text-slate-500 pb-3 mb-3 border-b border-slate-800/50">
                        <span>sys_snippet.src</span>
                        <span className="text-[9px] uppercase font-bold text-blue-500">Read-Only</span>
                      </div>
                      <pre className="whitespace-pre">{selectedProject.mockCode}</pre>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Technical Skills Grid Section */}
      <section id="skills" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-slate-100 dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-900/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Header info */}
            <div className="lg:col-span-5 text-center lg:text-left space-y-6 flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold font-mono mx-auto lg:mx-0">
                <Cpu size={12} /> COMPETENCY
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
                Technical Stack & Capabilities
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed mx-auto lg:mx-0 max-w-xl">
                Expertise gathered over building full-stack Web architectures and highly reliable Forex trading integrations. Select a domain tab to inspect technical details.
              </p>

              {/* Skills Category Buttons */}
              <div className="space-y-2 pt-2 w-full max-w-xl mx-auto lg:mx-0">
                {[
                  { id: 'languages', label: 'Languages', desc: 'Core programming languages', count: skillSets.languages.length },
                  { id: 'trading', label: 'Algorithmic Systems', desc: 'Quantitative modeling & backtests', count: skillSets.trading.length },
                  { id: 'backend', label: 'Backend & Data', desc: 'Relational DB & API services', count: skillSets.backend.length },
                  { id: 'devops', label: 'Cloud & Infrastructure', desc: 'System admin & CI/CD workflow', count: skillSets.devops.length },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveSkillCategory(cat.id as any)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      activeSkillCategory === cat.id
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/10'
                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-900 hover:border-slate-350 dark:hover:border-slate-800'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-sm block">{cat.label}</span>
                      <span className={`text-[11px] block mt-0.5 ${activeSkillCategory === cat.id ? 'text-blue-200' : 'text-slate-400'}`}>
                        {cat.desc}
                      </span>
                    </div>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                      activeSkillCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Skills Grid list representation */}
            <div className="lg:col-span-7 w-full max-w-xl mx-auto lg:mx-0">
              <div className="bg-white dark:bg-slate-950/40 border border-slate-200/65 dark:border-slate-900/65 rounded-[2rem] p-6 md:p-8 shadow-sm">
                <h4 className="text-lg font-bold font-display mb-6 capitalize text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Selected Category: {activeSkillCategory === 'trading' ? 'Algorithmic Trading' : activeSkillCategory === 'devops' ? 'Cloud & Infrastructure' : activeSkillCategory}</span>
                </h4>

                <div className="space-y-6">
                  {skillSets[activeSkillCategory].map((skill, i) => (
                    <div key={i} className="space-y-2 group">
                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {skill.name}
                        </span>
                        <span className="font-mono text-xs text-blue-600 dark:text-blue-400">{skill.level}</span>
                      </div>
                      
                      {/* Bar graph representing level */}
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: skill.level }}
                          transition={{ duration: 0.8, delay: i * 0.05 }}
                          className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                        />
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-mono">
                        {skill.info}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-900/60 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>* Estimated execution proficiency metric</span>
                  <span>EE Solutions 2026</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Professional Journey Timeline Section */}
      <section id="journey" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold font-mono">
              <Award size={12} /> TIMELINE
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
              Professional Milestones
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              A historical tracking of my engineering experience, product releases, and currency strategy architectures.
            </p>
          </div>

          {/* Timeline Layout */}
          <div className="relative max-w-xl md:max-w-3xl mx-auto">
            {/* Central line: left-aligned on mobile, centered on md+ */}
            <div className="absolute top-0 bottom-0 left-5 md:left-1/2 w-0.5 bg-slate-200 dark:bg-slate-900" />

            {/* Timeline nodes */}
            {[
              {
                year: '2026',
                title: 'Founder & Principal Architect',
                firm: 'EE Software Solutions',
                desc: 'Launched automated FX indicator models, executing over client portfolios via private APIs. Building premium SaaS web systems for business clients.',
                side: 'left'
              },
              {
                year: '2024 - 2025',
                title: 'Quantitative Strategy Developer',
                firm: 'Zenith Algo Tech',
                desc: 'Integrated machine-learning prediction vectors onto MetaTrader systems. Maintained secure Docker API clusters handling high-velocity price inputs.',
                side: 'right'
              },
              {
                year: '2022 - 2024',
                title: 'Senior Software Engineer',
                firm: 'Capital Stream Corp',
                desc: 'Engineered web applications, scaling microservices architecture to process 1.5M database commands daily. Managed secure GCP database environments.',
                side: 'left'
              },
              {
                year: '2020 - 2022',
                title: 'Freelance Software Developer',
                firm: 'Upwork / Private FX Clients',
                desc: 'Programmed custom volatility indicators in PineScript and Python. Designed responsive web systems for retail commerce customers.',
                side: 'right'
              }
            ].map((node, i) => (
              <div key={i} className="relative mb-10 md:mb-12">
                
                {/* ── MOBILE layout: all cards left-aligned after the timeline line ── */}
                <div className="flex md:hidden items-start gap-5 pl-14 pr-2">
                  {/* Node Dot (mobile) */}
                  <div className="absolute left-2.5 top-5 w-5 h-5 rounded-full bg-blue-600 border-4 border-slate-50 dark:border-slate-950 z-10" />
                  <div className="w-full bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/70 dark:border-slate-900/70 shadow-sm">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{node.year}</span>
                    <h4 className="font-display font-bold text-sm text-slate-950 dark:text-white mt-1">{node.title}</h4>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">{node.firm}</p>
                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-3 leading-relaxed font-mono">{node.desc}</p>
                  </div>
                </div>

                {/* ── DESKTOP layout: alternating left/right ── */}
                <div className="hidden md:grid md:grid-cols-2 gap-8 items-center">
                  {/* Node Dot (desktop) */}
                  <div className="absolute left-1/2 top-1/2 w-6 h-6 rounded-full bg-blue-600 border-4 border-slate-50 dark:border-slate-950 transform -translate-x-1/2 -translate-y-1/2 z-10" />

                  {/* Left column */}
                  <div className={`text-right pr-12 ${
                    node.side === 'left' ? 'order-1' : 'order-1 opacity-0 pointer-events-none'
                  }`}>
                    {node.side === 'left' && (
                      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-900/70 shadow-sm hover:border-blue-500/20 transition-all">
                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{node.year}</span>
                        <h4 className="font-display font-bold text-base text-slate-950 dark:text-white mt-1">{node.title}</h4>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">{node.firm}</p>
                        <p className="text-slate-600 dark:text-slate-400 text-xs mt-3 leading-relaxed font-mono">{node.desc}</p>
                      </div>
                    )}
                  </div>

                  {/* Right column */}
                  <div className={`pl-12 ${
                    node.side === 'right' ? 'order-2' : 'order-2 opacity-0 pointer-events-none'
                  }`}>
                    {node.side === 'right' && (
                      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-900/70 shadow-sm hover:border-blue-500/20 transition-all">
                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{node.year}</span>
                        <h4 className="font-display font-bold text-base text-slate-950 dark:text-white mt-1">{node.title}</h4>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">{node.firm}</p>
                        <p className="text-slate-600 dark:text-slate-400 text-xs mt-3 leading-relaxed font-mono">{node.desc}</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Testimonials Marquee Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-100 dark:bg-slate-900/20 border-t border-slate-200/50 dark:border-slate-900/50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
              Endorsed by Global Clients
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
              Read honest evaluations from partners who acquired customized system integrations and trading automations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-xl md:max-w-none mx-auto w-full">
            {[
              {
                text: "Emmanuel's Gold Scalper bot restructured my capital growth schedule. Its built-in risk vault triggers and micro-lot calculations kept drawdown below 7% over 10 months of continuous runtime. Stellar engineering.",
                client: "David Vance",
                tag: "Proprietary Trader, UK",
                stars: 5
              },
              {
                text: "We contracted EE Solutions to build our merchant inventory system. The API latency averages 75ms, and the offline-first action logging runs perfectly. Emmanuel's understanding of systems isolation is top class.",
                client: "Ngozi Obi",
                tag: "Director, Core wholesale Ltd",
                stars: 5
              },
              {
                text: "The reinforcement learning trading agents built by Emmanuel display real mathematical alpha. His ability to link python pipelines directly to MetaTrader execution arrays is incredibly rare.",
                client: "Maximilian K.",
                tag: "Quantitative Analyst, Germany",
                stars: 5
              }
            ].map((test, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-900/60 flex flex-col justify-between shadow-sm relative group hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex gap-1 text-yellow-500">
                    {[...Array(test.stars)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed italic">
                    "{test.text}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-900/50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center font-bold text-blue-600 text-sm">
                    {test.client.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-950 dark:text-white block">{test.client}</h5>
                    <span className="text-[10px] text-slate-400 block font-mono">{test.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Interactive Contact / WhatsApp Consultation Form Section */}
      <section id="contact" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-slate-50 dark:bg-slate-950 relative overflow-hidden scroll-mt-24">
        
        {/* Glow Spheres */}
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left description text */}
            <div className="lg:col-span-5 text-center lg:text-left space-y-6 flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold font-mono mx-auto lg:mx-0">
                <Calendar size={12} /> CONSULTATION
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
                Initiate a Project
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed mx-auto lg:mx-0 max-w-xl">
                Whether you need a custom-built quantitative trading robot, high-scaling web application, or algorithmic strategy consultation, I am ready to build your solution.
              </p>

              <div className="space-y-4 pt-4 w-full max-w-xl mx-auto lg:mx-0">
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase block">Direct Channel</span>
                    <a href="https://wa.me/2349025516842" className="text-sm font-bold text-slate-900 dark:text-white hover:underline block">
                      +234 (902) 551-6842 (WhatsApp)
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-600">
                    <Globe size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase block">Office Location</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block font-mono">
                      EE Software Solutions, Nigeria
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form (WhatsApp direct mapper) */}
            <div className="lg:col-span-7 w-full max-w-xl mx-auto lg:mx-0">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative">
                
                <h3 className="text-xl md:text-2xl font-bold font-display text-slate-950 dark:text-white mb-6">
                  Project Request Builder
                </h3>

                <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label htmlFor="name-input" className="text-xs text-slate-400 font-semibold font-mono uppercase block">Your Name *</label>
                      <input
                        id="name-input"
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="email-input" className="text-xs text-slate-400 font-semibold font-mono uppercase block">Your Email *</label>
                      <input
                        id="email-input"
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="e.g. john@example.com"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Project Category selection */}
                    <div className="space-y-2">
                      <label htmlFor="category-select" className="text-xs text-slate-400 font-semibold font-mono uppercase block">Project Type</label>
                      <div className="relative">
                        <select
                          id="category-select"
                          value={formType}
                          onChange={(e) => setFormType(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors appearance-none"
                        >
                          <option>Forex Trading Bot</option>
                          <option>Full-Stack Web App</option>
                          <option>API & Database System</option>
                          <option>Consultation Session</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    {/* Budget Estimation */}
                    <div className="space-y-2">
                      <label htmlFor="budget-select" className="text-xs text-slate-400 font-semibold font-mono uppercase block">Budget Estimation</label>
                      <div className="relative">
                        <select
                          id="budget-select"
                          value={formBudget}
                          onChange={(e) => setFormBudget(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors appearance-none"
                        >
                          <option>$500 - $1,000</option>
                          <option>$1,000 - $3,000</option>
                          <option>$3,000 - $5,000+</option>
                          <option>Hourly Consulting</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Message requirements description */}
                  <div className="space-y-2">
                    <label htmlFor="msg-textarea" className="text-xs text-slate-400 font-semibold font-mono uppercase block">Project Specifications *</label>
                    <textarea
                      id="msg-textarea"
                      required
                      rows={4}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Please detail your custom bot specifications, timeframe parameters, or website architecture requirements..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={formSubmitted}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-green-600/10 cursor-pointer disabled:bg-green-700 disabled:cursor-not-allowed"
                  >
                    {formSubmitted ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Forming WhatsApp Broadcast...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Proceed to WhatsApp Sync</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-slate-400 font-mono text-center">
                    * Submitting redirects you to WhatsApp with your details pre-formatted.
                  </p>

                </form>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 bg-slate-950 text-white border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="text-center md:text-left">
            <span className="font-display font-extrabold text-xl tracking-tight block">EE SOFTWARE SOLUTIONS</span>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest block uppercase mt-0.5">Automated Finance & Cloud Ecosystems</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400 font-mono font-bold uppercase">
            <a href="#about" onClick={(e) => scrollToSection(e, '#about')} className="hover:text-white transition-colors">About</a>
            <a href="#bots" onClick={(e) => scrollToSection(e, '#bots')} className="hover:text-white transition-colors">Forex Bots</a>
            <a href="#projects" onClick={(e) => scrollToSection(e, '#projects')} className="hover:text-white transition-colors">Projects</a>
            <a href="#skills" onClick={(e) => scrollToSection(e, '#skills')} className="hover:text-white transition-colors">Expertise</a>
            <a href="#journey" onClick={(e) => scrollToSection(e, '#journey')} className="hover:text-white transition-colors">Journey</a>
            <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="hover:text-white transition-colors">Contact</a>
          </div>

          <div className="text-center md:text-right font-mono text-[10px] text-slate-500">
            <p>© 2026 EE Software Solutions. All rights reserved.</p>
            <p className="mt-1 uppercase tracking-widest text-[9px] text-blue-500">Engineered for absolute excellence</p>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default App;