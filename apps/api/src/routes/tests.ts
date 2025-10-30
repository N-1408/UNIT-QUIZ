import { Router } from 'express';

const router = Router();

const TESTS = [
  { id: 'starter', title: 'Starter Placement', unit: 'Placement', createdAt: '2025-10-15T10:00:00Z', isNew: true },
  { id: 'unit-1', title: 'Unit 1 - Academic Skills', unit: 'Unit 1', createdAt: '2025-10-10T08:30:00Z', isNew: false },
  { id: 'speaking-lite', title: 'Speaking Lite', unit: 'Speaking', createdAt: '2025-10-05T14:20:00Z', isNew: false }
] as const;

const TEST_DETAILS: Record<string, { id: string; title: string; unit: string; durationSec: number; questions: Array<{ id: string; text: string; options: Array<{ key: string; text: string }> }> }> = {
  starter: {
    id: 'starter',
    title: 'Starter Placement',
    unit: 'Placement',
    durationSec: 600,
    questions: [
      {
        id: 'q1',
        text: 'Choose the synonym of “quick”.',
        options: [
          { key: 'A', text: 'slow' },
          { key: 'B', text: 'fast' },
          { key: 'C', text: 'late' },
          { key: 'D', text: 'weak' }
        ]
      }
    ]
  },
  'unit-1': {
    id: 'unit-1',
    title: 'Unit 1 - Academic Skills',
    unit: 'Unit 1',
    durationSec: 900,
    questions: [
      {
        id: 'q1',
        text: 'Grammar: Choose the correct option',
        options: [
          { key: 'A', text: 'He go' },
          { key: 'B', text: 'He goes' },
          { key: 'C', text: 'He going' },
          { key: 'D', text: 'He went' }
        ]
      }
    ]
  },
  'speaking-lite': {
    id: 'speaking-lite',
    title: 'Speaking Lite',
    unit: 'Speaking',
    durationSec: 420,
    questions: [
      {
        id: 'q1',
        text: 'Record a short introduction (mock).',
        options: [{ key: 'A', text: 'Placeholder' }]
      }
    ]
  }
};

const RATING = [
  { id: 'dilnoza', name: 'Dilnoza S.', score: 92, groupTitle: 'IELTS-4' },
  { id: 'azizbek', name: 'Azizbek K.', score: 88, groupTitle: 'Mentor B2' },
  { id: 'madina', name: 'Madina T.', score: 86, groupTitle: 'CEFR Up A2' }
];

router.get('/tests', (_req, res) => {
  res.json(TESTS);
});

router.get('/tests/:id', (req, res) => {
  const test = TEST_DETAILS[req.params.id];
  if (!test) {
    return res.status(404).json({ ok: false, error: 'Test not found' });
  }
  res.json(test);
});

router.post('/submissions', (req, res) => {
  const { testId, answers } = req.body ?? {};
  const detail = TEST_DETAILS[testId as string];
  const questionCount = detail?.questions.length ?? 0;
  const attempts = Array.isArray(answers) ? answers.length : 0;
  const score = Math.min(questionCount, Math.max(0, attempts));
  res.json({ ok: true, score, duration_sec: 380 });
});

router.get('/rating', (_req, res) => {
  res.json(RATING);
});

export default router;
