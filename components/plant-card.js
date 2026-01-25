import styles from './plant-card.module.css';

export function PlantCard({ plant }) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>🌿</div>
      <div className={styles.info}>
        <h3 className={styles.name}>{plant.plantType}</h3>
        {plant.nickname && (
          <p className={styles.nickname}>"{plant.nickname}"</p>
        )}
      </div>
    </div>
  );
}
