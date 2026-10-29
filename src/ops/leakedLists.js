/** Simulated marketplace dumps — fiction only, no real credentials. */

const FIRST = ['Ava', 'Noah', 'Mia', 'Liam', 'Zoe', 'Kai', 'Iris', 'Owen', 'Nina', 'Leo', 'Sara', 'Jude', 'Elena', 'Marco', 'Yara', 'Ben'];
const LAST = ['Brooks', 'Nguyen', 'Patel', 'Garcia', 'Kim', 'Rossi', 'Anders', 'Okoye', 'Silva', 'Walsh', 'Diaz', 'Chen'];
const PASSWORDS = [
  'Summer2024!',
  'Ayon#9912',
  'Password1!',
  'Welc0meBank',
  'qwerty2023',
  'Family$$88',
  'SoccerMom1',
  'Coffee@Home',
  'N3verShare',
  'BankLogin77'
];
const SOCIALS = ['insta.sim', 'chirp.sim', 'facehub.sim', 'clipit.sim'];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const uid = () => Math.random().toString(36).slice(2, 9);

function person() {
  const first = pick(FIRST);
  const last = pick(LAST);
  const email = `${first.toLowerCase()}.${last.toLowerCase()}${rand(1, 99)}@mail.sim`;
  return { first, last, email, name: `${first} ${last}` };
}

export const MARKET_LIST_DEFS = {
  emailPassword: {
    id: 'emailPassword',
    title: 'Email & Password Dump',
    description:
      'Leaked username/email + password combos from mixed breaches. Use on the laptop browser — not the phone.',
    price: 1200,
    badge: 'Dump',
    count: 12
  },
  bankAyon: {
    id: 'bankAyon',
    title: 'Bank Ayon Customer List',
    description:
      'Chris’s tip: Ayon Online Banking dump — emails, passwords, and soft balances. Siphon small transfers via laptop web.',
    price: 2800,
    badge: 'Bank',
    count: 8
  },
  socials: {
    id: 'socials',
    title: 'Socials Credential List',
    description:
      'Compromised social logins. Small payouts if you session-hijack via the laptop browser.',
    price: 900,
    badge: 'Social',
    count: 10
  }
};

export function generateEmailPasswordList(count = 12) {
  return Array.from({ length: count }, () => {
    const p = person();
    return {
      id: uid(),
      email: p.email,
      username: `${p.first.toLowerCase()}${rand(10, 99)}`,
      password: pick(PASSWORDS),
      source: pick(['forum scrape', 'old breach', 'phish kit']),
      used: false
    };
  });
}

export function generateBankAyonList(count = 8) {
  return Array.from({ length: count }, () => {
    const p = person();
    const balance = rand(42, 220);
    // Chris prefers dormant / quiet profiles — bias the dump that way
    const roll = Math.random();
    let activity = 'active';
    let lastTransferMonths = rand(1, 5);
    let loginAgeMonths = rand(1, 4);
    if (roll < 0.55) {
      activity = 'dormant';
      lastTransferMonths = rand(13, 40);
      loginAgeMonths = rand(10, 28);
    } else if (roll < 0.8) {
      activity = 'quiet';
      lastTransferMonths = rand(7, 14);
      loginAgeMonths = rand(5, 12);
    }
    const heatBias = activity === 'dormant' ? -3 : activity === 'quiet' ? -1 : 3;
    return {
      id: uid(),
      bank: 'Ayon',
      name: p.name,
      email: p.email,
      username: p.email,
      password: pick(PASSWORDS),
      accountNumber: `AY-${rand(100000, 999999)}`,
      balance,
      drained: false,
      activity,
      lastTransferMonths,
      loginAgeMonths,
      transferHeat: Math.max(4, rand(7, 14) + heatBias)
    };
  });
}

export function generateSocialsList(count = 10) {
  return Array.from({ length: count }, () => {
    const p = person();
    return {
      id: uid(),
      platform: pick(SOCIALS),
      handle: `@${p.first.toLowerCase()}${pick(LAST).slice(0, 3).toLowerCase()}${rand(1, 40)}`,
      email: p.email,
      password: pick(PASSWORDS),
      payout: rand(18, 55),
      heat: rand(3, 8),
      used: false
    };
  });
}

export function buildListBundle(listId) {
  const def = MARKET_LIST_DEFS[listId];
  if (!def) return null;
  if (listId === 'emailPassword') {
    return { purchased: true, purchasedAt: Date.now(), entries: generateEmailPasswordList(def.count) };
  }
  if (listId === 'bankAyon') {
    return { purchased: true, purchasedAt: Date.now(), entries: generateBankAyonList(def.count) };
  }
  if (listId === 'socials') {
    return { purchased: true, purchasedAt: Date.now(), entries: generateSocialsList(def.count) };
  }
  return null;
}

export const emptyMarketLists = () => ({
  emailPassword: { purchased: false, entries: [] },
  bankAyon: { purchased: false, entries: [] },
  socials: { purchased: false, entries: [] }
});

export const AYON_URL = 'ayon.bank.sim';
/** Chris-recommended burner drop — not a personal-named wallet. */
export const AYON_MULE = 'quiet-layer@ghostrelay.sim';
export const AYON_MULE_NOTE =
  'Burner drop only. Never route Ayon siphons into an account that carries your operator name.';
