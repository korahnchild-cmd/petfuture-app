// src/pages/OnboardingPage.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

// ── 색상 팔레트
const C = {
  bg:      '#F7F3EE',
  white:   '#FFFFFF',
  brown:   '#8B7355',
  brownDk: '#6B5340',
  brownLt: 'rgba(139,115,85,0.12)',
  text:    '#2C1A0E',
  muted:   '#9A8070',
  border:  'rgba(139,115,85,0.22)',
};

// ── 견종 10종 (강아지)
const DOG_BREEDS = [
  { id: 'maltese',    label: '말티즈',      emoji: '🐩' },
  { id: 'pomeranian', label: '포메라니안',  emoji: '🦊' },
  { id: 'golden',     label: '골든리트리버',emoji: '🐕' },
  { id: 'shiba',      label: '시바이누',    emoji: '🦮' },
  { id: 'pug',        label: '퍼그',        emoji: '🐶' },
  { id: 'bichon',     label: '비숑',        emoji: '🐩' },
  { id: 'jindo',      label: '진도',        emoji: '🐕‍🦺' },
  { id: 'dachshund',  label: '닥스훈트',    emoji: '🌭' },
  { id: 'yorkshire',  label: '요크셔테리어',emoji: '🎀' },
  { id: 'poodle',     label: '푸들',        emoji: '🐩' },
];

// ── 묘종 (고양이)
const CAT_BREEDS = [
  { id: 'domestic',  label: '코리안숏헤어', emoji: '🐱' },
  { id: 'persian',   label: '페르시안',     emoji: '😸' },
  { id: 'russian',   label: '러시안블루',   emoji: '💙' },
  { id: 'scottish',  label: '스코티시폴드', emoji: '🐈' },
  { id: 'siamese',   label: '샴',           emoji: '🐈‍⬛' },
];

// ── 털 길이
const FUR_LENGTHS = [
  { id: 'short',  label: '짧음',     desc: '단모종',   icon: '▪' },
  { id: 'medium', label: '중간',     desc: '중모종',   icon: '▪▪' },
  { id: 'long',   label: '길고 풍성함', desc: '장모종', icon: '▪▪▪' },
];

// ── 털 색상
const FUR_COLORS = [
  { id: 'white',  label: '흰색',  hex: '#F5F0E8' },
  { id: 'cream',  label: '크림',  hex: '#E8D5A3' },
  { id: 'golden', label: '황금',  hex: '#D4A254' },
  { id: 'brown',  label: '갈색',  hex: '#8B5E3C' },
  { id: 'black',  label: '검정',  hex: '#2C2420' },
  { id: 'gray',   label: '회색',  hex: '#9BA0A8' },
];

// ── 눈 색상
const EYE_COLORS = [
  { id: 'black', label: '검정', hex: '#2C2420' },
  { id: 'brown', label: '갈색', hex: '#7B4F2E' },
  { id: 'blue',  label: '하늘', hex: '#5B9BD5' },
  { id: 'green', label: '초록', hex: '#5B8C5A' },
];

// ── 포인트 특징
const ACCESSORIES = [
  { id: 'none',    label: '없음',    icon: '✕' },
  { id: 'collar',  label: '목걸이',  icon: '📿' },
  { id: 'ribbon',  label: '리본',    icon: '🎀' },
  { id: 'bandana', label: '반다나',  icon: '🔵' },
  { id: 'star',    label: '별 귀걸이', icon: '⭐' },
];

// ── 단계 정의
const STEPS = [
  { id: 'species',   title: '어떤 아이인가요?',     sub: '종류를 선택해주세요' },
  { id: 'breed',     title: '견종 / 묘종',           sub: '가장 비슷한 품종을 골라주세요' },
  { id: 'furLength', title: '털 길이',               sub: '우리 아이의 털 길이는요?' },
  { id: 'furColor',  title: '털 색상',               sub: '주요 털 색상을 선택해주세요' },
  { id: 'eyeColor',  title: '눈 색상',               sub: '눈빛을 맞춰드릴게요' },
  { id: 'accessory', title: '포인트 특징',           sub: '좋아하던 것이 있었나요? (선택)' },
  { id: 'info',      title: '마지막으로 이름이요',   sub: '이름과 함께한 날들을 알려주세요' },
];

// ── SVG 캐릭터 프리뷰 컴포넌트
function PetPreview({ config }) {
  const { species, furColor, eyeColor, furLength, accessory } = config;
  const fur = FUR_COLORS.find(c => c.id === furColor)?.hex || '#E8D5A3';
  const eye = EYE_COLORS.find(c => c.id === eyeColor)?.hex || '#2C2420';
  const isCat = species === 'cat';
  const isLong = furLength === 'long';
  const isMedium = furLength === 'medium';

  return (
    <svg viewBox="0 0 120 130" width="120" height="130" xmlns="http://www.w3.org/2000/svg">
      {/* 그림자 */}
      <ellipse cx="60" cy="122" rx="28" ry="6" fill="rgba(0,0,0,0.08)" />

      {/* 장모종 몸통 퍼 */}
      {isLong && (
        <ellipse cx="60" cy="88" rx="34" ry="30" fill={fur} opacity="0.5" />
      )}
      {isMedium && (
        <ellipse cx="60" cy="88" rx="31" ry="28" fill={fur} opacity="0.35" />
      )}

      {/* 몸통 */}
      <ellipse cx="60" cy="88" rx="28" ry="26" fill={fur} />

      {/* 꼬리 */}
      {isCat ? (
        <path d={isLong
          ? "M88,90 Q108,70 100,55 Q96,48 90,55 Q98,68 82,85"
          : "M86,90 Q102,72 95,58 Q92,52 87,58 Q94,70 80,85"}
          fill={fur} stroke={fur} strokeWidth="1" />
      ) : (
        <path d={isLong
          ? "M86,85 Q108,65 104,50 Q100,42 94,50 Q100,63 82,82"
          : "M85,86 Q104,70 100,56 Q96,48 91,56 Q97,68 80,82"}
          fill={fur} />
      )}

      {/* 장모종 가슴 털 */}
      {(isLong || isMedium) && (
        <ellipse cx="60" cy="96" rx={isLong ? 18 : 14} ry={isLong ? 12 : 9}
          fill="white" opacity={isLong ? 0.55 : 0.4} />
      )}

      {/* 고양이 귀 */}
      {isCat && (<>
        <polygon points="38,56 30,36 48,50" fill={fur} />
        <polygon points="40,55 34,40 46,51" fill="#F4A0A0" opacity="0.6" />
        <polygon points="82,56 90,36 72,50" fill={fur} />
        <polygon points="80,55 86,40 74,51" fill="#F4A0A0" opacity="0.6" />
      </>)}

      {/* 강아지 귀 */}
      {!isCat && (<>
        <ellipse cx="37" cy="64" rx={isLong ? 14 : 11} ry={isLong ? 19 : 16}
          fill={fur} transform="rotate(-15,37,64)" />
        <ellipse cx="83" cy="64" rx={isLong ? 14 : 11} ry={isLong ? 19 : 16}
          fill={fur} transform="rotate(15,83,64)" />
      </>)}

      {/* 머리 */}
      <circle cx="60" cy="62" r={isLong ? 27 : 24} fill={fur} />

      {/* 장모종 머리 퍼 */}
      {isLong && (
        <circle cx="60" cy="54" r="18" fill={fur} opacity="0.45" />
      )}

      {/* 눈 흰자 */}
      <ellipse cx="50" cy="60" rx="7" ry="7.5" fill="white" />
      <ellipse cx="70" cy="60" rx="7" ry="7.5" fill="white" />

      {/* 눈동자 */}
      <ellipse cx="51" cy="61" rx={isCat ? 3.5 : 5} ry={isCat ? 5.5 : 5} fill={eye} />
      <ellipse cx="71" cy="61" rx={isCat ? 3.5 : 5} ry={isCat ? 5.5 : 5} fill={eye} />

      {/* 눈 하이라이트 */}
      <circle cx="53" cy="59" r="1.5" fill="white" opacity="0.9" />
      <circle cx="73" cy="59" r="1.5" fill="white" opacity="0.9" />

      {/* 코 */}
      {isCat ? (
        <path d="M57,69 L60,71 L63,69 Q60,74 57,69Z" fill="#E89090" />
      ) : (
        <ellipse cx="60" cy="70" rx="6" ry="4.5" fill="#D4A0A0" />
      )}

      {/* 입 */}
      <path d={isCat
        ? "M56,72 Q60,76 64,72"
        : "M55,73 Q60,78 65,73"}
        stroke="#C07070" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* 볼 홍조 */}
      <ellipse cx="44" cy="66" rx="5" ry="3.5" fill="#F4A0A0" opacity="0.35" />
      <ellipse cx="76" cy="66" rx="5" ry="3.5" fill="#F4A0A0" opacity="0.35" />

      {/* 앞발 */}
      <ellipse cx="46" cy="112" rx={isLong ? 11 : 9} ry="8" fill={fur} />
      <ellipse cx="74" cy="112" rx={isLong ? 11 : 9} ry="8" fill={fur} />
      {/* 발가락 */}
      <line x1="42" y1="117" x2="42" y2="119" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      <line x1="46" y1="118" x2="46" y2="120" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      <line x1="50" y1="117" x2="50" y2="119" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      <line x1="70" y1="117" x2="70" y2="119" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      <line x1="74" y1="118" x2="74" y2="120" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      <line x1="78" y1="117" x2="78" y2="119" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />

      {/* 악세서리 */}
      {accessory === 'collar' && (
        <rect x="46" y="82" width="28" height="6" rx="3" fill="#E8A87C" opacity="0.9" />
      )}
      {accessory === 'ribbon' && (
        <g transform="translate(52,46)">
          <polygon points="0,0 -8,-6 -8,6" fill="#F4A0C0" opacity="0.9" />
          <polygon points="0,0 8,-6 8,6" fill="#F4A0C0" opacity="0.9" />
          <circle cx="0" cy="0" r="3" fill="#E87090" opacity="0.9" />
        </g>
      )}
      {accessory === 'bandana' && (
        <path d="M46,82 Q60,92 74,82 L70,88 Q60,96 50,88Z"
          fill="#7EB8D4" opacity="0.85" />
      )}
      {accessory === 'star' && (<>
        <text x="36" y="55" fontSize="10" opacity="0.9">⭐</text>
        <text x="76" y="55" fontSize="10" opacity="0.9">⭐</text>
      </>)}
    </svg>
  );
}

// ── 선택 버튼 공통 컴포넌트
function ChoiceBtn({ selected, onClick, children, fullWidth = false }) {
  return (
    <button onClick={onClick} style={{
      padding: '10px 14px',
      borderRadius: '12px',
      border: selected ? `2px solid ${C.brown}` : `1.5px solid ${C.border}`,
      background: selected ? C.brownLt : C.white,
      color: selected ? C.brownDk : C.muted,
      fontSize: '13px', fontWeight: selected ? 700 : 500,
      cursor: 'pointer', transition: 'all 0.15s',
      width: fullWidth ? '100%' : 'auto',
      textAlign: 'center',
    }}>
      {children}
    </button>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, setPet } = useApp();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    species:   'dog',
    breed:     '',
    furLength: 'medium',
    furColor:  'cream',
    eyeColor:  'brown',
    accessory: 'none',
    name:      '',
    birthDate: '',
    passedDate:'',
  });

  const set = (key, val) => setConfig(p => ({ ...p, [key]: val }));

  const breeds = config.species === 'cat' ? CAT_BREEDS
               : config.species === 'dog' ? DOG_BREEDS
               : [];

  // 다음 버튼 활성 여부
  const canNext = useMemo(() => {
    if (step === 0) return true;
    if (step === 1) return config.species === 'other' || !!config.breed;
    if (step === 6) return !!config.name && !!config.birthDate;
    return true;
  }, [step, config]);

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else handleComplete();
  };

  const handleComplete = async () => {
    if (!user) { navigate('/care'); return; } // 데모 모드
    setSaving(true);
    try {
      const petId = `pet_${Date.now()}`;
      await setDoc(doc(db, 'users', user.uid, 'pets', petId), {
        ...config, createdAt: serverTimestamp(), streak: 0,
      });
      await updateDoc(doc(db, 'users', user.uid), { activePetId: petId });
      setPet({ id: petId, ...config });
      navigate('/care');
    } catch (e) {
      console.error('펫 등록 실패', e);
      navigate('/care');
    } finally { setSaving(false); }
  };

  return (
    <div style={{
      background: C.bg, minHeight: '100vh',
      fontFamily: "'Pretendard', -apple-system, sans-serif",
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '24px 20px 40px',
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>

        {/* 진행바 */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '28px' }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: '3px', borderRadius: '2px',
              background: i <= step ? C.brown : C.brownLt,
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {/* 캐릭터 프리뷰 — 항상 상단 고정 */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          marginBottom: '20px',
        }}>
          <div style={{
            background: C.white, borderRadius: '24px', padding: '20px 32px',
            border: `1px solid ${C.border}`,
            boxShadow: '0 2px 16px rgba(139,115,85,0.08)',
          }}>
            <PetPreview config={config} />
          </div>
          {config.name && (
            <div style={{
              marginTop: '10px', fontSize: '16px', fontWeight: 800,
              color: C.text,
            }}>
              {config.name}
            </div>
          )}
        </div>

        {/* 스텝 타이틀 */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            fontSize: '11px', fontWeight: 700, color: C.brown,
            letterSpacing: '0.08em', marginBottom: '6px',
          }}>
            {step + 1} / {STEPS.length}
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: C.text, marginBottom: '4px' }}>
            {STEPS[step].title}
          </h2>
          <p style={{ fontSize: '13px', color: C.muted }}>
            {STEPS[step].sub}
          </p>
        </div>

        {/* ── STEP 0: 종류 ── */}
        {step === 0 && (
          <div style={{ display: 'flex', gap: '10px' }}>
            {[['dog','🐶','강아지'],['cat','🐱','고양이'],['other','🐾','기타']].map(([v,e,l]) => (
              <ChoiceBtn key={v} selected={config.species === v} onClick={() => {
                set('species', v); set('breed', '');
              }} fullWidth>
                <div style={{ fontSize: '26px', marginBottom: '4px' }}>{e}</div>
                <div>{l}</div>
              </ChoiceBtn>
            ))}
          </div>
        )}

        {/* ── STEP 1: 견종/묘종 ── */}
        {step === 1 && (
          <div>
            {config.species === 'other' ? (
              <div style={{
                padding: '20px', background: C.brownLt, borderRadius: '14px',
                textAlign: 'center', color: C.muted, fontSize: '14px',
              }}>
                🐾 어떤 아이든 소중해요<br />
                <span style={{ fontSize: '12px' }}>다음 단계로 넘어갈게요</span>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {breeds.map(b => (
                  <ChoiceBtn key={b.id} selected={config.breed === b.id}
                    onClick={() => set('breed', b.id)}>
                    <span style={{ marginRight: '5px' }}>{b.emoji}</span>{b.label}
                  </ChoiceBtn>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: 털 길이 ── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FUR_LENGTHS.map(f => (
              <ChoiceBtn key={f.id} selected={config.furLength === f.id}
                onClick={() => set('furLength', f.id)} fullWidth>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 4px' }}>
                  <span style={{ fontWeight: 700 }}>{f.label}</span>
                  <span style={{ fontSize: '12px', color: C.muted }}>{f.desc}</span>
                </div>
              </ChoiceBtn>
            ))}
          </div>
        )}

        {/* ── STEP 3: 털 색상 ── */}
        {step === 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {FUR_COLORS.map(c => (
              <button key={c.id} onClick={() => set('furColor', c.id)} style={{
                padding: '12px 8px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: config.furColor === c.id ? C.brownLt : C.white,
                outline: config.furColor === c.id ? `2px solid ${C.brown}` : `1.5px solid ${C.border}`,
                transition: 'all 0.15s',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: c.hex, margin: '0 auto 8px',
                  border: '2px solid rgba(0,0,0,0.08)',
                  boxShadow: config.furColor === c.id ? `0 0 0 3px ${C.brown}40` : 'none',
                }} />
                <div style={{ fontSize: '11px', color: C.text, fontWeight: 600 }}>{c.label}</div>
              </button>
            ))}
          </div>
        )}

        {/* ── STEP 4: 눈 색상 ── */}
        {step === 4 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {EYE_COLORS.map(c => (
              <button key={c.id} onClick={() => set('eyeColor', c.id)} style={{
                padding: '14px 8px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: config.eyeColor === c.id ? C.brownLt : C.white,
                outline: config.eyeColor === c.id ? `2px solid ${C.brown}` : `1.5px solid ${C.border}`,
                transition: 'all 0.15s',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: c.hex, margin: '0 auto 8px',
                  border: '2px solid rgba(0,0,0,0.10)',
                  boxShadow: config.eyeColor === c.id ? `0 0 0 3px ${C.brown}40` : 'none',
                }} />
                <div style={{ fontSize: '11px', color: C.text, fontWeight: 600 }}>{c.label}</div>
              </button>
            ))}
          </div>
        )}

        {/* ── STEP 5: 악세서리 ── */}
        {step === 5 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {ACCESSORIES.map(a => (
              <ChoiceBtn key={a.id} selected={config.accessory === a.id}
                onClick={() => set('accessory', a.id)}>
                <div style={{ fontSize: '22px', marginBottom: '4px' }}>{a.icon}</div>
                <div style={{ fontSize: '12px' }}>{a.label}</div>
              </ChoiceBtn>
            ))}
          </div>
        )}

        {/* ── STEP 6: 이름 + 날짜 ── */}
        {step === 6 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: C.brown, display: 'block', marginBottom: '6px' }}>
                이름 *
              </label>
              <input type="text" placeholder="나비, 콩이, 피오..."
                value={config.name}
                onChange={e => set('name', e.target.value)}
                style={{
                  width: '100%', padding: '13px 16px', borderRadius: '12px',
                  border: `1.5px solid ${C.border}`, background: C.white,
                  fontSize: '16px', fontWeight: 700, color: C.text,
                  outline: 'none', boxSizing: 'border-box', textAlign: 'center',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: C.brown, display: 'block', marginBottom: '6px' }}>
                생년월일 * <span style={{ fontWeight: 400, color: C.muted }}>(함께한 날들 계산 기준)</span>
              </label>
              <input type="date" value={config.birthDate}
                onChange={e => set('birthDate', e.target.value)}
                style={{
                  width: '100%', padding: '13px 16px', borderRadius: '12px',
                  border: `1.5px solid ${C.border}`, background: C.white,
                  fontSize: '15px', color: C.text, outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: C.brown, display: 'block', marginBottom: '6px' }}>
                떠난 날짜 <span style={{ fontWeight: 400, color: C.muted }}>(선택 — 아직 함께라면 비워두세요)</span>
              </label>
              <input type="date" value={config.passedDate}
                onChange={e => set('passedDate', e.target.value)}
                style={{
                  width: '100%', padding: '13px 16px', borderRadius: '12px',
                  border: `1.5px solid ${C.border}`, background: C.white,
                  fontSize: '15px', color: C.text, outline: 'none', boxSizing: 'border-box',
                }}
              />
              <p style={{ fontSize: '11px', color: C.muted, marginTop: '6px', lineHeight: 1.6 }}>
                💛 시한부 선고를 받으셨나요? 지금 시작하셔도 됩니다.
              </p>
            </div>
          </div>
        )}

        {/* 버튼 영역 */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{
              flex: 1, padding: '14px', borderRadius: '12px',
              border: `1.5px solid ${C.border}`, background: C.white,
              color: C.brown, fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            }}>
              이전
            </button>
          )}
          <button onClick={handleNext} disabled={!canNext || saving} style={{
            flex: 2, padding: '14px', borderRadius: '12px', border: 'none',
            background: canNext
              ? `linear-gradient(135deg, ${C.brown}, ${C.brownDk})`
              : C.brownLt,
            color: canNext ? '#fff' : C.muted,
            fontSize: '14px', fontWeight: 700, cursor: canNext ? 'pointer' : 'default',
            transition: 'all 0.2s',
          }}>
            {saving ? '저장 중...'
              : step === STEPS.length - 1
              ? `🐾 ${config.name || '아이'}와 돌봄 시작하기`
              : '다음 →'}
          </button>
        </div>

        {/* 건너뛰기 (악세서리 단계) */}
        {step === 5 && (
          <button onClick={() => setStep(s => s + 1)} style={{
            width: '100%', marginTop: '10px', padding: '8px',
            background: 'none', border: 'none', color: C.muted,
            fontSize: '12px', cursor: 'pointer',
          }}>
            특징 없이 계속하기
          </button>
        )}

      </div>
    </div>
  );
}
