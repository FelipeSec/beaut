import React, { useState, useEffect } from "react";
import './App.css'
import CategoryCard from "./components/CategoryCard";
import PreferenceSelection from "./components/PreferenceSelection";
import ProductRecommendations from "./components/ProductRecommendations";
import { fetchRecommendations } from "./mockApi";

const categories = [
  {
    id: 1,
    name: "Hair",
    image: "https://via.placeholder.com/300x200?text=Hair",
    preferences: ["Hair Type", "Hair Concerns", "Color Treatment"],
  },
  {
    id: 2,
    name: "Makeup",
    image: "https://via.placeholder.com/300x200?text=Makeup",
    preferences: ["Skin Tone", "Makeup Style", "Skin Type"],
  },
  {
    id: 3,
    name: "Skincare",
    image: "https://via.placeholder.com/300x200?text=Skincare",
    preferences: ["Skin Concerns", "Skin Type", "Age Group"],
  },
];

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const currentCategory = categories.find((cat) => cat.name === selectedCategory);

  useEffect(() => {
    if (showRecommendations && selectedCategory) {
      fetchRecommendations(selectedCategory).then((data: any) => {
        setRecommendations(data);
      });
    }
  }, [showRecommendations, selectedCategory]);

  return (
    <div>
      {!selectedCategory ? (
        <div>
          <h1>Select a Category</h1>
          <div style={{ display: "flex", gap: "20px" }}>
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                image={category.image}
                onSelect={() => setSelectedCategory(category.name)}
              />
            ))}
          </div>
        </div>
      ) : !preferences.length ? (
        <PreferenceSelection
          preferences={currentCategory?.preferences || []}
          onSubmit={(selectedPreferences) => setPreferences(selectedPreferences)}
        />
      ) : !showRecommendations ? (
        <div>
          <h2>Preferences Submitted!</h2>
          <button onClick={() => setShowRecommendations(true)}>
            Show Recommendations
          </button>
        </div>
      ) : selectedProduct ? (
        <div>
          <h2>Product Selected:</h2>
          <p>{selectedProduct.name}</p>
          <p>{selectedProduct.description}</p>
          <p>{selectedProduct.price}</p>
        </div>
      ) : (
        <div>
          {!recommendations.length ? (
            <p>Fetching product recommendations...</p>
          ) : (
            <ProductRecommendations
              products={recommendations}
              onSelect={(product) => setSelectedProduct(product)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
