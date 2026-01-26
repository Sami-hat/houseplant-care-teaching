import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { userEnvironment, userPlants, userKnowledge, users } from '@/db/schema';
import { CONCEPTS } from '@/lib/concepts';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const { environment, plants } = await req.json();

  // Save environment
  await db.insert(userEnvironment).values({
    userId: session.user.id,
    lightLevel: environment.lightLevel,
    humidity: environment.humidity,
    climate: environment.climate,
  }).onConflictDoUpdate({
    target: userEnvironment.userId,
    set: {
      lightLevel: environment.lightLevel,
      humidity: environment.humidity,
      climate: environment.climate,
    },
  });

  // Save plants
  for (const plant of plants) {
    await db.insert(userPlants).values({
      id: nanoid(),
      userId: session.user.id,
      plantType: plant.plantType,
      nickname: plant.nickname || null,
    });
  }

  // Initialise knowledge state for all concepts
  for (const conceptId of Object.keys(CONCEPTS)) {
    await db.insert(userKnowledge).values({
      userId: session.user.id,
      conceptId,
      mastery: 0,
      timesPracticed: 0,
    }).onConflictDoNothing();
  }

  // Mark onboarding complete
  await db.update(users)
    .set({ onboardingComplete: true })
    .where(eq(users.id, session.user.id));

  return NextResponse.json({ success: true });
}
