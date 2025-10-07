// pages/BreedsPage.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BreedsPage.module.css';
import { breedsData } from '../data/breedsData'; // ✅ Import the data
const BreedsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');



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
    navigate(`/breeds/${breedName.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <div className={styles.breedsContainer}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1 className={styles.title}>Discover Dog Breeds</h1>
        <p className={styles.subtitle}>Explore 120 amazing dog breeds and find your perfect companion</p>
      </div>

      {/* Search and Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search breeds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        <div className={styles.filters}>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className={styles.filterSelect}
          >
            {groups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>

          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className={styles.filterSelect}
          >
            {sizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className={styles.resultsCount}>
          {filteredBreeds.length} breeds found
        </div>
      </div>

      {/* Breeds Grid */}
      <div className={styles.breedsGrid}>
        {filteredBreeds.map((breedName) => {
          const breed = breedsData[breedName];
          return (
            <div
              key={breedName}
              className={styles.breedCard}
              onClick={() => handleBreedClick(breedName)}
            >
              <div className={styles.imageContainer}>
                <img 
                  src={breed.img_url} 
                  alt={breedName}
                  className={styles.breedImage}
                />
                <div className={styles.overlay}>
                  <span className={styles.viewDetails}>View Details →</span>
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.breedName}>{breedName}</h3>
                <div className={styles.breedInfo}>
                  <span className={styles.badge}>{breed.size}</span>
                  <span className={styles.badge}>{breed.group}</span>
                </div>
                <p className={styles.lifeSpan}>🕐 {breed.life_span}</p>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBreeds.length === 0 && (
        <div className={styles.noResults}>
          <p>No breeds found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default BreedsPage;