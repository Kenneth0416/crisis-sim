import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

interface Scores {
  economy: number;
  environment: number;
  legitimacy: number;
  resilience: number;
}

interface GameEvent {
  event_time: string;
  event_type: string;
  page_id: string;
  payload_json: Record<string, unknown>;
  client_ms_since_start: number;
}

interface GameState {
  // Session
  sessionId: string;
  studentId: string;
  studentName: string;
  startTime: number;
  consentGiven: boolean;

  // Mini game results
  mg1Result: { answers: Record<string, string[]> } | null;
  mg2Result: { answers: Record<number, string[]> } | null;
  mg3Result: { ranking: Record<string, number> } | null;
  mg4Result: { ranking: Record<string, number> } | null;

  // Scenario results
  scenarioChoices: Record<number, number>; // scenario_id -> action_id
  scores: Scores;

  // Events log
  events: GameEvent[];

  // Actions
  initSession: (studentId: string, name: string) => void;
  setConsent: (consent: boolean) => void;
  setMg1Result: (result: GameState['mg1Result']) => void;
  setMg2Result: (result: GameState['mg2Result']) => void;
  setMg3Result: (result: GameState['mg3Result']) => void;
  setMg4Result: (result: GameState['mg4Result']) => void;
  setScenarioChoice: (scenarioId: number, actionId: number, scoreDelta: Scores) => void;
  addEvent: (type: string, pageId: string, payload: Record<string, unknown>) => void;
  getElapsedMs: () => number;
  reset: () => void;
}

const initialScores: Scores = { economy: 50, environment: 50, legitimacy: 50, resilience: 50 };

export const useGameStore = create<GameState>((set, get) => ({
  sessionId: '',
  studentId: '',
  studentName: '',
  startTime: 0,
  consentGiven: false,
  mg1Result: null,
  mg2Result: null,
  mg3Result: null,
  mg4Result: null,
  scenarioChoices: {},
  scores: { ...initialScores },
  events: [],

  initSession: (studentId, name) => set({
    sessionId: uuidv4(),
    studentId,
    studentName: name,
    startTime: Date.now(),
    consentGiven: false,
    mg1Result: null,
    mg2Result: null,
    mg3Result: null,
    mg4Result: null,
    scenarioChoices: {},
    scores: { ...initialScores },
    events: [],
  }),

  setConsent: (consent) => set({ consentGiven: consent }),

  setMg1Result: (result) => set({ mg1Result: result }),
  setMg2Result: (result) => set({ mg2Result: result }),
  setMg3Result: (result) => set({ mg3Result: result }),
  setMg4Result: (result) => set({ mg4Result: result }),

  setScenarioChoice: (scenarioId, actionId, scoreDelta) => set((state) => ({
    scenarioChoices: { ...state.scenarioChoices, [scenarioId]: actionId },
    scores: {
      economy: Math.max(0, Math.min(100, state.scores.economy + scoreDelta.economy)),
      environment: Math.max(0, Math.min(100, state.scores.environment + scoreDelta.environment)),
      legitimacy: Math.max(0, Math.min(100, state.scores.legitimacy + scoreDelta.legitimacy)),
      resilience: Math.max(0, Math.min(100, state.scores.resilience + scoreDelta.resilience)),
    },
  })),

  addEvent: (type, pageId, payload) => set((state) => ({
    events: [...state.events, {
      event_time: new Date().toISOString(),
      event_type: type,
      page_id: pageId,
      payload_json: payload,
      client_ms_since_start: Date.now() - state.startTime,
    }],
  })),

  getElapsedMs: () => Date.now() - get().startTime,

  reset: () => set({
    sessionId: '',
    studentId: '',
    studentName: '',
    startTime: 0,
    consentGiven: false,
    mg1Result: null,
    mg2Result: null,
    mg3Result: null,
    mg4Result: null,
    scenarioChoices: {},
    scores: { ...initialScores },
    events: [],
  }),
}));
