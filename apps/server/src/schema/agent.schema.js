/**
 * @file agent.schema.js
 * @description Zod schema definitions for agent input/output structures (Router, Builder, Reviewer states and messages).
 */

const { z } = require('zod');

/** Schema for Router Agent output structure */
const routerOutputSchema = z.object({
  intent: z.enum(['generate', 'edit', 'explain', 'debug', 'off_topic']),
  stack: z.enum(['vanilla', 'react-tailwind']).optional(),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
});

/** Schema for Builder Agent output structure */
const builderOutputSchema = z.object({
  summary: z.string(),
  filesToCreate: z.array(z.object({
    path: z.string(),
    content: z.string(),
  })),
  filesToModify: z.array(z.object({
    path: z.string(),
    content: z.string(),
  })),
  filesToDelete: z.array(z.string()),
});

/** Schema for Reviewer Agent output structure */
const reviewerOutputSchema = z.object({
  approved: z.boolean(),
  issues: z.array(z.string()),
  suggestions: z.array(z.string()),
});

module.exports = {
  routerOutputSchema,
  builderOutputSchema,
  reviewerOutputSchema,
};
