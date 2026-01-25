import styles from './progress-bar.module.css';

export function ProgressBar({ label, value, tier, locked }) {
  return (
    <div className={`${styles.container} ${locked ? styles.locked : ''}`}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{locked ? 'Locked' : `${value}%`}</span>
      </div>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${locked ? 0 : value}%` }}
        />
      </div>
    </div>
  );
}
