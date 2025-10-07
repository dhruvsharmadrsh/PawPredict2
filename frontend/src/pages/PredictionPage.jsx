import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';

const TABS = ['overview', 'care', 'health', 'behavior', 'living', 'appearance'];

const DogBreedPredictor = ({ isDarkMode = true }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [tab, setTab] = useState('overview');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [scrollY, setScrollY] = useState(0);

  const fileInput = useRef(null);
  const containerRef = useRef(null);
  const tabsContainerRef = useRef(null);
  const tabRefs = useRef([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });

  const API_URL = 'http://localhost:8000';
  const CONFIDENCE_THRESHOLD = 60; // Set minimum confidence threshold

  useEffect(() => {
    checkBackend();

    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateIndicator);
    setTimeout(updateIndicator, 120);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateIndicator);
    };
  }, []);

  useEffect(() => {
    setTimeout(updateIndicator, 80);
  }, [tab, result]);

  const updateIndicator = () => {
    const idx = TABS.indexOf(tab);
    const container = tabsContainerRef.current;
    const tabEl = tabRefs.current?.[idx];
    if (container && tabEl) {
      const contRect = container.getBoundingClientRect();
      const tabRect = tabEl.getBoundingClientRect();
      setIndicator({
        left: tabRect.left - contRect.left + container.scrollLeft,
        width: tabRect.width,
        visible: true,
      });
    }
  };

  const checkBackend = async () => {
    try {
      const res = await fetch(`${API_URL}/health`);
      setBackendStatus(res.ok ? 'online' : 'offline');
    } catch {
      setBackendStatus('offline');
    }
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024;
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a valid image (JPG, PNG, WebP)');
      return;
    }
    if (selectedFile.size > maxSize) {
      setError('Image must be smaller than 10MB');
      return;
    }
    setFile(selectedFile);
    setError(null);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const predict = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/predict`, { method: 'POST', body: formData });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || errData.message || 'Prediction failed');
      }
      const data = await res.json();
      setResult(data);
      setBackendStatus('online');
    } catch (err) {
      setError(err.message);
      setBackendStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setTab('overview');
    if (fileInput.current) fileInput.current.value = '';
    setTimeout(updateIndicator, 80);
  };

  const renderInfo = () => {
    if (!result?.breed_info) return null;
    const info = result.breed_info;

    if (tab === 'overview') {
      return (
        <div className="space-y-8 animate-fade-slide-up">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Size', value: info.size, icon: '📏', gradient: 'from-cyan-400 via-blue-500 to-indigo-600' },
              { label: 'Energy', value: info.energy_level, icon: '⚡', gradient: 'from-yellow-400 via-orange-500 to-red-600' },
              { label: 'Lifespan', value: info.life_span, icon: '⏰', gradient: 'from-green-400 via-emerald-500 to-teal-600' },
              { label: 'Group', value: info.group, icon: '🏷️', gradient: 'from-purple-400 via-pink-500 to-rose-600' }
            ].map((item, idx) => (
              <div key={item.label} className="glass-card-animated group" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="glass-glow" style={{ background: `linear-gradient(135deg, ${item.gradient.replace('from-', '').split(' ')[0]}, transparent)` }}></div>
                <div className="text-5xl mb-4 animate-float" style={{ animationDelay: `${idx * 200}ms` }}>{item.icon}</div>
                <div className="text-xs text-white/60 mb-2 font-bold uppercase tracking-widest">{item.label}</div>
                <div className={`text-2xl font-black bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>{item.value}</div>
              </div>
            ))}
          </div>

          <div className="glass-card-animated group" style={{ animationDelay: '400ms' }}>
            <div className="glass-glow"></div>
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-purple-400 animate-spin-slow" />
              <h3 className="text-2xl font-black text-white">Temperament</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {(info.temperament || []).map((trait, i) => (
                <span key={i} className="glass-tag-animated" style={{ animationDelay: `${i * 50}ms` }}>{trait}</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Trainability', value: info.trainability, icon: '🎓' },
              { label: 'Good with Kids', value: info.good_with_kids, icon: '👶' },
              { label: 'Good with Pets', value: info.good_with_pets, icon: '🐕' },
              { label: 'Barking', value: info.barking_tendency, icon: '🔊' },
              { label: 'Origin', value: info.origin, icon: '🌍' },
              { label: 'Bred For', value: info.bred_for, icon: '🎯' }
            ].map((item, idx) => (
              <div key={item.label} className="glass-card-small group" style={{ animationDelay: `${idx * 80}ms` }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl group-hover:scale-125 transition-transform duration-500">{item.icon}</span>
                  <div className="text-xs text-white/60 font-bold uppercase tracking-wider">{item.label}</div>
                </div>
                <div className="text-base font-bold text-white pl-1">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (tab === 'care') {
      return (
        <div className="space-y-6 animate-fade-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { title: 'Exercise', icon: '🏃', gradient: 'from-orange-500 to-red-600', data: [
                { label: 'Needs', value: info.exercise_needs },
                { label: 'Energy Level', value: info.energy_level },
                { label: 'Mental Stimulation', value: info.mental_stimulation_needs },
                { label: 'Playfulness', value: info.playfulness }
              ]},
              { title: 'Grooming', icon: '✂️', gradient: 'from-pink-500 to-rose-600', data: [
                { label: 'Grooming Needs', value: info.grooming_needs },
                { label: 'Brushing', value: info.brushing_frequency },
                { label: 'Shedding', value: info.shedding_level }
              ]},
              { title: 'Nutrition', icon: '🍖', gradient: 'from-green-500 to-emerald-600', data: [
                { label: 'Daily Food', value: info.daily_food_amount },
                { label: 'Calories', value: info.calorie_requirements },
                { label: 'Feeding Schedule', value: info.feeding_schedule },
                { label: 'Food Type', value: info.food_type_preferences },
                { label: 'Weight Management', value: info.weight_management }
              ]},
              { title: 'Training', icon: '🎓', gradient: 'from-blue-500 to-indigo-600', data: [
                { label: 'Trainability', value: info.trainability },
                { label: 'Prey Drive', value: info.prey_drive },
                { label: 'Independence', value: info.independence_level }
              ]}
            ].map((section, idx) => (
              <div key={section.title} className="glass-card-animated group" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="glass-glow"></div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl animate-bounce-subtle">{section.icon}</div>
                  <h3 className={`text-2xl font-black bg-gradient-to-r ${section.gradient} bg-clip-text text-transparent`}>{section.title}</h3>
                </div>
                <div className="space-y-3">
                  {section.data.map((item, i) => (
                    <div key={item.label} className="flex justify-between items-center py-3 px-4 rounded-xl hover:bg-white/10 transition-all duration-300 group/item">
                      <span className="text-sm text-white/70 font-semibold flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-white/40 group-hover/item:text-white/80 group-hover/item:translate-x-2 transition-all duration-300" />
                        {item.label}
                      </span>
                      <span className="text-sm font-bold text-white group-hover/item:scale-110 transition-transform duration-300">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {info.exercise_preferences && info.exercise_preferences.length > 0 && (
            <div className="glass-card-animated" style={{ animationDelay: '400ms' }}>
              <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <span className="text-3xl animate-pulse">🎯</span>
                Exercise Preferences
              </h3>
              <div className="flex flex-wrap gap-3">
                {info.exercise_preferences.map((pref, i) => (
                  <span key={i} className="glass-tag-animated" style={{ animationDelay: `${i * 50}ms` }}>{pref}</span>
                ))}
              </div>
            </div>
          )}

          {info.treats_guidelines && (
            <div className="glass-card-animated" style={{ animationDelay: '500ms' }}>
              <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <span className="text-3xl animate-bounce-subtle">🦴</span>
                Treats Guidelines
              </h3>
              <p className="text-white/90 text-base leading-relaxed">{info.treats_guidelines}</p>
            </div>
          )}
        </div>
      );
    }

    if (tab === 'health') {
      return (
        <div className="space-y-6 animate-fade-slide-up">
          <div className="glass-card-animated">
            <div className="glass-glow"></div>
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <span className="text-3xl animate-pulse">💊</span>
              Health Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Life Span', value: info.life_span, icon: '⏰' },
                { label: 'Height Range', value: info.height_range, icon: '📏' },
                { label: 'Weight Range', value: info.weight_range, icon: '⚖️' },
                { label: 'Hypoallergenic', value: info.hypoallergenic ? 'Yes' : 'No', icon: '🤧' }
              ].map((item, i) => (
                <div key={item.label} className="health-item-animated" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-sm text-white/70 font-semibold">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {info.common_health_issues && info.common_health_issues.length > 0 && (
            <div className="glass-card-gradient red" style={{ animationDelay: '200ms' }}>
              <h3 className="text-2xl font-black text-red-200 flex items-center gap-3 mb-4">
                <span className="text-3xl animate-pulse">🏥</span>
                Common Health Issues
              </h3>
              <div className="flex flex-wrap gap-3">
                {info.common_health_issues.map((issue, i) => (
                  <span key={i} className="badge-animated red" style={{ animationDelay: `${i * 50}ms` }}>{issue}</span>
                ))}
              </div>
            </div>
          )}

          {info.special_nutritional_needs && info.special_nutritional_needs.length > 0 && (
            <div className="glass-card-gradient cyan" style={{ animationDelay: '400ms' }}>
              <h3 className="text-2xl font-black text-cyan-200 flex items-center gap-3 mb-4">
                <span className="text-3xl animate-pulse">💊</span>
                Special Nutritional Needs
              </h3>
              <div className="flex flex-wrap gap-3">
                {info.special_nutritional_needs.map((need, i) => (
                  <span key={i} className="badge-animated cyan" style={{ animationDelay: `${i * 50}ms` }}>{need}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (tab === 'behavior') {
      return (
        <div className="space-y-6 animate-fade-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card-animated">
              <div className="glass-glow"></div>
              <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <span className="text-3xl animate-bounce-subtle">🐾</span>
                Social Traits
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Social Needs', value: info.social_needs, icon: '👥' },
                  { label: 'Stranger Friendliness', value: info.stranger_friendliness, icon: '👋' },
                  { label: 'Protective Instincts', value: info.protective_instincts, icon: '🛡️' },
                  { label: 'Sensitivity Level', value: info.sensitivity_level, icon: '💫' },
                  { label: 'Noise Sensitivity', value: info.noise_sensitivity, icon: '🔔' }
                ].map((item, i) => (
                  <div key={item.label} className="behavior-item-animated" style={{ animationDelay: `${i * 100}ms` }}>
                    <span className="text-sm text-white/70 font-semibold flex items-center gap-2">
                      <span className="text-xl">{item.icon}</span>
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card-animated" style={{ animationDelay: '100ms' }}>
              <div className="glass-glow"></div>
              <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <span className="text-3xl animate-bounce-subtle">🧠</span>
                Behavior Patterns
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Wanderlust', value: info.wanderlust_potential, icon: '🗺️' },
                  { label: 'Adaptability', value: info.adaptability_level, icon: '🔄' },
                  { label: 'Car Travel', value: info.car_travel_adaptability, icon: '🚗' },
                  { label: 'Independence', value: info.independence_level, icon: '🦅' },
                  { label: 'Watch Dog Ability', value: info.watch_dog_ability, icon: '👁️' },
                  { label: 'Territorial Behavior', value: info.territorial_behavior, icon: '🏠' }
                ].map((item, i) => (
                  <div key={item.label} className="behavior-item-animated" style={{ animationDelay: `${i * 100}ms` }}>
                    <span className="text-sm text-white/70 font-semibold flex items-center gap-2">
                      <span className="text-xl">{item.icon}</span>
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {info.similar_breeds && info.similar_breeds.length > 0 && (
            <div className="glass-card-gradient purple" style={{ animationDelay: '200ms' }}>
              <h3 className="text-2xl font-black text-purple-200 flex items-center gap-3 mb-4">
                <span className="text-3xl animate-spin-slow">🔄</span>
                Similar Breeds
              </h3>
              <div className="flex flex-wrap gap-3">
                {info.similar_breeds.map((breed, i) => (
                  <span key={i} className="badge-animated purple" style={{ animationDelay: `${i * 50}ms` }}>{breed}</span>
                ))}
              </div>
            </div>
          )}

          {info.common_names && info.common_names.length > 0 && (
            <div className="glass-card-gradient cyan" style={{ animationDelay: '300ms' }}>
              <h3 className="text-2xl font-black text-cyan-200 flex items-center gap-3 mb-4">
                <span className="text-3xl animate-pulse">🏷️</span>
                Common Names
              </h3>
              <div className="flex flex-wrap gap-3">
                {info.common_names.map((name, i) => (
                  <span key={i} className="badge-animated cyan" style={{ animationDelay: `${i * 50}ms` }}>{name}</span>
                ))}
              </div>
            </div>
          )}

          {info.adoption_considerations && (
            <div className="glass-card-gradient amber" style={{ animationDelay: '400ms' }}>
              <h3 className="text-2xl font-black text-amber-200 flex items-center gap-3 mb-4">
                <span className="text-3xl animate-pulse">💡</span>
                Adoption Considerations
              </h3>
              <div className="space-y-2">
                {info.adoption_considerations.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 px-4 rounded-xl hover:bg-white/10 transition-all duration-300 animate-fade-slide-right" style={{ animationDelay: `${i * 100}ms` }}>
                    <ChevronRight className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-amber-100 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (tab === 'living') {
      return (
        <div className="space-y-6 animate-fade-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card-animated">
              <div className="glass-glow"></div>
              <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <span className="text-3xl animate-bounce-subtle">🏡</span>
                Living Requirements
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Apartment Friendly', value: info.apartment_friendly ? 'Yes' : 'No', icon: '🏢' },
                  { label: 'Space Requirements', value: info.space_requirements, icon: '📐' },
                  { label: 'Novice Owner Friendly', value: info.novice_owner_friendly ? 'Yes' : 'No', icon: '👤' },
                  { label: 'Alone Time Tolerance', value: info.alone_time_tolerance, icon: '⏱️' },
                  { label: 'Cold Tolerance', value: info.cold_tolerance, icon: '❄️' },
                  { label: 'Heat Tolerance', value: info.heat_tolerance, icon: '☀️' }
                ].map((item, i) => (
                  <div key={item.label} className="behavior-item-animated" style={{ animationDelay: `${i * 100}ms` }}>
                    <span className="text-sm text-white/70 font-semibold flex items-center gap-2">
                      <span className="text-xl">{item.icon}</span>
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card-animated" style={{ animationDelay: '100ms' }}>
              <div className="glass-glow"></div>
              <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <span className="text-3xl animate-bounce-subtle">💰</span>
                Cost & Maintenance
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Cost Range', value: info.cost_range, icon: '💵' },
                  { label: 'Maturity Age', value: info.maturity_age, icon: '📅' },
                  { label: 'Gender Size Differences', value: info.gender_size_differences, icon: '⚖️' }
                ].map((item, i) => (
                  <div key={item.label} className="behavior-item-animated" style={{ animationDelay: `${i * 100}ms` }}>
                    <span className="text-sm text-white/70 font-semibold flex items-center gap-2">
                      <span className="text-xl">{item.icon}</span>
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card-animated" style={{ animationDelay: '200ms' }}>
            <div className="glass-glow"></div>
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <span className="text-3xl animate-pulse">💧</span>
              Water & Activity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="behavior-item-animated">
                <span className="text-sm text-white/70 font-semibold flex items-center gap-2">
                  <span className="text-xl">🏊</span>
                  Water Affinity
                </span>
                <span className="text-sm font-bold text-white">{info.water_affinity}</span>
              </div>
              <div className="behavior-item-animated">
                <span className="text-sm text-white/70 font-semibold flex items-center gap-2">
                  <span className="text-xl">🎾</span>
                  Playfulness
                </span>
                <span className="text-sm font-bold text-white">{info.playfulness}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (tab === 'appearance') {
      return (
        <div className="space-y-6 animate-fade-slide-up">
          <div className="glass-card-animated">
            <div className="glass-glow"></div>
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <span className="text-3xl animate-bounce-subtle">🎨</span>
              Coat & Appearance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Coat Type', value: info.coat_type, icon: '🧥' },
                { label: 'Shedding Level', value: info.shedding_level, icon: '🌪️' },
                { label: 'Drool Amount', value: info.drool_amount, icon: '💧' }
              ].map((item, i) => (
                <div key={item.label} className="behavior-item-animated" style={{ animationDelay: `${i * 100}ms` }}>
                  <span className="text-sm text-white/70 font-semibold flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </span>
                  <span className="text-sm font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {info.colors && info.colors.length > 0 && (
            <div className="glass-card-gradient purple" style={{ animationDelay: '100ms' }}>
              <h3 className="text-2xl font-black text-purple-200 flex items-center gap-3 mb-4">
                <span className="text-3xl animate-spin-slow">🌈</span>
                Available Colors
              </h3>
              <div className="flex flex-wrap gap-3">
                {info.colors.map((color, i) => (
                  <span key={i} className="badge-animated purple" style={{ animationDelay: `${i * 50}ms` }}>{color}</span>
                ))}
              </div>
            </div>
          )}

          <div className="glass-card-animated" style={{ animationDelay: '200ms' }}>
            <div className="glass-glow"></div>
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <span className="text-3xl animate-pulse">✂️</span>
              Grooming Schedule
            </h3>
            <div className="space-y-3">
              {[{ label: 'Professional Grooming', value: info.professional_grooming_frequency, icon: '💈' },
                { label: 'Brushing', value: info.brushing_frequency, icon: '🪮' },
                { label: 'Bathing', value: info.bathing_frequency, icon: '🛁' },
                { label: 'Nail Trimming', value: info.nail_trimming_frequency, icon: '💅' }
              ].map((item, i) => (
                <div key={item.label} className="behavior-item-animated" style={{ animationDelay: `${i * 100}ms` }}>
                  <span className="text-sm text-white/70 font-semibold flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </span>
                  <span className="text-sm font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  // Check if confidence is low
  const isLowConfidence = result && parseFloat(result.prediction.percentage) < CONFIDENCE_THRESHOLD;

  const bgClass = isDarkMode
    ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-black'
    : 'bg-gradient-to-br from-indigo-400 to-purple-700';

  return (
    <div ref={containerRef} className={`min-h-screen ${bgClass} py-20 px-4 transition-all duration-1000 relative overflow-hidden`}>
      <style>{`
        @keyframes fade-slide-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-slide-right { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes bounce-subtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes glow-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        
        .animate-fade-slide-up > * { animation: fade-slide-up 0.6s ease-out backwards; }
        .animate-fade-slide-right { animation: fade-slide-right 0.5s ease-out backwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        
        .glass-card-animated, .glass-card-small {
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 24px;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fade-slide-up 0.8s ease-out backwards;
          overflow: hidden;
        }
        
        .glass-card-animated:hover, .glass-card-small:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3);
        }
        
        .glass-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 70%);
          opacity: 0;
          transition: opacity 0.6s;
          pointer-events: none;
        }
        
        .glass-card-animated:hover .glass-glow { opacity: 1; animation: glow-pulse 2s ease-in-out infinite; }
        
        .glass-tag-animated {
          display: inline-block;
          padding: 12px 24px;
          background: rgba(139, 92, 246, 0.15);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 9999px;
          color: white;
          font-size: 0.875rem;
          font-weight: 700;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fade-slide-up 0.6s ease-out backwards;
        }
        
        .glass-tag-animated:hover {
          background: rgba(139, 92, 246, 0.25);
          border-color: rgba(139, 92, 246, 0.5);
          transform: scale(1.1) translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
        }
        
        .glass-card-gradient {
          position: relative;
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 24px;
          transition: all 0.5s ease;
          animation: fade-slide-up 0.8s ease-out backwards;
          overflow: hidden;
        }
        
        .glass-card-gradient.red { background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05)); border: 1px solid rgba(239, 68, 68, 0.2); box-shadow: 0 0 30px rgba(239, 68, 68, 0.15); }
        .glass-card-gradient.cyan { background: linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(14, 165, 233, 0.05)); border: 1px solid rgba(56, 189, 248, 0.2); box-shadow: 0 0 30px rgba(56, 189, 248, 0.15); }
        .glass-card-gradient.purple { background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(147, 51, 234, 0.05)); border: 1px solid rgba(168, 85, 247, 0.2); box-shadow: 0 0 30px rgba(168, 85, 247, 0.15); }
        .glass-card-gradient.amber { background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05)); border: 1px solid rgba(251, 191, 36, 0.2); box-shadow: 0 0 30px rgba(251, 191, 36, 0.15); }
        .glass-card-gradient.orange { background: linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(234, 88, 12, 0.05)); border: 1px solid rgba(249, 115, 22, 0.2); box-shadow: 0 0 30px rgba(249, 115, 22, 0.15); }
        
        .glass-card-gradient:hover { transform: scale(1.02) translateY(-4px); box-shadow: 0 0 50px rgba(139, 92, 246, 0.3); }
        
        .badge-animated {
          display: inline-block;
          padding: 10px 20px;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
          animation: fade-slide-up 0.5s ease-out backwards;
        }
        
        .badge-animated.red { background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: rgb(254, 202, 202); }
        .badge-animated.cyan { background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); color: rgb(207, 250, 254); }
        .badge-animated.purple { background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.3); color: rgb(233, 213, 255); }
        
        .badge-animated:hover { transform: scale(1.08) translateY(-2px); filter: brightness(1.2); }
        
        .health-item-animated, .behavior-item-animated {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          animation: fade-slide-right 0.5s ease-out backwards;
        }
        
        .health-item-animated:hover, .behavior-item-animated:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateX(8px);
        }
      `}</style>

      <div className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle 1000px at ${mousePos.x}% ${mousePos.y}%, rgba(139, 92, 246, 0.25), transparent 60%)`,
          transform: `translateY(${scrollY * 0.3}px)`
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-slide-up">
          <div className="inline-flex items-center gap-3 backdrop-blur-xl bg-white/10 border border-white/20 px-6 py-3 rounded-full mb-8 mt-6 hover:scale-110 transition-transform duration-500 shadow-2xl">
            {backendStatus === 'online' ? (
              <CheckCircle className="w-5 h-5 text-green-400 animate-pulse" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />
            )}
            <span className="text-white text-sm font-bold tracking-wide">
              {backendStatus === 'online' ? 'AI SYSTEM READY' : 'BACKEND OFFLINE'}
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none">
           Paw{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-float">Predict</span>
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 to-purple-600 blur-3xl opacity-30 animate-pulse" />
            </span>
          </h1>
          <p className="text-white/80 text-2xl font-medium">Because Every Dog Deserves to Be Recognized</p>
        </div>

        {!result ? (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 animate-fade-slide-up">
            <div
              className={`backdrop-blur-xl bg-white/5 border-3 ${dragging ? 'border-purple-400 bg-purple-500/20 scale-105' : 'border-white/20'} rounded-3xl p-16 text-center cursor-pointer transition-all duration-500`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => !loading && fileInput.current?.click()}
            >
              <input ref={fileInput} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files[0])} className="hidden" />

              {!preview ? (
                <div className="space-y-6">
                  <Upload className="w-24 h-24 mx-auto text-white/60 animate-float" />
                  <h3 className="text-3xl font-black text-white mb-2">{dragging ? 'Release to Upload' : 'Upload Image'}</h3>
                  <p className="text-white/70 text-xl">Drag & drop or click to select</p>
                  <div className="flex gap-4 justify-center flex-wrap pt-6">
                    {['JPG', 'PNG', 'WebP'].map((f, i) => (
                      <span key={f} className="backdrop-blur-xl bg-white/10 border border-white/20 px-6 py-3 rounded-2xl text-white text-sm font-bold hover:scale-110 transition-all duration-300" style={{ animationDelay: `${i * 100}ms` }}>{f}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="relative animate-fade-slide-up">
                  <img src={preview} alt="Preview" className="max-w-full max-h-[500px] mx-auto rounded-3xl shadow-2xl transition-transform duration-700 hover:scale-105" />
                  <button onClick={(e) => { e.stopPropagation(); reset(); }}
                    className="absolute -top-4 -right-4 p-4 bg-red-500 hover:bg-red-600 rounded-full text-white transition-all duration-300 hover:scale-110 hover:rotate-90 shadow-2xl">
                    <X className="w-7 h-7" />
                  </button>
                  <div className="mt-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 inline-block">
                    <p className="text-white font-bold text-lg">{file.name}</p>
                    <p className="text-white/70 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-8 bg-red-500/10 backdrop-blur-xl border-2 border-red-500/50 rounded-2xl p-5 text-red-200 flex items-center gap-4 animate-fade-slide-up">
                <AlertCircle className="w-7 h-7 flex-shrink-0 animate-pulse" />
                <span className="font-semibold text-lg">{error}</span>
              </div>
            )}

            {file && !loading && (
              <button onClick={predict} disabled={backendStatus === 'offline'}
                className="w-full mt-10 relative group/btn overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed animate-fade-slide-up">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-60 group-hover/btn:opacity-100 transition duration-500 animate-pulse"></div>
                <div className="relative backdrop-blur-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-black py-6 rounded-2xl text-2xl flex items-center justify-center gap-4 transition-all duration-300 group-hover/btn:scale-105">
                  <Camera className="w-7 h-7 group-hover/btn:rotate-12 transition-transform duration-300" />
                  Identify Breed
                </div>
              </button>
            )}

            {loading && (
              <div className="mt-10 text-center py-16 animate-fade-slide-up">
                <div className="relative inline-block mb-8">
                  <Loader2 className="w-20 h-20 text-purple-400 animate-spin" />
                  <div className="absolute inset-0 bg-purple-600 blur-2xl opacity-40 animate-pulse" />
                </div>
                <p className="text-white text-3xl font-black mb-3 animate-pulse">Analyzing...</p>
                <p className="text-white/70 text-lg">Processing with neural network</p>
              </div>
            )}
          </div>
        ) : isLowConfidence ? (
          // LOW CONFIDENCE SCREEN - Show this instead of breed info
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl animate-fade-slide-up overflow-hidden">
            <div className="p-12 text-center border-b border-white/10 bg-gradient-to-br from-orange-500/20 to-red-500/10">
              <img src={preview} alt="Dog" className="w-48 h-48 mx-auto rounded-3xl object-cover shadow-2xl mb-8 opacity-70 grayscale" />
              <AlertTriangle className="w-20 h-20 mx-auto text-orange-400 animate-shake mb-6" />
              <h2 className="text-5xl font-black text-orange-300 mb-4">Low Confidence Detection</h2>
              <div className="inline-flex items-center gap-4 backdrop-blur-xl bg-orange-500/30 border border-orange-400/50 rounded-full px-8 py-4 shadow-xl">
                <HelpCircle className="w-7 h-7 text-orange-300" />
                <span className="text-orange-200 font-black text-2xl">
                  {result.prediction.percentage}% Confidence
                </span>
              </div>
            </div>

            <div className="p-10 space-y-6">
              <div className="glass-card-gradient orange">
                <div className="flex items-start gap-4 mb-6">
                  <AlertTriangle className="w-8 h-8 text-orange-400 flex-shrink-0 mt-1 animate-pulse" />
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-orange-200 mb-3">Unable to Identify Breed with Confidence</h3>
                    <p className="text-orange-100 text-base leading-relaxed">
                      The AI model's confidence level is below the acceptable threshold ({CONFIDENCE_THRESHOLD}%). The prediction may not be accurate.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card-animated">
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">🤔</span>
                  Possible Reasons
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: '📸', title: 'Image Quality Issues', desc: 'Poor lighting, blurry photo, or unusual angle' },
                    { icon: '🐶', title: 'Mixed Breed Dog', desc: 'The dog may have features from multiple breeds' },
                    { icon: '🔍', title: 'Partial View', desc: 'Important identifying features may not be visible' },
                    { icon: '🎭', title: 'Rare or Unusual Breed', desc: 'The breed may not be well-represented in training data' },
                    { icon: '❌', title: 'Not a Dog', desc: 'The image may not contain a dog or contains multiple subjects' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 py-4 px-5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 animate-fade-slide-right" style={{ animationDelay: `${i * 100}ms` }}>
                      <span className="text-4xl flex-shrink-0">{item.icon}</span>
                      <div>
                        <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                        <p className="text-white/70 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card-gradient cyan">
                <h3 className="text-2xl font-black text-cyan-200 mb-6 flex items-center gap-3">
                  <span className="text-3xl">💡</span>
                  Recommendations
                </h3>
                <div className="space-y-3">
                  {[
                    'Upload a clearer, well-lit photo showing the full dog',
                    'Ensure the dog is the main subject in the image',
                    'Try a front or side profile view for better identification',
                    'Use a photo with good resolution and minimal background distractions',
                    'For mixed breeds, consult a veterinarian or DNA test for accurate identification'
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 py-2 px-4 rounded-xl hover:bg-white/10 transition-all duration-300 animate-fade-slide-right" style={{ animationDelay: `${i * 80}ms` }}>
                      <ChevronRight className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-cyan-100 font-medium">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {result.prediction.breed && (
                <div className="glass-card-animated border-2 border-yellow-500/30">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-black text-yellow-300 mb-2">Best Guess (Not Reliable)</h3>
                      <p className="text-white/80 text-base mb-3">
                        The model's best prediction was <span className="font-bold text-yellow-200">{result.prediction.breed}</span>, but this should not be trusted due to low confidence.
                      </p>
                      <p className="text-white/60 text-sm italic">
                        Please try a different photo or consult a professional for accurate breed identification.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-10 border-t border-white/10 flex gap-5 justify-center bg-white/5">
              <button onClick={reset}
                className="backdrop-blur-xl bg-gradient-to-r from-indigo-500 to-purple-500 border-2 border-white/30 px-10 py-5 text-white font-black rounded-2xl hover:scale-110 hover:shadow-2xl transition-all duration-300 text-lg flex items-center gap-3">
                <RefreshCw className="w-6 h-6" />
                Try Another Photo
              </button>
            </div>
          </div>
        ) : (
          // HIGH CONFIDENCE SCREEN - Show full breed info
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl animate-fade-slide-up">
            <div className="p-12 text-center border-b border-white/10 bg-white/5">
              <img src={preview} alt="Dog" className="w-48 h-48 mx-auto rounded-3xl object-cover shadow-2xl mb-8 transition-transform duration-700 hover:scale-110 hover:rotate-2" />
              <h2 className="text-5xl font-black text-white mb-6 animate-bounce-subtle">{result.prediction.breed}</h2>
              <div className="inline-flex items-center gap-4 backdrop-blur-xl bg-white/10 border-white/20 border rounded-full px-8 py-4 hover:scale-110 transition-all duration-300 shadow-xl">
                <CheckCircle className="w-7 h-7 text-green-400 animate-pulse" />
                <span className="text-green-300 font-black text-2xl">
                  {result.prediction.percentage}% Match
                </span>
              </div>
            </div>

            <div className="relative px-8 py-12 border-b border-white/10 overflow-hidden">
              <div className="relative flex justify-center gap-6 flex-wrap">
                {TABS.map((t, idx) => {
                  const isActive = tab === t;
                  const tabIcons = { overview: '📊', care: '💚', health: '🏥', behavior: '🐾', living: '🏡', appearance: '🎨' };
                  const colors = {
                    overview: 'from-cyan-400 via-blue-500 to-indigo-600',
                    care: 'from-emerald-400 via-green-500 to-teal-600',
                    health: 'from-rose-400 via-pink-500 to-red-600',
                    behavior: 'from-violet-400 via-purple-500 to-indigo-600',
                    living: 'from-amber-400 via-yellow-500 to-orange-600',
                    appearance: 'from-fuchsia-400 via-pink-500 to-purple-600'
                  };
                  const bgColors = {
                    overview: 'from-cyan-500/20 via-blue-500/20 to-indigo-600/20',
                    care: 'from-emerald-500/20 via-green-500/20 to-teal-600/20',
                    health: 'from-rose-500/20 via-pink-500/20 to-red-600/20',
                    behavior: 'from-violet-500/20 via-purple-500/20 to-indigo-600/20',
                    living: 'from-amber-500/20 via-yellow-500/20 to-orange-600/20',
                    appearance: 'from-fuchsia-500/20 via-pink-500/20 to-purple-600/20'
                  };
                  
                  return (
                    <button
                      key={t}
                      ref={(el) => (tabRefs.current[idx] = el)}
                      onClick={() => setTab(t)}
                      className="relative group"
                    >
                      {isActive && (
                        <>
                          <div className={`absolute -inset-2 bg-gradient-to-r ${colors[t]} rounded-2xl blur-2xl opacity-60 animate-spin-slow`} />
                          <div className={`absolute -inset-1 bg-gradient-to-r ${colors[t]} rounded-2xl blur-xl opacity-75 animate-pulse`} />
                        </>
                      )}
                      
                      <div className={`absolute -inset-1 bg-gradient-to-r ${colors[t]} rounded-2xl blur-xl transition-all duration-700 ${
                        isActive 
                          ? 'opacity-0' 
                          : 'opacity-0 group-hover:opacity-50 group-hover:scale-110'
                      }`} />
                      
                      <div className={`absolute -inset-0.5 rounded-2xl transition-opacity duration-500 ${
                        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}>
                        <div className={`absolute inset-0 bg-gradient-to-r ${colors[t]} rounded-2xl animate-border-spin`} />
                        <div className="absolute inset-0.5 bg-gray-900/95 rounded-2xl" />
                      </div>
                      
                      <div className={`relative flex items-center gap-3 px-9 py-4 rounded-2xl font-bold text-base transition-all duration-500 ${
                        isActive
                          ? `backdrop-blur-2xl bg-gradient-to-br ${bgColors[t]} text-white border-2 border-white/60 shadow-[0_0_40px_rgba(0,0,0,0.5),0_0_20px_rgba(255,255,255,0.1)] scale-110 translate-y-[-4px]`
                          : 'backdrop-blur-xl bg-white/5 text-white/60 border-2 border-white/10 hover:bg-white/10 hover:text-white/90 hover:border-white/30 hover:scale-105 hover:translate-y-[-2px] shadow-xl'
                      }`}>
                        <div className="relative">
                          {isActive && (
                            <div className={`absolute inset-0 bg-gradient-to-r ${colors[t]} blur-lg opacity-60 scale-150 animate-pulse`} />
                          )}
                          
                          <span className={`relative text-2xl transition-all duration-500 ${
                            isActive 
                              ? 'scale-125 drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-bounce-subtle' 
                              : 'group-hover:scale-115 group-hover:rotate-12 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                          }`}>
                            {tabIcons[t]}
                          </span>
                        </div>
                        
                        <div className="relative overflow-hidden">
                          <span className={`relative tracking-wide transition-all duration-500 ${
                            isActive? `bg-gradient-to-r ${colors[t]} bg-clip-text text-transparent font-black drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]` 
                              : 'font-bold group-hover:text-white'
                          }`}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                          </span>
                          
                          {isActive && (
                            <div className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r ${colors[t]} animate-pulse`} />
                          )}
                        </div>
                        
                        {isActive && (
                          <div className="absolute -top-3 -right-3 flex items-center justify-center">
                            <span className="relative flex h-5 w-5">
                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r ${colors[t]} opacity-75`} />
                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r ${colors[t]} opacity-75 animation-delay-500`} />
                              <span className={`relative inline-flex rounded-full h-5 w-5 bg-gradient-to-r ${colors[t]} shadow-[0_0_20px_rgba(255,255,255,0.8)]`}>
                                <span className="absolute inset-1 rounded-full bg-white animate-pulse" />
                              </span>
                            </span>
                          </div>
                        )}
                        
                        <div className="absolute inset-0 rounded-2xl overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] transition-transform duration-1000 ${
                            isActive 
                              ? 'group-hover:translate-x-[200%]' 
                              : 'group-hover:translate-x-[200%]'
                          }`} />
                        </div>
                        
                        {isActive && (
                          <>
                            <div className={`absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-white/50 rounded-tl-lg`} />
                            <div className={`absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-white/50 rounded-tr-lg`} />
                            <div className={`absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-white/50 rounded-bl-lg`} />
                            <div className={`absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-white/50 rounded-br-lg`} />
                          </>
                        )}
                      </div>
                      
                      {isActive && (
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                          <div className={`w-1 h-5 bg-gradient-to-b ${colors[t]} rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-white/50 animate-slide-down" />
                          </div>
                          
                          <div className="relative mt-1">
                            <div className={`w-20 h-1 bg-gradient-to-r ${colors[t]} rounded-full shadow-[0_0_15px_rgba(255,255,255,0.6)] animate-pulse`} />
                            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-fast`} />
                          </div>
                          
                          <div className={`w-2 h-2 mt-1 rounded-full bg-gradient-to-r ${colors[t]} shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse`} />
                        </div>
                      )}
                      
                      <div className={`absolute -top-16 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 ${
                        isActive ? 'scale-0' : 'group-hover:scale-100'
                      }`}>
                        <div className={`relative backdrop-blur-2xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-2 border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden`}>
                          <div className={`absolute inset-0 bg-gradient-to-r ${colors[t]} opacity-10`} />
                          
                          <div className="relative px-4 py-2">
                            <div className={`text-sm font-black bg-gradient-to-r ${colors[t]} bg-clip-text text-transparent mb-1`}>
                              {t.charAt(0).toUpperCase() + t.slice(1)}
                            </div>
                            <div className="text-xs text-white/70 font-semibold">
                              Click to view details
                            </div>
                          </div>
                          
                          <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-gray-900 to-gray-800 rotate-45 border-r-2 border-b-2 border-white/30`} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>

            <div className="p-10">{renderInfo()}</div>

            <div className="p-10 border-t border-white/10 flex gap-5 justify-center bg-white/5">
              <button onClick={reset}
                className="backdrop-blur-xl bg-white/10 border border-white/20 px-10 py-5 text-white font-black rounded-2xl hover:scale-110 hover:bg-white/20 transition-all duration-300 text-lg shadow-xl">
                Try Another Photo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DogBreedPredictor;