// TechCards.jsx
import React, { useEffect, useRef, useState } from 'react';

const TECH = [
  {
    icon: '🔬',
    title: 'Model Architecture',
    desc: 'EfficientNetV2-B2 with transfer learning and fine-tuning for optimal performance',
    features: ['7.2M Parameters', 'Compound Scaling', 'Fused-MBConv'],
    color: '#667eea',
  },
  {
    icon: '📊',
    title: 'Training Dataset',
    desc: '20,000+ carefully curated high-quality images across 120+ breeds',
    features: ['Balanced Classes', 'Quality Control', 'Diverse Angles'],
    color: '#764ba2',
  },
  {
    icon: '🎯',
    title: 'Validation',
    desc: '86% accuracy on independent test set with rigorous cross-validation',
    features: ['K-Fold Validation', 'Test Split 20%', 'Confusion Matrix'],
    color: '#f093fb',
  },
  {
    icon: '⚡',
    title: 'Performance',
    desc: 'Optimized for speed with less than 3 seconds processing time per image',
    features: ['GPU Acceleration', 'Batch Processing', 'Edge Optimization'],
    color: '#FFA500',
  },
];

export default function TechCards({ isDarkMode = false }) {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [visible, setVisible] = useState({});

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible((v) => ({ ...v, [e.target.id]: true }));
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
    );

    // Header
    const headerEl = document.getElementById('tech-header');
    if (headerEl) obs.observe(headerEl);

    // Cards
    itemRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24 px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div
          id="tech-header"
          className={`${visible['tech-header'] ? 'animate-in' : ''} text-center mb-16 opacity-0`}
        >
          <div className="waving text-6xl mb-4">🧠</div>
          <h2
            className={`text-4xl sm:text-5xl md:text-6xl font-black mb-4 drop-shadow-xl ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}
          >
            Our AI Technology
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            State-of-the-art deep learning architecture trained on thousands of dog images
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TECH.map((tech, idx) => (
            <div
              key={idx}
              id={`tech-${idx}`}
              ref={(el) => (itemRefs.current[idx] = el)}
              className={`card-hover ${
                visible[`tech-${idx}`] ? 'animate-rotate' : ''
              } backdrop-blur-2xl p-10 rounded-3xl border-2 opacity-0 transform-gpu transition-all duration-700 ${
                isDarkMode
                  ? 'bg-gray-800/60 border-gray-600/30'
                  : 'bg-slate-100/70 border border-slate-300/40 text-gray-800 hover:bg-slate-200/80 hover:border-slate-400/50 hover:shadow-lg'
              }`}
              style={{
                animationDelay: `${idx * 0.15}s`,
              }}
            >
              <div
                className="floating text-6xl mb-6"
                style={{
                  filter: `drop-shadow(0 0 15px ${tech.color})`,
                  animationDelay: `${idx * 0.3}s`,
                }}
              >
                {tech.icon}
              </div>

              <h3 className={`text-3xl font-extrabold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {tech.title}
              </h3>

              <p className={`leading-relaxed mb-6 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {tech.desc}
              </p>

              <div className="flex flex-col gap-3">
                {tech.features.map((feature, fidx) => (
                  <div
                    key={fidx}
                    className={`py-3 px-4 rounded-xl text-sm flex items-center gap-3 border transition-all duration-300 hover:translate-x-2 ${
                      isDarkMode
                        ? 'bg-gray-700/40 text-gray-200 border-gray-600/20 hover:bg-gray-600/50'
                        : 'backdrop-blur-md bg-white/60 text-gray-800 border border-gray-300/40 hover:bg-white/80'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: tech.color }} />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
