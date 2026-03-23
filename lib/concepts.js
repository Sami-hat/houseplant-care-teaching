export const CONCEPTS = {
  'light-requirements': {
    id: 'light-requirements',
    name: 'Light Requirements',
    description: 'Understanding direct, indirect, and low light needs',
  },
  'watering-basics': {
    id: 'watering-basics',
    name: 'Watering Basics',
    description: 'When and how much to water',
  },
  'soil-drainage': {
    id: 'soil-drainage',
    name: 'Soil and Drainage',
    description: 'Soil types, drainage holes, root health',
  },
  'humidity': {
    id: 'humidity',
    name: 'Humidity Management',
    description: 'Humidity needs and how to increase it',
  },
  'fertilising': {
    id: 'fertilising',
    name: 'Fertilising',
    description: 'NPK ratios, when to feed, signs of deficiency',
  },
  'repotting': {
    id: 'repotting',
    name: 'Repotting',
    description: 'When and how to repot, root bound signs',
  },
  'seasonal-care': {
    id: 'seasonal-care',
    name: 'Seasonal Adjustments',
    description: 'How care changes through the year',
  },
  'propagation': {
    id: 'propagation',
    name: 'Propagation',
    description: 'Cuttings, division, water propagation',
  },
  'pest-identification': {
    id: 'pest-identification',
    name: 'Pest Identification',
    description: 'Common pests and treatment',
  },
  // 'disease-diagnosis': {
  //   id: 'disease-diagnosis',
  //   name: 'Disease Diagnosis',
  //   description: 'Root rot, fungal issues, bacterial problems',
  // },
};

export function selectNextConcept(knowledge = {}, lastPracticed = {}) {
  const conceptIds = Object.keys(CONCEPTS);

  return conceptIds.sort((a, b) => {
    const masteryA = knowledge[a] ?? 0;
    const masteryB = knowledge[b] ?? 0;
    if (masteryA !== masteryB) return masteryA - masteryB;

    const timeA = lastPracticed[a] ? new Date(lastPracticed[a]).getTime() : 0;
    const timeB = lastPracticed[b] ? new Date(lastPracticed[b]).getTime() : 0;
    return timeA - timeB;
  })[0];
}
