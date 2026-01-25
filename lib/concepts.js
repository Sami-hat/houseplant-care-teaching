export const CONCEPTS = {
  // Tier 1 - Fundamentals
  'light-requirements': {
    id: 'light-requirements',
    name: 'Light Requirements',
    tier: 1,
    description: 'Understanding direct, indirect, and low light needs',
    objective: 'Learner can identify light requirements for common houseplants and assess their home lighting',
  },
  'watering-basics': {
    id: 'watering-basics',
    name: 'Watering Basics',
    tier: 1,
    description: 'When and how much to water',
    objective: 'Learner understands soil moisture checking and watering frequency factors',
  },
  'soil-drainage': {
    id: 'soil-drainage',
    name: 'Soil and Drainage',
    tier: 1,
    description: 'Soil types, drainage holes, root health',
    objective: 'Learner can select appropriate soil and pots for different plant types',
  },

  // Tier 2 - Intermediate
  'humidity': {
    id: 'humidity',
    name: 'Humidity Management',
    tier: 2,
    description: 'Humidity needs and how to increase it',
    objective: 'Learner can identify humidity-loving plants and implement humidity solutions',
  },
  'fertilising': {
    id: 'fertilising',
    name: 'Fertilising',
    tier: 2,
    description: 'NPK ratios, when to feed, signs of deficiency',
    objective: 'Learner understands fertiliser basics and seasonal feeding schedules',
  },
  'repotting': {
    id: 'repotting',
    name: 'Repotting',
    tier: 2,
    description: 'When and how to repot, root bound signs',
    objective: 'Learner can identify when repotting is needed and execute it properly',
  },
  'seasonal-care': {
    id: 'seasonal-care',
    name: 'Seasonal Adjustments',
    tier: 2,
    description: 'How care changes through the year',
    objective: 'Learner adjusts watering, feeding, and placement by season',
  },

  // Tier 3 - Advanced
  'propagation': {
    id: 'propagation',
    name: 'Propagation',
    tier: 3,
    description: 'Cuttings, division, water propagation',
    objective: 'Learner can propagate common houseplants using appropriate methods',
  },
  'pest-identification': {
    id: 'pest-identification',
    name: 'Pest Identification',
    tier: 3,
    description: 'Common pests and treatment',
    objective: 'Learner can identify spider mites, mealybugs, fungus gnats and treat them',
  },
  'disease-diagnosis': {
    id: 'disease-diagnosis',
    name: 'Disease Diagnosis',
    tier: 3,
    description: 'Root rot, fungal issues, bacterial problems',
    objective: 'Learner can diagnose common diseases and take corrective action',
  },
};

export function getUnlockedTiers(knowledge) {
  const tiers = [1];

  const tier1Concepts = Object.values(CONCEPTS).filter(c => c.tier === 1);
  const tier1Mastery = tier1Concepts.every(c => (knowledge[c.id] || 0) >= 60);
  if (tier1Mastery) tiers.push(2);

  const tier2Concepts = Object.values(CONCEPTS).filter(c => c.tier === 2);
  const tier2Mastery = tier2Concepts.every(c => (knowledge[c.id] || 0) >= 60);
  if (tier2Mastery) tiers.push(3);

  return tiers;
}

export function selectNextConcept(knowledge, lastPracticed) {
  const unlockedTiers = getUnlockedTiers(knowledge);
  const available = Object.values(CONCEPTS).filter(c => unlockedTiers.includes(c.tier));

  // Prioritise lowest mastery, then least recently practiced
  return available.sort((a, b) => {
    const masteryDiff = (knowledge[a.id] || 0) - (knowledge[b.id] || 0);
    if (masteryDiff !== 0) return masteryDiff;

    const aTime = lastPracticed[a.id]?.getTime() || 0;
    const bTime = lastPracticed[b.id]?.getTime() || 0;
    return aTime - bTime;
  })[0].id;
}
