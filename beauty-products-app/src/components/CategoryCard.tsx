import React from "react";

interface CategoryCardProps {
  name: string;
  image: string;
  onSelect: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, image, onSelect }) => {
  return (
    <div className="category-card" onClick={onSelect} style={{ cursor: "pointer", textAlign: "center" }}>
      <img src={image} alt={name} style={{ width: "100%", borderRadius: "8px" }} />
      <h3>{name}</h3>
    </div>
  );
};

export default CategoryCard;
