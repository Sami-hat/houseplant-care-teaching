'use client';

import { useState } from 'react';
import { COMMON_PLANTS } from '@/lib/plants';
import styles from './plants-manager.module.css';

export function PlantsManager({ initialPlants }) {
  const [plants, setPlants] = useState(initialPlants);
  const [newPlantType, setNewPlantType] = useState('');
  const [newPlantNickname, setNewPlantNickname] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newPlantType.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/plants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plantType: newPlantType,
          nickname: newPlantNickname || null,
        }),
      });

      if (res.ok) {
        const { plant } = await res.json();
        setPlants([...plants, plant]);
        setNewPlantType('');
        setNewPlantNickname('');
      }
    } catch (error) {
      console.error('Error adding plant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (plantId) => {
    if (!confirm('Are you sure you want to remove this plant?')) return;

    try {
      const res = await fetch(`/api/plants?id=${plantId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPlants(plants.filter(p => p.id !== plantId));
      }
    } catch (error) {
      console.error('Error deleting plant:', error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleAdd} className={styles.addForm}>
        <h2>Add a new plant</h2>
        <div className={styles.formRow}>
          <select
            value={newPlantType}
            onChange={(e) => setNewPlantType(e.target.value)}
            className={styles.select}
          >
            <option value="">Select a plant type...</option>
            {COMMON_PLANTS.map(plant => (
              <option key={plant.id} value={plant.name}>{plant.name}</option>
            ))}
            <option value="__custom">Other (custom)</option>
          </select>

          {newPlantType === '__custom' && (
            <input
              type="text"
              placeholder="Enter plant name"
              onChange={(e) => setNewPlantType(e.target.value)}
              className={styles.input}
            />
          )}

          <input
            type="text"
            placeholder="Nickname (optional)"
            value={newPlantNickname}
            onChange={(e) => setNewPlantNickname(e.target.value)}
            className={styles.input}
          />

          <button type="submit" disabled={loading || !newPlantType.trim()} className={styles.addButton}>
            {loading ? 'Adding...' : 'Add Plant'}
          </button>
        </div>
      </form>

      <div className={styles.plantsList}>
        <h2>Your plants ({plants.length})</h2>
        {plants.length === 0 ? (
          <p className={styles.empty}>No plants yet. Add your first plant above!</p>
        ) : (
          <div className={styles.grid}>
            {plants.map(plant => (
              <div key={plant.id} className={styles.plantCard}>
                <div className={styles.plantIcon}>🌿</div>
                <div className={styles.plantInfo}>
                  <h3>{plant.plantType}</h3>
                  {plant.nickname && <p className={styles.nickname}>"{plant.nickname}"</p>}
                </div>
                <button
                  onClick={() => handleDelete(plant.id)}
                  className={styles.deleteButton}
                  title="Remove plant"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
