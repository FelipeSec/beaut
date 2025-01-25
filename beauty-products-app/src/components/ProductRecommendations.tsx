  import React, { useState, useEffect } from 'react';
  import { motion } from 'framer-motion';

  interface Product {
    id: number;
    nome: string;
    marca: string;
    descricao: string;
    faixa_preco: string;
    beneficios_principais: string[];
  }

  interface ApiResponse {
    recommendations: Product[];
  }

  interface ProductRecommendationsProps {
    preferences: Record<string, string>;
    onSelect: (product: Product) => void;
  }

  const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({ preferences, onSelect }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchRecommendations = async () => {
        try {
          setLoading(true);
          console.log('Sending preferences:', preferences);

          const response = await fetch('http://localhost:5000/api/recommendations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ preferences }),
          });

          const data: ApiResponse = await response.json();
          console.log('Raw API Response:', JSON.stringify(data, null, 2));

          if (data && data.recommendations && Array.isArray(data.recommendations)) {
            // Map recommendations to Product type
            const mappedProducts = data.recommendations.map(rec => ({
              id: rec.id || Math.random(),
              nome: rec.nome || rec.name || '',
              marca: rec.marca || rec.brand || '',
              descricao: rec.descricao || rec.description || '',
              faixa_preco: rec.faixa_preco || rec.price_range || '',
              beneficios_principais: rec.beneficios_principais || rec.key_benefits || []
            }));
            
            console.log('Mapped Products:', mappedProducts);
            setProducts(mappedProducts);
            setError(null);
          } else {
            console.error('Invalid response format:', data);
            console.log('Response structure:', Object.keys(data));
            setError('Nenhuma recomendação encontrada');
          }
        } catch (err) {
          console.error('Error details:', err);
          setError('Erro ao carregar recomendações');
        } finally {
          setLoading(false);
        }
      };

      fetchRecommendations();
    }, [preferences]);

    if (loading) return <div className="loading">Carregando recomendações...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
      <div className="recommendations-container">
        <h2>Produtos Recomendados</h2>
        <div className="products-grid">
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="product-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onSelect(product)}
            >
              <h3>{product.nome}</h3>
              <p className="brand">{product.marca}</p>
              <p className="description">{product.descricao}</p>
              <p className="price">{product.faixa_preco}</p>
              <div className="benefits">
                {product.beneficios_principais.map((beneficio, index) => (
                  <span key={index} className="benefit-tag">{beneficio}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  export default ProductRecommendations;
