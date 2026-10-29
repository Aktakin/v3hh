import { useEffect, useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { AYON_MULE, AYON_MULE_NOTE } from '../ops/leakedLists';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Shell = styled.div`
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #fff5f5 0%, #ffffff 42%, #f7f7f8 100%);
  color: #1a1a1a;
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  animation: ${fadeIn} 0.35s ease;
`;

const TopBar = styled.header`
  background: #c8102e;
  color: #fff;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 2px 12px rgba(200, 16, 46, 0.35);
  flex-shrink: 0;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
`;

const LogoMark = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #fff;
  color: #c8102e;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 0.95rem;
`;

const Tag = styled.span`
  font-size: 0.7rem;
  opacity: 0.85;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Layout = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);

  @media (max-width: 780px) {
    grid-template-columns: 1fr;
  }
`;

const Side = styled.aside`
  border-right: 1px solid #f0d0d5;
  background: #fff8f9;
  overflow-y: auto;
  padding: 14px 12px 24px;

  @media (max-width: 780px) {
    border-right: none;
    border-bottom: 1px solid #f0d0d5;
    max-height: 220px;
  }
`;

const SideTitle = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #8b0a1e;
  margin: 0 8px 10px;
`;

const AccountBtn = styled.button`
  width: 100%;
  text-align: left;
  border: 1px solid ${(p) => (p.$active ? '#c8102e' : p.$drained ? '#e5e5e5' : '#f0d0d5')};
  background: ${(p) => (p.$active ? 'rgba(200, 16, 46, 0.1)' : p.$drained ? '#fafafa' : '#fff')};
  color: ${(p) => (p.$drained ? '#999' : '#1a1a1a')};
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
  cursor: ${(p) => (p.$drained ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.$drained ? 0.55 : 1)};

  &:hover:not(:disabled) {
    border-color: #c8102e;
  }
`;

const AccName = styled.div`
  font-weight: 700;
  font-size: 0.88rem;
`;

const AccMeta = styled.div`
  font-size: 0.72rem;
  color: #777;
  margin-top: 3px;
  line-height: 1.35;
`;

const AccBadge = styled.span`
  display: inline-block;
  margin-top: 6px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${(p) =>
    p.$kind === 'dormant' ? '#166534' : p.$kind === 'quiet' ? '#92400e' : '#9f1239'};
`;

const Main = styled.div`
  overflow-y: auto;
  padding: 22px 18px 40px;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #f0d0d5;
  border-radius: 14px;
  padding: 22px 22px 20px;
  box-shadow: 0 10px 28px rgba(200, 16, 46, 0.08);
  max-width: 520px;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin: 0 0 6px;
  font-size: 1.35rem;
  color: #8b0a1e;
`;

const Sub = styled.p`
  margin: 0 0 18px;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.45;
`;

const Label = styled.label`
  display: block;
  font-size: 0.78rem;
  font-weight: 600;
  color: #8b0a1e;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 11px 12px;
  border-radius: 8px;
  border: 1px solid #e2b4bc;
  margin-bottom: 14px;
  font-size: 0.95rem;
  background: #fffafb;

  &:focus {
    outline: 2px solid rgba(200, 16, 46, 0.35);
    border-color: #c8102e;
  }

  &:read-only {
    background: #faf0f2;
  }
`;

const Btn = styled.button`
  width: ${(p) => (p.$auto ? 'auto' : '100%')};
  border: none;
  border-radius: 8px;
  padding: ${(p) => (p.$auto ? '8px 12px' : '12px 14px')};
  font-weight: 700;
  cursor: pointer;
  background: ${(p) => (p.$ghost ? '#fff' : '#c8102e')};
  color: ${(p) => (p.$ghost ? '#c8102e' : '#fff')};
  border: 1px solid #c8102e;
  margin-top: ${(p) => (p.$spaced ? '10px' : '0')};
  flex-shrink: 0;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    filter: brightness(1.05);
  }
`;

const SwitchRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
`;

const Err = styled.div`
  background: #fff1f2;
  border: 1px solid #fecdd3;
  color: #9f1239;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.85rem;
  margin-bottom: 12px;
`;

const Ok = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.85rem;
  margin-bottom: 12px;
`;

const BalanceHero = styled.div`
  background: linear-gradient(135deg, #c8102e 0%, #8b0a1e 100%);
  color: #fff;
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: 16px;
`;

const BalanceLabel = styled.div`
  font-size: 0.75rem;
  opacity: 0.85;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const BalanceValue = styled.div`
  font-size: 1.85rem;
  font-weight: 700;
  margin-top: 4px;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 0.82rem;
  color: #666;
  margin-bottom: 14px;
`;

const Hint = styled.div`
  margin-top: 14px;
  font-size: 0.78rem;
  color: #888;
  line-height: 1.4;
`;

const EmptySide = styled.div`
  padding: 12px;
  font-size: 0.82rem;
  color: #888;
  line-height: 1.4;
`;

function activityLabel(row) {
  if (row.drained) return 'drained';
  if (row.activity === 'dormant') return 'dormant';
  if (row.activity === 'quiet') return 'quiet';
  return 'active';
}

export default function BankAyonPortal({
  accounts = [],
  onTransfer,
  onLogoutSession,
  onClose
}) {
  const sorted = useMemo(() => {
    const rank = (x) => {
      if (x.drained) return 3;
      if (x.activity === 'dormant') return 0;
      if (x.activity === 'quiet') return 1;
      return 2;
    };
    return [...accounts].sort((a, b) => rank(a) - rank(b));
  }, [accounts]);

  const live = useMemo(() => sorted.filter((a) => !a.drained), [sorted]);

  const [selectedId, setSelectedId] = useState(live[0]?.id || sorted[0]?.id || null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [session, setSession] = useState(null);
  const [busy, setBusy] = useState(false);
  const [amount, setAmount] = useState('');

  const selected = sorted.find((a) => a.id === selectedId) || null;
  const liveIndex = live.findIndex((a) => a.id === selectedId);

  const applyAccount = (row, { autoLogin = false } = {}) => {
    if (!row || row.drained) return;
    setSelectedId(row.id);
    setEmail(row.email || row.username || '');
    setPassword(row.password || '');
    setError('');
    setNotice(`Loaded ${row.name} from dump.`);
    if (autoLogin) {
      setSession(row);
      setAmount(String(Math.max(20, Math.floor(row.balance * 0.65))));
      setNotice(`Signed in as ${row.name}.`);
    } else if (session) {
      setSession(null);
    }
  };

  useEffect(() => {
    if (!selectedId && live[0]) {
      applyAccount(live[0]);
    } else if (selectedId && !email && selected && !selected.drained) {
      applyAccount(selected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]);

  useEffect(() => {
    if (!session) return;
    const fresh = accounts.find((a) => a.id === session.id);
    if (!fresh || fresh.drained) {
      setSession(null);
      setNotice('That account was emptied. Pick another from the list.');
      const next = live.find((a) => a.id !== session.id);
      if (next) applyAccount(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, session?.id]);

  const selectAccount = (row) => {
    if (row.drained) return;
    if (session && session.id !== row.id) {
      setSession(null);
      setNotice('Signed out — loaded next dump profile.');
    }
    applyAccount(row);
  };

  const switchRelative = (dir) => {
    if (!live.length) return;
    const idx = liveIndex >= 0 ? liveIndex : 0;
    const next = live[(idx + dir + live.length) % live.length];
    if (session) {
      setSession(null);
    }
    applyAccount(next);
  };

  const login = (e) => {
    e?.preventDefault?.();
    setError('');
    const match = accounts.find(
      (a) =>
        !a.drained &&
        (a.email === email.trim() || a.username === email.trim()) &&
        a.password === password
    );
    if (!match) {
      setError('Sign-in failed. Pick a live profile from the left, or check password.');
      setSession(null);
      return;
    }
    setSelectedId(match.id);
    setSession(match);
    setAmount(String(Math.max(20, Math.floor(match.balance * 0.65))));
    setNotice(`Welcome, ${match.name}. Simulation only.`);
  };

  const loginSelected = () => {
    if (!selected || selected.drained) {
      setError('Select a live dump account first.');
      return;
    }
    applyAccount(selected, { autoLogin: true });
  };

  const transfer = () => {
    if (!session || busy) return;
    const value = Math.min(session.balance, Math.max(1, Math.round(Number(amount) || 0)));
    if (value <= 0) {
      setError('Enter a transfer amount.');
      return;
    }
    setBusy(true);
    setError('');
    window.setTimeout(() => {
      const drainedId = session.id;
      onTransfer?.({
        accountId: drainedId,
        amount: value,
        heat: session.transferHeat || 10,
        victim: session.name,
        accountNumber: session.accountNumber
      });
      setNotice(`Transfer of $${value} to ${AYON_MULE} completed (sim).`);
      setSession(null);
      setAmount('');
      setBusy(false);
      onLogoutSession?.();
      const remaining = accounts.filter((a) => !a.drained && a.id !== drainedId);
      if (remaining[0]) applyAccount(remaining[0]);
      else {
        setEmail('');
        setPassword('');
      }
    }, 700);
  };

  const logout = () => {
    setSession(null);
    setNotice('Signed out of Ayon Online. Pick another profile anytime.');
    onLogoutSession?.();
  };

  return (
    <Shell>
      <TopBar>
        <Brand>
          <LogoMark>A</LogoMark>
          <div>
            <div>Bank Ayon</div>
            <Tag>Online Banking · Simulation</Tag>
          </div>
        </Brand>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {session ? (
            <Btn $ghost $auto type="button" onClick={logout}>
              Sign out
            </Btn>
          ) : (
            <Tag>Secure login</Tag>
          )}
          {onClose && (
            <Btn $ghost $auto type="button" onClick={onClose}>
              Close portal
            </Btn>
          )}
        </div>
      </TopBar>

      <Layout>
        <Side>
          <SideTitle>Dump profiles ({live.length} live)</SideTitle>
          {sorted.length === 0 ? (
            <EmptySide>
              No Bank Ayon list yet. Buy “Bank Ayon Customer List” in the Store marketplace, then
              reopen this portal.
            </EmptySide>
          ) : (
            sorted.map((row) => (
              <AccountBtn
                key={row.id}
                type="button"
                $active={row.id === selectedId}
                $drained={row.drained}
                disabled={row.drained}
                onClick={() => selectAccount(row)}
              >
                <AccName>{row.name}</AccName>
                <AccMeta>
                  {row.email}
                  <br />
                  ${row.balance}
                  {row.lastTransferMonths ? ` · last xfer ~${row.lastTransferMonths}mo` : ''}
                </AccMeta>
                <AccBadge $kind={activityLabel(row)}>{activityLabel(row)}</AccBadge>
              </AccountBtn>
            ))
          )}
        </Side>

        <Main>
          {!session ? (
            <Card>
              <Title>Sign in</Title>
              <Sub>
                Select a dump profile on the left — username and password fill automatically. Prefer
                dormant / quiet accounts. Switch profiles anytime, then sign in.
              </Sub>
              {error && <Err>{error}</Err>}
              {notice && <Ok>{notice}</Ok>}

              {live.length > 0 && (
                <SwitchRow>
                  <Btn $ghost type="button" onClick={() => switchRelative(-1)}>
                    ← Prev user
                  </Btn>
                  <Btn $ghost type="button" onClick={() => switchRelative(1)}>
                    Next user →
                  </Btn>
                </SwitchRow>
              )}

              <form onSubmit={login}>
                <Label htmlFor="ayon-user">Email / username</Label>
                <Input
                  id="ayon-user"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Pick a profile or type…"
                />
                <Label htmlFor="ayon-pass">Password</Label>
                <Input
                  id="ayon-pass"
                  type="text"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Filled from dump"
                />
                <Btn type="submit">Sign in to Ayon</Btn>
                <Btn $ghost $spaced type="button" disabled={!selected || selected.drained} onClick={loginSelected}>
                  One-click login selected profile
                </Btn>
              </form>
              <Hint>
                {accounts.length === 0
                  ? 'Purchase the Bank Ayon Customer List to unlock profiles.'
                  : `${live.length} live · ${accounts.length - live.length} drained · red portal only on laptop/web sim.`}
              </Hint>
            </Card>
          ) : (
            <Card>
              <BalanceHero>
                <BalanceLabel>Available balance</BalanceLabel>
                <BalanceValue>${session.balance.toLocaleString()}</BalanceValue>
              </BalanceHero>
              <MetaRow>
                <span>{session.name}</span>
                <span>{session.accountNumber}</span>
              </MetaRow>
              <MetaRow>
                <span style={{ textTransform: 'capitalize' }}>{activityLabel(session)}</span>
                <span>{session.email}</span>
              </MetaRow>
              {error && <Err>{error}</Err>}
              {notice && <Ok>{notice}</Ok>}

              <SwitchRow>
                <Btn $ghost type="button" onClick={() => { logout(); switchRelative(-1); }}>
                  ← Switch user
                </Btn>
                <Btn $ghost type="button" onClick={() => { logout(); switchRelative(1); }}>
                  Switch user →
                </Btn>
              </SwitchRow>

              <Label htmlFor="ayon-to">Transfer to (burner drop)</Label>
              <Input id="ayon-to" value={AYON_MULE} readOnly />
              <Hint style={{ marginTop: 0, marginBottom: 12 }}>{AYON_MULE_NOTE}</Hint>
              <Label htmlFor="ayon-amt">Amount (USD)</Label>
              <Input
                id="ayon-amt"
                type="number"
                min="1"
                max={session.balance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Btn type="button" disabled={busy} onClick={transfer}>
                {busy ? 'Processing…' : 'Transfer funds'}
              </Btn>
              <Btn $ghost $spaced type="button" onClick={logout}>
                Sign out
              </Btn>
              <Hint>
                Sign out or use Switch user to hop dump profiles. Each transfer raises police heat.
              </Hint>
            </Card>
          )}
        </Main>
      </Layout>
    </Shell>
  );
}
