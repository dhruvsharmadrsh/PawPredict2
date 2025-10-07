import React from 'react'
import ParticlesBg from './ParticlesBg'

const HeroSection = ({ isDarkMode }) => {
  return (
    <section className="relative overflow-hidden">
      <ParticlesBg isDarkMode={isDarkMode} />

      <div className={`py-20 px-8 text-center relative z-10 ${
        isDarkMode ? '' : 'bg-gradient-to-br from-indigo-400 to-purple-700'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div
            className={`animate-down inline-block backdrop-blur-lg py-3 px-8 rounded-full border-2 mb-8 ${
              isDarkMode 
                ? 'bg-gray-800 bg-opacity-60 border-gray-600 border-opacity-40' 
                : 'bg-white bg-opacity-20 border-white border-opacity-40'
            }`}
          >
            <span className={`font-bold text-sm tracking-widest ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              AI-POWERED INNOVATION
            </span>
          </div>

          <h1
            className={`text-5xl sm:text-6xl md:text-7xl font-black mb-6 ${
              isDarkMode ? 'text-gray-100 drop-shadow-2xl' : 'text-white drop-shadow-2xl'
            }`}
          >
            About{' '}
            <span
              className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent"
              style={{
                backgroundSize: '200% 200%',
                animation: 'gradientMove 3s ease infinite',
              }}
            >
              PawPredict
            </span>
          </h1>

          <p
            className={`text-xl sm:text-2xl max-w-3xl mx-auto mb-14 leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-white'
            }`}
          >
            Powered by cutting-edge artificial intelligence to help you
            understand your furry friend better. Experience instant breed
            identification with unmatched accuracy.
          </p>

          <div className="hero-stats grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: '86%', label: 'Accuracy Rate', icon: '🎯' },
              { number: '120+', label: 'Dog Breeds', icon: '🐕' },
              { number: '<3s', label: 'Processing Time', icon: '⚡' },
              { number: '20K+', label: 'Photos Trained', icon: '📊' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`backdrop-blur-2xl py-8 px-6 rounded-3xl border-2 cursor-pointer hover:scale-105 transition-transform ${
                  isDarkMode 
                    ? 'bg-gray-800 bg-opacity-50 border-gray-600 border-opacity-40' 
                    : 'bg-gradient-to-br from-white/10 to-cyan-400/10 border border-cyan-300/30'
                }`}
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className={`text-3xl sm:text-4xl font-black mb-2 ${
                  isDarkMode ? 'text-gray-100' : 'text-white'
                }`}>
                  {stat.number}
                </div>
                <div className={`text-sm sm:text-base font-semibold tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-white'
                }`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
