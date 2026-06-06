import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const [userId, setUserId] = useState('')
  const [userPw, setUserPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: Number(userId), userPw }),
      })
      if (!res.ok) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.')
        return
      }
      const data = await res.json()
      login(data)
      navigate('/')
    } catch {
      setError('서버 연결에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.titleArea}>
        <h1 className={styles.title}>로그인</h1>
      </div>

      <div className={styles.cardWrap}>
        <div className={styles.card}>
          {/* 왼쪽 패널 */}
          <div className={styles.leftPanel}>
            <p className={styles.sub}>나에게 딱 맞는</p>
            <p className={styles.accent}>IT개발업체&amp;프리랜서 3일안에</p>
            <div className={styles.illustration}>
              <svg viewBox="0 0 120 120" width="160" height="160">
                <circle cx="60" cy="60" r="55" fill="#fff3e0" />
                <text x="60" y="70" textAnchor="middle" fontSize="52">⚡</text>
              </svg>
            </div>
            <p className={styles.together}>프리모아와 함께하세요!</p>
            <div className={styles.dots}>
              <span className={styles.dot} />
              <span className={`${styles.dot} ${styles.active}`} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </div>

          {/* 오른쪽 패널 */}
          <div className={styles.rightPanel}>
            <button className={styles.socialNaver}>
              <span className={styles.socialIcon}>N</span>
              네이버 로그인
            </button>
            <button className={styles.socialGoogle}>
              <span className={styles.socialIcon}>G</span>
              Google 로그인
            </button>
            <button className={styles.socialKakao}>
              <span className={styles.socialIcon}>💬</span>
              카카오 로그인
            </button>

            <p className={styles.normalLabel}>일반회원 로그인</p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>👤</span>
                <input
                  type="number"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="아이디"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>🔒</span>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={userPw}
                  onChange={(e) => setUserPw(e.target.value)}
                  placeholder="패스워드"
                  required
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPw((v) => !v)}
                >
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>

              <div className={styles.options}>
                <label className={styles.checkLabel}>
                  <input type="checkbox" /> 로그인 유지
                </label>
                <div className={styles.links}>
                  <a href="#">아이디</a>
                  <span> | </span>
                  <a href="#">비밀번호 찾기</a>
                </div>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" className={styles.loginBtn} disabled={loading}>
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </form>

            <p className={styles.joinText}>아직 프리모아 회원이 아니신가요?</p>
            <p className={styles.joinBold}>
              지금 회원가입하고<br />
              무료로 비교 견적을 확인하세요!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
