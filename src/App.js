import React, { useState, useEffect } from 'react';
import './App.css';
import Select from 'react-select';

// Dropdown options for fitness tips selection
const fitnessOptions = [
  { value: 'both', label: 'Both Exercise & Diet Tips' },
  { value: 'exercise', label: 'Exercise Tips' },
  { value: 'diet', label: 'Diet Tips' }
];

// Exercise and diet tips arrays
const exerciseTips = [
  "Try a 30-minute walk today!",
  "Incorporate squats into your routine for better leg strength.",
  "Stretch before and after your workout to avoid injuries.",
  "Stay active during the day by walking around every hour.",
  "Engage in 15-minute high-intensity interval training (HIIT).",
  "Add resistance training to improve muscle strength.",
  "Focus on breathing while doing your exercises."
];

const dietTips = [
  "Drink plenty of water throughout the day.",
  "Avoid processed sugars and focus on whole foods.",
  "Have a balanced meal with protein, carbs, and healthy fats.",
  "Eat more vegetables for better digestion.",
  "Choose whole grains over refined grains.",
  "Don't skip breakfast to maintain energy levels.",
  "Opt for smaller meals throughout the day to keep your metabolism active."
];

const App = () => {
  const [height, setHeight] = useState(''); 
  const [weight, setWeight] = useState('');  
  const [bmi, setBmi] = useState(null);
  const [fitnessType, setFitnessType] = useState('both');
  const [dailyTips, setDailyTips] = useState([]);
  const [randomTip, setRandomTip] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to detect and convert height (cm/ft to meters) and weight (lbs to kg)
  const convertUnits = (value, type) => {
    if (!value) return 0; // Ensure no empty input

    // Height conversion (cm or ft)
    if (type === 'height') {
      // If value contains 'cm', convert it to meters
      if (value.includes('cm')) {
        const cm = parseFloat(value.replace('cm', '').trim());
        if (isNaN(cm)) return 0;  // Check if cm value is valid
        return cm / 100; // Convert cm to meters
      }
      // If value contains 'ft', convert it to meters
      if (value.includes('ft')) {
        const feet = parseFloat(value.replace('ft', '').trim());
        if (isNaN(feet)) return 0;  // Check if feet value is valid
        return feet * 0.3048; // Convert feet to meters
      }
    }

    // Weight conversion (kg or lbs)
    if (type === 'weight') {
      // If value contains 'lbs', convert it to kg
      if (value.includes('lbs')) {
        const lbs = parseFloat(value.replace('lbs', '').trim());
        if (isNaN(lbs)) return 0; // Check if lbs value is valid
        return lbs * 0.453592; // Convert lbs to kg
      }
      // If value contains 'kg', return it as it is (already in kg)
      if (value.includes('kg')) {
        const kg = parseFloat(value.replace('kg', '').trim());
        if (isNaN(kg)) return 0; // Check if kg value is valid
        return kg; // Return kg as is
      }
    }

    return parseFloat(value) || 0; // Return 0 if it's not a valid number
  };

  // BMI Calculation
  const calculateBMI = () => {
    if (!height || !weight) {
      setError('Please enter both height and weight.');
      return;
    }

    setError('');
    setLoading(true);

    const heightInMeters = convertUnits(height, 'height');
    const weightInKg = convertUnits(weight, 'weight');
    
    if (heightInMeters === 0 || weightInKg === 0) {
      setError('Invalid height or weight input');
      setLoading(false);
      return;
    }

    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    setBmi(bmiValue.toFixed(2));
    setLoading(false);
  };

  // Get fitness tips based on selected type
  useEffect(() => {
    const getFitnessTips = () => {
      let selectedTips = [];

      if (fitnessType === 'exercise' || fitnessType === 'both') {
        selectedTips = selectedTips.concat(exerciseTips);
      }
      if (fitnessType === 'diet' || fitnessType === 'both') {
        selectedTips = selectedTips.concat(dietTips);
      }

      // Show only 7 days worth of tips
      setDailyTips(selectedTips.slice(0, 7));
    };

    getFitnessTips(); // Call the function after dependencies change
  }, [fitnessType]);

  // Generate a random tip
  const showRandomTip = () => {
    setRandomTip(dailyTips[Math.floor(Math.random() * dailyTips.length)]);
  };

  // Determine BMI Category
  const getBMICategory = () => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi <= 24.9) return 'Normal weight';
    if (bmi >= 25 && bmi <= 29.9) return 'Overweight';
    return 'Obesity';
  };

  return (
    <div className="App">
      <div className="container">
        <h1>BMI Calculator and Daily Fitness Tips</h1>

        {/* BMI Calculator */}
        <div className="card">
          <h2>BMI Calculator</h2>
          <input
            type="text"
            placeholder="Enter height (in cm or ft)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Enter weight (in kg or lbs)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="input-field"
          />
          <button onClick={calculateBMI} className="btn">Calculate BMI</button>

          {loading && <div className="loading">Calculating...</div>}
          {error && <div className="error">{error}</div>}
          {bmi && !loading && (
            <div className="bmi-result">
              <p>Your BMI: {bmi}</p>
              <p>Category: {getBMICategory()}</p>
            </div>
          )}
        </div>

        {/* Fitness Tips Selection */}
        <div className="card">
          <h2>Choose Your Fitness Tip Preferences</h2>
          <Select
            options={fitnessOptions}
            onChange={(selectedOption) => setFitnessType(selectedOption.value)}
            value={fitnessOptions.find(option => option.value === fitnessType)}
            className="select"
            isSearchable={false}
          />
        </div>

        {/* Display Daily Tips */}
        <div className="card">
          <h2>Your Daily Fitness Tips (7 Days)</h2>
          <ul className="tips-list">
            {dailyTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>

        {/* Show Random Tip */}
        <div className="random-tip-card">
          <button onClick={showRandomTip} className="btn">Show Random Tip</button>
          {randomTip && <div className="random-tip">{randomTip}</div>}
        </div>
      </div>
    </div>
  );
};

export default App;
