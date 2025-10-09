// pages/BreedsPage.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { breedsData } from '../data/breedsData';

const BreedsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');

  // Normalize breed name for navigation
  const normalizeBreedName = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/_+/g, '-')
      .replace(/--+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+|-+$/g, '');
  };

  // Generate placeholder image as fallback
  const getPlaceholderImage = (breedName) => {
    const colors = ['6366f1', '8b5cf6', 'a855f7', '06b6d4', '10b981'];
    const colorIndex = breedName.length % colors.length;
    const color = colors[colorIndex];
    const encodedName = encodeURIComponent(breedName.substring(0, 20));
    return `https://via.placeholder.com/400x400/${color}/ffffff?text=${encodedName}`;
  };

  const breeds = Object.keys(breedsData);
  
  const groups = ['All', 'Hound', 'Sporting', 'Working', 'Terrier', 'Toy', 'Non-Sporting', 'Herding'];
  const sizes = ['All', 'Small', 'Medium', 'Large', 'Giant'];

  const filteredBreeds = useMemo(() => {
    return breeds.filter(breed => {
      const breedData = breedsData[breed];
      const matchesSearch = breed.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGroup = selectedGroup === 'All' || breedData.group === selectedGroup;
      const matchesSize = selectedSize === 'All' || breedData.size === selectedSize;
      return matchesSearch && matchesGroup && matchesSize;
    });
  }, [searchTerm, selectedGroup, selectedSize, breeds]);

  const handleBreedClick = (breedName) => {
    const normalizedName = normalizeBreedName(breedName);
    navigate(`/breeds/${normalizedName}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-black pb-16">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-8 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight animate-fade-in-up">
            Discover Dog Breeds
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Explore {breeds.length}+ amazing dog breeds and find your perfect companion
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-8 mb-12">
        <div className="bg-white/5 backdrop-blur-2xl border-2 border-purple-500/30 rounded-3xl p-8 space-y-6">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search breeds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-14 bg-white/5 border-2 border-purple-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 text-lg"
            />
            <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-6 py-4 bg-white/5 border-2 border-purple-500/30 rounded-2xl text-white focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 cursor-pointer appearance-none text-lg"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5em',
              }}
            >
              {groups.map(group => (
                <option key={group} value={group} className="bg-gray-800">
                  {group === 'All' ? '📋 All Groups' : `🐕 ${group}`}
                </option>
              ))}
            </select>

            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="px-6 py-4 bg-white/5 border-2 border-purple-500/30 rounded-2xl text-white focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 cursor-pointer appearance-none text-lg"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5em',
              }}
            >
              {sizes.map(size => (
                <option key={size} value={size} className="bg-gray-800">
                  {size === 'All' ? '📏 All Sizes' : `📐 ${size}`}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-2 border-purple-500/30 rounded-2xl">
            <span className="text-2xl">🎯</span>
            <span className="text-white text-lg font-semibold">
              {filteredBreeds.length} breed{filteredBreeds.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>
      </div>

      {/* Breeds Grid */}
      <div className="max-w-7xl mx-auto px-8">
        {filteredBreeds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {filteredBreeds.map((breedName) => {
              const breed = breedsData[breedName];
              // Use img_url from dataset, fallback to placeholder if not available
              const imageUrl = breed.img_url || getPlaceholderImage(breedName);
              
              return (
                <div
                  key={breedName}
                  onClick={() => handleBreedClick(breedName)}
                  className="group bg-white/5 backdrop-blur-2xl border-2 border-purple-500/30 rounded-3xl overflow-hidden hover:border-purple-400 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-purple-900/20 to-indigo-900/20">
                    <img 
                      src={imageUrl}
                      alt={breedName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = getPlaceholderImage(breedName);
                      }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                    
                    {/* Overlay Text */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="px-6 py-3 bg-purple-600 text-white font-bold rounded-full text-sm border-2 border-white/30 backdrop-blur-sm">
                        View Details →
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300 line-clamp-1">
                      {breedName}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-2 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/40 text-purple-200 text-xs font-semibold rounded-full">
                        {breed.size}
                      </span>
                      <span className="px-4 py-2 bg-gradient-to-br from-indigo-600/20 to-blue-600/20 border border-indigo-500/40 text-indigo-200 text-xs font-semibold rounded-full">
                        {breed.group}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <span className="text-lg">🕐</span>
                      <span>{breed.life_span}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white/5 backdrop-blur-2xl border-2 border-purple-500/30 rounded-3xl p-12 max-w-md mx-auto">
              <span className="text-7xl block mb-6">🔍</span>
              <h3 className="text-2xl font-bold text-white mb-4">No Breeds Found</h3>
              <p className="text-gray-400 mb-6">
                No breeds match your current search criteria. Try adjusting your filters.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGroup('All');
                  setSelectedSize('All');
                }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-full hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300"
              >
                Clear Filters
              </button>
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

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        select option {
          background-color: #1f2937;
          color: white;
          padding: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default BreedsPage;