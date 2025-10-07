import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import styles from './App.module.css';
import PredictionPage from './pages/PredictionPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

import BackgroundMusic from './components/BackgroundMusic';
import CustomContextMenu from './components/CustomContextMenu';
import BreedsPage from './pages/BreedsDirectoryPage';
import BreedDetailPage from './pages/BreedDetailPage';

// Get Clerk Publishable Key from Create React App env
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing REACT_APP_CLERK_PUBLISHABLE_KEY in .env file");
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

// Smooth Slide Transition
const PageTransition = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('enter');

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('exit');
    }
  }, [location, displayLocation]);

  const handleAnimationEnd = () => {
    if (transitionStage === 'exit') {
      setDisplayLocation(location);
      setTransitionStage('enter');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <>
      <div
        className={`page-content ${transitionStage}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <Routes location={displayLocation}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/breeds" element={<BreedsPage />} />
          <Route path="/breeds/:breedName" element={<BreedDetailPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/predict"
            element={
              <ProtectedRoute>
                <PredictionPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      <style>{`
        .page-content {
          min-height: 100vh;
          position: relative;
        }

        .page-content.enter {
          animation: slideInFade 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .page-content.exit {
          animation: slideOutFade 0.4s cubic-bezier(0.55, 0, 1, 0.45) forwards;
        }

        @keyframes slideInFade {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutFade {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-30px);
          }
        }

        html {
          scroll-behavior: smooth;
        }

        .page-content {
          will-change: transform, opacity;
          backface-visibility: hidden;
        }

        @media (max-width: 768px) {
          .page-content.enter {
            animation-duration: 0.4s;
          }
          .page-content.exit {
            animation-duration: 0.3s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .page-content.enter,
          .page-content.exit {
            animation: simpleFade 0.2s ease !important;
          }
          @keyframes simpleFade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          html {
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </>
  );
};

// Main App Component
function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
   
        <CustomContextMenu />
        <div className={styles.app}>
          <Navbar />
          <main>
            <PageTransition />
          </main>
          <Footer />
          
          <BackgroundMusic 
            src="/background-music.mp3"
            volume={0.5}
            autoStart={false}
          />
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;