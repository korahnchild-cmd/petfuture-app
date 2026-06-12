// src/pages/PrivacyPage.jsx
import { Link } from 'react-router-dom';
export default function PrivacyPage() {
  return (
    <div style={{ background: '#F7F3EE', minHeight: '100vh', padding: '40px 24px', fontFamily: "'Pretendard', -apple-system, sans-serif", maxWidth: '600px', margin: '0 auto' }}>
      <Link to="/" style={{ color: '#8B7355', fontSize: '13px', textDecoration: 'none', display: 'block', marginBottom: '24px' }}>← 홈으로</Link>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#2C1A0E', marginBottom: '16px' }}>개인정보처리방침</h1>
      <p style={{ fontSize: '13px', color: '#7A6050', lineHeight: 1.8 }}>
        Petfuture(이하 "서비스")는 이용자의 개인정보를 중요시하며, 관련 법령을 준수합니다.
        수집 항목: 이메일, 반려동물 정보, 돌봄 기록. 수집 목적: 서비스 제공 및 개선.
        보유 기간: 회원 탈퇴 시 즉시 삭제. 문의: petfuture@gmail.com
      </p>
    </div>
  );
}
