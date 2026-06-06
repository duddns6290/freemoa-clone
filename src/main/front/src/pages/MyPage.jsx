import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import ProjectManagement from '../components/mypage/ProjectManagement'
import ProfileManagement from '../components/mypage/ProfileManagement'
import styles from './MyPage.module.css'

const TABS = [
  { key: 'home',     label: '마이홈' },
  { key: 'projects', label: '프로젝트관리' },
  { key: 'reviews',  label: '리뷰관리' },
  { key: 'profile',  label: '프로필관리' },
  { key: 'docs',     label: '문서관리' },
  { key: 'settings', label: '설정' },
]

export default function MyPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'projects'

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  if (!user) return null

  const setTab = (key) => setSearchParams({ tab: key })

  const roleLabel = user.role === 'developer' ? '상주' : '클라이언트'

  return (
    <div className={styles.page}>
      <Header />

      {/* 프로필 완성 배너 */}
      <div className={styles.banner}>
        <span>🙋 프로젝트 지원을 위해 프로필을 완성해주세요.</span>
        <button className={styles.bannerBtn} onClick={() => setTab('profile')}>
          프로필 등록하러가기 ▶
        </button>
      </div>

      <div className={styles.body}>
        {/* 왼쪽 사이드바 */}
        <aside className={styles.sidebar}>
          <div className={styles.profileImgWrap}>
            {user.profileImage ? (
              <img src={`/base_img/${user.profileImage}`} className={styles.profileImg} alt="" />
            ) : (
              <div className={styles.profileImgDefault}>{user.userName?.[0] ?? 'U'}</div>
            )}
          </div>
          <p className={styles.email}>{user.userName}</p>
          <div className={styles.badges}>
            <span className={styles.badge}>{roleLabel}</span>
            <span className={styles.badge}>활동</span>
          </div>
          <div className={styles.stars}>
            {'★★★★★'.split('').map((s, i) => (
              <span key={i} className={styles.starEmpty}>{s}</span>
            ))}
            <span className={styles.ratingText}>0.0 / 평가 0개</span>
          </div>

          <div className={styles.statList}>
            <div className={styles.statRow}>
              <span>파트너스 지역</span><span>미등록</span>
            </div>
            <div className={styles.statRow}>
              <span>누적 지원 프로젝트</span><span>0 건</span>
            </div>
            <div className={styles.statRow}>
              <span>누적계약 프로젝트</span><span>0 건</span>
            </div>
            <div className={styles.statRow}>
              <span>누적 완료 프로젝트</span><span>0 건</span>
            </div>
            <div className={styles.statRow}>
              <span>누적 계약금</span><span>0 원</span>
            </div>
            <div className={styles.statRow}>
              <span>받은 관심 수</span><span>0 개</span>
            </div>
          </div>

          <button className={styles.profileViewBtn} onClick={() => setTab('profile')}>
            내 프로필 보기
          </button>
          <button className={styles.switchBtn}>↺ 클라이언트로 전환하기</button>
        </aside>

        {/* 오른쪽 컨텐츠 */}
        <main className={styles.content}>
          {/* 탭 헤더 */}
          <div className={styles.tabBar}>
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`${styles.tabBtn} ${activeTab === t.key ? styles.activeTabBtn : ''}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* 탭 컨텐츠 */}
          {activeTab === 'projects' && <ProjectManagement userId={user.userId} />}
          {activeTab === 'profile'  && <ProfileManagement user={user} />}
          {(activeTab === 'home' || activeTab === 'reviews' || activeTab === 'docs' || activeTab === 'settings') && (
            <div className={styles.emptyTab}>준비 중입니다.</div>
          )}
        </main>
      </div>
    </div>
  )
}
