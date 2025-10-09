import React, { useState, useEffect } from 'react';

// NOTE: This component assumes Tailwind CSS classes are available.

/**
 * Functional component to fetch and display YouTube videos for a specific dog breed.
 * IMPORTANT: The API Key below is a placeholder and should be securely handled 
 * via environment variables in a real application.
 * * @param {{ breedName: string }} props
 */
const YouTubeVideoSection = ({ breedName }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYouTubeVideos = async () => {
      try {
        // IMPORTANT: Replace the placeholder key with your actual YouTube API Key.
        const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || 'AIzaSyBxBH-5_hJ2rAm1TuIVzlBK6xcjsch1FCk';
        
        // Replace hyphens with spaces for a better search query
        const readableBreedName = breedName.replace(/-/g, ' '); 
        const searchQuery = `${readableBreedName} dog breed`;
        
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=4&key=${API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error('YouTube API Error:', response.statusText);
            setLoading(false);
            return;
        }

        const data = await response.json();
        
        if (data.items) {
          setVideos(data.items);
        }
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchYouTubeVideos();
  }, [breedName]);

  // Loading State UI
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {[1, 2].map((i) => (
          <div key={i} className="aspect-video bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-2xl animate-pulse flex items-center justify-center">
            <div className="text-white text-lg">Loading videos...</div>
          </div>
        ))}
      </div>
    );
  }

  // No Videos Found UI
  if (videos.length === 0) {
    const readableBreedName = breedName.replace(/-/g, ' ');
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Link 1: General Breed Search */}
        <a 
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(readableBreedName + ' dog breed')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="aspect-video bg-gradient-to-br from-red-500/20 to-pink-500/20 border-2 border-red-500/30 rounded-2xl overflow-hidden hover:border-red-400 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 flex flex-col items-center justify-center group cursor-pointer"
        >
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">▶️</div>
          <h3 className="text-white font-bold text-xl mb-2">Watch Breed Videos</h3>
          <p className="text-gray-300 text-sm">Click to search YouTube</p>
        </a>

        {/* Link 2: Training Search */}
        <a 
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(readableBreedName + ' puppy training')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-500/30 rounded-2xl overflow-hidden hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 flex flex-col items-center justify-center group cursor-pointer"
        >
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🎓</div>
          <h3 className="text-white font-bold text-xl mb-2">Training Videos</h3>
          <p className="text-gray-300 text-sm">Click to search YouTube</p>
        </a>
      </div>
    );
  }

  // Display Videos UI (first 2 results)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {videos.slice(0, 2).map((video) => (
        <div
          key={video.id.videoId}
          className="aspect-video bg-white/5 border-2 border-purple-500/30 rounded-2xl overflow-hidden hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
        >
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${video.id.videoId}`}
            title={video.snippet.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ))}
    </div>
  );
};


/**
 * Main wrapper for the Video Content section.
 * @param {{ actualBreedName: string }} props
 */
const VideoContent = ({ actualBreedName }) => {
    const readableBreedName = actualBreedName.replace(/-/g, ' ');

    return (
        <div className="bg-white/5 backdrop-blur-2xl border-2 border-purple-500/20 rounded-3xl p-10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="text-4xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 p-3 rounded-2xl">🎥</span>
                    Video Content
                </h2>
                <p className="text-gray-400 mt-2">Watch videos about {readableBreedName}</p>
            </div>

            <YouTubeVideoSection breedName={actualBreedName} />


            

            {/* Additional Resources */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-2 border-purple-500/30 rounded-2xl">
                <div className="flex items-start gap-4">
                    <span className="text-3xl">💡</span>
                    <div>
                        <h4 className="text-white font-bold text-lg mb-2">Looking for More Content?</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Visit YouTube and search for "{readableBreedName}" to find comprehensive videos about breed characteristics, 
                            training tips, care guides, and real owner experiences.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoContent;