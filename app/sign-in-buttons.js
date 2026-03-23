'use client';
import { signIn } from 'next-auth/react';
import styles from './page.module.css';

export default function SignInButtons() {
  return (
    <div className={styles.signInButtons}>
      <button onClick={() => signIn('github')} className={styles.signInButton}>
        Sign in with GitHub
      </button>
      <button onClick={() => signIn('google')} className={styles.signInButtonGoogle}>
        Sign in with Google
      </button>
    </div>
  );
}
