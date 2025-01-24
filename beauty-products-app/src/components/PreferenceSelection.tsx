import React, { useState } from "react";
import { motion } from "framer-motion";
import './PreferenceSelection.css';

interface PreferenceSelectionProps {
  preferences: { [key: string]: string[] };
  onSubmit: (selectedPreferences: { [key: string]: string }) => void;
}

const PreferenceSelection: React.FC<PreferenceSelectionProps> = ({ preferences, onSubmit }) => {
  const [selected, setSelected] = useState<{ [key: string]: string }>({});

  const isComplete = Object.keys(preferences).every(category => selected[category]);

  return (
    <motion.div 
      className="preference-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="preference-title">Selecione suas Preferências</h2>
      <div className="preference-grid">
        {Object.entries(preferences).map(([category, options], index) => (
          <motion.div
            key={category}
            className="preference-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h3>{category}</h3>
            <div className="option-list">
              {options.map(option => (
                <motion.label 
                  key={option} 
                  className={`option-item ${selected[category] === option ? 'selected' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name={category}
                    value={option}
                    checked={selected[category] === option}
                    onChange={() => {
                      setSelected(prev => ({
                        ...prev,
                        [category]: option
                      }));
                    }}
                  />
                  <span className="option-text">{option}</span>
                </motion.label>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <motion.button
        className={`submit-button ${!isComplete ? 'disabled' : ''}`}
        whileHover={isComplete ? { scale: 1.05 } : {}}
        whileTap={isComplete ? { scale: 0.95 } : {}}
        onClick={() => isComplete && onSubmit(selected)}
        disabled={!isComplete}
      >
        {isComplete ? 'Continuar' : 'Por favor, selecione todas as preferências'}
      </motion.button>
    </motion.div>
  );
};

export default PreferenceSelection;
