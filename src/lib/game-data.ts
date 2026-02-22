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
  reaction: string;
  reactionIcon: string;
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
        id: 1, name: 'Suspend All Operations', posture: 'Precaution-First', postureColor: 'blue', icon: 'pause_circle',
        consequences: ['Operations halted until assessments complete', 'Short-term economic losses increase'], consequenceColors: ['amber', 'red'],
        reaction: 'Safety-Focused', reactionIcon: 'verified_user',
        scores: { economy: -6, environment: 6, legitimacy: 5, resilience: 7 },
      },
      {
        id: 2, name: 'Resume Limited Operations', posture: 'Balanced', postureColor: 'green', icon: 'tune',
        consequences: ['Partial operations under strict monitoring', 'Some risks remain but disruption reduced'], consequenceColors: ['green', 'amber'],
        reaction: 'Cautiously Optimistic', reactionIcon: 'sentiment_neutral',
        scores: { economy: 3, environment: -2, legitimacy: 1, resilience: 2 },
      },
      {
        id: 3, name: 'Prioritise Rapid Recovery', posture: 'Economy-First', postureColor: 'red', icon: 'speed',
        consequences: ['Operations resume quickly', 'Investigations proceed in parallel'], consequenceColors: ['green', 'amber'],
        reaction: 'Divided', reactionIcon: 'thumbs_up_down',
        scores: { economy: 7, environment: -7, legitimacy: -4, resilience: -6 },
      },
      {
        id: 4, name: 'Public Communication Focus', posture: 'Legitimacy-First', postureColor: 'purple', icon: 'campaign',
        consequences: ['Frequent public updates prioritised', 'Operational decisions temporarily deferred'], consequenceColors: ['green', 'amber'],
        reaction: 'Trust-Building', reactionIcon: 'sentiment_satisfied',
        scores: { economy: -2, environment: 0, legitimacy: 7, resilience: 2 },
      },
      {
        id: 5, name: 'Environmental Containment', posture: 'Environment-First', postureColor: 'emerald', icon: 'eco',
        consequences: ['Resources diverted to prevent environmental damage', 'Economic recovery deprioritised'], consequenceColors: ['green', 'red'],
        reaction: 'Environmentally Responsible', reactionIcon: 'park',
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
        id: 1, name: 'Full Regulatory Cooperation', posture: 'Compliance-First', postureColor: 'green', icon: 'gavel',
        consequences: ['Full access to data and operations provided', 'Recovery slows but regulatory clarity improves'], consequenceColors: ['green', 'amber'],
        reaction: 'Accountable', reactionIcon: 'verified',
        scores: { economy: -4, environment: 2, legitimacy: 6, resilience: 3 },
      },
      {
        id: 2, name: 'Negotiate Limited Penalties', posture: 'Pragmatic', postureColor: 'orange', icon: 'handshake',
        consequences: ['Faster recovery through negotiated settlements', 'Some accountability concerns unresolved'], consequenceColors: ['green', 'amber'],
        reaction: 'Wary', reactionIcon: 'sentiment_neutral',
        scores: { economy: 5, environment: -1, legitimacy: -2, resilience: 1 },
      },
      {
        id: 3, name: 'Targeted Compensation & Remediation', posture: 'Stakeholder-Repair', postureColor: 'blue', icon: 'volunteer_activism',
        consequences: ['Affected customers and communities compensated', 'Environmental remediation plans launched'], consequenceColors: ['green', 'green'],
        reaction: 'Supportive', reactionIcon: 'sentiment_satisfied',
        scores: { economy: -3, environment: 4, legitimacy: 4, resilience: 2 },
      },
      {
        id: 4, name: 'Challenge Liability', posture: 'Defensive Legal', postureColor: 'red', icon: 'shield',
        consequences: ['Legal exposure contested', 'Recovery continues amid public criticism'], consequenceColors: ['amber', 'red'],
        reaction: 'Distrustful', reactionIcon: 'sentiment_dissatisfied',
        scores: { economy: 2, environment: -3, legitimacy: -6, resilience: -4 },
      },
      {
        id: 5, name: 'System Audits & Reforms', posture: 'Corrective Reform', postureColor: 'indigo', icon: 'build',
        consequences: ['Independent audits identify weaknesses', 'Recovery slower but more robust'], consequenceColors: ['green', 'amber'],
        reaction: 'Reform-Minded', reactionIcon: 'engineering',
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
        id: 1, name: 'Resilient & Sustainable Infrastructure', posture: 'Resilience-Sustainability', postureColor: 'emerald', icon: 'eco',
        consequences: ['Significant investment in safer, greener systems', 'Short-term returns limited, long-term robustness improves'], consequenceColors: ['green', 'amber'],
        reaction: 'Impressed', reactionIcon: 'sentiment_satisfied',
        scores: { economy: -2, environment: 6, legitimacy: 4, resilience: 8 },
      },
      {
        id: 2, name: 'Industry Safety & Governance Leader', posture: 'Legitimacy Leadership', postureColor: 'purple', icon: 'workspace_premium',
        consequences: ['Advocates for higher industry standards', 'Reputation improves, operational flexibility decreases'], consequenceColors: ['green', 'amber'],
        reaction: 'Confident', reactionIcon: 'thumb_up',
        scores: { economy: 1, environment: 2, legitimacy: 7, resilience: 4 },
      },
      {
        id: 3, name: 'Optimise Economic Competitiveness', posture: 'Efficiency-First', postureColor: 'red', icon: 'trending_up',
        consequences: ['Cost efficiency and competitiveness prioritised', 'Safety and sustainability selectively implemented'], consequenceColors: ['green', 'red'],
        reaction: 'Cautious', reactionIcon: 'sentiment_neutral',
        scores: { economy: 6, environment: -4, legitimacy: -3, resilience: -2 },
      },
      {
        id: 4, name: 'Maintain Status Quo', posture: 'Status Quo', postureColor: 'slate', icon: 'do_not_disturb',
        consequences: ['Major reforms avoided', 'Short-term stability preserved, vulnerabilities remain'], consequenceColors: ['amber', 'red'],
        reaction: 'Watchful', reactionIcon: 'visibility',
        scores: { economy: 2, environment: -2, legitimacy: -2, resilience: -3 },
      },
      {
        id: 5, name: 'Embed Crisis Lessons', posture: 'Learning-Oriented', postureColor: 'blue', icon: 'school',
        consequences: ['Crisis lessons institutionalised through training', 'Improves preparedness without major structural overhaul'], consequenceColors: ['green', 'green'],
        reaction: 'Supportive', reactionIcon: 'sentiment_satisfied',
        scores: { economy: 0, environment: 2, legitimacy: 3, resilience: 5 },
      },
    ],
  },
];

// Reflection questions
export const REFLECTION_QUESTIONS = [
  { id: 1, question: 'On a scale of 1 to 9, how would you rate your overall experience with this intervention?', low: 'Very Poor', high: 'Excellent' },
  { id: 2, question: 'How effective was this intervention in enhancing your ability to critically evaluate information or arguments?', low: 'Not Effective', high: 'Highly Effective' },
  { id: 3, question: 'How effective was this intervention in developing your analytical skills (e.g., breaking down complex information or identifying key components)?', low: 'Not Effective', high: 'Highly Effective' },
  { id: 4, question: 'How effective was this intervention in improving your ability to synthesise information from multiple sources?', low: 'Not Effective', high: 'Highly Effective' },
  { id: 5, question: 'How effective was this intervention in helping you form clear and well-structured arguments?', low: 'Not Effective', high: 'Highly Effective' },
  { id: 6, question: 'How effective was this intervention in improving your ability to develop arguments that are logical, coherent, and valid?', low: 'Not Effective', high: 'Highly Effective' },
];
