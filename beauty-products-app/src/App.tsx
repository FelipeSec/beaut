import React, { useState, useEffect } from "react";
import { FaStar, FaHeart, FaMoon, FaSun } from "react-icons/fa";
import { motion } from "framer-motion";
import './App.css';
import CategoryCard from "./components/CategoryCard";
import PreferenceSelection from "./components/PreferenceSelection";
import ProductRecommendations from "./components/ProductRecommendations";
import { fetchRecommendations } from "./mockApi";

// Add image size constants
const IMAGE_DIMENSIONS = {
  width: 400,
  height: 300,
};

const categories = [
  {
    id: 1,
    name: "Hair",
    image: `https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=${IMAGE_DIMENSIONS.width}&h=${IMAGE_DIMENSIONS.height}&fit=crop`,
    preferences: ["Hair Type", "Hair Concerns", "Color Treatment"],
  },
  {
    id: 2,
    name: "Makeup",
    image: `https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=${IMAGE_DIMENSIONS.width}&h=${IMAGE_DIMENSIONS.height}&fit=crop`,
    preferences: ["Skin Tone", "Makeup Style", "Skin Type"],
  },
  {
    id: 3,
    name: "Skincare",
    image: `https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=${IMAGE_DIMENSIONS.width}&h=${IMAGE_DIMENSIONS.height}&fit=crop`,
    preferences: ["Skin Concerns", "Skin Type", "Age Group"],
  },
];

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const currentCategory = categories.find((cat) => cat.name === selectedCategory);

  useEffect(() => {
    if (showRecommendations && selectedCategory) {
      fetchRecommendations(selectedCategory).then((data: any) => {
        setRecommendations(data);
      });
    }
  }, [showRecommendations, selectedCategory]);

  // Add theme toggle effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark-theme', isDarkMode);
  }, [isDarkMode]);

  const ThemeToggle = () => (
    <motion.button
      className="theme-toggle"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsDarkMode(!isDarkMode)}
    >
      {isDarkMode ? <FaSun /> : <FaMoon />}
    </motion.button>
  );

  return (
    <div className="app-container">
      <div className="theme-wrapper">
        <ThemeToggle />
      </div>
      <nav className="navigation">
        {selectedCategory && (
          <motion.button 
            className="back-button"
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              if (selectedProduct) setSelectedProduct(null);
              else if (showRecommendations) setShowRecommendations(false);
              else if (preferences.length) setPreferences([]);
              else setSelectedCategory(null);
            }}
          >
            ← Back
          </motion.button>
        )}
      </nav>

      <main className="main-content">
        {!selectedCategory ? (
          <motion.div 
            className="category-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1>Discover Your Perfect Beauty Products</h1>
            <p className="subtitle">Select a category to get personalized recommendations</p>
            <div className="category-grid">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  {...category}
                  onSelect={() => setSelectedCategory(category.name)}
                />
              ))}
            </div>
          </motion.div>
        ) : !preferences.length ? (
          <PreferenceSelection
            preferences={currentCategory?.preferences || []}
            onSubmit={(selectedPreferences) => setPreferences(selectedPreferences)}
          />
        ) : !showRecommendations ? (
          <motion.div 
            className="preferences-submitted"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2>Great! We've got your preferences</h2>
            <p>Let's find the perfect products for you</p>
            <motion.button 
              className="primary-button"
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowRecommendations(true)}
            >
              View Recommendations
            </motion.button>
          </motion.div>
        ) : selectedProduct ? (
          <div className="product-detail">
            <div className="product-image">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
            </div>
            <div className="product-info">
              <h2>{selectedProduct.name}</h2>
              <p className="description">{selectedProduct.description}</p>
              <p className="price">{selectedProduct.price}</p>
            </div>
          </div>
        ) : (
          <div className="recommendations">
            {!recommendations.length ? (
              <div className="loading">
                <p>Finding the best products for you...</p>
              </div>
            ) : (
              <ProductRecommendations
                products={recommendations}
                onSelect={(product) => setSelectedProduct(product)}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
