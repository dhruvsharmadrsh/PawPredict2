import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const particlesRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // System theme detection
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme based on system preference
    setIsDarkMode(mediaQuery.matches);

    // Listen for system theme changes
    const handleSystemThemeChange = (e) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    const createParticle = () => {
      if (!particlesRef.current) return;

      const particle = document.createElement("div");
      particle.className = `absolute rounded-full pointer-events-none ${
        isDarkMode ? 'bg-purple-300/20' : 'bg-white/30'
      } animate-dogAiParticleFloat`;
      const size = Math.random() * 60 + 20;
      particle.style.width = size + "px";
      particle.style.height = size + "px";
      particle.style.left = Math.random() * -100 + "px";
      particle.style.top = Math.random() * window.innerHeight + "px";

      particlesRef.current.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 20000);
    };

    const interval = setInterval(createParticle, 500);
    for (let i = 0; i < 10; i++) {
      setTimeout(createParticle, i * 200);
    }

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const hero = document.querySelector(".hero");
      if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [isDarkMode]);

  return (
    <div className={`font-sans overflow-x-hidden min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-black' 
        : 'bg-gradient-to-br from-indigo-400 to-purple-700'
    }`}>
      <section className="hero relative flex items-center min-h-screen px-10 py-20 overflow-hidden">
        {/* particles */}
        <div ref={particlesRef} className="absolute inset-0 z-0"></div>

        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          {/* left content */}
          <div>
            <div className={`inline-flex items-center gap-2 backdrop-blur-md px-6 py-3 rounded-full border-2 mb-8 animate-dogAiBadgePulse ${
              isDarkMode 
                ? 'bg-gray-800/60 border-gray-600/40' 
                : 'bg-white/20 border-white/40'
            }`}>
              <span className="animate-dogAiBadgeIconRotate">🧠</span>
              <span className={`uppercase text-sm tracking-widest font-bold ${
                isDarkMode ? 'text-gray-200' : 'text-white'
              }`}>
                AI-POWERED
              </span>
            </div>

            <h1 className={`font-extrabold text-5xl leading-tight mb-6 animate-dogAiHeroTitle ${
              isDarkMode ? 'text-gray-100' : 'text-white'
            }`}>
              Identify Your Dog's Breed
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent inline-block animate-dogAiGradientShift">
                Instantly
              </span>
            </h1>

            <p className={`text-lg mb-10 animate-dogAiFadeInUp leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-white/90'
            }`}>
Upload a photo of your dog and get instant, accurate breed identification powered by advanced AI technology.
Discover detailed breed characteristics, temperament insights, and personalized care tips — all crafted to help you understand your furry friend better.
            </p>

            <div className="flex flex-wrap gap-4 animate-dogAiFadeInUp">
              <Link
                to="/predict"
                className="px-8 py-4 rounded-full font-bold text-lg bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-xl hover:scale-105 transition"
              >
                📷 Start Identifying
              </Link>
              <Link
                to="/about"
                className={`px-8 py-4 rounded-full font-bold text-lg border-2 backdrop-blur hover:scale-105 transition ${
                  isDarkMode 
                    ? 'border-gray-500/50 text-gray-200 bg-gray-800/30 hover:bg-gray-700/40' 
                    : 'border-white/50 text-white bg-white/10 hover:bg-white/20'
                }`}
              >
                📖 Learn More
              </Link>
            </div>
          </div>

          {/* right floating cards */}
          <div className="relative h-[500px] animate-dogAiFadeInRight">
            <div className={`absolute top-[10%] left-[5%] animate-dogAiFloatCard1 backdrop-blur-lg p-6 rounded-2xl shadow-xl border text-center font-bold ${
              isDarkMode 
                ? 'bg-gray-800/80 border-gray-600/30 text-gray-200' 
                : 'bg-white/90 border text-gray-700'
            }`}>
              <div className="text-6xl animate-dogAiEmojiPulse">🐕‍🦺</div>
              German Shepherd
            </div>
            <div className={`absolute top-[45%] right-[10%] animate-dogAiFloatCard2 backdrop-blur-lg p-6 rounded-2xl shadow-xl border text-center font-bold ${
              isDarkMode 
                ? 'bg-gray-800/80 border-gray-600/30 text-gray-200' 
                : 'bg-white/90 border text-gray-700'
            }`}>
              <div className="text-6xl animate-dogAiEmojiPulse">🐕</div>
              Golden Retriever
            </div>
            <div className={`absolute bottom-[10%] left-[30%] animate-dogAiFloatCard3 backdrop-blur-lg p-6 rounded-2xl shadow-xl border text-center font-bold ${
              isDarkMode 
                ? 'bg-gray-800/80 border-gray-600/30 text-gray-200' 
                : 'bg-white/90 border text-gray-700'
            }`}>
              <div className="text-6xl animate-dogAiEmojiPulse">🐶</div>
              French Bulldog
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={`relative py-20 px-10 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="max-w-[1400px] mx-auto relative z-10">
          {/* Heading */}
          <h2 className={`text-4xl font-extrabold text-center mb-16 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-indigo-400 to-purple-700 bg-clip-text text-transparent'
          }`}>
              Why Choose Us?
          </h2>

          {/* Cards Grid */}
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Card 1 */}
            <div className={`p-8 rounded-2xl shadow-xl text-center hover:scale-105 transition ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600/30' 
                : 'bg-gradient-to-br from-white to-gray-100'
            }`}>
              <div className="text-5xl mb-4 animate-dogAiEmojiPulse">🧠</div>
              <h3 className={`text-xl font-bold mb-2 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`}>
                Advanced AI Model
              </h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Uses EfficientNetV2-B2 architecture trained on thousands of dog
                images for accurate breed identification.
              </p>
            </div>

            {/* Card 2 */}
            <div className={`p-8 rounded-2xl shadow-xl text-center hover:scale-105 transition ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600/30' 
                : 'bg-gradient-to-br from-white to-gray-100'
            }`}>
              <div className="text-5xl mb-4 animate-dogAiEmojiPulse">⚡</div>
              <h3 className={`text-xl font-bold mb-2 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`}>
                Instant Results
              </h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Get breed predictions in seconds with confidence scores and
                detailed breed information.
              </p>
            </div>

            {/* Card 3 */}
            <div className={`p-8 rounded-2xl shadow-xl text-center hover:scale-105 transition ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600/30' 
                : 'bg-gradient-to-br from-white to-gray-100'
            }`}>
              <div className="text-5xl mb-4 animate-dogAiEmojiPulse">📚</div>
              <h3 className={`text-xl font-bold mb-2 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`}>
                Breed Details
              </h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Learn about your dog's characteristics, temperament, size,
                energy level, and care requirements.
              </p>
            </div>

            {/* Card 4 */}
            <div className={`p-8 rounded-2xl shadow-xl text-center hover:scale-105 transition ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600/30' 
                : 'bg-gradient-to-br from-white to-gray-100'
            }`}>
              <div className="text-5xl mb-4 animate-dogAiEmojiPulse">📱</div>
              <h3 className={`text-xl font-bold mb-2 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`}>
                Mobile Friendly
              </h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Works perfectly on all devices - desktop, tablet, and mobile
                with responsive design.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={`py-20 px-10 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-800 via-slate-800 to-gray-900' 
          : 'bg-gradient-to-br from-indigo-400 to-purple-700'
      }`}>
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-4 gap-10 text-center text-white">
          <div className="cursor-pointer hover:scale-110 transition">
            <div className="text-5xl font-extrabold mb-2 animate-dogAiStatPulse">
              120+
            </div>
            <div className="uppercase tracking-wide font-semibold">
              Dog Breeds
            </div>
          </div>
          <div className="cursor-pointer hover:scale-110 transition">
            <div className="text-5xl font-extrabold mb-2 animate-dogAiStatPulse">
              86%
            </div>
            <div className="uppercase tracking-wide font-semibold">
              Accuracy Rate
            </div>
          </div>
          <div className="cursor-pointer hover:scale-110 transition">
            <div className="text-5xl font-extrabold mb-2 animate-dogAiStatPulse">
              20K+
            </div>
            <div className="uppercase tracking-wide font-semibold">
              Photos Analyzed
            </div>
          </div>
          <div className="cursor-pointer hover:scale-110 transition">
            <div className="text-5xl font-extrabold mb-2 animate-dogAiStatPulse">
              &lt;3s
            </div>
            <div className="uppercase tracking-wide font-semibold">
              Processing Time
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
