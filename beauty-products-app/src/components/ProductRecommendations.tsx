import React from "react";

interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  price: string;
}

interface ProductRecommendationsProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({ products, onSelect }) => {
  return (
    <div>
      <h3>Recommended Products:</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "8px",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => onSelect(product)}
          >
            <img src={product.image} alt={product.name} style={{ width: "100%", borderRadius: "8px" }} />
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            <p style={{ fontWeight: "bold" }}>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;
