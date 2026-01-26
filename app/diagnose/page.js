import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { ChatInterface } from '@/components/chat-interface';
import styles from './diagnose.module.css';

export default async function DiagnosePage() {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  if (!session.user.onboardingComplete) {
    redirect('/onboarding');
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.backLink}>← Back to Dashboard</Link>
        <div className={styles.info}>
          <h1 className={styles.title}>Plant Doctor</h1>
          <p className={styles.subtitle}>Describe what&apos;s happening with your plant and I&apos;ll help diagnose the problem.</p>
        </div>
      </header>

      <div className={styles.chatContainer}>
        <ChatInterface
          apiEndpoint="/api/diagnose/chat"
          initialMessage="Hello! I'm here to help diagnose any problems with your plants. What symptoms are you noticing? Please describe what's happening - are there any changes to the leaves, stems, or soil?"
          placeholder="Describe your plant's symptoms..."
        />
      </div>
    </main>
  );
}
