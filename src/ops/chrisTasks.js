/**
 * Chris desk task cards — one card per mentor email task (not the hello unlock note).
 * Bank Ayon is always sorted first when present.
 * First three must be completed before Chris’s betrayal / later drops.
 */

export const CHRIS_UNLOCK_LESSON = 'chris-hello';

export const CHRIS_FIRST_BATCH = ['chris-ayon', 'chris-ops', 'chris-phish'];

export const CHRIS_TASK_CARDS = {
  'chris-ayon': {
    id: 'chris-ayon',
    title: 'Bank Ayon',
    tag: 'Money',
    blurb:
      'Buy the Ayon dump, open the red portal, hit dormant / quiet profiles, siphon to the burner drop. Watch heat.',
    detail:
      'Laptop/web portal only. Prefer last transfer over a year ago. Transfer to quiet-layer@ghostrelay.sim. Small spaced takes.',
    action: 'openAyon',
    cta: 'Open Bank Ayon portal',
    accent: '#c8102e'
  },
  'chris-ops': {
    id: 'chris-ops',
    title: 'Ops — quiet first',
    tag: 'Ops',
    blurb: 'Don’t open with floods. Monitor → map → capture → access. Heat climbs fast if you spray.',
    detail: 'Phishing waves can bounce counter-lures into your inbox. Stay under the police heat line.',
    action: 'gotoOps',
    cta: 'Open Ops',
    accent: '#00ff41'
  },
  'chris-phish': {
    id: 'chris-phish',
    title: 'Inbox battlefield',
    tag: 'Mail',
    blurb: 'Bank alerts and “claim $50” lures are aimed at you. Report bait — don’t click.',
    detail: 'Open the inbox, handle a lure safely, then mark this task complete.',
    action: 'openInbox',
    cta: 'Open inbox',
    accent: '#60a5fa'
  },
  'chris-betrayal': {
    id: 'chris-betrayal',
    title: 'Dog eat dog',
    tag: 'Lesson',
    blurb:
      'Chris sent a warm note after your first three. Read it. Decide whether to open his “quiet channel.”',
    detail: 'Never trust anyone — not even Chris. The mail is in your inbox.',
    action: 'openInbox',
    cta: 'Read Chris’s note',
    accent: '#f87171'
  },
  'chris-burn': {
    id: 'chris-burn',
    title: 'Burn the trail',
    tag: 'OPSEC',
    blurb: 'Mentor mail self-deletes after you read. No replies. Short bursts, then erase.',
    detail: 'Burn arms only after your eyes are on the note.',
    action: 'openInbox',
    cta: 'Check inbox',
    accent: '#f59e0b'
  }
};

/** Task lesson order with Bank Ayon first. */
export const CHRIS_TASK_ORDER = [
  'chris-ayon',
  'chris-ops',
  'chris-phish',
  'chris-betrayal',
  'chris-burn'
];

export function buildChrisTaskCards(seenLessons = []) {
  const seen = new Set(seenLessons || []);
  return CHRIS_TASK_ORDER.filter((id) => seen.has(id) && CHRIS_TASK_CARDS[id]).map(
    (id) => CHRIS_TASK_CARDS[id]
  );
}

export function firstBatchComplete(completed = []) {
  return CHRIS_FIRST_BATCH.every((id) => (completed || []).includes(id));
}
