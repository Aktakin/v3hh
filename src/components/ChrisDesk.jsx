import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FaUserSecret,
  FaUniversity,
  FaBroadcastTower,
  FaEnvelope,
  FaFire,
  FaCheckCircle,
  FaSkullCrossbones
} from 'react-icons/fa';
import { buildChrisTaskCards, CHRIS_FIRST_BATCH, firstBatchComplete } from '../ops/chrisTasks';

const Shell = styled.div`
  max-width: 1040px;
  margin: 0 auto;
`;

const Hero = styled(motion.div)`
  background: linear-gradient(145deg, rgba(18, 27, 46, 0.8), rgba(11, 18, 33, 0.88));
  border: 1px solid rgba(96, 165, 250, 0.35);
  border-radius: 16px;
  padding: 18px 20px;
  margin-bottom: 16px;
  box-shadow:
    0 18px 42px rgba(0, 0, 0, 0.35),
    inset 0 0 0 1px rgba(255, 255, 255, 0.03);
`;

const Kicker = styled.div`
  color: #93c5fd;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 1.55rem;
  color: #e8f1ff;
`;

const Lead = styled.p`
  margin: 0;
  color: #9ca3af;
  font-size: 0.95rem;
  line-height: 1.5;
  max-width: 62ch;
`;

const PauseNote = styled.div`
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(251, 191, 36, 0.35);
  background: rgba(251, 191, 36, 0.08);
  color: #fde68a;
  font-size: 0.85rem;
  line-height: 1.45;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
`;

const Card = styled(motion.div)`
  text-align: left;
  border-radius: 14px;
  border: 1px solid ${(p) => (p.$done ? 'rgba(134,239,172,0.45)' : p.$accent || 'rgba(255,255,255,0.12)')};
  background: linear-gradient(160deg, rgba(12, 18, 32, 0.95), rgba(8, 12, 22, 0.98));
  color: #e5e7eb;
  overflow: hidden;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
`;

const CardTop = styled.div`
  padding: 16px 16px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(
    135deg,
    ${(p) => `${p.$accent}33` || 'transparent'} 0%,
    transparent 55%
  );
`;

const CardTag = styled.span`
  display: inline-block;
  font-size: 0.68rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: ${(p) => p.$accent || '#93c5fd'};
  margin-bottom: 8px;
  font-weight: 700;
`;

const CardTitle = styled.div`
  font-size: 1.15rem;
  font-weight: 700;
  color: #f3f4f6;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CardBody = styled.div`
  padding: 12px 16px 16px;
`;

const CardBlurb = styled.p`
  margin: 0 0 10px;
  font-size: 0.88rem;
  line-height: 1.45;
  color: #c5d0db;
`;

const CardDetail = styled.p`
  margin: 0 0 14px;
  font-size: 0.8rem;
  line-height: 1.4;
  color: #9ca3af;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const CtaBtn = styled.button`
  border-radius: 8px;
  border: 1px solid ${(p) => p.$accent || 'rgba(147,197,253,0.45)'};
  background: ${(p) => (p.$ghost ? 'transparent' : `${p.$accent || '#60a5fa'}22`)};
  color: ${(p) => (p.$done ? '#bbf7d0' : '#e5e7eb')};
  padding: 8px 12px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: default;
  }
`;

const Empty = styled.div`
  border: 1px dashed rgba(148, 163, 184, 0.35);
  border-radius: 14px;
  padding: 28px 20px;
  color: #9ca3af;
  text-align: center;
  line-height: 1.5;
`;

function cardIcon(taskId) {
  if (taskId === 'chris-ayon') return FaUniversity;
  if (taskId === 'chris-ops') return FaBroadcastTower;
  if (taskId === 'chris-phish') return FaEnvelope;
  if (taskId === 'chris-burn') return FaFire;
  if (taskId === 'chris-betrayal') return FaSkullCrossbones;
  return FaUserSecret;
}

export default function ChrisDesk({
  seenLessons = [],
  completedTasks = [],
  betrayalDone = false,
  onOpenTask,
  onCompleteTask,
  onRequestBetrayal
}) {
  const cards = buildChrisTaskCards(seenLessons);
  const batchDelivered = CHRIS_FIRST_BATCH.every((id) => seenLessons.includes(id));
  const batchDone = firstBatchComplete(completedTasks);
  const paused = batchDelivered && !batchDone;
  const canPullBetrayal = !betrayalDone;

  return (
    <Shell>
      <Hero initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Kicker>
          <FaUserSecret /> Dead-drop desk · no reply
        </Kicker>
        <Title>Chris</Title>
        <Lead>
          Tasks appear as Chris sends mail. Read each note before the burn timer arms. Finish the
          first three cards before he sends anything else.
        </Lead>
        {paused && (
          <PauseNote>
            Paused after three tasks. Complete Bank Ayon, Ops, and Inbox battlefield — then Chris
            writes again. It will not be gentle.
          </PauseNote>
        )}
        {batchDone && !betrayalDone && (
          <PauseNote>First three done. Check your inbox — Chris has a personal note for you.</PauseNote>
        )}
        {canPullBetrayal && (
          <div style={{ marginTop: 12 }}>
            <CtaBtn
              type="button"
              $accent="#f87171"
              onClick={() => onRequestBetrayal?.()}
            >
              Get Chris’s quiet-channel letter now →
            </CtaBtn>
          </div>
        )}
      </Hero>

      {cards.length === 0 ? (
        <Empty>
          No task cards yet. Read Chris’s hello mail (burn arms after you open it). When it clears,
          Bank Ayon lands first.
        </Empty>
      ) : (
        <Grid>
          {cards.map((task, index) => {
            const Icon = cardIcon(task.id);
            const done = completedTasks.includes(task.id);
            return (
              <Card
                key={task.id}
                $accent={task.accent}
                $done={done}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.06, 0.3) }}
              >
                <CardTop $accent={task.accent}>
                  <CardTag $accent={task.accent}>
                    {done ? 'Complete' : task.tag}
                  </CardTag>
                  <CardTitle>
                    <Icon aria-hidden />
                    {task.title}
                  </CardTitle>
                </CardTop>
                <CardBody>
                  <CardBlurb>{task.blurb}</CardBlurb>
                  <CardDetail>{task.detail}</CardDetail>
                  <Actions>
                    <CtaBtn
                      type="button"
                      $accent={task.accent}
                      onClick={() => onOpenTask?.(task)}
                    >
                      {task.cta} →
                    </CtaBtn>
                    {CHRIS_FIRST_BATCH.includes(task.id) && (
                      <CtaBtn
                        type="button"
                        $ghost
                        $accent={task.accent}
                        $done={done}
                        disabled={done}
                        onClick={() => onCompleteTask?.(task.id)}
                      >
                        {done ? (
                          <>
                            <FaCheckCircle style={{ marginRight: 6 }} />
                            Done
                          </>
                        ) : (
                          'Mark complete'
                        )}
                      </CtaBtn>
                    )}
                  </Actions>
                </CardBody>
              </Card>
            );
          })}
        </Grid>
      )}
    </Shell>
  );
}
