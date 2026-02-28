import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { calculateScores, clampScore, useGameStore } from './store';

const BASE_SCORE = 50;

describe('store helpers', () => {
  it('calculateScores totals deltas across scenarios', () => {
    const deltas = {
      1: { economy: 3, environment: -2, legitimacy: 1, resilience: 4 },
      2: { economy: -1, environment: 5, legitimacy: 0, resilience: -3 },
    };

    expect(calculateScores(deltas)).toEqual({
      economy: BASE_SCORE + 3 - 1,
      environment: BASE_SCORE - 2 + 5,
      legitimacy: BASE_SCORE + 1 + 0,
      resilience: BASE_SCORE + 4 - 3,
    });
  });

  it('clampScore keeps values within 0-100', () => {
    expect(clampScore(120)).toBe(100);
    expect(clampScore(-12)).toBe(0);
    expect(clampScore(42)).toBe(42);
  });
});

describe('setScenarioChoice', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  afterEach(() => {
    cleanup();
    useGameStore.getState().reset();
  });

  it('updates scores and avoids double-counting when a scenario is reselected', () => {
    const { result } = renderHook(() => useGameStore());

    const initialDelta = { economy: 8, environment: -4, legitimacy: 0, resilience: 3 };
    const secondDelta = { economy: -5, environment: 7, legitimacy: 2, resilience: -2 };
    const replacementDelta = { economy: -10, environment: 0, legitimacy: 4, resilience: 1 };

    act(() => {
      result.current.setScenarioChoice(1, 2, initialDelta);
    });

    expect(result.current.scenarioChoices[1]).toBe(2);
    expect(result.current.scores).toEqual({
      economy: BASE_SCORE + 8,
      environment: BASE_SCORE - 4,
      legitimacy: BASE_SCORE + 0,
      resilience: BASE_SCORE + 3,
    });

    act(() => {
      result.current.setScenarioChoice(2, 1, secondDelta);
    });

    expect(result.current.scenarioChoices[2]).toBe(1);
    expect(result.current.scores).toEqual({
      economy: BASE_SCORE + 8 - 5,
      environment: BASE_SCORE - 4 + 7,
      legitimacy: BASE_SCORE + 0 + 2,
      resilience: BASE_SCORE + 3 - 2,
    });

    act(() => {
      result.current.setScenarioChoice(1, 4, replacementDelta);
    });

    expect(result.current.scenarioChoices[1]).toBe(4);
    expect(result.current.scenarioScoreDeltas[1]).toEqual(replacementDelta);
    expect(result.current.scores).toEqual({
      economy: BASE_SCORE - 10 - 5,
      environment: BASE_SCORE + 0 + 7,
      legitimacy: BASE_SCORE + 4 + 2,
      resilience: BASE_SCORE + 1 - 2,
    });
  });
});

describe('store actions', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  afterEach(() => {
    cleanup();
    useGameStore.getState().reset();
    vi.useRealTimers();
  });

  it('updates mini-game results', () => {
    const { result } = renderHook(() => useGameStore());

    const mg1 = { answers: { q1: ['a', 'b'] } };
    const mg2 = { answers: { 1: ['x'] } };
    const mg3 = { ranking: { alpha: 1 } };
    const mg4 = { ranking: {} };

    act(() => {
      result.current.setMg1Result(mg1);
      result.current.setMg2Result(mg2);
      result.current.setMg3Result(mg3);
      result.current.setMg4Result(mg4);
    });

    expect(result.current.mg1Result).toEqual(mg1);
    expect(result.current.mg2Result).toEqual(mg2);
    expect(result.current.mg3Result).toEqual(mg3);
    expect(result.current.mg4Result).toEqual(mg4);
  });

  it('setConsent toggles the consent flag', () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.setConsent(true);
    });

    expect(result.current.consentGiven).toBe(true);

    act(() => {
      result.current.setConsent(false);
    });

    expect(result.current.consentGiven).toBe(false);
  });

  it('initSession initializes session state and clears previous data', () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.setConsent(true);
      result.current.setMg1Result({ answers: { q1: ['a'] } });
      result.current.setScenarioChoice(1, 2, { economy: 1, environment: 2, legitimacy: 3, resilience: 4 });
    });

    vi.useFakeTimers();
    const sessionStart = new Date('2024-03-10T12:00:00.000Z');
    vi.setSystemTime(sessionStart);

    act(() => {
      result.current.initSession('student-1', 'Ada Lovelace');
    });

    expect(result.current.sessionId).toBeTruthy();
    expect(result.current.studentId).toBe('student-1');
    expect(result.current.studentName).toBe('Ada Lovelace');
    expect(result.current.startTime).toBe(sessionStart.getTime());
    expect(result.current.consentGiven).toBe(false);
    expect(result.current.mg1Result).toBeNull();
    expect(result.current.scenarioChoices).toEqual({});
    expect(result.current.scenarioScoreDeltas).toEqual({});
    expect(result.current.scores).toEqual({
      economy: BASE_SCORE,
      environment: BASE_SCORE,
      legitimacy: BASE_SCORE,
      resilience: BASE_SCORE,
    });
    expect(result.current.events).toEqual([]);
  });

  it('addEvent logs event data with elapsed time', () => {
    const { result } = renderHook(() => useGameStore());

    vi.useFakeTimers();
    const startTime = new Date('2024-03-10T12:00:00.000Z');
    const eventTime = new Date('2024-03-10T12:00:05.000Z');
    vi.setSystemTime(startTime);

    act(() => {
      result.current.initSession('student-2', 'Grace Hopper');
    });

    vi.setSystemTime(eventTime);

    act(() => {
      result.current.addEvent('click', 'landing', { source: 'cta' });
    });

    expect(result.current.events).toHaveLength(1);
    expect(result.current.events[0]).toEqual({
      event_time: eventTime.toISOString(),
      event_type: 'click',
      page_id: 'landing',
      payload_json: { source: 'cta' },
      client_ms_since_start: eventTime.getTime() - startTime.getTime(),
    });
  });

  it('getElapsedMs returns the time since start', () => {
    const { result } = renderHook(() => useGameStore());

    vi.useFakeTimers();
    const startTime = new Date('2024-03-10T12:00:00.000Z');
    const laterTime = new Date('2024-03-10T12:00:12.000Z');
    vi.setSystemTime(startTime);

    act(() => {
      result.current.initSession('student-3', 'Alan Turing');
    });

    vi.setSystemTime(laterTime);

    expect(result.current.getElapsedMs()).toBe(laterTime.getTime() - startTime.getTime());
  });

  it('reset clears session, results, and events', () => {
    const { result } = renderHook(() => useGameStore());

    act(() => {
      result.current.initSession('student-4', 'Katherine Johnson');
      result.current.setConsent(true);
      result.current.setMg2Result({ answers: { 2: ['y'] } });
      result.current.setScenarioChoice(2, 3, { economy: -5, environment: 1, legitimacy: 2, resilience: -1 });
      result.current.addEvent('submit', 'summary', { ok: true });
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.sessionId).toBe('');
    expect(result.current.studentId).toBe('');
    expect(result.current.studentName).toBe('');
    expect(result.current.startTime).toBe(0);
    expect(result.current.consentGiven).toBe(false);
    expect(result.current.mg1Result).toBeNull();
    expect(result.current.mg2Result).toBeNull();
    expect(result.current.mg3Result).toBeNull();
    expect(result.current.mg4Result).toBeNull();
    expect(result.current.scenarioChoices).toEqual({});
    expect(result.current.scenarioScoreDeltas).toEqual({});
    expect(result.current.scores).toEqual({
      economy: BASE_SCORE,
      environment: BASE_SCORE,
      legitimacy: BASE_SCORE,
      resilience: BASE_SCORE,
    });
    expect(result.current.events).toEqual([]);
  });

  it('handles empty inputs and boundary values', () => {
    const { result } = renderHook(() => useGameStore());

    vi.useFakeTimers();
    const sessionStart = new Date('2024-03-10T12:00:00.000Z');
    vi.setSystemTime(sessionStart);

    act(() => {
      result.current.initSession('', '');
      result.current.setMg1Result({ answers: {} });
      result.current.addEvent('', '', {});
    });

    expect(result.current.studentId).toBe('');
    expect(result.current.studentName).toBe('');
    expect(result.current.mg1Result).toEqual({ answers: {} });
    expect(result.current.events[0]).toMatchObject({
      event_type: '',
      page_id: '',
      payload_json: {},
      client_ms_since_start: 0,
    });
    expect(result.current.getElapsedMs()).toBe(0);
  });
});
