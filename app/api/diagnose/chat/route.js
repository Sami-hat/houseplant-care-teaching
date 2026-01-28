import { streamText, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { userEnvironment, userPlants } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { buildDiagnosisSystemPrompt } from '@/lib/prompts';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response('Unauthorised', { status: 401 });
    }

    const { messages } = await req.json();
    const userId = session.user.id;

    const environment = await db.query.userEnvironment.findFirst({
      where: eq(userEnvironment.userId, userId),
    });

    const plants = await db.query.userPlants.findMany({
      where: eq(userPlants.userId, userId),
    });

    const learnerContext = {  
      environment: environment || { lightLevel: 'medium', humidity: 'moderate', climate: 'temperate' },
      plants,
      knowledge: {},
    };

    const systemPrompt = buildDiagnosisSystemPrompt(learnerContext);

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Diagnosis chat error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
