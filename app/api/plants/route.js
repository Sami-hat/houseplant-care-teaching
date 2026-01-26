import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { userPlants } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const plants = await db.query.userPlants.findMany({
    where: eq(userPlants.userId, session.user.id),
  });

  return NextResponse.json({ plants });
}

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const { plantType, nickname } = await req.json();

  const plant = await db.insert(userPlants).values({
    id: nanoid(),
    userId: session.user.id,
    plantType,
    nickname: nickname || null,
  }).returning();

  return NextResponse.json({ plant: plant[0] });
}

export async function DELETE(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const plantId = searchParams.get('id');

  if (!plantId) {
    return NextResponse.json({ error: 'Plant ID required' }, { status: 400 });
  }

  await db.delete(userPlants).where(
    and(
      eq(userPlants.id, plantId),
      eq(userPlants.userId, session.user.id)
    )
  );

  return NextResponse.json({ success: true });
}
