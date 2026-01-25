'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { COMMON_PLANTS } from '@/lib/plants';
import styles from './onboarding-form.module.css';

const LIGHT_OPTIONS = [
  { value: 'low', label: 'Low light (north-facing, no direct sun)' },
  { value: 'medium', label: 'Medium light (east or west-facing)' },
  { value: 'bright_indirect', label: 'Bright indirect (near south-facing, filtered)' },
  { value: 'direct', label: 'Direct sunlight (unobstructed south-facing)' },
];

const HUMIDITY_OPTIONS = [
  { value: 'low', label: 'Low (dry air, heating in winter)' },
  { value: 'moderate', label: 'Moderate (average home humidity)' },
  { value: 'high', label: 'High (bathroom, humidifier, or tropical climate)' },
];

const CLIMATE_OPTIONS = [
  { value: 'tropical', label: 'Tropical (warm year-round)' },
  { value: 'temperate', label: 'Temperate (distinct seasons)' },
  { value: 'arid', label: 'Arid (dry, desert-like)' },
];

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [environment, setEnvironment] = useState({
    lightLevel: '',
    humidity: '',
    climate: '',
  });
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [customPlant, setCustomPlant] = useState('');

  const handleEnvironmentChange = (field, value) => {
    setEnvironment(prev => ({ ...prev, [field]: value }));
  };

  const togglePlant = (plantId) => {
    setSelectedPlants(prev =>
      prev.includes(plantId)
        ? prev.filter(id => id !== plantId)
        : [...prev, plantId]
    );
  };

  const addCustomPlant = () => {
    if (customPlant.trim() && !selectedPlants.includes(customPlant.trim())) {
      setSelectedPlants(prev => [...prev, customPlant.trim()]);
      setCustomPlant('');
    }
  };

  const canProceedStep1 = environment.lightLevel && environment.humidity && environment.climate;
  const canProceedStep2 = selectedPlants.length > 0;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const plants = selectedPlants.map(plantId => {
        const commonPlant = COMMON_PLANTS.find(p => p.id === plantId);
        return {
          plantType: commonPlant ? commonPlant.name : plantId,
          nickname: null,
        };
      });

      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ environment, plants }),
      });

      if (res.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        <div className={styles.progressStep} data-active={step >= 1}>1</div>
        <div className={styles.progressLine} data-active={step >= 2}></div>
        <div className={styles.progressStep} data-active={step >= 2}>2</div>
        <div className={styles.progressLine} data-active={step >= 3}></div>
        <div className={styles.progressStep} data-active={step >= 3}>3</div>
      </div>

      {step === 1 && (
        <div className={styles.stepContent}>
          <h2>Tell us about your home</h2>
          <p>This helps us tailor plant care advice to your environment.</p>

          <div className={styles.field}>
            <label>Light Level</label>
            {LIGHT_OPTIONS.map(opt => (
              <label key={opt.value} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="lightLevel"
                  value={opt.value}
                  checked={environment.lightLevel === opt.value}
                  onChange={(e) => handleEnvironmentChange('lightLevel', e.target.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>

          <div className={styles.field}>
            <label>Humidity</label>
            {HUMIDITY_OPTIONS.map(opt => (
              <label key={opt.value} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="humidity"
                  value={opt.value}
                  checked={environment.humidity === opt.value}
                  onChange={(e) => handleEnvironmentChange('humidity', e.target.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>

          <div className={styles.field}>
            <label>Climate</label>
            {CLIMATE_OPTIONS.map(opt => (
              <label key={opt.value} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="climate"
                  value={opt.value}
                  checked={environment.climate === opt.value}
                  onChange={(e) => handleEnvironmentChange('climate', e.target.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>

          <button
            className={styles.button}
            onClick={() => setStep(2)}
            disabled={!canProceedStep1}
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className={styles.stepContent}>
          <h2>What plants do you have?</h2>
          <p>Select all the plants you currently own.</p>

          <div className={styles.plantGrid}>
            {COMMON_PLANTS.map(plant => (
              <label
                key={plant.id}
                className={styles.plantCard}
                data-selected={selectedPlants.includes(plant.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedPlants.includes(plant.id)}
                  onChange={() => togglePlant(plant.id)}
                />
                <span className={styles.plantName}>{plant.name}</span>
                <span className={styles.plantDifficulty} data-difficulty={plant.difficulty}>
                  {plant.difficulty}
                </span>
              </label>
            ))}
          </div>

          <div className={styles.customPlant}>
            <input
              type="text"
              placeholder="Add a plant not listed..."
              value={customPlant}
              onChange={(e) => setCustomPlant(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomPlant()}
            />
            <button type="button" onClick={addCustomPlant}>Add</button>
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.buttonSecondary} onClick={() => setStep(1)}>
              Back
            </button>
            <button
              className={styles.button}
              onClick={() => setStep(3)}
              disabled={!canProceedStep2}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className={styles.stepContent}>
          <h2>Confirm your setup</h2>

          <div className={styles.summary}>
            <h3>Your Environment</h3>
            <ul>
              <li>Light: {LIGHT_OPTIONS.find(o => o.value === environment.lightLevel)?.label}</li>
              <li>Humidity: {HUMIDITY_OPTIONS.find(o => o.value === environment.humidity)?.label}</li>
              <li>Climate: {CLIMATE_OPTIONS.find(o => o.value === environment.climate)?.label}</li>
            </ul>

            <h3>Your Plants ({selectedPlants.length})</h3>
            <ul>
              {selectedPlants.map(plantId => {
                const plant = COMMON_PLANTS.find(p => p.id === plantId);
                return <li key={plantId}>{plant ? plant.name : plantId}</li>;
              })}
            </ul>
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.buttonSecondary} onClick={() => setStep(2)}>
              Back
            </button>
            <button
              className={styles.button}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Start Learning'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
