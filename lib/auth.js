import { getServerSession } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, user.email),
      });

      if (!existingUser) {
        await db.insert(users).values({
          id: nanoid(),
          email: user.email,
          name: user.name,
          onboardingComplete: false,
        });
      }

      return true;
    },
    async session({ session, token }) {
      if (token?.email) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, token.email),
        });
        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.onboardingComplete = dbUser.onboardingComplete;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
  },
};

export async function auth() {
  return getServerSession(authOptions);
}
