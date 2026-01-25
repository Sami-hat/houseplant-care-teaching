import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { userEnvironment, userPlants, userKnowledge } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { selectNextConcept, CONCEPTS } from '@/lib/concepts';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const userId = session.user.id;

  const environment = await db.query.userEnvironment.findFirst({
    where: eq(userEnvironment.userId, userId),
  });

  const plants = await db.query.userPlants.findMany({
    where: eq(userPlants.userId, userId),
  });

  const knowledgeRows = await db.query.userKnowledge.findMany({
    where: eq(userKnowledge.userId, userId),
  });

  const knowledge = {};
  const lastPracticed = {};

  for (const row of knowledgeRows) {
    knowledge[row.conceptId] = row.mastery || 0;
    if (row.lastPracticed) {
      lastPracticed[row.conceptId] = row.lastPracticed;
    }
  }

  const nextConceptId = selectNextConcept(knowledge, lastPracticed);
  const nextConcept = CONCEPTS[nextConceptId];

  return NextResponse.json({
    environment,
    plants,
    knowledge,
    nextConcept,
    concepts: CONCEPTS,
  });
}
