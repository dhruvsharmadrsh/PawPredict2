import { useState, useEffect, useCallback } from 'react';

const useBreedImage = (breedName) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [source, setSource] = useState('');

  // Breed index mapping for your ML API
  const breedIndexMap = {
    "Afghan_hound": 0,
    "African_hunting_dog": 1,
    "Airedale": 2,
    "American_Staffordshire_terrier": 3,
    "Appenzeller": 4,
    "Australian_terrier": 5,
    "Bedlington_terrier": 6,
    "Bernese_mountain_dog": 7,
    "Blenheim_spaniel": 8,
    "Border_collie": 9,
    "Border_terrier": 10,
    "Boston_bull": 11,
    "Bouvier_des_Flandres": 12,
    "Brabancon_griffon": 13,
    "Brittany_spaniel": 14,
    "Cardigan": 15,
    "Chesapeake_Bay_retriever": 16,
    "Chihuahua": 17,
    "Dandie_Dinmont": 18,
    "Doberman": 19,
    "English_foxhound": 20,
    "English_setter": 21,
    "English_springer": 22,
    "EntleBucher": 23,
    "Eskimo_dog": 24,
    "French_bulldog": 25,
    "German_shepherd": 26,
    "German_short-haired_pointer": 27,
    "Gordon_setter": 28,
    "Great_Dane": 29,
    "Great_Pyrenees": 30,
    "Greater_Swiss_Mountain_dog": 31,
    "Ibizan_hound": 32,
    "Irish_setter": 33,
    "Irish_terrier": 34,
    "Irish_water_spaniel": 35,
    "Irish_wolfhound": 36,
    "Italian_greyhound": 37,
    "Japanese_spaniel": 38,
    "Kerry_blue_terrier": 39,
    "Labrador_retriever": 40,
    "Lakeland_terrier": 41,
    "Leonberg": 42,
    "Lhasa": 43,
    "Maltese_dog": 44,
    "Mexican_hairless": 45,
    "Newfoundland": 46,
    "Norfolk_terrier": 47,
    "Norwegian_elkhound": 48,
    "Norwich_terrier": 49,
    "Old_English_sheepdog": 50,
    "Pekinese": 51,
    "Pembroke": 52,
    "Pomeranian": 53,
    "Rhodesian_ridgeback": 54,
    "Rottweiler": 55,
    "Saint_Bernard": 56,
    "Saluki": 57,
    "Samoyed": 58,
    "Scotch_terrier": 59,
    "Scottish_deerhound": 60,
    "Sealyham_terrier": 61,
    "Shetland_sheepdog": 62,
    "Shih-Tzu": 63,
    "Siberian_husky": 64,
    "Staffordshire_bullterrier": 65,
    "Sussex_spaniel": 66,
    "Tibetan_mastiff": 67,
    "Tibetan_terrier": 68,
    "Walker_hound": 69,
    "Weimaraner": 70,
    "Welsh_springer_spaniel": 71,
    "West_Highland_white_terrier": 72,
    "Yorkshire_terrier": 73,
    "affenpinscher": 74,
    "basenji": 75,
    "basset": 76,
    "beagle": 77,
    "black-and-tan_coonhound": 78,
    "bloodhound": 79,
    "bluetick": 80,
    "borzoi": 81,
    "boxer": 82,
    "briard": 83,
    "bull_mastiff": 84,
    "cairn": 85,
    "chow": 86,
    "clumber": 87,
    "cocker_spaniel": 88,
    "collie": 89,
    "curly-coated_retriever": 90,
    "dhole": 91,
    "dingo": 92,
    "flat-coated_retriever": 93,
    "giant_schnauzer": 94,
    "golden_retriever": 95,
    "groenendael": 96,
    "keeshond": 97,
    "kelpie": 98,
    "komondor": 99,
    "kuvasz": 100,
    "malamute": 101,
    "malinois": 102,
    "miniature_pinscher": 103,
    "miniature_poodle": 104,
    "miniature_schnauzer": 105,
    "otterhound": 106,
    "papillon": 107,
    "pug": 108,
    "redbone": 109,
    "schipperke": 110,
    "silky_terrier": 111,
    "soft-coated_wheaten_terrier": 112,
    "standard_poodle": 113,
    "standard_schnauzer": 114,
    "toy_poodle": 115,
    "toy_terrier": 116,
    "vizsla": 117,
    "whippet": 118,
    "wire-haired_fox_terrier": 119
  };

  // Convert breed name for API calls
  const formatBreedName = (name) => {
    return name.toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/-/g, '_');
  };

  // Try your ML API first
  const fetchFromMLAPI = async (breedName) => {
    const apiBreedName = formatBreedName(breedName);
    const breedIndex = breedIndexMap[apiBreedName];
    
    if (breedIndex === undefined) {
      throw new Error('Breed not found in ML API');
    }

    const response = await fetch(`${process.env.REACT_APP_ML_API_URL || 'http://localhost:8000/api'}/breed-image/${breedIndex}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`ML API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      url: data.image_url || data.image || data.url,
      source: 'ML API'
    };
  };

  // Fallback to Dog CEO API
  const fetchFromDogAPI = async (breedName) => {
    const apiBreedName = formatBreedName(breedName);
    
    // Handle special breed names for Dog CEO API
    const breedMapping = {
      'afghan_hound': 'afghan',
      'german_shepherd': 'germanshepherd',
      'golden_retriever': 'retriever/golden',
      'labrador_retriever': 'retriever/labrador',
      'saint_bernard': 'stbernard',
      'boston_bull': 'bulldog/boston',
      'french_bulldog': 'bulldog/french',
      'english_springer': 'spaniel/english',
      'cocker_spaniel': 'spaniel/cocker',
      'irish_setter': 'setter/irish',
      'english_setter': 'setter/english',
      'gordon_setter': 'setter/gordon',
      'chesapeake_bay_retriever': 'retriever/chesapeake',
      'curly_coated_retriever': 'retriever/curly',
      'flat_coated_retriever': 'retriever/flatcoated',
      'welsh_springer_spaniel': 'spaniel/welsh',
      'yorkshire_terrier': 'terrier/yorkshire',
      'west_highland_white_terrier': 'terrier/westhighland',
      'wire_haired_fox_terrier': 'terrier/fox',
      'soft_coated_wheaten_terrier': 'terrier/wheaten',
      'staffordshire_bullterrier': 'terrier/staffordshire',
      'american_staffordshire_terrier': 'terrier/american',
      'australian_terrier': 'terrier/australian',
      'bedlington_terrier': 'terrier/bedlington',
      'border_terrier': 'terrier/border',
      'cairn': 'terrier/cairn',
      'dandie_dinmont': 'terrier/dandie',
      'irish_terrier': 'terrier/irish',
      'kerry_blue_terrier': 'terrier/kerryblue',
      'lakeland_terrier': 'terrier/lakeland',
      'norfolk_terrier': 'terrier/norfolk',
      'norwich_terrier': 'terrier/norwich',
      'scotch_terrier': 'terrier/scottish',
      'sealyham_terrier': 'terrier/sealyham',
      'silky_terrier': 'terrier/silky',
      'tibetan_terrier': 'terrier/tibetan',
      'toy_terrier': 'terrier/toy',
      'german_short_haired_pointer': 'pointer/german',
      'old_english_sheepdog': 'sheepdog/english',
      'shetland_sheepdog': 'sheepdog/shetland',
      'bernese_mountain_dog': 'mountain/bernese',
      'greater_swiss_mountain_dog': 'mountain/swiss',
      'tibetan_mastiff': 'mastiff/tibetan',
      'bull_mastiff': 'mastiff/bull',
      'miniature_pinscher': 'pinscher/miniature',
      'miniature_poodle': 'poodle/miniature',
      'standard_poodle': 'poodle/standard',
      'toy_poodle': 'poodle/toy',
      'miniature_schnauzer': 'schnauzer/miniature',
      'giant_schnauzer': 'schnauzer/giant',
      'standard_schnauzer': 'schnauzer/standard',
      'mexican_hairless': 'xoloitzcuintli',
      'eskimo_dog': 'eskimo',
      'norwegian_elkhound': 'elkhound/norwegian',
      'rhodesian_ridgeback': 'ridgeback/rhodesian',
      'black_and_tan_coonhound': 'coonhound',
      'walker_hound': 'hound/walker',
      'ibizan_hound': 'hound/ibizan',
      'scottish_deerhound': 'deerhound',
      'italian_greyhound': 'greyhound/italian',
      'great_dane': 'dane/great',
      'great_pyrenees': 'pyrenees',
      'newfoundland': 'newfoundland',
      'siberian_husky': 'husky',
      'malamute': 'malamute',
      'shih_tzu': 'shihtzu',
      'lhasa': 'lhasa',
      'maltese_dog': 'maltese',
      'pekinese': 'pekinese',
      'pomeranian': 'pomeranian',
      'papillon': 'papillon',
      'chihuahua': 'chihuahua',
      'affenpinscher': 'affenpinscher'
    };

    const mappedBreed = breedMapping[apiBreedName] || apiBreedName.replace(/_/g, '/');

    const response = await fetch(`https://dog.ceo/api/breed/${mappedBreed}/images/random`);
    
    if (!response.ok) {
      throw new Error(`Dog CEO API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 'success') {
      throw new Error('Dog CEO API returned error status');
    }

    return {
      url: data.message,
      source: 'Dog CEO API'
    };
  };

  // Fallback to Unsplash (requires API key)
  const fetchFromUnsplash = async (breedName) => {
    if (!process.env.REACT_APP_UNSPLASH_API_KEY) {
      throw new Error('Unsplash API key not configured');
    }

    const query = `${breedName.replace(/_/g, ' ')} dog`;
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${process.env.REACT_APP_UNSPLASH_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return {
        url: data.results[0].urls.regular,
        source: 'Unsplash API'
      };
    }
    
    throw new Error('No images found on Unsplash');
  };

  const fetchImage = useCallback(async () => {
    if (!breedName) return;

    try {
      setLoading(true);
      setError(false);

      let result = null;

      // Try different APIs in order of preference
      const attempts = [
        () => fetchFromMLAPI(breedName),
        () => fetchFromDogAPI(breedName),
        () => fetchFromUnsplash(breedName),
      ];

      for (const attempt of attempts) {
        try {
          result = await attempt();
          if (result?.url) break;
        } catch (err) {
          console.warn(`API attempt failed:`, err.message);
          continue;
        }
      }

      if (result?.url) {
        setImage(result.url);
        setSource(result.source);
      } else {
        throw new Error('All API attempts failed');
      }
    } catch (err) {
      console.error('Error fetching breed image:', err);
      setError(true);
      setSource('Fallback');
      setImage('/images/default-dog.jpg');
    } finally {
      setLoading(false);
    }
  }, [breedName]);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  return { 
    image, 
    loading, 
    error, 
    source,
    refetch: fetchImage
  };
};

export default useBreedImage;