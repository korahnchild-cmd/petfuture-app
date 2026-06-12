// src/pages/HomePage.jsx
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shield, Sparkles } from 'lucide-react';

// ── 돌봄 액션 9가지
const CARE_ACTIONS = [
  { icon: '🍚', label: '밥 주기' },
  { icon: '💧', label: '물 갈기' },
  { icon: '🤚', label: '쓰다듬기' },
  { icon: '🌿', label: '산책' },
  { icon: '🧹', label: '화장실 청소' },
  { icon: '🎾', label: '장난감 놀기' },
  { icon: '💬', label: '말 걸기' },
  { icon: '📷', label: '사진 찍기' },
  { icon: '🎂', label: '생일 이벤트' },
];

// ── 요금제 (2플랜)
const PLANS = [
  {
    name: 'Lite',
    price: '8,900',
    desc: '나 혼자, 조용히',
    sub: '하루 297원 — 커피값의 1/15',
    features: ['2D 캐릭터 1마리 영구 보관', '돌봄 액션 9가지 전체', '함께한 날들 카운터', '기일·생일 알림·스트리크', '추억 갤러리', 'AI 한 줄 편지 (매일)'],
    highlight: false,
  },
  {
    name: 'Family',
    price: '16,900',
    desc: '가족과 함께, 어디서든',
    sub: '5인 기준 1인당 월 3,380원',
    features: ['Lite 전체 포함', '캐릭터 최대 3마리', '가족 공유 최대 5인', '공동 돌봄 기여도 표시', '캐릭터 스킨·의상 변경', '기념일 이미지 카드 자동 생성'],
    highlight: true,
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useApp();

  const handleStart = () => {
    if (user) navigate('/care');
    else navigate('/login');
  };

  return (
    <div style={{ background: '#F7F3EE', minHeight: '100vh', fontFamily: "'Pretendard', -apple-system, sans-serif" }}>

      {/* ── 네비 ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(247,243,238,0.92)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(139,90,60,0.10)',
        padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: '18px', fontWeight: 800, color: '#3D2410', letterSpacing: '-0.5px' }}>
          Pet<span style={{ color: '#8B7355' }}>future</span>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {['서비스 소개', '돌봄 기능', '요금제'].map((label, i) => (
            <a key={label} href={['#solution', '#actions', '#pricing'][i]}
              style={{ fontSize: '13px', color: '#7A6050', textDecoration: 'none', fontWeight: 500 }}>
              {label}
            </a>
          ))}
          <button onClick={handleStart} style={{
            background: '#8B7355', color: '#fff', border: 'none', borderRadius: '8px',
            padding: '8px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
          }}>
            베타 신청
          </button>
        </div>
      </nav>

      {/* ── 히어로 ── */}
      <section style={{ padding: '80px 24px 64px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(139,115,85,0.10)', border: '1px solid rgba(139,115,85,0.25)',
          borderRadius: '20px', padding: '5px 14px', marginBottom: '28px',
          fontSize: '11px', fontWeight: 700, color: '#8B7355', letterSpacing: '0.06em',
        }}>
          🐾 반려동물 사후 디지털 돌봄 서비스
        </div>

        <h1 style={{ fontSize: '40px', fontWeight: 900, color: '#2C1A0E', lineHeight: 1.2, marginBottom: '12px', letterSpacing: '-1px' }}>
          서서히, 자연스럽게<br />
          <em style={{ fontStyle: 'italic', color: '#8B7355' }}>잊혀지게</em>
        </h1>
        <p style={{ fontSize: '15px', color: '#7A6050', lineHeight: 1.7, marginBottom: '8px' }}>
          이별이 오기 전, 지금 이 순간부터.
        </p>
        <p style={{ fontSize: '14px', color: '#9A8070', lineHeight: 1.7, marginBottom: '36px' }}>
          영원히 기억하는 서비스가 아닙니다.<br />
          새로운 반려동물이 그 자리를 채울 때까지 —<br />
          서서히, 자연스럽게 일상으로 돌아오도록.
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleStart} style={{
            background: 'linear-gradient(135deg, #8B7355, #6B5340)',
            color: '#fff', border: 'none', borderRadius: '12px',
            padding: '14px 32px', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(139,115,85,0.35)',
          }}>
            🐾 무료로 시작하기
          </button>
          <a href="#solution" style={{
            background: '#fff', color: '#8B7355',
            border: '1.5px solid rgba(139,115,85,0.3)',
            borderRadius: '12px', padding: '14px 24px',
            fontSize: '15px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center',
          }}>
            서비스 알아보기
          </a>
        </div>

        {/* 함께한 날들 카운터 */}
        <div style={{
          marginTop: '48px', background: '#fff',
          border: '1px solid rgba(139,115,85,0.15)',
          borderRadius: '16px', padding: '24px',
          display: 'inline-block', minWidth: '200px',
        }}>
          <div style={{ fontSize: '48px', fontWeight: 900, color: '#8B7355', lineHeight: 1 }}>2,847</div>
          <div style={{ fontSize: '12px', color: '#9A8070', marginTop: '6px', fontWeight: 600 }}>
            함께한 날들 · 매일 자정 +1
          </div>
        </div>

        {/* 창업자 인용 */}
        <blockquote style={{
          marginTop: '32px', padding: '20px 24px',
          background: 'rgba(139,115,85,0.06)',
          borderLeft: '3px solid #8B7355',
          borderRadius: '0 12px 12px 0',
          textAlign: 'left', color: '#7A6050', fontSize: '14px', lineHeight: 1.7,
        }}>
          "저도 반려견을 키우고 있습니다.<br />
          그 이별을 대비해서 <em>만들었습니다.</em>"
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#9A8070', fontWeight: 600 }}>
            — 김성훈, Petfuture 창업자
          </div>
        </blockquote>
      </section>

      {/* ── 공감 섹션 ── */}
      <section id="solution" style={{ background: '#fff', padding: '64px 24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#8B7355', letterSpacing: '0.1em', marginBottom: '10px' }}>
              PETFUTURE의 접근
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#2C1A0E', lineHeight: 1.3 }}>
              슬픔을 붙잡지 않고,<br />
              <em style={{ color: '#8B7355' }}>자연스럽게 통과합니다</em>
            </h2>
          </div>

          {[
            { icon: '🌅', title: '일상이 무너집니다', desc: '아침 밥을 챙기던 루틴, 퇴근 후 산책 시간, 밤에 옆에 있던 온기. 이별은 하루의 리듬 전체를 흔들어 놓습니다.' },
            { icon: '💼', title: '업무에도 지장이 생깁니다', desc: '집중이 안 되고, 갑자기 눈물이 납니다. 가족을 잃은 슬픔은 일터에서도 예외가 없습니다.' },
            { icon: '👧', title: '아이들은 더 힘들어합니다', desc: '첫 이별을 경험하는 아이들에게 "죽음"을 어떻게 설명해야 할지 막막합니다.' },
            { icon: '🔄', title: '그런데, 잊어야 하나요?', desc: '영원히 기억하는 것도, 빨리 잊는 것도 정답이 아닙니다. 자연스럽게 통과하는 길이 있습니다.' },
          ].map((item) => (
            <div key={item.title} style={{
              display: 'flex', gap: '16px', alignItems: 'flex-start',
              padding: '20px 0', borderBottom: '1px solid rgba(139,115,85,0.08)',
            }}>
              <span style={{ fontSize: '28px', flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#2C1A0E', marginBottom: '4px' }}>{item.title}</div>
                <div style={{ fontSize: '13px', color: '#7A6050', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { num: '01', title: '생전과 동일한 돌봄', desc: '손가락이 기억하는 행동을 그대로 이어갑니다.' },
              { num: '02', title: 'AI 캐릭터 자동 생성', desc: '사진 5~20장으로 24시간 내 캐릭터 완성.' },
              { num: '03', title: '심리학적 근거', desc: 'Continuing Bonds Theory 기반 설계.' },
              { num: '04', title: '이탈이 곧 성공', desc: '새 반려동물이 그 자리를 채울 때까지.' },
            ].map((item) => (
              <div key={item.num} style={{
                background: 'rgba(139,115,85,0.05)', borderRadius: '12px', padding: '16px',
                border: '1px solid rgba(139,115,85,0.10)',
              }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#8B7355', letterSpacing: '0.06em', marginBottom: '6px' }}>
                  {item.num}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#2C1A0E', marginBottom: '4px' }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: '#9A8070', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 돌봄 액션 9가지 ── */}
      <section id="actions" style={{ padding: '64px 24px', background: '#F7F3EE' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#8B7355', letterSpacing: '0.1em', marginBottom: '10px' }}>
            돌봄 액션
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#2C1A0E', marginBottom: '8px', lineHeight: 1.3 }}>
            현실과 똑같이,<br />
            <em style={{ color: '#8B7355' }}>9가지 돌봄</em>
          </h2>
          <p style={{ fontSize: '13px', color: '#9A8070', marginBottom: '32px', lineHeight: 1.6 }}>
            손이 기억하는 그 행동 그대로입니다.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {CARE_ACTIONS.map((action) => (
              <div key={action.label} style={{
                background: '#fff', borderRadius: '12px', padding: '18px 8px',
                border: '1px solid rgba(139,115,85,0.12)', textAlign: 'center',
              }}>
                <div style={{ fontSize: '26px', marginBottom: '6px' }}>{action.icon}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#7A6050' }}>{action.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 요금제 ── */}
      <section id="pricing" style={{ padding: '64px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#8B7355', letterSpacing: '0.1em', marginBottom: '10px' }}>
            요금제
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#2C1A0E', marginBottom: '8px' }}>
            함께하는 방식을 <em style={{ color: '#8B7355' }}>선택하세요</em>
          </h2>
          <p style={{ fontSize: '13px', color: '#9A8070', marginBottom: '36px' }}>
            14일 무료 체험 후 결정하세요. 언제든 변경 가능합니다.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', maxWidth: '480px', margin: '0 auto' }}>
            {PLANS.map((plan) => (
              <div key={plan.name} style={{
                background: plan.highlight ? 'linear-gradient(135deg, #8B7355, #6B5340)' : '#F7F3EE',
                borderRadius: '16px', padding: '24px 18px',
                border: plan.highlight ? 'none' : '1px solid rgba(139,115,85,0.15)',
                position: 'relative',
              }}>
                {plan.highlight && (
                  <div style={{
                    position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                    background: '#E8A87C', borderRadius: '20px', padding: '3px 12px',
                    fontSize: '10px', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap',
                  }}>
                    가족과 함께
                  </div>
                )}
                <div style={{ fontSize: '16px', fontWeight: 800, color: plan.highlight ? '#fff' : '#2C1A0E', marginBottom: '2px' }}>
                  {plan.name}
                </div>
                <div style={{ fontSize: '11px', color: plan.highlight ? 'rgba(255,255,255,0.7)' : '#9A8070', marginBottom: '12px' }}>
                  {plan.desc}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: plan.highlight ? '#fff' : '#8B7355', marginBottom: '2px' }}>
                  ₩{plan.price}<span style={{ fontSize: '12px', fontWeight: 500 }}>/월</span>
                </div>
                <div style={{ fontSize: '10px', color: plan.highlight ? 'rgba(255,255,255,0.6)' : '#9A8070', marginBottom: '16px' }}>
                  {plan.sub}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', textAlign: 'left' }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{
                      fontSize: '11px', color: plan.highlight ? 'rgba(255,255,255,0.85)' : '#7A6050',
                      padding: '3px 0', display: 'flex', alignItems: 'flex-start', gap: '6px',
                    }}>
                      <span style={{ color: plan.highlight ? '#E8A87C' : '#8B7355', fontWeight: 700, flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={handleStart} style={{
                  width: '100%', padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  background: plan.highlight ? '#fff' : '#8B7355',
                  color: plan.highlight ? '#8B7355' : '#fff',
                  fontSize: '12px', fontWeight: 700,
                }}>
                  14일 무료 시작
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 베타 신청 ── */}
      <section id="beta" style={{ padding: '64px 24px', background: '#2C1A0E', textAlign: 'center' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#8B7355', letterSpacing: '0.1em', marginBottom: '12px' }}>
            베타 얼리버드
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#F7F3EE', marginBottom: '10px', lineHeight: 1.3 }}>
            먼저 경험하고,<br />함께 만들어 주세요
          </h2>
          <p style={{ fontSize: '13px', color: '#9A8070', marginBottom: '28px', lineHeight: 1.6 }}>
            베타 신청자에게는 출시 즉시 안내드립니다.<br />얼리버드 혜택과 함께 가장 먼저 시작할 수 있습니다.
          </p>
          <div style={{ display: 'flex', gap: '8px', maxWidth: '360px', margin: '0 auto 20px' }}>
            <input type="email" placeholder="이메일 주소를 입력하세요"
              style={{
                flex: 1, padding: '12px 16px', borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)',
                color: '#F7F3EE', fontSize: '13px', outline: 'none',
              }} />
            <button style={{
              background: '#8B7355', color: '#fff', border: 'none', borderRadius: '10px',
              padding: '12px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
            }}>
              신청하기
            </button>
          </div>
          <p style={{ fontSize: '11px', color: '#7A6050' }}>스팸 없음. 출시 소식만 보내드립니다.</p>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '28px' }}>
            {[['30일', '무료 체험'], ['얼리버드', '특별 혜택'], ['552만', '반려동물 양육 가구']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#8B7355' }}>{num}</div>
                <div style={{ fontSize: '10px', color: '#7A6050', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 푸터 ── */}
      <footer style={{
        background: '#1C0E06', padding: '28px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <div style={{ fontSize: '16px', fontWeight: 800, color: '#F7F3EE' }}>
          Pet<span style={{ color: '#8B7355' }}>future</span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          {[['개인정보처리방침', '/privacy'], ['이용약관', '/terms']].map(([label, to]) => (
            <Link key={label} to={to} style={{ fontSize: '11px', color: '#7A6050', textDecoration: 'underline' }}>
              {label}
            </Link>
          ))}
        </div>
        <div style={{ fontSize: '11px', color: '#5A4030' }}>© 2026 Petfuture. All rights reserved.</div>
      </footer>

      {/* 면책 고지 */}
      <div style={{ background: '#1C0E06', padding: '0 24px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '10px', color: '#5A4030', lineHeight: 1.6 }}>
          본 서비스는 심리 치료를 대체하지 않으며, 자연스러운 애도를 돕는 디지털 돌봄 서비스입니다.<br />
          심각한 펫로스 증후군은 전문 상담사와 상담하시기 바랍니다.
        </p>
      </div>
    </div>
  );
}
