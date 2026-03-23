'use client';

import { useRouter } from 'next/navigation';
import styles from './plant-selector.module.css';

export function PlantSelector({ plants, selectedPlantId }) {
  const router = useRouter();

  function select(plantId) {
    if (plantId) {
      router.push(`/dashboard?plant=${plantId}`);
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <div className={styles.selector}>
      <button
        className={`${styles.pill} ${!selectedPlantId ? styles.active : ''}`}
        onClick={() => select(null)}
      >
        All Plants
      </button>
      {plants.map(plant => (
        <button
          key={plant.id}
          className={`${styles.pill} ${selectedPlantId === plant.id ? styles.active : ''}`}
          onClick={() => select(plant.id)}
        >
          {plant.nickname || plant.plantType}
        </button>
      ))}
    </div>
  );
}
