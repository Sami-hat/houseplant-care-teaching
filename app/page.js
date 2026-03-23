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
            <h3>Instant Plant Care Info</h3>
            <p>Get tailored care guides for every plant you own, instantly</p>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🎯</span>
            <h3>Plant-Specific Guides</h3>
            <p>Focus on one plant at a time or get advice across your whole collection</p>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🩺</span>
            <h3>Plant Doctor</h3>
            <p>Get help diagnosing and treating plant problems</p>
          </div>
        </div>

        <div className={styles.signInButtons}>
          <a href="/api/auth/signin/github" className={styles.signInButton}>
            Sign in with GitHub
          </a>
          <a href="/api/auth/signin/google" className={styles.signInButtonGoogle}>
            Sign in with Google
          </a>
        </div>
      </div>
    </main>
  );
}
