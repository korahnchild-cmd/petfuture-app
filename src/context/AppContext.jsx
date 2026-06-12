// src/context/AppContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [pet, setPet] = useState(null);           // 현재 선택된 반려동물
  const [subscription, setSubscription] = useState(null); // 'free' | 'lite' | 'family' | 'premium'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Firestore에서 사용자 데이터 로드
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setSubscription(data.subscription || 'free');
            if (data.activePetId) {
              const petDoc = await getDoc(doc(db, 'users', firebaseUser.uid, 'pets', data.activePetId));
              if (petDoc.exists()) setPet({ id: petDoc.id, ...petDoc.data() });
            }
          }
        } catch (e) {
          console.error('유저 데이터 로드 실패', e);
        }
      } else {
        setUser(null);
        setPet(null);
        setSubscription(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 파트너 수익 프로그램 없음 — 레퍼럴 코드 불필요

  return (
    <AppContext.Provider value={{
      user, setUser,
      pet, setPet,
      subscription, setSubscription,
      loading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
