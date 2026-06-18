import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import ProjectManagement from '../components/mypage/ProjectManagement'
import ProfileManagement from '../components/mypage/ProfileManagement'
import ClientProjectManagement from '../components/mypage/ClientProjectManagement'
import CreateProject from '../components/mypage/CreateProject'
import styles from './MyPage.module.css'

const DEVELOPER_TABS = [
  { key: 'projects', label: '프로젝트관리' },
  { key: 'profile',  label: '프로필관리' },
]

const CLIENT_TABS = [
  { key: 'create',   label: '프로젝트 의뢰하기' },
  { key: 'projects', label: '프로젝트관리' },
]

export default function MyPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const isDeveloper = user?.role === 'developer'
  const TABS = isDeveloper ? DEVELOPER_TABS : CLIENT_TABS
  const defaultTab = isDeveloper ? 'projects' : 'create'
  const activeTab = searchParams.get('tab') || defaultTab

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  if (!user) return null

  const setTab = (key) => setSearchParams({ tab: key })

  const roleLabel = isDeveloper ? '개발자' : '의뢰인'

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.body}>
        {/* 왼쪽 사이드바 */}
        <aside className={styles.sidebar}>
          <div className={styles.profileImgWrap}>
            <img
              src={user.profileImage ? `/base_img/${user.profileImage}` : '/base_img/profile_base_img.png'}
              className={styles.profileImg}
              alt=""
            />
          </div>
          <p className={styles.userName}>{user.userName}</p>
          <div className={styles.badges}>
            <span className={styles.badge}>{roleLabel}</span>
            <span className={styles.badge}>활동</span>
          </div>

          {isDeveloper && (
            <>
              <div className={styles.statList}>
                <div className={styles.statRow}>
                  <span>파트너스 지역</span>
                  <span>{user.regionCity || '미등록'}</span>
                </div>
                <div className={styles.statRow}>
                  <span>비즈니스 형태</span>
                  <span>{{
                    freelancer: '개인프리랜서',
                    team_freelancer: '팀프리랜서',
                    sole_proprietor: '개인사업자',
                    corporation: '법인사업자',
                  }[user.businessType] || '-'}</span>
                </div>
              </div>

              <button className={styles.profileViewBtn} onClick={() => setTab('profile')}>
                내 프로필 보기
              </button>
            </>
          )}
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
          {isDeveloper ? (
            <>
              {activeTab === 'projects' && <ProjectManagement userId={user.userId} />}
              {activeTab === 'profile'  && <ProfileManagement user={user} />}
            </>
          ) : (
            <>
              {activeTab === 'create'   && <CreateProject userId={user.userId} onSuccess={() => setTab('projects')} />}
              {activeTab === 'projects' && <ClientProjectManagement userId={user.userId} />}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
