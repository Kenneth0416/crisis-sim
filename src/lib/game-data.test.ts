import { describe, expect, it } from 'vitest';
import { SCENARIOS } from './game-data';

describe('SCENARIOS', () => {
  it('matches the expected scenario/action structure', () => {
    expect(Array.isArray(SCENARIOS)).toBe(true);
    expect(SCENARIOS.length).toBeGreaterThan(0);

    const scenarioIds = new Set<number>();

    for (const scenario of SCENARIOS) {
      expect(typeof scenario.id).toBe('number');
      expect(scenarioIds.has(scenario.id)).toBe(false);
      scenarioIds.add(scenario.id);

      expect(typeof scenario.title).toBe('string');
      expect(scenario.title.length).toBeGreaterThan(0);
      expect(typeof scenario.subtitle).toBe('string');
      expect(scenario.subtitle.length).toBeGreaterThan(0);
      expect(typeof scenario.description).toBe('string');
      expect(scenario.description.length).toBeGreaterThan(0);
      expect(Array.isArray(scenario.actions)).toBe(true);
      expect(scenario.actions.length).toBeGreaterThan(0);

      const actionIds = new Set<number>();

      for (const action of scenario.actions) {
        expect(typeof action.id).toBe('number');
        expect(actionIds.has(action.id)).toBe(false);
        actionIds.add(action.id);

        expect(typeof action.name).toBe('string');
        expect(action.name.length).toBeGreaterThan(0);
        expect(typeof action.posture).toBe('string');
        expect(action.posture.length).toBeGreaterThan(0);
        expect(typeof action.postureColor).toBe('string');
        expect(action.postureColor.length).toBeGreaterThan(0);
        expect(typeof action.icon).toBe('string');
        expect(action.icon.length).toBeGreaterThan(0);

        expect(Array.isArray(action.consequences)).toBe(true);
        expect(action.consequences.length).toBeGreaterThan(0);
        expect(Array.isArray(action.consequenceColors)).toBe(true);
        expect(action.consequenceColors.length).toBe(action.consequences.length);

        expect(Array.isArray(action.reactions)).toBe(true);
        expect(action.reactions.length).toBeGreaterThan(0);

        expect(Number.isFinite(action.scores.economy)).toBe(true);
        expect(Number.isFinite(action.scores.environment)).toBe(true);
        expect(Number.isFinite(action.scores.legitimacy)).toBe(true);
        expect(Number.isFinite(action.scores.resilience)).toBe(true);
      }
    }
  });
});
