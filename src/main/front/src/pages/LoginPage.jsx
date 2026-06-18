import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const [loginId, setLoginId] = useState('')
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
        body: JSON.stringify({ loginId, userPw }),
      })
      if (!res.ok) { setError('아이디 또는 비밀번호가 올바르지 않습니다.'); return }
      login(await res.json())
      navigate('/')
    } catch {
      setError('서버 연결에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>로그인</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrap}>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="아이디"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputWrap}>
            <input
              type={showPw ? 'text' : 'password'}
              value={userPw}
              onChange={(e) => setUserPw(e.target.value)}
              placeholder="비밀번호"
              required
              className={styles.input}
            />
            <button type="button" className={styles.eyeBtn} onClick={() => setShowPw((v) => !v)}>
              {showPw ? '🙈' : '👁'}
            </button>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
