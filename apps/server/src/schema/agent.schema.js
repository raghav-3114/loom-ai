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

/**
 * Schema for Design Planner Agent output structure (internal Design Specification).
 * Consumed only by the Builder Agent — never shown to the end user.
 * Every field defaults to a safe placeholder so a partially-formed but valid JSON object
 * from a small/fast model still produces a usable specification instead of hard-failing
 * the whole generation pipeline; a genuine planning failure is an unparseable/non-object response.
 */
const designSpecSchema = z.object({
  normalizedRequest: z.string().default(''),
  projectType: z.string().default('Not specified'),
  designStyle: z.string().default('Not specified'),
  targetAudience: z.string().default('General users'),
  visualTheme: z.string().default('Not specified'),
  colorPalette: z.union([z.string(), z.array(z.string())]).default('Not specified'),
  typography: z.string().default('Not specified'),
  layoutStrategy: z.string().default('Not specified'),
  responsiveStrategy: z.string().default('Desktop, tablet, and mobile breakpoints'),
  navigationStyle: z.string().default('Not specified'),
  componentHierarchy: z.union([z.string(), z.array(z.string())]).default([]),
  requiredSections: z.union([z.string(), z.array(z.string())]).default([]),
  animationRequirements: z.union([z.string(), z.array(z.string())]).default('Subtle transitions'),
  interactionDesign: z.string().default('Not specified'),
  accessibilityRequirements: z.union([z.string(), z.array(z.string())]).default('Semantic HTML, ARIA labels, keyboard navigation'),
  spacingRules: z.string().default('Not specified'),
  gridSystem: z.string().default('Not specified'),
  iconStrategy: z.string().default('Not specified'),
  imageStrategy: z.string().default('Not specified'),
  reusableComponents: z.union([z.string(), z.array(z.string())]).default([]),
  folderStructure: z.union([z.string(), z.array(z.string())]).default([]),
  expectedFiles: z.union([z.string(), z.array(z.string())]).default([]),
  stateRequirements: z.string().default('Not specified'),
  externalLibraries: z.union([z.string(), z.array(z.string())]).default([]),
  designConstraints: z.union([z.string(), z.array(z.string())]).default([]),
  uxGoals: z.union([z.string(), z.array(z.string())]).default([]),
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
  designSpecSchema,
  builderOutputSchema,
  reviewerOutputSchema,
};
