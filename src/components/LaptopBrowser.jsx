import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import BankAyonPortal from './BankAyonPortal';
import { AYON_URL, MARKET_LIST_DEFS } from '../ops/leakedLists';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 360px;
  background: #0b1220;
  color: #dce9ff;
`;

const Chrome = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px 10px;
  background: #121a2a;
  border-bottom: 1px solid rgba(124, 158, 205, 0.22);
`;

const UrlInput = styled.input`
  flex: 1;
  border-radius: 8px;
  border: 1px solid rgba(124, 158, 205, 0.35);
  background: #0d1420;
  color: #dce9ff;
  padding: 8px 10px;
  font-size: 0.85rem;
`;

const GoBtn = styled.button`
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #5fa8ff 0%, #3d7ccc 100%);
  color: #fff;
`;

const Page = styled.div`
  flex: 1;
  overflow: auto;
  background: ${(p) => (p.$bank ? '#fff' : '#0b1220')};
`;

const Home = styled.div`
  padding: 18px;
`;

const H = styled.h3`
  margin: 0 0 8px;
  color: #e8f1ff;
`;

const P = styled.p`
  margin: 0 0 14px;
  color: #8ea6cb;
  font-size: 0.88rem;
  line-height: 1.45;
`;

const Bookmark = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  margin-bottom: 8px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(124, 158, 205, 0.22);
  background: rgba(18, 31, 51, 0.75);
  color: #dce9ff;
  cursor: pointer;

  strong {
    display: block;
    margin-bottom: 4px;
  }

  span {
    font-size: 0.78rem;
    color: #8ea6cb;
  }

  &:hover {
    border-color: rgba(95, 168, 255, 0.55);
  }
`;

const Table = styled.div`
  padding: 14px;
  font-size: 0.82rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr 0.7fr auto;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(124, 158, 205, 0.15);
  color: ${(p) => (p.$dim ? '#6b7c95' : '#dce9ff')};

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const Action = styled.button`
  border: 1px solid rgba(95, 168, 255, 0.45);
  background: rgba(95, 168, 255, 0.12);
  color: #bfdbfe;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 0.75rem;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

function normalizeUrl(raw) {
  return String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
}

export default function LaptopBrowser({
  marketLists,
  onBankTransfer,
  onSocialHack,
  initialUrl = null
}) {
  const [url, setUrl] = useState(() => normalizeUrl(initialUrl) || 'start.sim');
  const [draft, setDraft] = useState(() => normalizeUrl(initialUrl) || 'start.sim');

  const page = useMemo(() => {
    const u = normalizeUrl(url);
    if (u.includes('ayon.bank') || u === AYON_URL) return 'ayon';
    if (u.includes('lists.dark') || u.includes('dump')) return 'lists';
    if (u.includes('social')) return 'socials';
    return 'home';
  }, [url]);

  const go = (target) => {
    const next = normalizeUrl(target) || 'start.sim';
    setDraft(next);
    setUrl(next);
  };

  useEffect(() => {
    if (!initialUrl) return;
    go(initialUrl);
  }, [initialUrl]);

  const bankEntries = marketLists?.bankAyon?.entries || [];
  const emailEntries = marketLists?.emailPassword?.entries || [];
  const socialEntries = marketLists?.socials?.entries || [];

  return (
    <Wrap>
      <Chrome>
        <UrlInput
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') go(draft);
          }}
          placeholder="Enter address…"
          spellCheck={false}
        />
        <GoBtn type="button" onClick={() => go(draft)}>
          Go
        </GoBtn>
      </Chrome>
      <Page $bank={page === 'ayon'}>
        {page === 'ayon' && (
          <BankAyonPortal accounts={bankEntries} onTransfer={onBankTransfer} />
        )}

        {page === 'home' && (
          <Home>
            <H>Browser · simulation</H>
            <P>
              Chris said use the laptop web for Bank Ayon — not the phone. Bookmarks below jump
              straight to the dumps and the red/white Ayon portal.
            </P>
            <Bookmark type="button" onClick={() => go(AYON_URL)}>
              <strong>Bank Ayon Online</strong>
              <span>{AYON_URL} — red &amp; white customer portal</span>
            </Bookmark>
            <Bookmark type="button" onClick={() => go('lists.dark.sim/dumps')}>
              <strong>Leaked dumps viewer</strong>
              <span>Email/password + Bank Ayon rows from the Store marketplace</span>
            </Bookmark>
            <Bookmark type="button" onClick={() => go('social.hijack.sim')}>
              <strong>Social session desk</strong>
              <span>Burn socials list entries for small payouts</span>
            </Bookmark>
          </Home>
        )}

        {page === 'lists' && (
          <Table>
            <H>Marketplace dumps</H>
            <P>
              {MARKET_LIST_DEFS.emailPassword.title}:{' '}
              {marketLists?.emailPassword?.purchased
                ? `${emailEntries.length} combos`
                : 'not purchased'}
              {' · '}
              {MARKET_LIST_DEFS.bankAyon.title}:{' '}
              {marketLists?.bankAyon?.purchased
                ? `${bankEntries.filter((a) => !a.drained).length} live / ${bankEntries.length}`
                : 'not purchased'}
            </P>

            <H style={{ fontSize: '1rem', marginTop: 12 }}>Bank Ayon list</H>
            {!marketLists?.bankAyon?.purchased ? (
              <P>Buy “Bank Ayon Customer List” in the Store.</P>
            ) : (
              bankEntries.map((row) => (
                <Row key={row.id} $dim={row.drained}>
                  <div>
                    <div>{row.name}</div>
                    <div style={{ color: '#8ea6cb' }}>{row.email}</div>
                    <div style={{ color: row.activity === 'dormant' ? '#86efac' : row.activity === 'quiet' ? '#fde68a' : '#fca5a5', fontSize: '0.72rem', marginTop: 4 }}>
                      {row.activity || 'active'}
                      {row.lastTransferMonths
                        ? ` · last transfer ~${row.lastTransferMonths}mo ago`
                        : ''}
                    </div>
                  </div>
                  <div>
                    pass: <code>{row.password}</code>
                  </div>
                  <div>${row.balance}</div>
                  <Action
                    type="button"
                    disabled={row.drained}
                    onClick={() => go(AYON_URL)}
                  >
                    {row.drained ? 'Drained' : 'Open Ayon'}
                  </Action>
                </Row>
              ))
            )}

            <H style={{ fontSize: '1rem', marginTop: 18 }}>Email &amp; password dump</H>
            {!marketLists?.emailPassword?.purchased ? (
              <P>Buy “Email & Password Dump” in the Store.</P>
            ) : (
              emailEntries.slice(0, 12).map((row) => (
                <Row key={row.id} $dim={row.used}>
                  <div>{row.email}</div>
                  <div>
                    <code>{row.password}</code>
                  </div>
                  <div>{row.source}</div>
                  <div />
                </Row>
              ))
            )}
          </Table>
        )}

        {page === 'socials' && (
          <Table>
            <H>Social session desk</H>
            <P>Small grabs. Still raises heat — do not spray the whole list at once.</P>
            {!marketLists?.socials?.purchased ? (
              <P>Buy “Socials Credential List” in the Store marketplace.</P>
            ) : (
              socialEntries.map((row) => (
                <Row key={row.id} $dim={row.used}>
                  <div>
                    {row.platform}
                    <div style={{ color: '#8ea6cb' }}>{row.handle}</div>
                  </div>
                  <div>
                    <code>{row.password}</code>
                  </div>
                  <div>+${row.payout}</div>
                  <Action
                    type="button"
                    disabled={row.used}
                    onClick={() => onSocialHack?.(row)}
                  >
                    {row.used ? 'Burned' : 'Hijack'}
                  </Action>
                </Row>
              ))
            )}
          </Table>
        )}
      </Page>
    </Wrap>
  );
}
