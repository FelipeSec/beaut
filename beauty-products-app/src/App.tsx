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
    name: "Cabelo",
    image: `https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=${IMAGE_DIMENSIONS.width}&h=${IMAGE_DIMENSIONS.height}&fit=crop`,
    preferences: {
      "Tipo de Cabelo": ["Liso", "Cacheado", "Ondulado", "Crespo"],
      "Textura do Cabelo": ["Fino", "Médio", "Grosso"],
      "Comprimento do Cabelo": ["Curto", "Médio", "Longo"],
      "Tipo de Couro Cabeludo": ["Oleoso", "Seco", "Normal"],
      "Problemas Capilares": ["Caspa", "Frizz", "Queda", "Pontas Duplas"],
      "Produtos Desejados": ["Shampoo", "Condicionador", "Gel", "Máscaras"],
      "Cor do Cabelo": ["Natural", "Tingido", "Mechas"]
    }
  },
  {
    id: 2,
    name: "Maquiagem",
    image: `https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=${IMAGE_DIMENSIONS.width}&h=${IMAGE_DIMENSIONS.height}&fit=crop`,
    preferences: {
      "Tom de Pele": ["Clara", "Média", "Escura"],
      "Tipo de Base": ["Líquida", "Pó", "Cremosa", "Bastão"],
      "Preferências de Corretivo": ["Cobertura Total", "Cobertura Leve"],
      "Maquiagem para Olhos": ["Máscara", "Delineador", "Sombra"],
      "Maquiagem para Lábios": ["Batom", "Gloss", "Lápis"],
      "Preocupações com Maquiagem": ["Longa Duração", "Matte", "Luminosa", "Pele Sensível"],
      "Acabamento Desejado": ["Matte", "Luminoso", "Natural"],
      "Alergias ou Sensibilidades": ["Sem Fragrância", "Cruelty-free"]
    }
  },
  {
    id: 3,
    name: "Skincare",
    image: `https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=${IMAGE_DIMENSIONS.width}&h=${IMAGE_DIMENSIONS.height}&fit=crop`,
    preferences: {
      "Tipo de Pele": ["Oleosa", "Seca", "Mista", "Sensível"],
      "Preocupações com a Pele": ["Acne", "Envelhecimento", "Manchas", "Ressecamento", "Vermelhidão"],
      "Rotina de Skincare": ["Limpador", "Tônico", "Sérum", "Hidratante", "Protetor Solar"],
      "Preferências de Ingredientes": ["Ácido Hialurônico", "Retinol", "Vitamina C", "CBD"],
      "Resultados Desejados": ["Hidratação", "Anti-idade", "Clareamento", "Controle de Acne"],
      "Proteção Solar": ["FPS 30", "FPS 50+"],
      "Natural ou Orgânico": ["Sem Parabenos", "Sem Sulfatos", "Vegano"]
    }
  }
];

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<{ [key: string]: string }>({});
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [cheapestPrices, setCheapestPrices] = useState<any[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const currentCategory = categories.find(cat => cat.name === selectedCategory);

  useEffect(() => {
    document.documentElement.classList.toggle('dark-theme', isDarkMode);
  }, [isDarkMode]);

  const scrapePrices = async (productName: string) => {
    setLoadingPrices(true);
    try {
      const response = await fetch(
        `http://localhost:5000/scrape-prices?productName=${encodeURIComponent(productName)}`
      );
      const data = await response.json();
      setCheapestPrices(data.prices || []);
    } catch (error) {
      console.error("Error scraping prices:", error);
    } finally {
      setLoadingPrices(false);
    }
  };

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    scrapePrices(product.name);
  };

  const handlePreferenceSubmit = async (selectedPreferences: { [key: string]: string }) => {
    try {
      setPreferences(selectedPreferences);
      const response = await fetch('http://localhost:5000/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences: selectedPreferences }),
      });
      const data = await response.json();
      setRecommendations(data.recomendacoes || []);
      setShowRecommendations(true);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const renderSelectedProduct = () => {
    if (!selectedProduct) return null;

    return (
      <motion.div 
        className="product-details"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="product-header">
          <h2>{selectedProduct.name}</h2>
          <button 
            className="back-button"
            onClick={() => setSelectedProduct(null)}
          >
            ← Volte para as recomendações
          </button>
        </div>

        <div className="product-content">
          <div className="product-info">
            <img src={selectedProduct.image} alt={selectedProduct.name} />
            <p className="description">{selectedProduct.description}</p>
            <p className="price">${selectedProduct.price}</p>
          </div>

          <div className="price-comparison">
            <h3>Price Comparison</h3>
            {loadingPrices ? (
              <motion.div 
                className="loading-spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Carregando preços...
              </motion.div>
            ) : (
              <ul className="prices-list">
                {cheapestPrices.map((price, index) => (
                  <motion.li 
                    key={index}
                    className="price-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="store-name">{price.name}</span>
                    <span className="price-amount">${price.price}</span>
                    <a 
                      href={price.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-button"
                    >
                      Ver oferta
                    </a>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="app-container">
      <div className="theme-wrapper">
        <motion.button
          className="theme-toggle"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </motion.button>
      </div>

      <main className="main-content">
        {!selectedCategory ? (
          <motion.div 
            className="category-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1>Selecione uma Categoria</h1>
            <div className="categories-container">
              {categories.map(category => (
                <CategoryCard
                  key={category.id}
                  {...category}
                  onSelect={() => setSelectedCategory(category.name)}
                />
              ))}
            </div>
          </motion.div>
        ) : !Object.keys(preferences).length ? (
          <PreferenceSelection
            preferences={currentCategory?.preferences || {}}
            onSubmit={handlePreferenceSubmit}
          />
        ) : selectedProduct ? (
          renderSelectedProduct()
        ) : (
          <ProductRecommendations
            products={recommendations}
            onSelect={handleProductSelect}
          />
        )}
      </main>
    </div>
  );
};

export default App;
