import Link from 'next/link';
import styles from './concept-card.module.css';

export function ConceptCard({ concept, mastery, locked, isNext }) {
  if (locked) {
    return (
      <div className={`${styles.card} ${styles.locked}`}>
        <div className={styles.header}>
          <h3 className={styles.name}>{concept.name}</h3>
          <span className={styles.lockIcon}>🔒</span>
        </div>
        <p className={styles.description}>{concept.description}</p>
      </div>
    );
  }

  return (
    <Link href={`/lesson/${concept.id}`} className={`${styles.card} ${isNext ? styles.recommended : ''}`}>
      <div className={styles.header}>
        <h3 className={styles.name}>{concept.name}</h3>
        <span className={styles.mastery}>{mastery}%</span>
      </div>
      <p className={styles.description}>{concept.description}</p>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${mastery}%` }} />
      </div>
      {isNext && <span className={styles.badge}>Recommended</span>}
    </Link>
  );
}
