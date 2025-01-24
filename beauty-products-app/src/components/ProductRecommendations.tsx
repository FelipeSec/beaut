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
        console.log('Sending preferences:', preferences); // Debug log

        const response = await fetch('http://localhost:5000/api/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ preferences }),
        });

        const data = await response.json();
        console.log('Received data:', data); // Debug log

        if (data.recomendacoes && data.recomendacoes.length > 0) {
          setProducts(data.recomendacoes);
        } else {
          setError('Nenhuma recomendação encontrada');
        }
      } catch (err) {
        console.error('Error details:', err); // Debug log
        setError('Erro ao carregar recomendações');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [preferences]);

  if (loading) {
    return <div className="loading">Carregando recomendações...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="recommendations-container">
      <h2>Produtos Recomendados</h2>
      <div className="products-grid">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className="product-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(product)}
          >
            <h3>{product.nome}</h3>
            <p className="brand">Marca: {product.marca}</p>
            <p className="description">{product.descricao}</p>
            <p className="price-range">Preço: {product.faixa_preco}</p>
            <div className="benefits">
              {product.beneficios_principais.map((beneficio, i) => (
                <span key={i} className="benefit-tag">{beneficio}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;
