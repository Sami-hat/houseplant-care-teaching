import Link from 'next/link';
import styles from './concept-card.module.css';

export function ConceptCard({ concept, plantId }) {
  const href = plantId
    ? `/lesson/${concept.id}?plant=${plantId}`
    : `/lesson/${concept.id}`;

  return (
    <Link href={href} className={styles.card}>
      <h3 className={styles.name}>{concept.name}</h3>
      <p className={styles.description}>{concept.description}</p>
    </Link>
  );
}
