// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { useApp } from '../context/AppContext';
import { Mail, Lock, Eye, EyeOff, X } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setSubscription } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ERROR_MSGS = {
    'auth/user-not-found': '등록되지 않은 이메일입니다.',
    'auth/wrong-password': '비밀번호가 올바르지 않습니다.',
    'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
    'auth/weak-password': '비밀번호는 6자 이상이어야 합니다.',
    'auth/invalid-email': '이메일 형식을 확인해주세요.',
    'auth/invalid-credential': '이메일 또는 비밀번호를 확인해주세요.',
  };

  const afterLogin = async (firebaseUser) => {
    setUser(firebaseUser);
    // 신규 유저 Firestore 초기화
    const userRef = doc(db, 'users', firebaseUser.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      const referralCode = localStorage.getItem('referralCode') || null;
      await setDoc(userRef, {
        email: firebaseUser.email,
        subscription: 'free',
        referredBy: referralCode,
        createdAt: serverTimestamp(),
        // 추천 코드 자동 생성 (이름 앞 2글자 + 숫자 4자리)
        myReferralCode: firebaseUser.email.slice(0, 2).toUpperCase() + Math.floor(1000 + Math.random() * 9000),
      });
      setSubscription('free');
    } else {
      setSubscription(snap.data().subscription || 'free');
    }
    navigate('/onboarding');
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await afterLogin(result.user);
    } catch (err) {
      setError(ERROR_MSGS[err.code] || '구글 로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const cred = isLogin
        ? await signInWithEmailAndPassword(auth, email, password)
        : await createUserWithEmailAndPassword(auth, email, password);
      await afterLogin(cred.user);
    } catch (err) {
      setError(ERROR_MSGS[err.code] || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#F7F3EE', minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
      fontFamily: "'Pretendard', -apple-system, sans-serif",
    }}>
      <div style={{
        background: '#fff', borderRadius: '20px', padding: '32px 28px',
        width: '100%', maxWidth: '360px', boxShadow: '0 4px 24px rgba(44,26,14,0.08)',
      }}>
        <button onClick={() => navigate('/')} style={{
          background: 'none', border: 'none', cursor: 'pointer', float: 'right',
          color: '#9A8070', padding: '0',
        }}>
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🐾</div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#2C1A0E', marginBottom: '4px' }}>
            {isLogin ? '로그인' : '회원가입'}
          </h2>
          <p style={{ fontSize: '12px', color: '#9A8070' }}>
            {isLogin ? '계속 돌봄을 이어가세요' : '30일 무료 체험을 시작하세요'}
          </p>
        </div>

        {/* 구글 로그인 */}
        <button onClick={handleGoogle} disabled={loading} style={{
          width: '100%', padding: '12px', borderRadius: '10px',
          border: '1.5px solid rgba(44,26,14,0.12)', background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          fontSize: '14px', fontWeight: 600, color: '#2C1A0E', cursor: 'pointer', marginBottom: '16px',
        }}>
          <span style={{ fontSize: '18px' }}>G</span>
          Google로 {isLogin ? '로그인' : '가입'}하기
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(139,115,85,0.15)' }} />
          <span style={{ fontSize: '11px', color: '#9A8070' }}>또는</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(139,115,85,0.15)' }} />
        </div>

        <form onSubmit={handleEmail} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8B7355' }} />
            <input type="email" placeholder="이메일 주소" value={email}
              onChange={(e) => setEmail(e.target.value)} required
              style={{
                width: '100%', padding: '12px 12px 12px 38px', borderRadius: '10px',
                border: '1.5px solid rgba(139,115,85,0.2)', background: '#F7F3EE',
                fontSize: '13px', color: '#2C1A0E', outline: 'none', boxSizing: 'border-box',
              }} />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8B7355' }} />
            <input type={showPw ? 'text' : 'password'} placeholder="비밀번호 (6자 이상)" value={password}
              onChange={(e) => setPassword(e.target.value)} required minLength={6}
              style={{
                width: '100%', padding: '12px 38px 12px 38px', borderRadius: '10px',
                border: '1.5px solid rgba(139,115,85,0.2)', background: '#F7F3EE',
                fontSize: '13px', color: '#2C1A0E', outline: 'none', boxSizing: 'border-box',
              }} />
            <button type="button" onClick={() => setShowPw(v => !v)} style={{
              position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: '#9A8070',
            }}>
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', color: '#DC2626', fontSize: '12px', borderRadius: '8px', padding: '10px 12px', border: '1px solid #FECACA' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            background: 'linear-gradient(135deg, #8B7355, #6B5340)', color: '#fff',
            border: 'none', borderRadius: '10px', padding: '13px',
            fontSize: '14px', fontWeight: 700, cursor: 'pointer', marginTop: '4px',
          }}>
            {loading ? '처리 중...' : isLogin ? '로그인하고 계속하기' : '가입하고 시작하기'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#9A8070', marginTop: '16px' }}>
          {isLogin ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}{' '}
          <button onClick={() => { setIsLogin(v => !v); setError(''); }} style={{
            background: 'none', border: 'none', color: '#8B7355', fontWeight: 700, cursor: 'pointer', fontSize: '12px',
          }}>
            {isLogin ? '회원가입' : '로그인'}
          </button>
        </p>
      </div>
    </div>
  );
}
