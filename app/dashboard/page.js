import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { userEnvironment, userPlants, userKnowledge } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { selectNextConcept, CONCEPTS, getUnlockedTiers } from '@/lib/concepts';
import { PlantCard } from '@/components/plant-card';
import { ConceptCard } from '@/components/concept-card';
import styles from './dashboard.module.css';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  if (!session.user.onboardingComplete) {
    redirect('/onboarding');
  }

  const userId = session.user.id;

  const environment = await db.query.userEnvironment.findFirst({
    where: eq(userEnvironment.userId, userId),
  });

  const plants = await db.query.userPlants.findMany({
    where: eq(userPlants.userId, userId),
  });

  const knowledgeRows = await db.query.userKnowledge.findMany({
    where: eq(userKnowledge.userId, userId),
  });

  const knowledge = {};
  const lastPracticed = {};

  for (const row of knowledgeRows) {
    knowledge[row.conceptId] = row.mastery || 0;
    if (row.lastPracticed) {
      lastPracticed[row.conceptId] = row.lastPracticed;
    }
  }

  const nextConceptId = selectNextConcept(knowledge, lastPracticed);
  const unlockedTiers = getUnlockedTiers(knowledge);

  const conceptsByTier = {
    1: Object.values(CONCEPTS).filter(c => c.tier === 1),
    2: Object.values(CONCEPTS).filter(c => c.tier === 2),
    3: Object.values(CONCEPTS).filter(c => c.tier === 3),
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.greeting}>Hello, {session.user.name?.split(' ')[0] || 'Friend'}!</h1>
          <p className={styles.subtitle}>Ready to learn about your plants?</p>
        </div>
        <Link href="/api/auth/signout" className={styles.signOut}>Sign out</Link>
      </header>

      <div className={styles.actions}>
        <Link href={`/lesson/${nextConceptId}`} className={styles.primaryAction}>
          Continue Learning
          <span className={styles.actionSubtext}>{CONCEPTS[nextConceptId].name}</span>
        </Link>
        <Link href="/diagnose" className={styles.secondaryAction}>
          Diagnose a Problem
        </Link>
      </div>

      <div className={styles.content}>
        <section className={styles.plantsSection}>
          <div className={styles.sectionHeader}>
            <h2>My Plants</h2>
            <Link href="/plants" className={styles.manageLink}>Manage</Link>
          </div>
          {plants.length === 0 ? (
            <p className={styles.emptyState}>No plants added yet.</p>
          ) : (
            <div className={styles.plantGrid}>
              {plants.map(plant => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          )}
        </section>

        <section className={styles.progressSection}>
          <h2>Learning Progress</h2>

          {[1, 2, 3].map(tier => (
            <div key={tier} className={styles.tierGroup}>
              <h3 className={styles.tierTitle}>
                {tier === 1 && 'Fundamentals'}
                {tier === 2 && 'Intermediate'}
                {tier === 3 && 'Advanced'}
                {!unlockedTiers.includes(tier) && ' (Locked)'}
              </h3>
              <div className={styles.conceptGrid}>
                {conceptsByTier[tier].map(concept => (
                  <ConceptCard
                    key={concept.id}
                    concept={concept}
                    mastery={knowledge[concept.id] || 0}
                    locked={!unlockedTiers.includes(tier)}
                    isNext={concept.id === nextConceptId}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
