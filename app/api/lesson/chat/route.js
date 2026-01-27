import { streamText, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { userEnvironment, userPlants, userKnowledge } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { buildLessonSystemPrompt } from '@/lib/prompts';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response('Unauthorised', { status: 401 });
    }

    const { messages, conceptId } = await req.json();
    const userId = session.user.id;

    // Fetch learner context
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
    for (const row of knowledgeRows) {
      knowledge[row.conceptId] = row.mastery || 0;
    }

    const learnerContext = {
      name: session.user.name || undefined,
      environment: environment || { lightLevel: 'medium', humidity: 'moderate', climate: 'temperate' },
      plants,
      knowledge,
    };

    const systemPrompt = buildLessonSystemPrompt(learnerContext, { conceptId });

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      onFinish: async ({ text }) => {
        // Extract mastery delta from response
        const jsonMatch = text.match(/\{"understood":\s*(true|false),\s*"mastery_delta":\s*(-?\d+)\}/);

        if (jsonMatch) {
          const masteryDelta = parseInt(jsonMatch[2], 10);

          // Check if knowledge row exists
          const current = await db.query.userKnowledge.findFirst({
            where: and(
              eq(userKnowledge.userId, userId),
              eq(userKnowledge.conceptId, conceptId)
            ),
          });

          const newMastery = Math.min(100, Math.max(0, (current?.mastery || 0) + masteryDelta));

          if (current) {
            // Update existing row
            await db.update(userKnowledge)
              .set({
                mastery: newMastery,
                lastPracticed: new Date(),
                timesPracticed: (current.timesPracticed || 0) + 1,
              })
              .where(and(
                eq(userKnowledge.userId, userId),
                eq(userKnowledge.conceptId, conceptId)
              ));
          } else {
            // Insert new row
            await db.insert(userKnowledge).values({
              userId,
              conceptId,
              mastery: newMastery,
              lastPracticed: new Date(),
              timesPracticed: 1,
            });
          }
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Lesson chat error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
