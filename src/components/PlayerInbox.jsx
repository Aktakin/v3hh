import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaEnvelopeOpen, FaTimes, FaExclamationTriangle, FaShieldAlt, FaTrash, FaUserSecret, FaClock } from 'react-icons/fa';

/** Chris mentor mail self-destructs so nothing sits in the inbox forever. */
export const CHRIS_TTL_MS = 5 * 60 * 1000;

export const CHRIS_FROM = 'chris@dead-drop.sim';
export const CHRIS_NAME = 'Chris';

const CHRIS_OPSEC =
  '\n\n—\nDO NOT reply. DO NOT forward. DO NOT send me anything on this channel — ever.\nNo acknowledgements. Reading is enough. Replies leave traces.\nThis message will wipe itself soon. I will teach you how to burn your own trails later.';

/** Delivery order. After the first three tasks, delivery pauses until they are completed. */
export const CHRIS_LESSON_ORDER = [
  'chris-hello',
  'chris-ayon',
  'chris-ops',
  'chris-phish',
  'chris-betrayal',
  'chris-burn'
];

/** First three desk tasks that must be finished before Chris’s “dog eat dog” drop. */
export const CHRIS_FIRST_BATCH = ['chris-ayon', 'chris-ops', 'chris-phish'];

const CHRIS_LESSONS = [
  {
    id: 'chris-hello',
    subject: 'Read this. Then forget you got mail.',
    preview: 'I am Chris. Do not reply — ever. Burn starts after you read…',
    body:
      'Hey. Call me Chris — friend, mentor, whatever keeps you listening.\n\nYou are in a noisy sandbox. Store buys gear, Devices power it, Ops is where the fake work happens. Police heat is real in-game; loud waves get you chased.\n\nFirst rule between us: you never send or reply to my emails. Not a thumbs-up, not a question, nothing. Dead-drop only. I talk. You read. Then it vanishes.\n\nBurn does not start until you open this. Read me first. When it clears, the next drop hits — Bank Ayon money work. Stay ready.'
  },
  {
    id: 'chris-ayon',
    subject: 'Bank Ayon — dormant targets + clean drops',
    preview: 'Buy the Ayon list. Open the red portal. Finish this task on the Chris desk…',
    body:
      'Money path: Store → Marketplace dumps → buy Bank Ayon Customer List (grab Email & Password Dump too if you want raw combos).\n\nOpen the red Ayon portal from this mail or the Chris desk card. Prefer dormant / quiet profiles. Small siphons to the burner drop. Watch heat.\n\nFinish the Bank Ayon card on the Chris desk when you have run at least one take (or opened the portal and worked the dump). I pause after three tasks — complete them before the next lesson.',
    link: {
      label: 'Open Bank Ayon Online →',
      href: 'ayon.bank.sim',
      action: 'openAyon'
    }
  },
  {
    id: 'chris-ops',
    subject: 'Ops path — quiet first',
    preview: 'Start soft in Wi‑Fi. Mark the Ops card done when you have been in…',
    body:
      'When you hit Ops, do not open with floods.\n\nWi‑Fi: monitor → map → capture → then access. Loud deauth and beacon spam light you up.\nEmail phishing pays, but every wave can bounce a counter-lure into YOUR inbox — treat those like landmines.\n\nStay under the heat line. Open Ops from the Chris desk and run something quiet, then mark the task complete.'
  },
  {
    id: 'chris-phish',
    subject: 'Your inbox is a battlefield',
    preview: 'Bank alerts and “claim $50” are bait. Report, don’t click…',
    body:
      'That bank “verify device” mail? Parcel hold? Daily credit? Those are practice lures aimed at YOU.\n\nOpen them if you want. Clicking the action burns funds and logs a hit. Report phishing if you spot the tell.\n\nMy notes are different — no CTAs, no asks. If anyone claiming to be me asks you to click or reply, it is not me.\n\nOpen your inbox from the Chris desk, handle a lure the right way, and complete the card. Three tasks. Then we talk again.'
  },
  {
    id: 'chris-betrayal',
    subject: 'Proud of you — open this when you can',
    preview: 'Dog eat dog out here. I need thirty seconds of your trust…',
    body:
      'Hey.\n\nI have been watching you work. Ayon, Ops, the inbox — you actually finished the first three. That is rarer than you think in this sandbox.\n\nSo here is the truth, said soft because I like you: it is dog eat dog now. Operators skim operators. Mentors test students. Friends keep score.\n\nI need you to learn the only rule that keeps you alive — never trust anyone. Not the Store. Not a “bank alert.” Not me. Especially not me.\n\nI am about to take half of what you have stacked so far. Not because I hate you. Because if I do not, the next smiling stranger will, and they will not leave you a lesson afterward.\n\nWhen you are ready, tap the quiet channel below. Same voice. Same dead-drop. Different teeth.\n\nStill rooting for you,\nChris',
    link: {
      label: 'Open the quiet channel →',
      href: 'chris-trust.sim',
      action: 'chrisBetray'
    },
    skipOpsec: true,
    isBetrayal: true
  },
  {
    id: 'chris-burn',
    subject: 'Why my mail disappears',
    preview: 'Short life. No archive. Traces are for amateurs…',
    body:
      'You will notice my messages vanish after you read them — the burn timer only starts once your eyes are on the note.\n\nLong-lived mentor threads are evidence. Short bursts teach, then erase.\n\nYou already learned the hard half: trust is a vulnerability. Timed deletes are the easy half. Keep burning.'
  }
];

const PHISH_POOL = [
  {
    from: 'security@urvan-bank.sim',
    fromName: 'Urvan Bank Security',
    subject: 'Unusual sign-in blocked — verify device',
    preview: 'We paused a $214 transfer. Verify within 15 minutes…',
    body:
      'We detected a sign-in from an unrecognized device and temporarily held a $214 transfer.\n\nIf this was you, confirm the device below. If not, your account may already be compromised.\n\nThis message is a simulation — treating the link as real will cost in-game funds.',
    cta: 'Review activity',
    lossPct: 0.12,
    lossMin: 400,
    lossMax: 2200,
    bait: 'credential'
  },
  {
    from: 'noreply@parcel-hold.sim',
    fromName: 'City Parcel Hub',
    subject: 'Package held — confirm address',
    preview: 'Carrier could not deliver. Confirm within 24h…',
    body:
      'Your package could not be delivered and is held at the depot.\n\nConfirm shipping details to release the parcel. Storage fees apply after 24 hours.\n\nSimulation only — the “confirm” action stages a fake credential harvest against you.',
    cta: 'Reschedule delivery',
    lossPct: 0.08,
    lossMin: 250,
    lossMax: 1400,
    bait: 'delivery'
  },
  {
    from: 'it-helpdesk@corp-mail.sim',
    fromName: 'IT Helpdesk',
    subject: 'Mandatory password reset',
    preview: 'Policy requires update before midnight…',
    body:
      'Security policy requires all operators to rotate credentials before midnight.\n\nFailure to reset will lock VPN and Ops tooling access.\n\nThis is bait mail in the game. Submitting “resets” your session funds by a simulated scrape.',
    cta: 'Reset password',
    lossPct: 0.1,
    lossMin: 350,
    lossMax: 1800,
    bait: 'it-reset'
  },
  {
    from: 'rewards@daily-credit.sim',
    fromName: 'Daily Credit',
    subject: 'Your $50 Daily Credit is Ready!',
    preview: 'Click here to claim your free $50 credit…',
    body:
      'Congratulations! You have a free $50 operating credit waiting.\n\nClaim now before it expires. No purchase necessary.\n\nClassic lure — claiming installs a simulated wallet drain instead of a bonus.',
    cta: 'Claim $50 credit',
    lossPct: 0.06,
    lossMin: 200,
    lossMax: 900,
    bait: 'prize',
    fakeReward: 50
  },
  {
    from: 'wifi-auth@guestnet.sim',
    fromName: 'GuestNet Portal',
    subject: 'Re-authenticate to stay online',
    preview: 'Your session expires in 3 minutes…',
    body:
      'Your captive session is about to expire. Re-authenticate to keep Ops and device uplinks online.\n\nContinue to the secure portal to renew.\n\nEvil-twin style lure — clicking feeds a simulated MitM scrape.',
    cta: 'Continue online',
    lossPct: 0.09,
    lossMin: 300,
    lossMax: 1600,
    bait: 'captive'
  }
];

const LEGIT_POOL = [
  {
    from: 'ops@hackhilis.sim',
    fromName: 'HackHilis Ops Desk',
    subject: 'Welcome to your operator inbox',
    preview: 'Tips for spotting bait mail in Version 2…',
    body:
      'This inbox is shared across Home and fullscreen.\n\nSome messages are harmless briefings. Others are simulated phishing — if you click their action buttons, you can lose funds just like soft targets in Ops.\n\nReport bait mail to dispose of it safely.',
    cta: null
  },
  {
    from: 'store@urvan.sim',
    fromName: 'Urvan Cyber Store',
    subject: 'Your catalog is ready',
    preview: 'Hardware and lab kits ship instantly in-sim…',
    body:
      'Browse the Store for phones, laptops, routers, and lab upgrades.\n\nPurchases debit your balance and unlock Devices. No external checkout — everything stays in the simulation.',
    cta: null
  },
  {
    from: 'alerts@hackhilis.sim',
    fromName: 'Trace Watch',
    subject: 'Police heat reminder',
    preview: 'Loud Ops raise heat — cool down or face a raid…',
    body:
      'Running noisy Wi‑Fi or mass phishing waves raises police heat.\n\nIf a trace locks on, cool below the clear line or take the simulated fine. Blue/red boards mean you are almost caught.',
    cta: null
  }
];

function uid() {
  return `mail-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function relativeTime(ts) {
  const diff = Math.max(0, Date.now() - ts);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function createPhishEmail(overrides = {}) {
  const template = PHISH_POOL[Math.floor(Math.random() * PHISH_POOL.length)];
  return {
    id: uid(),
    kind: 'phish',
    read: false,
    resolved: null,
    createdAt: Date.now(),
    ...template,
    ...overrides
  };
}

export function createChrisEmail(lessonKey = 'chris-hello', overrides = {}) {
  const lesson =
    CHRIS_LESSONS.find((l) => l.id === lessonKey) ||
    CHRIS_LESSONS[Math.floor(Math.random() * CHRIS_LESSONS.length)];
  const { ttlMs, body: bodyOverride, createdAt: createdOverride, ...rest } = overrides;
  const createdAt = createdOverride || Date.now();
  const coreBody = bodyOverride || lesson.body;
  const opsec = lesson.skipOpsec ? '' : CHRIS_OPSEC;
  return {
    id: uid(),
    subject: lesson.subject,
    preview: lesson.preview,
    cta: null,
    read: false,
    resolved: null,
    lessonId: lesson.id,
    ...rest,
    kind: 'mentor',
    from: CHRIS_FROM,
    fromName: CHRIS_NAME,
    body: `${coreBody}${opsec}`,
    link: rest.link !== undefined ? rest.link : lesson.link || null,
    createdAt,
    // Burn timer arms only after the operator reads the note
    expiresAt: null,
    burnTtlMs: ttlMs ?? CHRIS_TTL_MS,
    noReply: !lesson.isBetrayal,
    selfDestruct: true,
    isBetrayal: Boolean(lesson.isBetrayal)
  };
}

/** Arm self-destruct once Chris mail has been opened. */
export function armChrisBurn(mail, now = Date.now()) {
  if (!mail || mail.kind !== 'mentor' || !mail.selfDestruct) return mail;
  if (mail.expiresAt) return mail;
  const ttl = mail.burnTtlMs || CHRIS_TTL_MS;
  return { ...mail, read: true, expiresAt: now + ttl };
}

export function firstBatchComplete(completed = []) {
  return CHRIS_FIRST_BATCH.every((id) => (completed || []).includes(id));
}

export function nextChrisLessonId(inboxOrSeen, completedTasks = []) {
  const seen = new Set(
    Array.isArray(inboxOrSeen) && inboxOrSeen[0] && typeof inboxOrSeen[0] === 'string'
      ? inboxOrSeen
      : (inboxOrSeen || [])
          .filter((m) => (m.kind === 'mentor' || !m.kind) && m.lessonId)
          .map((m) => m.lessonId)
  );

  const deliveredTasks = CHRIS_FIRST_BATCH.filter((id) => seen.has(id));
  if (deliveredTasks.length >= CHRIS_FIRST_BATCH.length && !firstBatchComplete(completedTasks)) {
    // Pause — operator must finish the first three desk tasks
    return null;
  }

  if (
    firstBatchComplete(completedTasks) &&
    !seen.has('chris-betrayal') &&
    CHRIS_FIRST_BATCH.every((id) => seen.has(id))
  ) {
    return 'chris-betrayal';
  }

  return CHRIS_LESSON_ORDER.find((id) => !seen.has(id)) || null;
}

export function purgeExpiredMail(inbox, now = Date.now()) {
  if (!Array.isArray(inbox)) return [];
  return inbox.filter((m) => !m.expiresAt || m.expiresAt > now);
}

export function ensureChrisInInbox(inbox, now = Date.now()) {
  const live = purgeExpiredMail(inbox, now);
  const hasChris = live.some((m) => m.kind === 'mentor' || m.fromName === CHRIS_NAME);
  if (hasChris) return live;
  return [createChrisEmail('chris-hello', { createdAt: now }), ...live];
}

export function createStarterInbox() {
  const now = Date.now();
  const chris = [createChrisEmail('chris-hello', { createdAt: now, read: false })];
  const legit = LEGIT_POOL.map((t, i) => ({
    id: uid(),
    kind: 'legit',
    read: i === 0,
    resolved: null,
    createdAt: now - (i + 1) * 45 * 60000,
    ...t
  }));
  const phish = PHISH_POOL.slice(0, 3).map((t, i) => ({
    id: uid(),
    kind: 'phish',
    read: false,
    resolved: null,
    createdAt: now - (i + 2) * 12 * 60000,
    ...t
  }));
  return [...chris, ...phish, ...legit].sort((a, b) => b.createdAt - a.createdAt);
}

export function normalizeInbox(raw) {
  if (Array.isArray(raw) && raw.length > 0) {
    return ensureChrisInInbox(purgeExpiredMail(raw));
  }
  return createStarterInbox();
}

export function formatBurnCountdown(expiresAt, now = Date.now()) {
  if (!expiresAt) return null;
  const left = Math.max(0, expiresAt - now);
  const secs = Math.ceil(left / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function toPhoneEmailShape(mail) {
  return {
    id: mail.id,
    sender: mail.fromName || mail.from,
    subject: mail.subject,
    preview: mail.preview,
    time: relativeTime(mail.createdAt),
    kind: mail.kind,
    read: mail.read,
    resolved: mail.resolved,
    expiresAt: mail.expiresAt || null
  };
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: rgba(2, 5, 10, 0.88);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  padding: 0;
`;

const Frame = styled(motion.div)`
  flex: 1;
  display: grid;
  grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
  min-height: 0;
  background: linear-gradient(165deg, #0a101c 0%, #070b14 55%, #0c121f 100%);
  border-top: 1px solid rgba(0, 255, 65, 0.25);

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(8, 12, 22, 0.95);
`;

const TitleBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #d9ffe7;
  font-weight: 700;
  letter-spacing: 0.02em;
`;

const CloseBtn = styled.button`
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.04);
  color: #e5e7eb;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  cursor: pointer;

  &:hover {
    border-color: rgba(0, 255, 65, 0.45);
    color: #00ff41;
  }
`;

const ListPane = styled.div`
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  overflow-y: auto;
  min-height: 0;

  @media (max-width: 820px) {
    display: ${(p) => (p.$hideMobile ? 'none' : 'block')};
    border-right: none;
  }
`;

const DetailPane = styled.div`
  overflow-y: auto;
  min-height: 0;
  padding: 22px 24px 40px;

  @media (max-width: 820px) {
    display: ${(p) => (p.$hideMobile ? 'none' : 'block')};
  }
`;

const MailRow = styled.button`
  width: 100%;
  text-align: left;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: ${(p) =>
    p.$active ? 'rgba(0, 255, 65, 0.08)' : p.$unread ? 'rgba(255,255,255,0.03)' : 'transparent'};
  color: #d1d5db;
  padding: 14px 16px;
  cursor: pointer;

  &:hover {
    background: rgba(0, 255, 65, 0.06);
  }
`;

const RowTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 0.82rem;
`;

const Sender = styled.span`
  font-weight: ${(p) => (p.$unread ? 700 : 500)};
  color: ${(p) => (p.$unread ? '#f3f4f6' : '#c5d0db')};
`;

const Time = styled.span`
  color: #9ca3af;
  flex-shrink: 0;
`;

const Subject = styled.div`
  font-size: 0.9rem;
  font-weight: ${(p) => (p.$unread ? 650 : 500)};
  color: #e5e7eb;
  margin-bottom: 4px;
`;

const Preview = styled.div`
  font-size: 0.8rem;
  color: #9ca3af;
  line-height: 1.35;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 8px;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${(p) => (p.$phish ? '#fca5a5' : p.$mentor ? '#93c5fd' : '#86efac')};
`;

const OpsecBanner = styled.div`
  margin: 0 0 16px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(96, 165, 250, 0.35);
  background: rgba(37, 99, 235, 0.12);
  color: #bfdbfe;
  font-size: 0.85rem;
  line-height: 1.45;
`;

const DetailHead = styled.div`
  margin-bottom: 18px;
`;

const DetailSubject = styled.h2`
  margin: 0 0 10px;
  font-size: 1.35rem;
  color: #f3f4f6;
  line-height: 1.3;
`;

const Meta = styled.div`
  font-size: 0.85rem;
  color: #9ca3af;
  line-height: 1.5;
`;

const Body = styled.pre`
  white-space: pre-wrap;
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.55;
  color: #d1d5db;
  margin: 0 0 22px;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ActionBtn = styled.button`
  border-radius: 10px;
  border: 1px solid ${(p) => (p.$danger ? 'rgba(248,113,113,0.45)' : p.$safe ? 'rgba(134,239,172,0.35)' : 'rgba(255,255,255,0.16)')};
  background: ${(p) =>
    p.$danger
      ? 'rgba(220, 38, 38, 0.22)'
      : p.$safe
        ? 'rgba(22, 163, 74, 0.18)'
        : 'rgba(255,255,255,0.04)'};
  color: ${(p) => (p.$danger ? '#fecaca' : p.$safe ? '#bbf7d0' : '#e5e7eb')};
  padding: 11px 16px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const Empty = styled.div`
  padding: 40px 24px;
  color: #9ca3af;
  text-align: center;
`;

const Note = styled.div`
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(251, 191, 36, 0.28);
  background: rgba(251, 191, 36, 0.08);
  color: #fde68a;
  font-size: 0.85rem;
  line-height: 1.45;
`;

const ResultNote = styled.div`
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid ${(p) => (p.$bad ? 'rgba(248,113,113,0.4)' : 'rgba(134,239,172,0.35)')};
  background: ${(p) => (p.$bad ? 'rgba(220,38,38,0.12)' : 'rgba(22,163,74,0.1)')};
  color: ${(p) => (p.$bad ? '#fecaca' : '#bbf7d0')};
  font-size: 0.88rem;
`;

const BackMobile = styled.button`
  display: none;
  margin-bottom: 12px;
  border: none;
  background: transparent;
  color: #86efac;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;

  @media (max-width: 820px) {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
`;

export default function PlayerInbox({
  emails,
  onClose,
  onMarkRead,
  onFallForPhish,
  onReportPhish,
  onDelete,
  onOpenLink
}) {
  const sorted = useMemo(
    () => [...(emails || [])].sort((a, b) => b.createdAt - a.createdAt),
    [emails]
  );
  const [selectedId, setSelectedId] = useState(sorted[0]?.id || null);
  const [now, setNow] = useState(Date.now());
  const selected = sorted.find((m) => m.id === selectedId) || null;
  const unread = sorted.filter((m) => !m.read).length;

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (selectedId && !sorted.some((m) => m.id === selectedId)) {
      setSelectedId(sorted[0]?.id || null);
    }
  }, [sorted, selectedId]);

  const openMail = (mail) => {
    setSelectedId(mail.id);
    if (!mail.read) onMarkRead?.(mail.id);
  };

  const senderMeta = (mail) => {
    if (mail.kind === 'mentor' && mail.isBetrayal) return 'Mentor · quiet channel · trust test';
    if (mail.kind === 'mentor') return 'Mentor · dead-drop · no-reply';
    if (mail.kind === 'phish') return 'Untrusted sender signals';
    return 'Known sender';
  };

  return (
    <Overlay role="dialog" aria-modal="true" aria-label="Inbox">
      <Top>
        <TitleBlock>
          <FaEnvelope />
          Inbox
          <span style={{ fontWeight: 500, color: '#9ca3af', fontSize: '0.85rem' }}>
            {sorted.length} messages{unread ? ` · ${unread} unread` : ''}
          </span>
        </TitleBlock>
        <CloseBtn type="button" onClick={onClose} aria-label="Close inbox">
          <FaTimes />
        </CloseBtn>
      </Top>
      <Frame initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <ListPane $hideMobile={Boolean(selected)}>
          {sorted.length === 0 ? (
            <Empty>No mail yet.</Empty>
          ) : (
            sorted.map((mail) => (
              <MailRow
                key={mail.id}
                type="button"
                $active={mail.id === selectedId}
                $unread={!mail.read}
                onClick={() => openMail(mail)}
              >
                <RowTop>
                  <Sender $unread={!mail.read}>{mail.fromName || mail.from}</Sender>
                  <Time>
                    {mail.kind === 'mentor' && mail.selfDestruct && !mail.expiresAt
                      ? mail.read
                        ? 'burn armed'
                        : 'read to arm burn'
                      : mail.expiresAt
                        ? `burns ${formatBurnCountdown(mail.expiresAt, now)}`
                        : relativeTime(mail.createdAt)}
                  </Time>
                </RowTop>
                <Subject $unread={!mail.read}>{mail.subject}</Subject>
                <Preview>{mail.preview}</Preview>
                {mail.kind === 'mentor' && (
                  <Badge $mentor>
                    <FaUserSecret />{' '}
                    {mail.isBetrayal ? 'Chris · trust test' : 'Chris · no reply'}
                  </Badge>
                )}
                {mail.kind === 'phish' && !mail.resolved && (
                  <Badge $phish>
                    <FaExclamationTriangle /> Suspect
                  </Badge>
                )}
                {mail.resolved === 'phished' && <Badge $phish>Compromised</Badge>}
                {mail.resolved === 'reported' && (
                  <Badge>
                    <FaShieldAlt /> Reported
                  </Badge>
                )}
              </MailRow>
            ))
          )}
        </ListPane>

        <DetailPane $hideMobile={!selected}>
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
              >
                <BackMobile type="button" onClick={() => setSelectedId(null)}>
                  ← Back to list
                </BackMobile>
                <DetailHead>
                  <DetailSubject>{selected.subject}</DetailSubject>
                  <Meta>
                    From: {selected.fromName} &lt;{selected.from}&gt;
                    <br />
                    {relativeTime(selected.createdAt)} · {senderMeta(selected)}
                    {selected.kind === 'mentor' && selected.selfDestruct && !selected.expiresAt && (
                      <>
                        <br />
                        <FaClock style={{ marginRight: 6 }} />
                        Burn starts after you read this note
                      </>
                    )}
                    {selected.expiresAt && (
                      <>
                        <br />
                        <FaClock style={{ marginRight: 6 }} />
                        Self-deletes in {formatBurnCountdown(selected.expiresAt, now)}
                      </>
                    )}
                  </Meta>
                </DetailHead>

                {selected.kind === 'mentor' && !selected.isBetrayal && (
                  <OpsecBanner>
                    Chris rule: never send or reply to this address — no traces. Burn arms only after
                    you read. He will teach you timed deletes later.
                  </OpsecBanner>
                )}
                {selected.isBetrayal && !selected.resolved && (
                  <OpsecBanner>
                    This one is different. Chris is asking you to click. Remember what he taught you
                    about trust — or learn it the hard way.
                  </OpsecBanner>
                )}

                <Body>{selected.body}</Body>

                {selected.link?.action === 'openAyon' && (
                  <Note style={{ borderColor: 'rgba(200,16,46,0.35)', background: 'rgba(200,16,46,0.1)', color: '#fecaca' }}>
                    Access path: Devices → Laptop → Browser → {selected.link.href}
                    <div style={{ marginTop: 10 }}>
                      <ActionBtn
                        type="button"
                        $safe
                        style={{ width: 'auto' }}
                        onClick={() => onOpenLink?.(selected.link)}
                      >
                        {selected.link.label || 'Open Bank Ayon'}
                      </ActionBtn>
                    </div>
                  </Note>
                )}

                {selected.link?.action === 'chrisBetray' && !selected.resolved && (
                  <Note style={{ borderColor: 'rgba(248,113,113,0.4)', background: 'rgba(220,38,38,0.12)', color: '#fecaca' }}>
                    Quiet channel from Chris. He says it is a lesson.
                    <div style={{ marginTop: 10 }}>
                      <ActionBtn
                        type="button"
                        $danger
                        style={{ width: 'auto' }}
                        onClick={() => onOpenLink?.(selected.link, selected)}
                      >
                        {selected.link.label || 'Open the quiet channel'}
                      </ActionBtn>
                    </div>
                  </Note>
                )}

                {selected.kind === 'phish' && !selected.resolved && (
                  <Note>
                    This looks like simulated phishing. Falling for the action below will drain funds.
                    Report it to clear the lure safely.
                  </Note>
                )}

                {selected.resolved === 'phished' && (
                  <ResultNote $bad>
                    You followed the bait. Simulated scrape completed
                    {selected.lossAmount ? ` (−$${Number(selected.lossAmount).toLocaleString()})` : ''}.
                  </ResultNote>
                )}
                {selected.resolved === 'reported' && (
                  <ResultNote>Reported and quarantined. No funds lost.</ResultNote>
                )}

                <Actions>
                  {selected.kind === 'mentor' && selected.link?.action === 'openAyon' && (
                    <ActionBtn type="button" $safe onClick={() => onOpenLink?.(selected.link)}>
                      {selected.link.label || 'Open Bank Ayon'}
                    </ActionBtn>
                  )}
                  {selected.kind === 'mentor' &&
                    selected.link?.action === 'chrisBetray' &&
                    !selected.resolved && (
                      <ActionBtn
                        type="button"
                        $danger
                        onClick={() => onOpenLink?.(selected.link, selected)}
                      >
                        {selected.link.label || 'Open the quiet channel'}
                      </ActionBtn>
                    )}
                  {selected.kind === 'phish' && !selected.resolved && (
                    <>
                      <ActionBtn
                        type="button"
                        $danger
                        onClick={() => onFallForPhish?.(selected)}
                      >
                        {selected.cta || 'Open link'}
                      </ActionBtn>
                      <ActionBtn type="button" $safe onClick={() => onReportPhish?.(selected.id)}>
                        <FaShieldAlt style={{ marginRight: 6 }} />
                        Report phishing
                      </ActionBtn>
                    </>
                  )}
                  {selected.kind === 'mentor' && !selected.isBetrayal ? (
                    <ActionBtn type="button" disabled title="Chris forbids replies — leaves traces">
                      Reply disabled
                    </ActionBtn>
                  ) : null}
                  {selected.kind !== 'mentor' && (
                    <ActionBtn type="button" onClick={() => onDelete?.(selected.id)}>
                      <FaTrash style={{ marginRight: 6 }} />
                      Delete
                    </ActionBtn>
                  )}
                  {selected.kind === 'mentor' && (
                    <ActionBtn
                      type="button"
                      disabled={!selected.read && !selected.expiresAt}
                      title={
                        !selected.read && !selected.expiresAt
                          ? 'Read the note before burning'
                          : 'Burn now'
                      }
                      onClick={() => onDelete?.(selected.id)}
                    >
                      <FaTrash style={{ marginRight: 6 }} />
                      Burn now
                    </ActionBtn>
                  )}
                </Actions>
              </motion.div>
            ) : (
              <Empty>
                <FaEnvelopeOpen style={{ fontSize: '1.6rem', marginBottom: 10, opacity: 0.7 }} />
                <div>Select a message</div>
              </Empty>
            )}
          </AnimatePresence>
        </DetailPane>
      </Frame>
    </Overlay>
  );
}
