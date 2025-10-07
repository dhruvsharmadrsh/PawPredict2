// pages/BreedDetailPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BreedDetailPage.module.css';
import { breedsData } from '../data/breedsData';

const BreedDetailPage = () => {
  const { breedName } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);

  // Convert URL param back to breed name
  const actualBreedName = Object.keys(breedsData).find(
    name => name.toLowerCase().replace(/\s+/g, '-') === breedName
  );

  if (!actualBreedName) {
    return (
      <div className={styles.notFound}>
        <div className={styles.notFoundContent}>
          <span className={styles.notFoundIcon}>🐕</span>
          <h2>Oops! Breed Not Found</h2>
          <p>The breed you're looking for doesn't exist in our database.</p>
          <button onClick={() => navigate('/breeds')} className={styles.notFoundButton}>
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
      'Very High': 100, 'High': 80, 'Moderate to High': 75,
      'Moderate': 60, 'Low to Moderate': 40, 'Low': 20, 'Very Low': 10
    };
    return scores[value] || 50;
  };

  return (
    <div className={styles.detailContainer}>
      {/* Floating Action Buttons */}
      <div className={styles.floatingActions}>
        <button 
          className={styles.backButton} 
          onClick={() => navigate('/breeds')}
          title="Back to Breeds"
        >
          <span className={styles.backIcon}>←</span>
        </button>
        <button 
          className={`${styles.favoriteButton} ${isFavorite ? styles.favorited : ''}`}
          onClick={toggleFavorite}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <span className={styles.heartIcon}>{isFavorite ? '❤️' : '🤍'}</span>
        </button>
      </div>

      {/* Hero Section with Parallax Effect */}
      <div className={styles.hero}>
        <div className={styles.heroBackground}>
          <img src={breed.img_url} alt={actualBreedName} />
          <div className={styles.heroGradient}></div>
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <span className={styles.breedGroup}>{breed.group}</span>
            <h1 className={styles.breedTitle}>{actualBreedName}</h1>
            <div className={styles.heroMeta}>
              <span className={styles.metaItem}>
                <span className={styles.metaIcon}>📍</span>
                {breed.origin}
              </span>
              <span className={styles.metaItem}>
                <span className={styles.metaIcon}>🎯</span>
                {breed.bred_for}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <span className={styles.statIcon}>📏</span>
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Size</p>
              <p className={styles.statValue}>{breed.size}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <span className={styles.statIcon}>⚖️</span>
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Weight</p>
              <p className={styles.statValue}>{breed.weight_range}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <span className={styles.statIcon}>📐</span>
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Height</p>
              <p className={styles.statValue}>{breed.height_range}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <span className={styles.statIcon}>🕐</span>
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Life Span</p>
              <p className={styles.statValue}>{breed.life_span}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <span className={styles.statIcon}>⚡</span>
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Energy</p>
              <p className={styles.statValue}>{breed.energy_level}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <span className={styles.statIcon}>🧠</span>
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Trainability</p>
              <p className={styles.statValue}>{breed.trainability.split('-')[0].trim()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'overview' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className={styles.tabIcon}>📋</span>
            Overview
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'care' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('care')}
          >
            <span className={styles.tabIcon}>💚</span>
            Care Guide
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'health' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('health')}
          >
            <span className={styles.tabIcon}>🏥</span>
            Health & Nutrition
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'compatibility' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('compatibility')}
          >
            <span className={styles.tabIcon}>👨‍👩‍👧</span>
            Compatibility
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className={styles.contentGrid}>
            {/* Temperament Section */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.titleIcon}>🐾</span>
                  Temperament & Personality
                </h2>
              </div>
              <div className={styles.tagContainer}>
                {breed.temperament.map((trait, index) => (
                  <span key={index} className={styles.tag}>
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Colors Section */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.titleIcon}>🎨</span>
                  Available Colors
                </h2>
              </div>
              <div className={styles.colorGrid}>
                {breed.colors.map((color, index) => (
                  <div key={index} className={styles.colorCard}>
                    <div className={styles.colorSwatch}></div>
                    <span className={styles.colorName}>{color}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Characteristics */}
            <div className={styles.section + ' ' + styles.fullWidth}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.titleIcon}>⭐</span>
                  Key Characteristics
                </h2>
              </div>
              <div className={styles.characteristicsGrid}>
                <div className={styles.characteristicCard}>
                  <span className={styles.charIcon}>🎯</span>
                  <h3>Prey Drive</h3>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{width: `${calculateScore(breed.prey_drive)}%`}}
                    ></div>
                  </div>
                  <p>{breed.prey_drive}</p>
                </div>
                <div className={styles.characteristicCard}>
                  <span className={styles.charIcon}>🛡️</span>
                  <h3>Protective Instinct</h3>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{width: `${calculateScore(breed.protective_instincts)}%`}}
                    ></div>
                  </div>
                  <p>{breed.protective_instincts}</p>
                </div>
                <div className={styles.characteristicCard}>
                  <span className={styles.charIcon}>🎭</span>
                  <h3>Playfulness</h3>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{width: `${calculateScore(breed.playfulness)}%`}}
                    ></div>
                  </div>
                  <p>{breed.playfulness}</p>
                </div>
                <div className={styles.characteristicCard}>
                  <span className={styles.charIcon}>🚶</span>
                  <h3>Independence</h3>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{width: `${calculateScore(breed.independence_level)}%`}}
                    ></div>
                  </div>
                  <p>{breed.independence_level}</p>
                </div>
              </div>
            </div>

            {/* Similar Breeds */}
            {breed.similar_breeds && breed.similar_breeds.length > 0 && (
              <div className={styles.section + ' ' + styles.fullWidth}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <span className={styles.titleIcon}>🐕</span>
                    Similar Breeds You Might Like
                  </h2>
                </div>
                <div className={styles.similarBreedsGrid}>
                  {breed.similar_breeds.map((similarBreed, index) => (
                    <div key={index} className={styles.similarBreedCard}>
                      <span className={styles.similarBreedIcon}>🐶</span>
                      <span className={styles.similarBreedName}>{similarBreed}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CARE GUIDE TAB */}
        {activeTab === 'care' && (
          <div className={styles.contentGrid}>
            {/* Exercise & Activity */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.titleIcon}>🏃‍♂️</span>
                  Exercise & Activity
                </h2>
              </div>
              <div className={styles.careInfo}>
                <div className={styles.careItem}>
                  <span className={styles.careLabel}>Exercise Needs:</span>
                  <span className={styles.careValue}>{breed.exercise_needs}</span>
                </div>
                <div className={styles.careItem}>
                  <span className={styles.careLabel}>Energy Level:</span>
                  <span className={styles.careValue}>{breed.energy_level}</span>
                </div>
              </div>
              <div className={styles.activityList}>
                <h4 className={styles.listTitle}>Recommended Activities:</h4>
                {breed.exercise_preferences.map((activity, index) => (
                  <div key={index} className={styles.activityItem}>
                    <span className={styles.activityIcon}>✓</span>
                    <span>{activity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grooming Needs */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.titleIcon}>✂️</span>
                  Grooming Requirements
                </h2>
              </div>
              <div className={styles.groomingGrid}>
                <div className={styles.groomingItem}>
                  <span className={styles.groomIcon}>🪮</span>
                  <div>
                    <p className={styles.groomLabel}>Brushing</p>
                    <p className={styles.groomValue}>{breed.brushing_frequency}</p>
                  </div>
                </div>
                <div className={styles.groomingItem}>
                  <span className={styles.groomIcon}>🛁</span>
                  <div>
                    <p className={styles.groomLabel}>Bathing</p>
                    <p className={styles.groomValue}>{breed.bathing_frequency}</p>
                  </div>
                </div>
                <div className={styles.groomingItem}>
                  <span className={styles.groomIcon}>💅</span>
                  <div>
                    <p className={styles.groomLabel}>Nail Trimming</p>
                    <p className={styles.groomValue}>{breed.nail_trimming_frequency}</p>
                  </div>
                </div>
                <div className={styles.groomingItem}>
                  <span className={styles.groomIcon}>✂️</span>
                  <div>
                    <p className={styles.groomLabel}>Professional Grooming</p>
                    <p className={styles.groomValue}>{breed.professional_grooming_frequency}</p>
                  </div>
                </div>
              </div>
              <div className={styles.coatInfo}>
                <p><strong>Coat Type:</strong> {breed.coat_type}</p>
                <p><strong>Shedding Level:</strong> {breed.shedding_level}</p>
                <p><strong>Hypoallergenic:</strong> {breed.hypoallergenic ? 'Yes' : 'No'}</p>
              </div>
            </div>

            {/* Living Conditions */}
            <div className={styles.section + ' ' + styles.fullWidth}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.titleIcon}>🏠</span>
                  Living Conditions & Environment
                </h2>
              </div>
              <div className={styles.livingGrid}>
                <div className={styles.livingCard}>
                  <span className={styles.livingIcon}>🏢</span>
                  <h4>Apartment Living</h4>
                  <p className={styles.livingStatus}>
                    {breed.apartment_friendly ? '✓ Suitable' : '✗ Not Suitable'}
                  </p>
                  <small>{breed.space_requirements}</small>
                </div>
                <div className={styles.livingCard}>
                  <span className={styles.livingIcon}>❄️</span>
                  <h4>Cold Tolerance</h4>
                  <p className={styles.livingStatus}>{breed.cold_tolerance}</p>
                </div>
                <div className={styles.livingCard}>
                  <span className={styles.livingIcon}>🌡️</span>
                  <h4>Heat Tolerance</h4>
                  <p className={styles.livingStatus}>{breed.heat_tolerance}</p>
                </div>
                <div className={styles.livingCard}>
                  <span className={styles.livingIcon}>🔇</span>
                  <h4>Noise Sensitivity</h4>
                  <p className={styles.livingStatus}>{breed.noise_sensitivity}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HEALTH & NUTRITION TAB */}
        {activeTab === 'health' && (
          <div className={styles.contentGrid}>
            {/* Nutrition */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.titleIcon}>🍖</span>
                  Nutrition Plan
                </h2>
              </div>
              <div className={styles.nutritionCard}>
                <div className={styles.nutritionItem}>
                  <span className={styles.nutIcon}>🥣</span>
                  <div>
                    <p className={styles.nutLabel}>Daily Food Amount</p>
                    <p className={styles.nutValue}>{breed.daily_food_amount}</p>
                  </div>
                </div>
                <div className={styles.nutritionItem}>
                  <span className={styles.nutIcon}>🔥</span>
                  <div>
                    <p className={styles.nutLabel}>Calorie Requirements</p>
                    <p className={styles.nutValue}>{breed.calorie_requirements}</p>
                  </div>
                </div>
                <div className={styles.nutritionItem}>
                  <span className={styles.nutIcon}>⏰</span>
                  <div>
                    <p className={styles.nutLabel}>Feeding Schedule</p>
                    <p className={styles.nutValue}>{breed.feeding_schedule}</p>
                  </div>
                </div>
                <div className={styles.nutritionItem}>
                  <span className={styles.nutIcon}>🍽️</span>
                  <div>
                    <p className={styles.nutLabel}>Food Type</p>
                    <p className={styles.nutValue}>{breed.food_type_preferences}</p>
                  </div>
                </div>
              </div>
              {breed.special_nutritional_needs && breed.special_nutritional_needs.length > 0 && (
                <div className={styles.specialNeeds}>
                  <h4>Special Nutritional Needs:</h4>
                  <ul>
                    {breed.special_nutritional_needs.map((need, index) => (
                      <li key={index}>{need}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Common Health Issues */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.titleIcon}>🏥</span>
                  Common Health Issues
                </h2>
              </div>
              <div className={styles.healthIssues}>
                {breed.common_health_issues.map((issue, index) => (
                  <div key={index} className={styles.healthIssueCard}>
                    <span className={styles.issueIcon}>⚠️</span>
                    <span className={styles.issueName}>{issue}</span>
                  </div>
                ))}
              </div>
              <div className={styles.healthNote}>
                <p>
                  <strong>💡 Note:</strong> Regular veterinary check-ups and preventive care 
                  can help manage these conditions. Consult with your veterinarian for a 
                  personalized health plan.
                </p>
              </div>
            </div>

            {/* Cost Information */}
            <div className={styles.section + ' ' + styles.fullWidth}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.titleIcon}>💰</span>
                  Cost of Ownership
                </h2>
              </div>
              <div className={styles.costCard}>
                <div className={styles.costIcon}>💵</div>
                <div className={styles.costDetails}>
                  <p className={styles.costText}>{breed.cost_range}</p>
                  <small className={styles.costNote}>
                    Costs include initial purchase price and estimated monthly expenses for 
                    food, grooming, healthcare, and supplies.
                  </small>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMPATIBILITY TAB */}
        {activeTab === 'compatibility' && (
          <div className={styles.contentGrid}>
            {/* Family Compatibility */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.titleIcon}>👨‍👩‍👧‍👦</span>
                  Family Compatibility
                </h2>
              </div>
              <div className={styles.compatibilityList}>
                <div className={styles.compatItem}>
                  <span className={styles.compatIcon}>👶</span>
                  <div className={styles.compatContent}>
                    <p className={styles.compatLabel}>Good with Kids</p>
                    <p className={styles.compatValue}>{breed.good_with_kids}</p>
                  </div>
                </div>
                <div className={styles.compatItem}>
                  <span className={styles.compatIcon}>🐈</span>
                  <div className={styles.compatContent}>
                    <p className={styles.compatLabel}>Good with Pets</p>
                    <p className={styles.compatValue}>{breed.good_with_pets}</p>
                  </div>
                </div>
                <div className={styles.compatItem}>
                  <span className={styles.compatIcon}>🚪</span>
                  <div className={styles.compatContent}>
                    <p className={styles.compatLabel}>Stranger Friendliness</p>
                    <p className={styles.compatValue}>{breed.stranger_friendliness}</p>
                  </div>
                </div>
                <div className={styles.compatItem}>
                  <span className={styles.compatIcon}>⏱️</span>
                  <div className={styles.compatContent}>
                    <p className={styles.compatLabel}>Alone Time Tolerance</p>
                    <p className={styles.compatValue}>{breed.alone_time_tolerance}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Suitability */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.titleIcon}>👤</span>
                  Owner Suitability
                </h2>
              </div>
              <div className={styles.suitabilityCards}>
                <div className={`${styles.suitabilityCard} ${breed.novice_owner_friendly ? styles.suitable : styles.notSuitable}`}>
                  <span className={styles.suitIcon}>
                    {breed.novice_owner_friendly ? '✓' : '✗'}
                  </span>
                  <p>First-Time Owners</p>
                </div>
                <div className={styles.suitabilityCard}>
                  <span className={styles.suitIcon}>📚</span>
                  <p>Experience Level: {breed.novice_owner_friendly ? 'Beginner' : 'Experienced'}</p>
                </div>
              </div>
              <div className={styles.adaptabilityInfo}>
                <p><strong>Adaptability Level:</strong> {breed.adaptability_level}</p>
                <p><strong>Mental Stimulation Needs:</strong> {breed.mental_stimulation_needs}</p>
                <p><strong>Social Needs:</strong> {breed.social_needs}</p>
              </div>
            </div>

            {/* Adoption Considerations */}
            <div className={styles.section + ' ' + styles.fullWidth}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.titleIcon}>⚠️</span>
                  Important Adoption Considerations
                </h2>
              </div>
              <div className={styles.considerationsGrid}>
                {breed.adoption_considerations.map((consideration, index) => (
                  <div key={index} className={styles.considerationCard}>
                    <span className={styles.considerationIcon}>•</span>
                    <p>{consideration}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreedDetailPage;