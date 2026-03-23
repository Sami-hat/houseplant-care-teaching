import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { userEnvironment, userPlants } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { CONCEPTS } from '@/lib/concepts';
import { PlantCard } from '@/components/plant-card';
import { ConceptCard } from '@/components/concept-card';
import { PlantSelector } from '@/components/plant-selector';
import styles from './dashboard.module.css';

export default async function DashboardPage({ searchParams }) {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  if (!session.user.onboardingComplete) {
    redirect('/onboarding');
  }

  const userId = session.user.id;
  const { plant: selectedPlantId } = await searchParams;

  const [environment, plants] = await Promise.all([
    db.query.userEnvironment.findFirst({ where: eq(userEnvironment.userId, userId) }),
    db.query.userPlants.findMany({ where: eq(userPlants.userId, userId) }),
  ]);

  const concepts = Object.values(CONCEPTS);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.greeting}>Hello, {session.user.name?.split(' ')[0] || 'Friend'}!</h1>
          <p className={styles.subtitle}>What would you like to learn about today?</p>
        </div>
        <Link href="/api/auth/signout" className={styles.signOut}>Sign out</Link>
      </header>

      <div className={styles.body}>
        <PlantSelector plants={plants} selectedPlantId={selectedPlantId || null} />

        <Link href="/diagnose" className={styles.diagnoseAction}>
          🩺 Diagnose a Problem
        </Link>

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

          <section className={styles.guidesSection}>
            <h2>Care Guides</h2>
            <div className={styles.conceptGrid}>
              {concepts.map(concept => (
                <ConceptCard
                  key={concept.id}
                  concept={concept}
                  plantId={selectedPlantId || null}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
