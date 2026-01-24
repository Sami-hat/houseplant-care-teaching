import { pgTable, text, timestamp, boolean, integer, primaryKey } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email'),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
  onboardingComplete: boolean('onboarding_complete').default(false),
});

export const userEnvironment = pgTable('user_environment', {
  userId: text('user_id').primaryKey().references(() => users.id),
  lightLevel: text('light_level'), // 'low', 'medium', 'bright_indirect', 'direct'
  humidity: text('humidity'), // 'low', 'moderate', 'high'
  climate: text('climate'), // 'tropical', 'temperate', 'arid'
});

export const userPlants = pgTable('user_plants', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  plantType: text('plant_type').notNull(),
  nickname: text('nickname'),
  acquiredAt: timestamp('acquired_at'),
  lastWatered: timestamp('last_watered'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const userKnowledge = pgTable('user_knowledge', {
  userId: text('user_id').references(() => users.id).notNull(),
  conceptId: text('concept_id').notNull(),
  mastery: integer('mastery').default(0),
  lastPracticed: timestamp('last_practiced'),
  timesPracticed: integer('times_practiced').default(0),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.conceptId] }),
}));

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  type: text('type').notNull(), // 'lesson', 'diagnosis', 'quiz'
  conceptId: text('concept_id'),
  summary: text('summary'),
  createdAt: timestamp('created_at').defaultNow(),
});
