// src/pages/CarePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const ACTIONS = [
  { id: 'feed',    icon: '🍚', label: '밥 주기',    stat: 'hunger',   effect: +15 },
  { id: 'water',   icon: '💧', label: '물 갈기',    stat: 'hydration', effect: +12 },
  { id: 'pet',     icon: '🤚', label: '쓰다듬기',   stat: 'bond',     effect: +10 },
  { id: 'walk',    icon: '🌿', label: '산책',       stat: 'energy',   effect: +15 },
  { id: 'toilet',  icon: '🧹', label: '화장실',     stat: 'clean',    effect: +10 },
  { id: 'play',    icon: '🎾', label: '장난감 놀기', stat: 'energy',   effect: +12 },
  { id: 'talk',    icon: '💬', label: '말 걸기',    stat: 'bond',     effect: +8  },
  { id: 'photo',   icon: '📷', label: '사진 찍기',  stat: 'memory',   effect: +5  },
  { id: 'birthday',icon: '🎂', label: '생일 이벤트', stat: 'bond',    effect: +20 },
];

const BOND_LEVELS = [
  { level: 1, label: '첫 만남',   min: 0   },
  { level: 2, label: '친구',      min: 30  },
  { level: 3, label: '가족',      min: 60  },
  { level: 4, label: '소울메이트', min: 85  },
];

function StatBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
        <span style={{ fontSize: '11px', color: '#9A8070' }}>{label}</span>
        <span style={{ fontSize: '11px', fontWeight: 700, color }}>{value}</span>
      </div>
      <div style={{ height: '6px', background: 'rgba(139,115,85,0.12)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
      </div>
    </div>
  );
}

export default function CarePage() {
  const navigate = useNavigate();
  const { user, pet } = useApp();
  const [todayActions, setTodayActions] = useState({});
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState({ hunger: 65, hydration: 45, bond: 72, energy: 80, clean: 90, memory: 60 });
  const [daysCount, setDaysCount] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [log, setLog] = useState([
    { time: '오전 7:30', text: `${pet?.name || '나비'}가 기지개를 켰어요 🌅` },
    { time: '오전 8:05', text: '창가에서 햇살을 맞고 있어요 ☀️' },
  ]);

  // 로그인 체크
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // 함께한 날수 계산
  useEffect(() => {
    if (pet?.birthDate) {
      const birth = new Date(pet.birthDate);
      const today = new Date();
      const diff = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
      setDaysCount(diff);
    } else {
      setDaysCount(2847); // 데모값
    }
  }, [pet]);

  // 오늘 돌봄 기록 로드
  useEffect(() => {
    if (!user || !pet) return;
    const today = new Date().toISOString().slice(0, 10);
    getDoc(doc(db, 'users', user.uid, 'pets', pet.id || 'demo', 'careLog', today))
      .then((snap) => {
        if (snap.exists()) setTodayActions(snap.data().actions || {});
      })
      .catch(() => {});
  }, [user, pet]);

  const bondLevel = BOND_LEVELS.slice().reverse().find(l => stats.bond >= l.min) || BOND_LEVELS[0];

  const handleAction = async (action) => {
    if (todayActions[action.id]) return; // 오늘 이미 한 액션

    // 상태 업데이트
    setStats(prev => ({
      ...prev,
      [action.stat]: Math.min(100, prev[action.stat] + action.effect),
    }));

    const newActions = { ...todayActions, [action.id]: true };
    setTodayActions(newActions);

    // 피드백 메시지
    const messages = {
      feed: `${pet?.name || '나비'}가 달려와 맛있게 먹어요 🍚`,
      water: `물을 마시며 만족스러워해요 💧`,
      pet: `눈을 감고 기분 좋아해요 🤚`,
      walk: `신나게 뛰어다니고 있어요 🌿`,
      toilet: `깨끗해진 공간에 만족해요 🧹`,
      play: `장난감을 물고 뛰어놀아요 🎾`,
      talk: `꼬리를 흔들며 듣고 있어요 💬`,
      photo: `포즈를 취하며 기다려요 📷`,
      birthday: `특별한 날을 함께해서 행복해요 🎂`,
    };
    setFeedback(messages[action.id] || '');
    setTimeout(() => setFeedback(''), 3000);

    // 일지 추가
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    setLog(prev => [{ time: timeStr, text: messages[action.id] || '' }, ...prev].slice(0, 10));

    // Firestore 저장
    if (user && pet) {
      const today = new Date().toISOString().slice(0, 10);
      try {
        await setDoc(doc(db, 'users', user.uid, 'pets', pet.id || 'demo', 'careLog', today), {
          actions: newActions,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (e) {
        console.error('돌봄 저장 실패', e);
      }
    }
  };

  const completedCount = Object.keys(todayActions).length;

  return (
    <div style={{ background: '#F7F3EE', minHeight: '100vh', fontFamily: "'Pretendard', -apple-system, sans-serif", maxWidth: '480px', margin: '0 auto' }}>

      {/* 헤더 */}
      <div style={{
        background: 'linear-gradient(135deg, #8B7355, #6B5340)',
        padding: '20px 20px 28px', color: '#fff',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800 }}>Pet<span style={{ opacity: 0.7 }}>future</span></div>
          <button onClick={() => navigate('/mypage')} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '20px',
            padding: '5px 12px', color: '#fff', fontSize: '12px', cursor: 'pointer',
          }}>
            👤 마이
          </button>
        </div>

        {/* 펫 이름 + 날수 */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '4px' }}>🐱</div>
          <div style={{ fontSize: '20px', fontWeight: 800 }}>{pet?.name || '나비'}</div>
          <div style={{ fontSize: '12px', opacity: 0.75, marginTop: '2px' }}>
            {pet?.birthYear || '2019'} – {pet?.passedYear || '2024'}
          </div>
          <div style={{ marginTop: '12px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 900 }}>{daysCount.toLocaleString()}</div>
              <div style={{ fontSize: '10px', opacity: 0.7 }}>함께한 날들 🔥</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 900 }}>{streak}</div>
              <div style={{ fontSize: '10px', opacity: 0.7 }}>연속 돌봄</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 900 }}>Lv.{bondLevel.level}</div>
              <div style={{ fontSize: '10px', opacity: 0.7 }}>{bondLevel.label}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px' }}>

        {/* 피드백 메시지 */}
        {feedback && (
          <div style={{
            background: 'rgba(139,115,85,0.10)', border: '1px solid rgba(139,115,85,0.2)',
            borderRadius: '10px', padding: '12px 16px', marginBottom: '12px',
            fontSize: '13px', color: '#6B5340', textAlign: 'center', fontWeight: 600,
            animation: 'fadeIn 0.3s ease',
          }}>
            {feedback}
          </div>
        )}

        {/* 상태 게이지 */}
        <div style={{
          background: '#fff', borderRadius: '14px', padding: '16px', marginBottom: '12px',
          border: '1px solid rgba(139,115,85,0.10)',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#8B7355', marginBottom: '12px', letterSpacing: '0.06em' }}>
            현재 상태
          </div>
          <StatBar label="배고픔" value={stats.hunger} color="#E8A87C" />
          <StatBar label="수분" value={stats.hydration} color="#7DBFA8" />
          <StatBar label="유대감" value={stats.bond} color="#8B7355" />
          <StatBar label="에너지" value={stats.energy} color="#A8C77D" />
        </div>

        {/* 오늘 돌봄 진행도 */}
        <div style={{
          background: '#fff', borderRadius: '14px', padding: '16px', marginBottom: '12px',
          border: '1px solid rgba(139,115,85,0.10)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#8B7355', letterSpacing: '0.06em' }}>
              오늘의 돌봄
            </div>
            <div style={{ fontSize: '11px', color: '#9A8070' }}>
              {completedCount}/{ACTIONS.length}
            </div>
          </div>

          {/* 9가지 돌봄 그리드 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {ACTIONS.map((action) => {
              const done = !!todayActions[action.id];
              return (
                <button key={action.id} onClick={() => handleAction(action)} style={{
                  background: done ? 'linear-gradient(135deg, #8B7355, #6B5340)' : 'rgba(139,115,85,0.06)',
                  border: done ? 'none' : '1px solid rgba(139,115,85,0.15)',
                  borderRadius: '10px', padding: '12px 6px', cursor: done ? 'default' : 'pointer',
                  textAlign: 'center', transition: 'all 0.2s',
                  opacity: action.id === 'birthday' && !pet?.isBirthday ? 0.4 : 1,
                }}>
                  <div style={{ fontSize: '22px', marginBottom: '4px' }}>{done ? '✅' : action.icon}</div>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: done ? '#fff' : '#7A6050' }}>
                    {action.label}
                  </div>
                </button>
              );
            })}
          </div>

          {completedCount === ACTIONS.length && (
            <div style={{
              marginTop: '12px', background: 'rgba(139,115,85,0.08)', borderRadius: '8px',
              padding: '10px', textAlign: 'center', fontSize: '12px', color: '#8B7355', fontWeight: 700,
            }}>
              🌙 오늘도 잘 돌봐줬어요
            </div>
          )}
        </div>

        {/* 오늘의 일지 */}
        <div style={{
          background: '#fff', borderRadius: '14px', padding: '16px',
          border: '1px solid rgba(139,115,85,0.10)',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#8B7355', marginBottom: '12px', letterSpacing: '0.06em' }}>
            오늘의 기록
          </div>
          {log.slice(0, 5).map((entry, i) => (
            <div key={i} style={{
              display: 'flex', gap: '10px', padding: '6px 0',
              borderBottom: i < 4 ? '1px solid rgba(139,115,85,0.06)' : 'none',
            }}>
              <span style={{ fontSize: '11px', color: '#9A8070', flexShrink: 0, minWidth: '52px' }}>{entry.time}</span>
              <span style={{ fontSize: '12px', color: '#5A4030', lineHeight: 1.5 }}>{entry.text}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
