import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import styles from './page.module.css';

export default async function HomePage() {
  const session = await auth();

  if (session) {
    if (session.user.onboardingComplete) {
      redirect('/dashboard');
    } else {
      redirect('/onboarding');
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Bloomwise</h1>
        <p className={styles.tagline}>Learn to care for your houseplants with personalised AI lessons</p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🌱</span>
            <h3>Personalised Learning</h3>
            <p>Lessons tailored to the plants you own and your home environment</p>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📚</span>
            <h3>Track Your Progress</h3>
            <p>Master plant care concepts from basics to advanced techniques</p>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🩺</span>
            <h3>Plant Doctor</h3>
            <p>Get help diagnosing and treating plant problems</p>
          </div>
        </div>

        <a href="/api/auth/signin/github" className={styles.signInButton}>
          Sign in with GitHub
        </a>
      </div>
    </main>
  );
}
