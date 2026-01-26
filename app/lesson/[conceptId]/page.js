import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { CONCEPTS } from '@/lib/concepts';
import { ChatInterface } from '@/components/chat-interface';
import styles from './lesson.module.css';

export default async function LessonPage({ params }) {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  if (!session.user.onboardingComplete) {
    redirect('/onboarding');
  }

  const { conceptId } = await params;
  const concept = CONCEPTS[conceptId];

  if (!concept) {
    redirect('/dashboard');
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.backLink}>← Back to Dashboard</Link>
        <div className={styles.lessonInfo}>
          <span className={styles.tier}>Tier {concept.tier}</span>
          <h1 className={styles.title}>{concept.name}</h1>
          <p className={styles.objective}>{concept.objective}</p>
        </div>
      </header>

      <div className={styles.chatContainer}>
        <ChatInterface
          apiEndpoint="/api/lesson/chat"
          conceptId={conceptId}
          autoStart={true}
        />
      </div>
    </main>
  );
}
