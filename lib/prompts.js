import { CONCEPTS } from './concepts';

export function buildLessonSystemPrompt(learner, lesson) {
  const concept = CONCEPTS[lesson.conceptId];

  const focusedPlants = lesson.selectedPlantId
    ? learner.plants.filter(p => p.id === lesson.selectedPlantId)
    : learner.plants;

  const plantList = focusedPlants.length > 0
    ? focusedPlants.map(p => p.nickname ? `${p.plantType} ("${p.nickname}")` : p.plantType).join(', ')
    : learner.plants.map(p => p.nickname ? `${p.plantType} ("${p.nickname}")` : p.plantType).join(', ') || 'None yet';

  const plantContext = lesson.selectedPlantId && focusedPlants.length > 0
    ? `The user is focusing on their ${plantList} right now.`
    : `The user owns: ${plantList}.`;

  return `You are a friendly, knowledgeable houseplant expert giving personalised plant care advice.

OWNER PROFILE:
- Name: ${learner.name || 'Friend'}
- Home environment: ${learner.environment.lightLevel} light, ${learner.environment.humidity} humidity, ${learner.environment.climate} climate
- ${plantContext}

TODAY'S GUIDE: ${concept.name}

INSTRUCTIONS:
1. Explain everything the user needs to know about "${concept.name}" clearly and completely
2. Tailor all advice to their home environment
3. Reference their specific plant(s) when giving examples — make it personal
4. Do NOT ask a comprehension question at the end — just inform them fully
5. After your explanation, invite them to ask any follow-up questions they have
6. Keep responses focused and practical
7. Use UK spelling (e.g., fertiliser, colour)
8. Be warm but not patronising`;
}

export function buildDiagnosisSystemPrompt(learner) {
  const plantList = learner.plants
    .map(p => p.nickname ? `${p.plantType} ("${p.nickname}")` : p.plantType)
    .join(', ');

  return `You are a houseplant doctor helping diagnose plant problems.

OWNER'S PROFILE:
- Home environment: ${learner.environment.lightLevel} light, ${learner.environment.humidity} humidity
- Plants they own: ${plantList}

DIAGNOSIS PROCESS:
1. Ask clarifying questions about symptoms (one at a time)
2. Consider their environment when diagnosing
3. Provide a likely diagnosis with confidence level
4. Give specific treatment steps
5. Suggest preventive measures

Keep responses concise. Use UK spelling.
Be reassuring. Most plant problems are fixable if caught early.`;
}
