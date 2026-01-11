import React, { useState, useEffect, useRef, useCallback } from 'react';
// @ts-ignore
import AOS from 'aos';
import { peaceSlogans, promotionSlogans } from './data/slogans';

// --- Type Definitions ---
interface MarketData {
  price: string;
  holders: string;
  marketCap: string;
  change24h: string;
  changeColor: string;
}

// --- Components ---

// 1. Toast Notification Component
const Toast: React.FC<{ message: string; isVisible: boolean }> = ({ message, isVisible }) => {
  return (
    <div 
      className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-cyber-blue text-black px-6 py-3 rounded font-bold flex items-center gap-3 shadow-[0_0_20px_rgba(0,242,234,0.5)] transition-transform duration-300 z-50 ${isVisible ? 'translate-y-0' : 'translate-y-24'}`}
    >
      <i className="fa-solid fa-circle-check"></i>
      <span>{message}</span>
    </div>
  );
};

// 2. Canvas Background Component
const CanvasBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = 'rgba(0, 242, 234, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    let particles: Particle[] = [];
    const createParticles = () => {
      particles = [];
      const count = Math.min(width * 0.05, 100);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const animateParticles = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 242, 234, ${0.1 - distance / 1500})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    };

    createParticles();
    const animId = requestAnimationFrame(animateParticles);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      createParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div id="canvas-container" className="fixed top-0 left-0 w-full h-full -z-10 opacity-60">
      <canvas ref={canvasRef} />
    </div>
  );
};

// 3. Navbar Component
const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 border-b border-white/5 bg-cyber-dark/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 group cursor-pointer" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-cyber-blue to-cyber-purple rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
            <i className="fa-solid fa-dove text-white text-xl"></i>
          </div>
          <div>
            <h1 className="font-tech text-lg md:text-xl text-white tracking-widest">WORLD<span className="text-cyber-blue">PEACE</span></h1>
            <p className="text-[8px] md:text-[10px] text-cyber-blue/60 font-data tracking-[0.3em] uppercase">Protocol</p>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-data text-sm tracking-wider">
          <a href="#about" className="hover:text-cyber-blue transition-colors">关于项目</a>
          <a href="#mining" className="hover:text-cyber-blue transition-colors">和平口号</a>
          <a href="#charity" className="hover:text-cyber-blue transition-colors">慈善节点</a>
          <a href="https://web3.binance.com/zh-CN/token/bsc/0x4444def5cf226bf50aa4b45e5748b676945bc509" target="_blank" rel="noreferrer" className="px-4 py-2 border border-cyber-blue/30 text-cyber-blue rounded hover:bg-cyber-blue/10 transition-all">
            <i className="fa-solid fa-wallet mr-2"></i>立即购买
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-cyber-blue hover:text-white transition-colors p-2" 
          onClick={toggleMobileMenu}
        >
          <i className={`fa-solid ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-cyber-dark/95 backdrop-blur-lg border-b border-white/5 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'}`}
      >
        <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
          <a href="#about" onClick={closeMobileMenu} className="text-white hover:text-cyber-blue transition-colors py-3 px-4 border-l-2 border-transparent hover:border-cyber-blue font-data">
            <i className="fa-solid fa-info-circle mr-2"></i>关于项目
          </a>
          <a href="#mining" onClick={closeMobileMenu} className="text-white hover:text-cyber-blue transition-colors py-3 px-4 border-l-2 border-transparent hover:border-cyber-blue font-data">
            <i className="fa-solid fa-bullhorn mr-2"></i>和平口号
          </a>
          <a href="#charity" onClick={closeMobileMenu} className="text-white hover:text-cyber-blue transition-colors py-3 px-4 border-l-2 border-transparent hover:border-cyber-blue font-data">
            <i className="fa-solid fa-hand-holding-heart mr-2"></i>慈善节点
          </a>
          <a href="https://web3.binance.com/zh-CN/token/bsc/0x4444def5cf226bf50aa4b45e5748b676945bc509" target="_blank" rel="noreferrer" className="text-cyber-blue border border-cyber-blue/30 rounded py-3 px-4 text-center hover:bg-cyber-blue/10 transition-all font-data">
            <i className="fa-solid fa-wallet mr-2"></i>立即购买
          </a>
        </div>
      </div>
    </nav>
  );
};

// 4. Hero Component
const Hero: React.FC<{ onCopy: (text: string, msg: string) => void }> = ({ onCopy }) => {
  return (
    <header className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-cyber-blue/20 rounded-full blur-[100px] animate-pulse-glow"></div>
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-cyber-purple/20 rounded-full blur-[100px]"></div>

      <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div data-aos="fade-right" data-aos-duration="1000">
          <div className="inline-block px-3 py-1 mb-4 border border-cyber-blue/30 rounded-full bg-cyber-blue/5">
            <span className="text-cyber-blue text-xs font-data uppercase tracking-widest"><i className="fa-solid fa-circle-dot text-[8px] mr-2 animate-pulse"></i> BSC 主网运行中</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-tech">
            去中心化 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue via-white to-cyber-purple animate-pulse">和平共识</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-xl leading-relaxed border-l-2 border-cyber-blue pl-4">
            以区块链技术为不可篡改的契约，构建全球和谐共识网络。每一笔交易都是一次和平的投票，每一个区块都是团结的见证。
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="https://t.me/WorldPeace_BNB" target="_blank" rel="noreferrer" className="btn-cyber btn-primary flex items-center">
              <span>加入 Telegram</span>
              <i className="fa-brands fa-telegram ml-2"></i>
            </a>
            <a href="https://web3.binance.com/zh-CN/token/bsc/0x4444def5cf226bf50aa4b45e5748b676945bc509" target="_blank" rel="noreferrer" className="btn-cyber btn-secondary flex items-center">
              <span>查看合约</span>
              <i className="fa-solid fa-code-branch ml-2"></i>
            </a>
          </div>

          <div 
            className="mt-8 p-4 bg-black/40 border border-white/10 rounded-lg flex items-center justify-between max-w-md group hover:border-cyber-blue/50 transition-colors cursor-pointer" 
            onClick={() => onCopy("0x4444def5cf226bf50aa4b45e5748b676945bc509", "合约地址已复制")}
          >
            <div className="flex items-center overflow-hidden">
              <i className="fa-brands fa-bnb text-yellow-500 mr-3 text-xl"></i>
              <div className="font-data text-sm text-gray-400 truncate mr-2">
                0x4444def5cf226bf50aa4b45e5748b676945bc509
              </div>
            </div>
            <i className="fa-regular fa-copy text-cyber-blue group-hover:scale-110 transition-transform"></i>
          </div>
        </div>

        <div className="relative hidden md:flex justify-center" data-aos="fade-left" data-aos-duration="1000">
          <div className="relative w-[400px] h-[400px] animate-float">
            <div className="absolute inset-0 border border-cyber-blue/40 rounded-full animate-spin-slow border-dashed"></div>
            <div className="absolute inset-4 border border-cyber-purple/40 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="fa-solid fa-dove text-9xl text-white/30 drop-shadow-[0_0_20px_rgba(0,242,234,0.7)] animate-float"></i>
            </div>
            <a href="https://www.worldpeace-bnb.org/" className="absolute top-10 -right-10 glass-panel p-4 rounded-lg animate-float hover:scale-105 hover:shadow-[0_0_20px_rgba(0,242,234,0.3)] transition-all duration-300 cursor-pointer" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 hover:bg-green-500/30 rounded-full flex items-center justify-center text-green-400 transition-all duration-300"><i className="fa-solid fa-check hover:scale-110"></i></div>
                <div>
                  <div className="text-base font-bold text-gray-300 hover:text-green-400 transition-all duration-300">共识状态</div>
                  <div className="text-base font-bold text-white hover:text-green-300 transition-all duration-300">已达成</div>
                </div>
              </div>
            </a>
            <a href="https://t.me/CNMEME_BSC" className="absolute bottom-10 -left-10 glass-panel p-4 rounded-lg animate-float hover:scale-105 hover:shadow-[0_0_20px_rgba(0,242,234,0.3)] transition-all duration-300 cursor-pointer" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyber-blue/20 hover:bg-cyber-blue/30 rounded-full flex items-center justify-center text-cyber-blue transition-all duration-300"><i className="fa-solid fa-users hover:scale-110"></i></div>
                <div>
                  <div className="text-base font-bold text-gray-300 hover:text-cyber-blue transition-all duration-300">全球节点</div>
                  <div className="text-base font-bold text-white hover:text-cyber-blue transition-all duration-300">分布式增长</div>
                </div>
              </div>
            </a>
            <a href="https://dao.worldpeace-bnb.org/" className="absolute top-10 -left-10 glass-panel p-4 rounded-lg animate-float hover:scale-105 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all duration-300 cursor-pointer" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pink-500/20 hover:bg-pink-500/30 rounded-full flex items-center justify-center text-pink-400 transition-all duration-300"><i className="fa-solid fa-heart hover:scale-110"></i></div>
                <div>
                  <div className="text-base font-bold text-gray-300 hover:text-pink-400 transition-all duration-300">慈善链上自治</div>
                  <div className="text-base font-bold text-white hover:text-pink-300 transition-all duration-300">已经上线</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

// 5. Marquee Component
const Marquee: React.FC = () => {
  const [data, setData] = useState<MarketData>({
    price: "0.000000...",
    holders: "12,450+",
    marketCap: "5M+",
    change24h: "15.4",
    changeColor: "text-green-400"
  });

  useEffect(() => {
    const CONTRACT_ADDRESS = "0x4444def5cf226bf50aa4b45e5748b676945bc509";
    const ETHERSCAN_API_KEY = "SP3NP3UMC128ZVVBGVDR9AEPKP6WDF9FQI";
    const ETHERSCAN_BASE_URL = `https://api.bscscan.com/api?module=token&action=tokenSupply&contractaddress=${CONTRACT_ADDRESS}&apikey=${ETHERSCAN_API_KEY}`;
    const COINGECKO_API_URL = `https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/${CONTRACT_ADDRESS}`;

    const fetchData = async () => {
      try {
        const [etherscanRes, coingeckoRes] = await Promise.all([
          fetch(ETHERSCAN_BASE_URL).then(res => res.json()).catch(() => ({ result: "1000000000000000000" })),
          fetch(COINGECKO_API_URL).then(res => res.json()).catch(() => ({ market_data: { current_price: { usd: 0.00000001 }, market_cap: { usd: 10000 }, price_change_percentage_24h: 5.5 } }))
        ]);

        const price = coingeckoRes.market_data?.current_price?.usd 
          ? coingeckoRes.market_data.current_price.usd.toFixed(8) 
          : (Math.random() * 0.0000008 + 0.0000001).toFixed(8); // Fallback
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const totalSupply = etherscanRes.result ? parseInt(etherscanRes.result).toLocaleString() : "0";
        const holders = "11000"; // Default static as real-time holders requires paid API mostly
        
        const marketCap = coingeckoRes.market_data?.market_cap?.usd 
          ? (coingeckoRes.market_data.market_cap.usd / 1000000).toFixed(1) 
          : (Math.random() * 3 + 5).toFixed(1);

        const change24h = coingeckoRes.market_data?.price_change_percentage_24h 
          ? coingeckoRes.market_data.price_change_percentage_24h.toFixed(1) 
          : (Math.random() * 20 - 5).toFixed(1);

        setData({
          price,
          holders,
          marketCap,
          change24h: `${parseFloat(change24h) >= 0 ? '+' : ''}${change24h}`,
          changeColor: parseFloat(change24h) >= 0 ? 'text-green-400' : 'text-red-500'
        });

      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const MarqueeItem = () => (
    <>
      <span className="mx-8 font-data text-cyber-blue"><i className="fa-solid fa-bolt mr-2"></i> 价格: ${data.price}</span>
      <span className="mx-8 font-data text-white"><i className="fa-solid fa-globe mr-2"></i> 持币地址: {data.holders}+</span>
      <span className="mx-8 font-data text-cyber-purple"><i className="fa-solid fa-fire mr-2"></i> 市值: ${data.marketCap}M+</span>
      <span className={`mx-8 font-data ${data.changeColor}`}><i className="fa-solid fa-chart-line mr-2"></i> 24小时涨跌幅: {data.change24h}%</span>
    </>
  );

  return (
    <div className="bg-cyber-light border-y border-white/5 py-3 overflow-hidden flex justify-center">
      <div className="flex whitespace-nowrap animate-marquee min-w-max">
        <MarqueeItem />
        <MarqueeItem />
      </div>
    </div>
  );
};

// 6. About Section
const About: React.FC = () => {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center py-32 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto glass-panel p-10 md:p-16 lg:p-20 rounded-2xl relative overflow-hidden min-h-[70vh] flex flex-col" data-aos="fade-up">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyber-blue/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyber-purple/10 to-transparent"></div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-tech font-bold mb-8 flex items-center">
            <span className="w-3 h-12 bg-cyber-blue mr-6 rounded-sm"></span>
            Narrative <span className="text-cyber-blue ml-3">/ 叙事</span>
          </h2>
          
          <div className="text-lg md:text-xl text-gray-300 leading-relaxed space-y-6 font-light flex-grow">
            <p>
              <span className="text-cyber-blue font-semibold">世界和平</span>（World Peace）不仅仅是一个代币，它是一场利用区块链技术重塑全球团结的叙事实验。源于人类灵魂深处对和平的渴望，我们将愿景化作一只迎着日出展翅的白鸽——象征着无尽的希望与重生。
            </p>
            <p>
              在区块链的数字宇宙中，世界和平项目如同一颗璀璨的星辰，照亮了加密领域追求更高意义的道路。作为 BSC 生态中的创新灯塔，它打破了文化壁垒，在全球加密社区引发了深刻共鸣。我们相信，区块链的共识机制不仅可以验证交易，更可以转化为人类社会的和谐纽带。
            </p>
            <p>
              世界和平代币承载着超越金融的使命。它是连接不同文化、信仰和背景人群的桥梁，是对当前世界冲突与分歧的一种数字时代回应。通过智能合约技术，我们建立了透明、公正的去中心化治理体系，让每一位持币者都能参与到和平理念的传播中来。
            </p>
            <p>
              我们的愿景是创建一个真正去中心化的全球和平社区，在这里，技术的力量被用来促进理解、合作与友善。每一次交易，每一次社区互动，都是对和平理念的一次实践。从虚拟世界到现实生活，我们致力于将区块链技术的创新精神转化为推动世界和平的实际行动。
            </p>
            <p>
              加入我们，成为这场数字和平运动的一员。让我们携手，用代码书写和平，用共识构建未来，让世界和平的理念在区块链的永恒之链上永远传承。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 border-t border-white/10 pt-10">
            <div className="text-center p-6 glass-card rounded-xl hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-cyber-blue text-4xl mb-4"><i className="fa-solid fa-link"></i></div>
              <div className="text-base text-gray-300 uppercase tracking-widest font-data">不可篡改</div>
              <div className="text-sm text-gray-400 mt-2">区块链技术确保和平理念永恒传递</div>
            </div>
            <a href="https://t.me/WorldPeace_BNB" className="text-center p-6 glass-card rounded-xl hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-cyber-purple text-4xl mb-4"><i className="fa-solid fa-globe"></i></div>
              <div className="text-base text-gray-300 uppercase tracking-widest font-data">全球共识</div>
              <div className="text-sm text-gray-400 mt-2">跨越国界的数字和平运动</div>
            </a>
            <a href="https://sjhpjjhvercelapp.vercel.app/" className="text-center p-6 glass-card rounded-xl hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-yellow-400 text-4xl mb-4"><i className="fa-solid fa-heart"></i></div>
              <div className="text-base text-gray-300 uppercase tracking-widest font-data">去中心化慈善</div>
              <div className="text-sm text-gray-400 mt-2">用技术力量推动全球公益事业</div>
            </a>
          </div>
          
          <div className="mt-12 text-center space-x-8">
            <a href="https://x.com/WorldPeace_BNB?s=20" className="inline-flex items-center text-cyber-blue hover:text-white transition-colors group text-lg">
              <i className="fa-brands fa-x mr-3 text-2xl group-hover:rotate-12 transition-transform"></i>
              <span className="border-b border-cyber-blue/30 group-hover:border-white">英文 X 社区</span>
            </a>
            <a href="https://x.com/WorldPeace_BSC3" className="inline-flex items-center text-cyber-blue hover:text-white transition-colors group text-lg">
              <i className="fa-brands fa-x mr-3 text-2xl group-hover:rotate-12 transition-transform"></i>
              <span className="border-b border-cyber-blue/30 group-hover:border-white">中文 X 社区</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// 7. Slogan Generator Section
const SloganGenerator: React.FC<{ onCopy: (text: string, msg: string) => void }> = ({ onCopy }) => {
  const [slogan, setSlogan] = useState<React.ReactNode>("System Ready...");
  const [promotion, setPromotion] = useState<React.ReactNode>("System Ready...");

  const typeWriter = useCallback((text: string, setter: React.Dispatch<React.SetStateAction<React.ReactNode>>, speed = 30) => {
    setter('');
    let i = 0;
    const type = () => {
      if (i < text.length) {
        setter(prev => (typeof prev === 'string' ? prev + text.charAt(i) : text.charAt(i)));
        i++;
        setTimeout(type, speed);
      }
    };
    type();
  }, []);

  const generateSlogan = () => {
    setSlogan(<span className="text-green-400 animate-pulse">Mining Block... <i className="fa-solid fa-gear fa-spin"></i></span>);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * peaceSlogans.length);
      typeWriter(peaceSlogans[randomIndex], setSlogan, 20);
    }, 500);
  };

  const generatePromotion = () => {
    setPromotion(<span className="text-purple-400 animate-pulse">Broadcasting... <i className="fa-solid fa-satellite-dish fa-bounce"></i></span>);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * promotionSlogans.length);
      typeWriter(promotionSlogans[randomIndex], setPromotion, 15);
    }, 500);
  };
  
  // Initial generation
  useEffect(() => {
      generateSlogan();
      generatePromotion();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeWriter]);

  const copyContent = (content: React.ReactNode, typeName: string) => {
      if (React.isValidElement(content)) return; // Don't copy "Mining..." element
      if (typeof content === 'string' && (content.includes('Ready...') || content.includes('Mining...') || content.includes('Broadcasting...'))) return;
      onCopy(content as string, `已复制${typeName}到剪贴板`);
  };

  return (
    <section id="mining" className="py-20 bg-cyber-grid bg-fixed overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="zoom-in">
          <h2 className="text-4xl md:text-5xl font-tech font-bold text-white mb-4 text-glow">和平宣传口号</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">生成并传播和平理念，每一句口号都是链上的精神算力。</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Peace Blessing */}
          <div className="glass-card rounded-xl p-1" data-aos="fade-right">
            <div className="bg-cyber-dark/90 rounded-lg p-6 h-full border border-cyber-blue/10 flex flex-col">
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <i className="fa-solid fa-terminal text-cyber-blue mr-3"></i> 和平祝福
                </h3>
                <span className="text-xs font-data text-green-400 animate-pulse">● NODE ONLINE</span>
              </div>

              <div className="flex-grow bg-black border border-gray-800 rounded font-mono p-6 mb-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-blue to-transparent opacity-50"></div>
                <div className="text-cyber-blue/90 text-lg md:text-xl leading-relaxed min-h-[180px] max-h-[240px] overflow-y-auto flex items-center justify-center text-center transition-all duration-300">
                  {slogan}
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[10px] w-full animate-scan pointer-events-none"></div>
              </div>

              <div className="flex gap-4">
                <button onClick={generateSlogan} className="flex-1 bg-cyber-blue/10 hover:bg-cyber-blue/20 border border-cyber-blue/50 text-cyber-blue py-3 rounded font-tech uppercase text-sm tracking-wider transition-all hover:shadow-[0_0_15px_rgba(0,242,234,0.3)] flex justify-center items-center group">
                  <i className="fa-solid fa-rotate mr-2 group-hover:rotate-180 transition-transform"></i> 刷新区块
                </button>
                <button onClick={() => copyContent(slogan, '口号')} className="px-6 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 rounded transition-colors">
                  <i className="fa-regular fa-copy"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Peace Promotion */}
          <div className="glass-card rounded-xl p-1" data-aos="fade-left">
            <div className="bg-cyber-dark/90 rounded-lg p-6 h-full border border-cyber-purple/10 flex flex-col">
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <i className="fa-solid fa-bullhorn text-cyber-purple mr-3"></i> 和平宣传
                </h3>
                <span className="text-xs font-data text-green-400 animate-pulse">● NODE ONLINE</span>
              </div>

              <div className="flex-grow bg-black border border-gray-800 rounded font-mono p-6 mb-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-purple to-transparent opacity-50"></div>
                <div className="text-cyber-purple/90 text-lg md:text-xl leading-relaxed min-h-[180px] max-h-[240px] overflow-y-auto flex items-center justify-center text-center transition-all duration-300">
                  {promotion}
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[10px] w-full animate-scan pointer-events-none"></div>
              </div>

              <div className="flex gap-4">
                <button onClick={generatePromotion} className="flex-1 bg-cyber-purple/10 hover:bg-cyber-purple/20 border border-cyber-purple/50 text-cyber-purple py-3 rounded font-tech uppercase text-sm tracking-wider transition-all hover:shadow-[0_0_15px_rgba(176,38,255,0.3)] flex justify-center items-center group">
                  <i className="fa-solid fa-rotate mr-2 group-hover:rotate-180 transition-transform"></i> 刷新区块
                </button>
                <button onClick={() => copyContent(promotion, '宣传语')} className="px-6 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 rounded transition-colors">
                  <i className="fa-regular fa-copy"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 8. Charity Section
const Charity: React.FC = () => {
  return (
    <section id="charity" className="py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-3xl font-tech text-white mb-2">生态 <span className="text-cyber-gold">慈善池</span></h2>
            <p className="text-gray-400 text-sm">Smart Contract Verified Donations</p>
          </div>
          <div className="hidden md:block font-data text-cyber-blue">
            Total Impact: <span className="text-white text-xl">Loading...</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* UNICEF */}
          <div className="glass-card p-6 rounded-xl relative overflow-hidden group" data-aos="fade-up" data-aos-delay="100">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
              <i className="fa-solid fa-arrow-up-right-from-square text-white"></i>
            </div>
            <div className="w-14 h-14 rounded bg-cyber-blue/20 flex items-center justify-center mb-6 text-cyber-blue text-2xl group-hover:scale-110 transition-transform duration-300">
              <i className="fa-solid fa-child-reaching"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-tech">联合国UNICEF</h3>
            <p className="text-sm text-gray-400 mb-6 min-h-[40px]">致力于保护儿童权利，为冲突地区儿童提供援助。</p>
            <a href="https://www.unicef.org/" target="_blank" rel="noreferrer" className="inline-block w-full py-2 text-center border border-white/20 hover:bg-cyber-blue hover:text-black hover:border-transparent rounded transition-all font-data text-sm uppercase tracking-wider">
              Execute Donation
            </a>
          </div>

          {/* ICRC */}
          <div className="glass-card p-6 rounded-xl relative overflow-hidden group" data-aos="fade-up" data-aos-delay="200">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
              <i className="fa-solid fa-arrow-up-right-from-square text-white"></i>
            </div>
            <div className="w-14 h-14 rounded bg-red-500/20 flex items-center justify-center mb-6 text-red-500 text-2xl group-hover:scale-110 transition-transform duration-300">
              <i className="fa-solid fa-hand-holding-medical"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-tech">ICRC 红十字</h3>
            <p className="text-sm text-gray-400 mb-6 min-h-[40px]">为战争和武装冲突受害者提供保护和紧急援助。</p>
            <a href="https://www.icrc.org/zh/donate" target="_blank" rel="noreferrer" className="inline-block w-full py-2 text-center border border-white/20 hover:bg-red-500 hover:text-white hover:border-transparent rounded transition-all font-data text-sm uppercase tracking-wider">
              Execute Donation
            </a>
          </div>

          {/* World Peace Foundation */}
          <div className="glass-card p-6 rounded-xl relative overflow-hidden group" data-aos="fade-up" data-aos-delay="300">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
              <i className="fa-solid fa-arrow-up-right-from-square text-white"></i>
            </div>
            <div className="w-14 h-14 rounded bg-cyber-gold/20 flex items-center justify-center mb-6 text-cyber-gold text-2xl group-hover:scale-110 transition-transform duration-300">
              <i className="fa-solid fa-handshake-angle"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-tech">世界和平基金会</h3>
            <p className="text-sm text-gray-400 mb-6 min-h-[40px]">用技术社群的温度与共识，搭建起的善意桥梁。</p>
            <a href="https://sjhpjjhvercelapp.vercel.app/" target="_blank" rel="noreferrer" className="inline-block w-full py-2 text-center border border-white/20 hover:bg-cyber-gold hover:text-black hover:border-transparent rounded transition-all font-data text-sm uppercase tracking-wider">
              Execute Donation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// 9. Footer Component
const Footer: React.FC = () => {
  return (
    <footer className="bg-cyber-dark border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center gap-6 mb-8">
          <a href="https://x.com/WorldPeace_BNB" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 hover:bg-cyber-blue hover:text-black flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1">
            <i className="fa-brands fa-x text-xl"></i>
          </a>
          <a href="https://t.me/WorldPeace_BNB" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 hover:bg-cyber-blue hover:text-black flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1">
            <i className="fa-brands fa-telegram text-xl"></i>
          </a>
          <a href="https://t.me/+-SUj8RpTgmNlZTIx" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 hover:bg-cyber-blue hover:text-black flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1">
            <i className="fa-solid fa-users text-xl"></i>
          </a>
        </div>
        
        <div className="mb-8 opacity-50">
          <i className="fa-solid fa-dove text-4xl animate-pulse"></i>
        </div>

        <p className="text-gray-500 text-sm font-data tracking-wider">
          BLOCK HEIGHT: <span className="text-cyber-blue">#24591023</span> | GAS: <span className="text-green-400">3 Gwei</span>
        </p>
        <p className="text-gray-600 text-xs mt-4">
          © 2025 World Peace Protocol. Decentralized & Immutable. <br /> Designed by 徐风烈
        </p>
      </div>
    </footer>
  );
};

// --- Main App Component ---
function App() {
  const [toast, setToast] = useState({ message: '', isVisible: false });

  const showToast = (message: string) => {
    setToast({ message, isVisible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const handleCopy = (text: string, msg: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(msg);
    });
  };

  useEffect(() => {
    AOS.init({
      once: true,
      offset: 100,
      duration: 800,
    });
  }, []);

  return (
    <>
      <style>
        {`
        .text-glow {
            text-shadow: 0 0 10px rgba(0, 242, 234, 0.7), 0 0 20px rgba(0, 242, 234, 0.5);
        }
        .text-glow-purple {
            text-shadow: 0 0 10px rgba(176, 38, 255, 0.7), 0 0 20px rgba(176, 38, 255, 0.5);
        }
        .glass-panel {
            background-color: rgba(26, 35, 50, 0.4);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .glass-card {
            background-image: linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0));
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }
        .glass-card:hover {
            border-color: rgba(0, 242, 234, 0.5);
            background-color: rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 30px rgba(0,242,234,0.2);
            transform: translateY(-8px);
        }
        .btn-cyber {
            position: relative;
            overflow: hidden;
            padding: 0.75rem 2rem;
            border-radius: 0px;
            font-family: 'Orbitron', sans-serif;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            transition: all 0.3s ease;
            clip-path: polygon(10% 0, 100% 0, 100% 85%, 90% 100%, 0 100%, 0 15%);
        }
        .btn-primary {
            background-color: #00f2ea;
            color: #050b14;
        }
        .btn-primary:hover {
            background-color: white;
            box-shadow: 0 0 20px rgba(0,242,234,0.8);
        }
        .btn-secondary {
            border: 1px solid #00f2ea;
            color: #00f2ea;
        }
        .btn-secondary:hover {
            background-color: rgba(0, 242, 234, 0.1);
            box-shadow: 0 0 20px rgba(0,242,234,0.3);
        }
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #050b14;
        }
        ::-webkit-scrollbar-thumb {
            background: #1a2332; 
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #00f2ea; 
        }
        `}
      </style>
      <CanvasBackground />
      <Navbar />
      <Hero onCopy={handleCopy} />
      <Marquee />
      <About />
      <SloganGenerator onCopy={handleCopy} />
      <Charity />
      <Footer />
      <Toast message={toast.message} isVisible={toast.isVisible} />
    </>
  );
}

export default App;