// pages/BreedDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { breedsData } from '../data/breedsData';
import { fetchBreedImage } from '../utils/breedImageHelper';

const BreedDetailPage = () => {
  const { breedName } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [breedImage, setBreedImage] = useState('');
  const [imageLoading, setImageLoading] = useState(true);
  const [mediaImages, setMediaImages] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);

  // Comprehensive breed name normalization function
  const normalizeBreedName = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // spaces to hyphens
      .replace(/_+/g, '-')            // underscores to hyphens
      .replace(/--+/g, '-')           // multiple hyphens to single
      .replace(/[^a-z0-9-]/g, '')     // remove special characters except hyphens
      .replace(/^-+|-+$/g, '');       // remove leading/trailing hyphens
  };

  // Convert URL param back to breed name with flexible matching
  const actualBreedName = Object.keys(breedsData).find(
    (name) => normalizeBreedName(name) === breedName
  );

  // Fetch breed image from Dog CEO API
  useEffect(() => {
    const loadImage = async () => {
      if (!actualBreedName) return;
      
      setImageLoading(true);
      const imageUrl = await fetchBreedImage(actualBreedName);
      setBreedImage(imageUrl);
      setImageLoading(false);
    };

    loadImage();
  }, [actualBreedName]);

  // Fetch multiple images for Media tab
  useEffect(() => {
    const loadMediaImages = async () => {
      if (!actualBreedName) return;
      
      setMediaLoading(true);
      const breedKey = normalizeBreedName(actualBreedName);
      const apiBreedName = breedKey.split('-').reverse().join('/');
      
      try {
        const response = await fetch(`https://dog.ceo/api/breed/${apiBreedName}/images/random/12`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setMediaImages(data.message);
        }
      } catch (error) {
        console.error('Error fetching media images:', error);
      } finally {
        setMediaLoading(false);
      }
    };

    if (activeTab === 'media') {
      loadMediaImages();
    }
  }, [actualBreedName, activeTab]);

  if (!actualBreedName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-black flex items-center justify-center p-8">
        <div className="text-center max-w-lg">
          <span className="text-8xl animate-bounce inline-block mb-8">🐕</span>
          <h2 className="text-5xl font-black text-white mb-4">Oops! Breed Not Found</h2>
          <p className="text-xl text-gray-300 mb-8">The breed you're looking for doesn't exist in our database.</p>
          <button
            onClick={() => navigate('/breeds')}
            className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-full border-2 border-purple-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
          >
            Explore All Breeds
          </button>
        </div>
      </div>
    );
  }

  const breed = breedsData[actualBreedName];

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Calculate compatibility score (0-100)
  const calculateScore = (value) => {
    const scores = {
      'Very High': 100,
      High: 80,
      'Moderate to High': 75,
      Moderate: 60,
      'Low to Moderate': 40,
      Low: 20,
      'Very Low': 10,
    };
    return scores[value] || 50;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-black pb-16">
      {/* Floating Action Buttons */}
      <div className="fixed top-24 right-8 z-50 flex flex-col gap-4 md:flex-col">
        <button
          onClick={() => navigate('/breeds')}
          title="Back to Breeds"
          className="w-16 h-16 rounded-full bg-gray-900/90 backdrop-blur-xl border-2 border-purple-500/50 text-white flex items-center justify-center hover:scale-110 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300"
        >
          <span className="text-3xl font-bold">←</span>
        </button>
        <button
          onClick={toggleFavorite}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`w-16 h-16 rounded-full backdrop-blur-xl border-2 flex items-center justify-center hover:scale-110 transition-all duration-300 ${
            isFavorite
              ? 'bg-gradient-to-br from-pink-500 to-rose-500 border-pink-400 animate-pulse'
              : 'bg-gray-900/90 border-pink-500/50 hover:border-pink-400 hover:shadow-2xl hover:shadow-pink-500/40'
          }`}
        >
          <span className="text-3xl">{isFavorite ? '❤️' : '🤍'}</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-[600px] overflow-hidden -mb-24">
        <div className="absolute inset-0">
          {imageLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              <p className="text-white text-xl font-semibold mt-4">Loading image...</p>
            </div>
          ) : (
            <img
              src={breedImage}
              alt={actualBreedName}
              className="w-full h-full object-cover brightness-75 scale-110 hover:scale-125 transition-transform duration-[8s] ease-out"
              onError={(e) => {
                e.target.src = 'https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg';
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-gray-900/70 to-gray-900"></div>
        </div>
        
        <div className="relative h-full flex items-end max-w-7xl mx-auto px-8 pb-16 z-10">
          <div className="animate-fade-in-up">
            <span className="inline-block px-6 py-2 bg-purple-600/30 border border-purple-500/50 rounded-full text-purple-200 text-sm font-semibold mb-4 backdrop-blur-md">
              {breed.group}
            </span>
            <h1 className="text-7xl md:text-8xl font-black text-white mb-4 drop-shadow-2xl tracking-tight">
              {actualBreedName}
            </h1>
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-2 text-purple-200 text-lg px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <span className="text-2xl">📍</span>
                {breed.origin}
              </span>
              <span className="flex items-center gap-2 text-purple-200 text-lg px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <span className="text-2xl">🎯</span>
                {breed.bred_for}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="max-w-7xl mx-auto px-8 mb-12 relative z-20 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {[
            { icon: '📏', label: 'Size', value: breed.size },
            { icon: '⚖️', label: 'Weight', value: breed.weight_range },
            { icon: '📐', label: 'Height', value: breed.height_range },
            { icon: '🕐', label: 'Life Span', value: breed.life_span },
            { icon: '⚡', label: 'Energy', value: breed.energy_level },
            { icon: '🧠', label: 'Trainability', value: breed.trainability.split('-')[0].trim() },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/5 backdrop-blur-2xl border-2 border-purple-500/30 rounded-3xl p-6 flex flex-col items-center text-center gap-4 hover:scale-105 hover:border-purple-400 hover:bg-purple-600/10 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 cursor-pointer min-h-[180px]"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600/20 to-indigo-600/20 flex items-center justify-center flex-shrink-0">
                <span className="text-4xl">{stat.icon}</span>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2">{stat.label}</p>
                <p className="text-white text-xl font-bold break-words">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-8 mb-12 sticky top-20 z-40">
        <div className="flex gap-4 bg-gray-900/90 backdrop-blur-2xl p-4 rounded-3xl border-2 border-purple-500/30 overflow-x-auto scrollbar-hide">
          {[
            { id: 'overview', icon: '📋', label: 'Overview' },
            { id: 'care', icon: '💚', label: 'Care Guide' },
            { id: 'health', icon: '🏥', label: 'Health & Nutrition' },
            { id: 'compatibility', icon: '👨‍👩‍👧', label: 'Compatibility' },
            { id: 'media', icon: '📸', label: 'Media Gallery' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-4 rounded-2xl font-semibold whitespace-nowrap flex items-center gap-2 transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border-2 border-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'border-2 border-transparent text-gray-400 hover:text-white hover:bg-purple-600/10 hover:border-purple-500/30'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-8 animate-fade-in">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Temperament Section */}
            <div className="bg-white/5 backdrop-blur-2xl border-2 border-purple-500/20 rounded-3xl p-10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-4xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 p-3 rounded-2xl">🐾</span>
                  Temperament & Personality
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {breed.temperament.map((trait, idx) => (
                  <span
                    key={idx}
                    className="px-6 py-3 rounded-full bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/40 text-purple-200 text-base font-semibold hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/30 hover:from-purple-600/30 hover:to-indigo-600/30 transition-all duration-300"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Colors Section */}
            <div className="bg-white/5 backdrop-blur-2xl border-2 border-purple-500/20 rounded-3xl p-10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-4xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 p-3 rounded-2xl">🎨</span>
                  Available Colors
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {breed.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-3 p-5 bg-white/3 border-2 border-pink-500/30 rounded-2xl hover:-translate-y-2 hover:border-pink-400 hover:shadow-xl hover:shadow-pink-500/30 transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 border-4 border-white/20"></div>
                    <span className="text-pink-100 font-semibold text-center text-sm">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Characteristics */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-2xl border-2 border-purple-500/20 rounded-3xl p-10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-4xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 p-3 rounded-2xl">⭐</span>
                  Key Characteristics
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: '🎯', label: 'Prey Drive', value: breed.prey_drive },
                  { icon: '🛡️', label: 'Protective Instinct', value: breed.protective_instincts },
                  { icon: '🎭', label: 'Playfulness', value: breed.playfulness },
                  { icon: '🚶', label: 'Independence', value: breed.independence_level },
                ].map((char, idx) => (
                  <div
                    key={idx}
                    className="bg-white/3 border-2 border-purple-500/30 rounded-3xl p-6 text-center hover:-translate-y-2 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                  >
                    <span className="text-5xl block mb-4">{char.icon}</span>
                    <h3 className="text-white text-lg font-bold mb-4">{char.label}</h3>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-1000"
                        style={{ width: `${calculateScore(char.value)}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-sm">{char.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Breeds */}
            {breed.similar_breeds && breed.similar_breeds.length > 0 && (
              <div className="lg:col-span-2 bg-white/5 backdrop-blur-2xl border-2 border-purple-500/20 rounded-3xl p-10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="text-4xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 p-3 rounded-2xl">🐕</span>
                    Similar Breeds You Might Like
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {breed.similar_breeds.map((similarBreed, idx) => {
                    const normalizedBreed = normalizeBreedName(similarBreed);

                    return (
                      <a key={idx} href={`/breeds/${normalizedBreed}`}>
                        <div className="flex items-center gap-4 p-6 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl hover:-translate-y-2 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 cursor-pointer">
                          <span className="text-4xl">🐶</span>
                          <span className="text-emerald-100 font-semibold">{similarBreed}</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CARE GUIDE TAB */}
        {activeTab === 'care' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Exercise & Activity */}
            <div className="bg-white/5 backdrop-blur-2xl border-2 border-purple-500/20 rounded-3xl p-10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-4xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 p-3 rounded-2xl">🏃‍♂️</span>
                  Exercise & Activity
                </h2>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-4 bg-white/3 rounded-2xl border-l-4 border-purple-500">
                  <span className="text-gray-400 font-semibold">Exercise Needs:</span>
                  <span className="text-white font-bold text-right">{breed.exercise_needs}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/3 rounded-2xl border-l-4 border-purple-500">
                  <span className="text-gray-400 font-semibold">Energy Level:</span>
                  <span className="text-white font-bold text-right">{breed.energy_level}</span>
                </div>
              </div>
              <div>
                <h4 className="text-white text-lg font-semibold mb-4">Recommended Activities:</h4>
                {breed.exercise_preferences.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-white/3 rounded-xl mb-3 hover:bg-white/8 hover:translate-x-2 transition-all duration-300"
                  >
                    <span className="text-emerald-400 text-xl font-bold">✓</span>
                    <span className="text-purple-100">{activity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grooming Needs */}
            <div className="bg-white/5 backdrop-blur-2xl border-2 border-purple-500/20 rounded-3xl p-10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-4xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 p-3 rounded-2xl">✂️</span>
                  Grooming Requirements
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6 mb-6">
                {[
                  { icon: '🪮', label: 'Brushing', value: breed.brushing_frequency },
                  { icon: '🛁', label: 'Bathing', value: breed.bathing_frequency },
                  { icon: '💅', label: 'Nail Trimming', value: breed.nail_trimming_frequency },
                  { icon: '✂️', label: 'Professional Grooming', value: breed.professional_grooming_frequency },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-6 bg-white/3 border-2 border-violet-500/30 rounded-2xl hover:-translate-y-1 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300"
                  >
                    <span className="text-4xl">{item.icon}</span>
                    <div>
                      <p className="text-gray-400 text-xs uppercase font-semibold mb-1">{item.label}</p>
                      <p className="text-white font-bold">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-violet-500/10 border-2 border-violet-500/30 rounded-2xl space-y-3">
                <p className="text-purple-200">
                  <strong>Coat Type:</strong> {breed.coat_type}
                </p>
                <p className="text-purple-200">
                  <strong>Shedding Level:</strong> {breed.shedding_level}
                </p>
                <p className="text-purple-200">
                  <strong>Hypoallergenic:</strong> {breed.hypoallergenic ? 'Yes' : 'No'}
                </p>
              </div>
            </div>

            {/* Living Conditions */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-2xl border-2 border-purple-500/20 rounded-3xl p-10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-4xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 p-3 rounded-2xl">🏠</span>
                  Living Conditions & Environment
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: '🏢', label: 'Apartment Living', value: breed.apartment_friendly ? '✓ Suitable' : '✗ Not Suitable', extra: breed.space_requirements },
                  { icon: '❄️', label: 'Cold Tolerance', value: breed.cold_tolerance },
                  { icon: '🌡️', label: 'Heat Tolerance', value: breed.heat_tolerance },
                  { icon: '🔇', label: 'Noise Sensitivity', value: breed.noise_sensitivity },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-8 bg-white/3 border-2 border-purple-500/30 rounded-3xl text-center hover:-translate-y-2 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                  >
                    <span className="text-5xl block mb-4">{item.icon}</span>
                    <h4 className="text-white text-lg font-bold mb-4">{item.label}</h4>
                    <p className="text-purple-400 font-bold mb-2">{item.value}</p>
                    {item.extra && <small className="text-gray-400 text-sm">{item.extra}</small>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HEALTH & NUTRITION TAB */}
        {activeTab === 'health' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Nutrition */}
            <div className="bg-white/5 backdrop-blur-2xl border-2 border-purple-500/20 rounded-3xl p-10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-4xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 p-3 rounded-2xl">🍖</span>
                  Nutrition Plan
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6 mb-6">
                {[
                  { icon: '🥣', label: 'Daily Food Amount', value: breed.daily_food_amount },
                  { icon: '🔥', label: 'Calorie Requirements', value: breed.calorie_requirements },
                  { icon: '⏰', label: 'Feeding Schedule', value: breed.feeding_schedule },
                  { icon: '🍽️', label: 'Food Type', value: breed.food_type_preferences },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-6 bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl hover:-translate-y-1 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300"
                  >
                    <span className="text-4xl">{item.icon}</span>
                    <div>
                      <p className="text-gray-400 text-xs uppercase font-semibold mb-1">{item.label}</p>
                      <p className="text-white font-bold">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {breed.special_nutritional_needs && breed.special_nutritional_needs.length > 0 && (
                <div className="p-6 bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl">
                  <h4 className="text-white text-lg font-bold mb-4">Special Nutritional Needs:</h4>
                  <ul className="space-y-2">
                    {breed.special_nutritional_needs.map((need, idx) => (
                      <li key={idx} className="text-amber-100 pl-6 relative before:content-['✓'] before:absolute before:left-0 before:text-amber-500 before:font-bold">
                        {need}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/*{/* Common Health Issues */}
            <div className="bg-white/5 backdrop-blur-2xl border-2 border-purple-500/20 rounded-3xl p-10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-4xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 p-3 rounded-2xl">🏥</span>
                  Common Health Issues
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 mb-6">
                {breed.common_health_issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-5 bg-red-500/10 border-2 border-red-500/30 rounded-2xl hover:translate-x-2 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300"
                  >
                    <span className="text-2xl">⚠️</span>
                    <span className="text-red-200 font-semibold">{issue}</span>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-blue-500/10 border-2 border-blue-500/30 border-l-4 rounded-2xl">
                <p className="text-blue-100 leading-relaxed">
                  <strong>💡 Note:</strong> Regular veterinary check-ups and preventive care can help manage these conditions. Consult with your veterinarian for a personalized health plan.
                </p>
              </div>
            </div>

            {/* Cost Information */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-2xl border-2 border-purple-500/20 rounded-3xl p-10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-4xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 p-3 rounded-2xl">💰</span>
                  Cost of Ownership
                </h2>
              </div>
              <div className="flex items-center gap-8 p-10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 rounded-3xl hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-300">
                <div className="text-7xl">💵</div>
                <div className="flex-1">
                  <p className="text-white text-2xl font-bold mb-3">{breed.cost_range}</p>
                  <small className="text-gray-400 leading-relaxed">
                    Costs include initial purchase price and estimated monthly expenses for food, grooming, healthcare, and supplies.
                  </small>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMPATIBILITY TAB */}
        {activeTab === 'compatibility' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Family Compatibility */}
            <div className="bg-white/5 backdrop-blur-2xl border-2 border-purple-500/20 rounded-3xl p-10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-4xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 p-3 rounded-2xl">👨‍👩‍👧‍👦</span>
                  Family Compatibility
                </h2>
              </div>
              <div className="space-y-6">
                {[
                  { icon: '👶', label: 'Good with Kids', value: breed.good_with_kids },
                  { icon: '🐈', label: 'Good with Pets', value: breed.good_with_pets },
                  { icon: '🚪', label: 'Stranger Friendliness', value: breed.stranger_friendliness },
                  { icon: '⏱️', label: 'Alone Time Tolerance', value: breed.alone_time_tolerance },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-6 p-6 bg-white/3 border-2 border-purple-500/30 rounded-2xl hover:translate-x-2 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                  >
                    <span className="text-5xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm font-semibold mb-1">{item.label}</p>
                      <p className="text-white text-lg font-bold">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner Suitability */}
            <div className="bg-white/5 backdrop-blur-2xl border-2 border-purple-500/20 rounded-3xl p-10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-4xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 p-3 rounded-2xl">👤</span>
                  Owner Suitability
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div
                  className={`p-8 border-2 rounded-3xl text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300 ${
                    breed.novice_owner_friendly
                      ? 'border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-400 hover:shadow-emerald-500/30'
                      : 'border-red-500/30 bg-red-500/10 hover:border-red-400 hover:shadow-red-500/30'
                  }`}
                >
                  <span className="text-5xl block mb-4">
                    {breed.novice_owner_friendly ? '✓' : '✗'}
                  </span>
                  <p className="text-white font-bold text-lg">First-Time Owners</p>
                </div>
                <div className="p-8 bg-white/3 border-2 border-purple-500/30 rounded-3xl text-center hover:-translate-y-2 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300">
                  <span className="text-5xl block mb-4">📚</span>
                  <p className="text-white font-bold text-lg">
                    Experience Level: {breed.novice_owner_friendly ? 'Beginner' : 'Experienced'}
                  </p>
                </div>
              </div>
              <div className="p-6 bg-white/3 border-2 border-purple-500/30 rounded-2xl space-y-4">
                <p className="text-purple-200">
                  <strong>Adaptability Level:</strong> {breed.adaptability_level}
                </p>
                <p className="text-purple-200">
                  <strong>Mental Stimulation Needs:</strong> {breed.mental_stimulation_needs}
                </p>
                <p className="text-purple-200">
                  <strong>Social Needs:</strong> {breed.social_needs}
                </p>
              </div>
            </div>

            {/* Adoption Considerations */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-2xl border-2 border-purple-500/20 rounded-3xl p-10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-4xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 p-3 rounded-2xl">⚠️</span>
                  Important Adoption Considerations
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {breed.adoption_considerations.map((consideration, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-6 bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl hover:translate-x-2 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300"
                  >
                    <span className="text-amber-400 text-2xl font-bold flex-shrink-0">•</span>
                    <p className="text-amber-100 leading-relaxed">{consideration}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MEDIA GALLERY TAB */}
        {activeTab === 'media' && (
          <div className="space-y-8">
            {/* Image Gallery Section */}
            <div className="bg-white/5 backdrop-blur-2xl border-2 border-purple-500/20 rounded-3xl p-10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-4xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 p-3 rounded-2xl">📸</span>
                  Photo Gallery
                </h2>
                <p className="text-gray-400 mt-2">Explore beautiful images of {actualBreedName}</p>
              </div>

              {mediaLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(12)].map((_, idx) => (
                    <div
                      key={idx}
                      className="aspect-square bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-2xl animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : mediaImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mediaImages.map((image, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-purple-500/30 hover:border-purple-400 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 cursor-pointer"
                    >
                      <img
                        src={image}
                        alt={`${actualBreedName} ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white font-semibold text-sm">
                            {actualBreedName} #{idx + 1}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <span className="text-6xl block mb-4">📷</span>
                  <p className="text-gray-400 text-lg">No images available at the moment</p>
                </div>
              )}
            </div>

            {/* Video Section */}
            <div className="bg-white/5 backdrop-blur-2xl border-2 border-purple-500/20 rounded-3xl p-10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-4xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 p-3 rounded-2xl">🎥</span>
                  Video Content
                </h2>
                <p className="text-gray-400 mt-2">Watch videos about {actualBreedName}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* YouTube Video Embed Placeholders */}
                <div className="aspect-video bg-white/5 border-2 border-purple-500/30 rounded-2xl overflow-hidden hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/search?q=${encodeURIComponent(actualBreedName + ' dog breed')}`}
                    title={`${actualBreedName} Video 1`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="aspect-video bg-white/5 border-2 border-purple-500/30 rounded-2xl overflow-hidden hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/search?q=${encodeURIComponent(actualBreedName + ' puppy')}`}
                    title={`${actualBreedName} Video 2`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Info Cards */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-2xl hover:-translate-y-2 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300">
                    <span className="text-4xl block mb-3">🎬</span>
                    <h3 className="text-white font-bold text-lg mb-2">Training Videos</h3>
                    <p className="text-blue-200 text-sm">Learn how to train your {actualBreedName}</p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-2xl hover:-translate-y-2 hover:border-green-400 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300">
                    <span className="text-4xl block mb-3">🏃</span>
                    <h3 className="text-white font-bold text-lg mb-2">Activity Guides</h3>
                    <p className="text-green-200 text-sm">Exercise routines and play ideas</p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-2 border-pink-500/30 rounded-2xl hover:-translate-y-2 hover:border-pink-400 hover:shadow-xl hover:shadow-pink-500/30 transition-all duration-300">
                    <span className="text-4xl block mb-3">💝</span>
                    <h3 className="text-white font-bold text-lg mb-2">Care Tips</h3>
                    <p className="text-pink-200 text-sm">Grooming and health care guidance</p>
                  </div>
                </div>
              </div>

              {/* Additional Resources */}
              <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-2 border-purple-500/30 rounded-2xl">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">💡</span>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-2">Looking for More Content?</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Visit YouTube and search for "{actualBreedName}" to find comprehensive videos about breed characteristics, 
                      training tips, care guides, and real owner experiences.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fun Facts Section */}
            <div className="bg-white/5 backdrop-blur-2xl border-2 border-purple-500/20 rounded-3xl p-10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-4xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 p-3 rounded-2xl">✨</span>
                  Did You Know?
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-2 border-yellow-500/30 rounded-2xl hover:-translate-y-2 hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-300">
                  <span className="text-4xl block mb-4">🌟</span>
                  <h3 className="text-white font-bold text-lg mb-2">Origin Story</h3>
                  <p className="text-yellow-100 text-sm">
                    The {actualBreedName} originated from {breed.origin} and was bred for {breed.bred_for.toLowerCase()}.
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/30 rounded-2xl hover:-translate-y-2 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300">
                  <span className="text-4xl block mb-4">🎯</span>
                  <h3 className="text-white font-bold text-lg mb-2">Special Traits</h3>
                  <p className="text-cyan-100 text-sm">
                    Known for being {breed.temperament.slice(0, 3).join(', ').toLowerCase()}, making them {breed.novice_owner_friendly ? 'great for first-time owners' : 'best for experienced handlers'}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default BreedDetailPage;