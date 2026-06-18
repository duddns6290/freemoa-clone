import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Header.module.css'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/user/logout', { method: 'POST', credentials: 'include' })
    logout()
    setDropdownOpen(false)
    navigate('/login')
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.logo} onClick={() => navigate('/')}>freemoa</span>
          <nav className={styles.nav}>
            <a onClick={() => navigate('/')} style={{cursor:'pointer'}}>프로젝트</a>
          </nav>
        </div>

        <div className={styles.right}>
          {user ? (
            <>
              <button className={styles.iconBtn}>🔔</button>
              <button className={styles.iconBtn}>💬</button>
              <div className={styles.avatarWrap} ref={dropRef}>
                <button
                  className={styles.avatarBtn}
                  onClick={() => setDropdownOpen((v) => !v)}
                >
                  <img
                    src={user.profileImage ? `/base_img/${user.profileImage}` : '/base_img/profile_base_img.png'}
                    className={styles.avatarImg}
                    alt=""
                  />
                  <span className={styles.avatarArrow}>▾</span>
                </button>

                {dropdownOpen && (
                  <div className={styles.dropdown}>
                    <button onClick={() => { navigate('/mypage'); setDropdownOpen(false) }}>마이페이지</button>
                    <button onClick={() => { navigate('/mypage?tab=projects'); setDropdownOpen(false) }}>프로젝트 관리</button>
                    {user?.role !== 'client' && <button onClick={() => { navigate('/mypage?tab=profile'); setDropdownOpen(false) }}>프로필 관리</button>}
<button onClick={handleLogout}>로그아웃</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button className={styles.textBtn} onClick={() => navigate('/login')}>로그인</button>
              <span className={styles.divider}>|</span>
              <button className={styles.textBtn}>회원가입</button>
              <button className={styles.ctaBtn}>무료 견적 의뢰</button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
