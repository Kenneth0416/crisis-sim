// Stakeholders
export const STAKEHOLDERS = ['Engineers', 'Environmental Agency', 'Government', 'Customers'] as const;

export const STAKEHOLDER_INFO: Record<string, { icon: string; primary: string; color: string }> = {
  'Government': { icon: 'gavel', primary: 'Public safety and legal compliance', color: 'blue' },
  'Environmental Agency': { icon: 'eco', primary: 'Minimisation of environmental damage', color: 'emerald' },
  'Engineers': { icon: 'engineering', primary: 'Structural safety and system reliability', color: 'amber' },
  'Customers': { icon: 'shopping_cart', primary: 'Timely delivery and compensation', color: 'purple' },
};

// Mini Game 1: Priority Ranking - concerns list
export const CONCERNS = [
  { id: 'safety', label: 'Immediate safety and risk containment', description: 'Concerns about preventing further harm, accidents, or cascading failures in the short term.' },
  { id: 'compliance', label: 'Legal and regulatory compliance', description: 'Concerns about meeting legal obligations, regulatory requirements, and avoiding penalties or sanctions.' },
  { id: 'economy', label: 'Economic and operational impact', description: 'Concerns about financial losses, operational disruption, compensation costs, and business continuity.' },
  { id: 'environment', label: 'Environmental protection and long-term sustainability', description: 'Concerns about environmental damage, ecological recovery, and long-term sustainability implications.' },
  { id: 'reputation', label: 'Public trust, reputation, and stakeholder confidence', description: 'Concerns about public perception, credibility, and maintaining trust among stakeholders and society.' },
];

// Mini Game 2: Tension Identification - statements with context
export const TENSION_STATEMENTS = [
  {
    id: 1,
    title: 'Compliance vs. Budget Constraints',
    statement: '"A proposed delay in the filter installation will save the department budget significantly, but it directly violates the new compliance agreement signed last month with local regulators."',
    hint: 'Think about who cares most about cost savings versus who enforces legal agreements.',
  },
  {
    id: 2,
    title: 'Safety vs. Production Targets',
    statement: '"The engineering team recommends a full shutdown for safety inspection, but the customer delivery deadline is in 48 hours and any delay will trigger penalty clauses."',
    hint: 'Consider who prioritizes physical safety versus who needs timely delivery.',
  },
  {
    id: 3,
    title: 'Transparency vs. Market Stability',
    statement: '"Releasing the full environmental impact report now would satisfy regulators but could cause a 15% stock price drop based on analyst projections."',
    hint: 'Think about regulatory obligations versus financial stakeholder interests.',
  },
  {
    id: 4,
    title: 'Technical Uncertainty vs. Public Communication',
    statement: '"The company should communicate decisive plans to the public, even if technical assessments are still incomplete."',
    hint: 'Consider engineering caution versus reputational pressure and public trust management.',
  },
  {
    id: 5,
    title: 'Compensation Fairness vs. Financial Sustainability',
    statement: '"Compensation to affected customers should be prioritised immediately, even if it places long-term financial strain on the company."',
    hint: 'Think about immediate stakeholder trust versus long-term business viability.',
  },
];

// Mini Game 3: Information sources
export const INFO_SOURCES = [
  { id: 'media_report', label: 'Media Report', description: 'Information reported by news outlets, including press briefings, eyewitness accounts, and early commentary.', icon: 'live_tv', color: 'purple' },
  { id: 'gov_statement', label: 'Official Government Statement', description: 'Formal statements released by government agencies or port authorities regarding the incident and ongoing response.', icon: 'account_balance', color: 'blue' },
  { id: 'eng_report', label: 'Engineering Assessment Report', description: 'Preliminary technical evaluations conducted by engineers regarding structural safety, system integrity, and operational risk.', icon: 'engineering', color: 'emerald' },
  { id: 'env_assessment', label: 'Environmental Impact Assessment', description: 'Early assessments or estimates regarding potential environmental damage, pollution risks, and ecological consequences.', icon: 'eco', color: 'green' },
  { id: 'internal_briefing', label: 'Industry / Company Internal Briefing', description: 'Internal updates or briefings prepared by the shipping company or industry experts based on available operational data.', icon: 'business', color: 'orange' },
];

// Mini Game 4: Dimensions
export const DIMENSIONS = [
  { id: 'economy', label: 'Economy', abbr: 'ECO', description: 'Financial loss, stock price volatility, investor confidence.', icon: 'attach_money', color: 'blue' },
  { id: 'environment', label: 'Environment', abbr: 'ENV', description: 'Ecological damage, carbon footprint, sustainability targets.', icon: 'eco', color: 'emerald' },
  { id: 'legitimacy', label: 'Legitimacy', abbr: 'LEG', description: 'Public trust, brand reputation, legal compliance.', icon: 'gavel', color: 'purple' },
  { id: 'resilience', label: 'Resilience', abbr: 'RES', description: 'Operational continuity, employee morale, adaptability.', icon: 'shield', color: 'amber' },
];

// Scenarios with actions and score deltas
export interface ScenarioAction {
  id: number;
  name: string;
  posture: string;
  postureColor: string;
  icon: string;
  consequences: string[];
  consequenceColors: string[];
  reactions: string[];
  scores: { economy: number; environment: number; legitimacy: number; resilience: number };
}

export interface Scenario {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  actions: ScenarioAction[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: 'Scenario 1: Immediate Response',
    subtitle: 'Crisis Onset',
    description: 'The bridge collapse has just occurred. Information is incomplete, public attention is intense, and operational uncertainty is high. Any action taken at this stage will shape stakeholder trust and constrain future options.',
    actions: [
      {
        id: 1, name: 'Suspend all operations pending full investigations', posture: 'Precaution-first posture', postureColor: 'blue', icon: 'pause_circle',
        consequences: ['Operations remain halted until technical and environmental assessments are completed', 'Short-term economic losses increase, but safety risks are minimised'], consequenceColors: ['amber', 'red'],
        reactions: [
          'Engineers: Strongly supportive due to safety assurance',
          'Environmental Agency: Supportive of precautionary approach',
          'Government: Cautiously supportive, but concerned about economic impact',
          'Customers: Frustrated by prolonged uncertainty and delays',
        ],
        scores: { economy: -6, environment: 6, legitimacy: 5, resilience: 7 },
      },
      {
        id: 2, name: 'Resume limited operations with enhanced monitoring', posture: 'Balanced risk-management posture', postureColor: 'green', icon: 'tune',
        consequences: ['Partial operations resume under strict monitoring and contingency measures', 'Some risks remain, but disruption is reduced'], consequenceColors: ['green', 'amber'],
        reactions: [
          'Government: Tentatively supportive due to the balance of safety and continuity',
          'Engineers: Cautious, highlighting residual uncertainty',
          'Environmental Agency: Concerned about premature reopening',
          'Customers: Moderately reassured by partial service restoration',
        ],
        scores: { economy: 3, environment: -2, legitimacy: 1, resilience: 2 },
      },
      {
        id: 3, name: 'Prioritise rapid operational recovery', posture: 'Economy-first posture', postureColor: 'red', icon: 'speed',
        consequences: ['Operations resume quickly to minimise disruption and losses', 'Investigations and assessments proceed in parallel'], consequenceColors: ['green', 'amber'],
        reactions: [
          'Customers: Strongly supportive due to service continuity',
          'Government: Concerned about safety and accountability',
          'Engineers: Strongly opposed due to unresolved risks',
          'Environmental Agency: Strongly opposed due to precaution violations',
        ],
        scores: { economy: 7, environment: -7, legitimacy: -4, resilience: -6 },
      },
      {
        id: 4, name: 'Focus on public communication and transparency', posture: 'Legitimacy-first posture', postureColor: 'purple', icon: 'campaign',
        consequences: ['Frequent public updates and stakeholder briefings are prioritised', 'Operational decisions are temporarily deferred'], consequenceColors: ['green', 'amber'],
        reactions: [
          'Government: Supportive of transparency and trust-building',
          'Customers: Reassured by communication, but still concerned about delays',
          'Engineers: Neutral, awaiting technical clarity',
          'Environmental Agency: Neutral, emphasising substance over messaging',
        ],
        scores: { economy: -2, environment: 0, legitimacy: 7, resilience: 2 },
      },
      {
        id: 5, name: 'Allocate resources to immediate environmental containment', posture: 'Environment-first posture', postureColor: 'emerald', icon: 'eco',
        consequences: ['Resources are diverted to prevent potential environmental damage', 'Economic recovery is deprioritised in the short term'], consequenceColors: ['green', 'red'],
        reactions: [
          'Environmental Agency: Strongly supportive',
          'Engineers: Supportive if actions reduce systemic risk',
          'Government: Supportive but concerned about economic costs',
          'Customers: Dissatisfied due to lack of operational focus',
        ],
        scores: { economy: -4, environment: 8, legitimacy: 4, resilience: 5 },
      },
    ],
  },
  {
    id: 2,
    title: 'Scenario 2: Short-Term Recovery & Accountability',
    subtitle: 'Short-Term Stabilization',
    description: 'Initial emergency actions have been taken. Investigations are underway, responsibilities are being clarified, and stakeholders are now focused on accountability, recovery progress, and corrective actions.',
    actions: [
      {
        id: 1, name: 'Fully cooperate with investigations and accept regulatory oversight', posture: 'Compliance-first accountability posture', postureColor: 'green', icon: 'gavel',
        consequences: ['The company provides full access to data and operations', 'Recovery slows, but regulatory clarity improves'], consequenceColors: ['green', 'amber'],
        reactions: [
          'Government: Strongly supportive of accountability',
          'Environmental Agency: Supportive due to transparency',
          'Engineers: Supportive of evidence-based correction',
          'Customers: Concerned about delays and cost implications',
        ],
        scores: { economy: -4, environment: 2, legitimacy: 6, resilience: 3 },
      },
      {
        id: 2, name: 'Negotiate limited penalties to accelerate recovery', posture: 'Pragmatic recovery posture', postureColor: 'orange', icon: 'handshake',
        consequences: ['Faster recovery through negotiated settlements', 'Some accountability concerns remain unresolved'], consequenceColors: ['green', 'amber'],
        reactions: [
          'Government: Mixed, accepts pragmatism, wary of precedent',
          'Customers: Supportive of faster normalisation',
          'Environmental Agency: Concerned about diluted responsibility',
          'Engineers: Neutral, depending on safeguards',
        ],
        scores: { economy: 5, environment: -1, legitimacy: -2, resilience: 1 },
      },
      {
        id: 3, name: 'Implement targeted compensation and remediation programmes', posture: 'Stakeholder-repair posture', postureColor: 'blue', icon: 'volunteer_activism',
        consequences: ['Affected customers and communities receive compensation', 'Environmental remediation plans are launched'], consequenceColors: ['green', 'green'],
        reactions: [
          'Customers: Strongly supportive',
          'Environmental Agency: Supportive of remediation focus',
          'Government: Supportive but concerned about financial strain',
          'Engineers: Neutral',
        ],
        scores: { economy: -3, environment: 4, legitimacy: 4, resilience: 2 },
      },
      {
        id: 4, name: 'Challenge liability and delay accountability measures', posture: 'Defensive legal posture', postureColor: 'red', icon: 'shield',
        consequences: ['Legal exposure is contested', 'Recovery continues amid public criticism'], consequenceColors: ['amber', 'red'],
        reactions: [
          'Government: Critical of avoidance behaviour',
          'Customers: Increasingly distrustful',
          'Environmental Agency: Strongly critical',
          'Engineers: Concerned about unresolved risks',
        ],
        scores: { economy: 2, environment: -3, legitimacy: -6, resilience: -4 },
      },
      {
        id: 5, name: 'Invest in system audits and operational reforms', posture: 'Corrective reform posture', postureColor: 'indigo', icon: 'build',
        consequences: ['Independent audits identify weaknesses', 'Recovery is slower but more robust'], consequenceColors: ['green', 'amber'],
        reactions: [
          'Engineers: Strongly supportive',
          'Government: Supportive of reform',
          'Environmental Agency: Supportive if reforms include safeguards',
          'Customers: Impatient with slower recovery',
        ],
        scores: { economy: -2, environment: 3, legitimacy: 3, resilience: 6 },
      },
    ],
  },
  {
    id: 3,
    title: 'Scenario 3: Long-Term Positioning',
    subtitle: 'Final Decision',
    description: 'The immediate crisis has passed. Recovery is underway. Attention now shifts to long-term strategy, organisational identity, and how the company positions itself for future resilience, sustainability, and stakeholder trust.',
    actions: [
      {
        id: 1, name: 'Invest in long-term, resilient, and sustainable infrastructure', posture: 'Resilience-sustainability transformation posture', postureColor: 'emerald', icon: 'eco',
        consequences: ['Significant investment in safer, greener, and more resilient systems', 'Short-term financial returns are limited, but long-term robustness improves'], consequenceColors: ['green', 'amber'],
        reactions: [
          'Engineers: Strongly supportive of system redesign',
          'Environmental Agency: Strongly supportive of sustainability commitment',
          'Government: Supportive of long-term risk reduction',
          'Customers: Mixed, supportive in principle, concerned about costs',
        ],
        scores: { economy: -2, environment: 6, legitimacy: 4, resilience: 8 },
      },
      {
        id: 2, name: 'Position the company as an industry leader in safety and governance', posture: 'Legitimacy leadership posture', postureColor: 'purple', icon: 'workspace_premium',
        consequences: ['The company advocates for higher industry standards and transparency', 'Reputation improves, but operational flexibility decreases'], consequenceColors: ['green', 'amber'],
        reactions: [
          'Government: Strongly supportive of leadership role',
          'Customers: More confident in long-term reliability',
          'Engineers: Supportive of standardisation',
          'Environmental Agency: Supportive if standards include sustainability',
        ],
        scores: { economy: 1, environment: 2, legitimacy: 7, resilience: 4 },
      },
      {
        id: 3, name: 'Optimise operations for long-term economic competitiveness', posture: 'Efficiency-first market posture', postureColor: 'red', icon: 'trending_up',
        consequences: ['Cost efficiency and competitiveness are prioritised', 'Safety and sustainability investments are selectively implemented'], consequenceColors: ['green', 'red'],
        reactions: [
          'Customers: Supportive due to lower costs',
          'Government: Cautious about risk trade-offs',
          'Engineers: Concerned about long-term robustness',
          'Environmental Agency: Critical of limited sustainability focus',
        ],
        scores: { economy: 6, environment: -4, legitimacy: -3, resilience: -2 },
      },
      {
        id: 4, name: 'Maintain current practices with minimal long-term change', posture: 'Status-quo posture', postureColor: 'slate', icon: 'do_not_disturb',
        consequences: ['The company avoids major reforms', 'Short-term stability is preserved, but vulnerabilities remain'], consequenceColors: ['amber', 'red'],
        reactions: [
          'Government: Neutral but watchful',
          'Customers: Neutral to mildly concerned',
          'Engineers: Concerned about unresolved risks',
          'Environmental Agency: Critical of missed opportunity',
        ],
        scores: { economy: 2, environment: -2, legitimacy: -2, resilience: -3 },
      },
      {
        id: 5, name: 'Embed crisis lessons into organisational learning and training', posture: 'Learning-oriented resilience posture', postureColor: 'blue', icon: 'school',
        consequences: ['Crisis lessons are institutionalised through training and procedures', 'Improves preparedness without major structural overhaul'], consequenceColors: ['green', 'green'],
        reactions: [
          'Engineers: Supportive of learning-based improvement',
          'Government: Supportive of preparedness',
          'Environmental Agency: Moderately supportive',
          'Customers: Neutral, benefits are indirect',
        ],
        scores: { economy: 0, environment: 2, legitimacy: 3, resilience: 5 },
      },
    ],
  },
];

// Reflection questions
export const REFLECTION_QUESTIONS = [
  { id: 1, question: 'On a scale of 1 to 9, how would you rate your overall experience with this game?', low: 'Very Poor', high: 'Excellent' },
  { id: 2, question: 'How effective was this game in enhancing your ability to critically evaluate information or arguments?', low: 'Not Effective', high: 'Highly Effective' },
  { id: 3, question: 'How effective was this game in developing your analytical skills (e.g., breaking down complex information or identifying key components)?', low: 'Not Effective', high: 'Highly Effective' },
  { id: 4, question: 'How effective was this game in improving your ability to synthesise information from multiple sources?', low: 'Not Effective', high: 'Highly Effective' },
  { id: 5, question: 'How effective was this game in helping you form clear and well-structured arguments?', low: 'Not Effective', high: 'Highly Effective' },
  { id: 6, question: 'How effective was this game in improving your ability to develop arguments that are logical, coherent, and valid?', low: 'Not Effective', high: 'Highly Effective' },
];
