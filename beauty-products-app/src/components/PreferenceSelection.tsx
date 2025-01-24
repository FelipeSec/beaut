import React, { useState } from "react";

interface PreferenceSelectionProps {
  preferences: string[];
  onSubmit: (selectedPreferences: string[]) => void;
}

const PreferenceSelection: React.FC<PreferenceSelectionProps> = ({ preferences, onSubmit }) => {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const togglePreference = (preference: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(preference) ? prev.filter((p) => p !== preference) : [...prev, preference]
    );
  };

  return (
    <div>
      <h3>Select Your Preferences:</h3>
      <div>
        {preferences.map((preference) => (
          <label key={preference}>
            <input
              type="checkbox"
              value={preference}
              onChange={() => togglePreference(preference)}
            />
            {preference}
          </label>
        ))}
      </div>
      <button onClick={() => onSubmit(selectedPreferences)}>Submit Preferences</button>
    </div>
  );
};

export default PreferenceSelection;
