import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { userPlants } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { PlantsManager } from '@/components/plants-manager';
import styles from './plants.module.css';

export default async function PlantsPage() {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  if (!session.user.onboardingComplete) {
    redirect('/onboarding');
  }

  const plants = await db.query.userPlants.findMany({
    where: eq(userPlants.userId, session.user.id),
  });

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.backLink}>← Back to Dashboard</Link>
        <h1 className={styles.title}>My Plants</h1>
        <p className={styles.subtitle}>Manage your plant collection</p>
      </header>

      <div className={styles.content}>
        <PlantsManager initialPlants={plants} />
      </div>
    </main>
  );
}
