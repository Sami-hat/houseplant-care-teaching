import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { OnboardingForm } from '@/components/onboarding-form';

export default async function OnboardingPage() {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  if (session.user.onboardingComplete) {
    redirect('/dashboard');
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem 1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Welcome to Bloomwise</h1>
      <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>
        Let&apos;s set up your profile to personalise your learning experience.
      </p>
      <OnboardingForm />
    </main>
  );
}
