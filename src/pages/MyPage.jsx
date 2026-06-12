// src/pages/MyPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useApp } from '../context/AppContext';

export default function MyPage() {
  const navigate = useNavigate();
  const { user, pet, subscription, setUser } = useApp();
  const [copied, setCopied] = useState(false);
  const [refInput, setRefInput] = useState('');

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate('/');
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const myCode = user?.email?.slice(0, 2).toUpperCase() + '2847'; // 실제는 Firestore에서 로드
  const referralLink = `https://korahnchild-cmd.github.io/petfuture/?ref=${myCode}`;

  const PLAN_LABELS = { free: '무료', lite: 'Lite', family: 'Family', premium: 'Premium' };

  return (
    <div style={{
      background: '#F7F3EE', minHeight: '100vh',
      fontFamily: "'Pretendard', -apple-system, sans-serif",
      maxWidth: '480px', margin: '0 auto', padding: '0 0 40px',
    }}>
      {/* 헤더 */}
      <div style={{
        background: 'linear-gradient(135deg, #8B7355, #6B5340)',
        padding: '20px 20px 28px', color: '#fff',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button onClick={() => navigate('/care')} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '20px',
            padding: '5px 12px', color: '#fff', fontSize: '12px', cursor: 'pointer',
          }}>
            ← 돌아가기
          </button>
          <div style={{ fontSize: '15px', fontWeight: 800 }}>내 정보</div>
          <div style={{ width: '60px' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>👤</div>
          <div style={{ fontSize: '16px', fontWeight: 700 }}>{user?.displayName || user?.email?.split('@')[0] || '사용자'}</div>
          <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '2px' }}>{user?.email}</div>
          <div style={{
            display: 'inline-block', marginTop: '10px',
            background: 'rgba(255,255,255,0.2)', borderRadius: '20px',
            padding: '4px 14px', fontSize: '11px', fontWeight: 700,
          }}>
            {PLAN_LABELS[subscription || 'free']} 플랜
          </div>
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* 현재 반려동물 */}
        {pet && (
          <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', border: '1px solid rgba(139,115,85,0.10)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#8B7355', marginBottom: '10px', letterSpacing: '0.06em' }}>
              돌보는 아이
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '32px' }}>{pet.species === 'dog' ? '🐶' : '🐱'}</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#2C1A0E' }}>{pet.name}</div>
                <div style={{ fontSize: '12px', color: '#9A8070' }}>{pet.birthDate} ~ {pet.passedDate}</div>
              </div>
            </div>
          </div>
        )}

        {/* 구독 상태 */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', border: '1px solid rgba(139,115,85,0.10)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#8B7355', marginBottom: '12px', letterSpacing: '0.06em' }}>
            구독 플랜
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#2C1A0E' }}>
                {PLAN_LABELS[subscription || 'free']}
              </div>
              <div style={{ fontSize: '12px', color: '#9A8070' }}>
                {subscription === 'free' ? '30일 무료 체험 중' : '구독 중'}
              </div>
            </div>
            <button style={{
              background: '#8B7355', color: '#fff', border: 'none', borderRadius: '8px',
              padding: '8px 16px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
            }}>
              {subscription === 'free' ? '업그레이드' : '플랜 변경'}
            </button>
          </div>
        </div>

        {/* 레퍼럴 코드 */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', border: '1px solid rgba(139,115,85,0.10)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#8B7355', marginBottom: '12px', letterSpacing: '0.06em' }}>
            친구 초대하고 매달 수익 받기
          </div>
          <div style={{ fontSize: '12px', color: '#9A8070', marginBottom: '12px', lineHeight: 1.5 }}>
            친구가 가입하면 구독료의 25%를 매달 받아요
          </div>
          <div style={{
            background: 'rgba(139,115,85,0.06)', borderRadius: '10px', padding: '12px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px',
          }}>
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#8B7355', letterSpacing: '2px' }}>{myCode}</span>
            <button onClick={() => handleCopy(myCode)} style={{
              background: '#8B7355', color: '#fff', border: 'none', borderRadius: '6px',
              padding: '6px 12px', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
            }}>
              {copied ? '복사됨!' : '복사'}
            </button>
          </div>
          <button onClick={() => handleCopy(referralLink)} style={{
            width: '100%', padding: '10px', borderRadius: '10px',
            border: '1.5px solid rgba(139,115,85,0.25)', background: '#fff',
            color: '#8B7355', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
          }}>
            🔗 초대 링크 복사
          </button>
        </div>

        {/* 추천코드 입력 */}
        {!localStorage.getItem('referralUsed') && (
          <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', border: '1px solid rgba(139,115,85,0.10)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#8B7355', marginBottom: '10px', letterSpacing: '0.06em' }}>
              추천 코드 입력
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text" placeholder="추천 코드를 입력하세요"
                value={refInput} onChange={(e) => setRefInput(e.target.value.toUpperCase())}
                style={{
                  flex: 1, padding: '10px 12px', borderRadius: '8px',
                  border: '1.5px solid rgba(139,115,85,0.2)', background: '#F7F3EE',
                  fontSize: '13px', color: '#2C1A0E', outline: 'none', letterSpacing: '1px',
                }}
              />
              <button style={{
                background: '#8B7355', color: '#fff', border: 'none', borderRadius: '8px',
                padding: '10px 16px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              }}>
                적용
              </button>
            </div>
          </div>
        )}

        {/* 로그아웃 */}
        <button onClick={handleLogout} style={{
          width: '100%', padding: '14px', borderRadius: '12px',
          border: '1.5px solid rgba(220,38,38,0.2)', background: '#fff',
          color: '#DC2626', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
        }}>
          로그아웃
        </button>
      </div>
    </div>
  );
}
