// src/pages/TermsPage.jsx
import { Link } from 'react-router-dom';
export default function TermsPage() {
  return (
    <div style={{ background: '#F7F3EE', minHeight: '100vh', padding: '40px 24px', fontFamily: "'Pretendard', -apple-system, sans-serif", maxWidth: '600px', margin: '0 auto' }}>
      <Link to="/" style={{ color: '#8B7355', fontSize: '13px', textDecoration: 'none', display: 'block', marginBottom: '24px' }}>← 홈으로</Link>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#2C1A0E', marginBottom: '16px' }}>이용약관</h1>
      <p style={{ fontSize: '13px', color: '#7A6050', lineHeight: 1.8 }}>
        본 서비스는 반려동물 사후 디지털 돌봄 서비스로, 심리 치료를 대체하지 않습니다.
        서비스 이용 시 관련 법령 및 본 약관을 준수해주세요.
        서비스 관련 문의: petfuture@gmail.com
      </p>
    </div>
  );
}
