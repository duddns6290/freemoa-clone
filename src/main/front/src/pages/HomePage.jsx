import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import styles from './HomePage.module.css'

const PARTNERS_ROW1 = [
  { name: '김신애 파트너', type: '웹' },
  { name: '윤기종 파트너', type: '웹' },
  { name: '정태연 파트너', type: '영상' },
  { name: '이슬비 파트너', type: '웹' },
  { name: '권린 파트너', type: '웹' },
  { name: '박종서 파트너', type: '웹' },
  { name: '남강석 파트너', type: '웹' },
  { name: '김민혜 파트너', type: '인쇄물' },
  { name: '이소연 파트너', type: '쇼핑몰' },
]
const PARTNERS_ROW2 = [
  { name: '문근영 파트너', type: '웹' },
  { name: '이은주 파트너', type: '일러스트' },
  { name: '최유나 파트너', type: '애플리케이션' },
  { name: '강혜진 파트너', type: '기타 앱' },
  { name: '디자인웹 파트너', type: '애플리케이션' },
  { name: '차지영 파트너', type: 'Android 앱' },
  { name: '김호 파트너', type: '로고' },
  { name: '김신 파트너', type: '퍼블리싱' },
  { name: '오민준 파트너', type: '웹' },
]

const HERO_WORDS = ['신개로운세', '프랜서 개발자', 'IT 파트너']

const TABS = ['어플리케이션 개발', '웹 개발', '소프트웨어 개발', '게임 개발', '기획&디자인', '영상제작', '퍼블리싱', '기타']
const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'apply', label: '지원자순' },
  { value: 'budget', label: '견적순' },
]

const CATEGORY_PILLS = ['오픈마켓', '반려동물', '병원예약', 'O2O/중개', '배달', '교육', '헬스케어']

function PartnerCard({ name, type }) {
  return (
    <div className={styles.partnerCard}>
      <div className={styles.partnerAvatar}>{name[0]}</div>
      <div>
        <p className={styles.partnerName}>{name}</p>
        <p className={styles.partnerType}>{type}</p>
      </div>
    </div>
  )
}

function ProjectCard({ project }) {
  const navigate = useNavigate()
  const formatMoney = (v) => v != null ? `${(v / 10000).toLocaleString()}만원` : '-'
  const field = project.field || '개발>앱'

  return (
    <div className={styles.projectCard} onClick={() => navigate(`/projects/${project.projectId}`)}>
      <span className={styles.fieldTag}>{field}</span>
      <h3 className={styles.projectTitle}>{project.title}</h3>
      <div className={styles.budgetRow}>
        <span className={styles.budgetLabel}>최고 / 최저 견적</span>
        <span className={styles.budgetValue}>
          {formatMoney(project.budgetMax)} ~ {formatMoney(project.budgetMin)}
        </span>
      </div>
      <div className={styles.statsRow}>
        <span className={styles.statItem}>
          <span className={styles.statLabel}>평균견적</span>
          <span className={styles.statValue}>
            {project.budgetMin && project.budgetMax
              ? formatMoney(Math.round((project.budgetMin + project.budgetMax) / 2))
              : '-'}
          </span>
        </span>
        <span className={styles.divider}>|</span>
        <span className={styles.statItem}>
          <span className={styles.statLabel}>평균기간</span>
          <span className={styles.statValue}>{project.durationDays ?? '-'}일</span>
        </span>
        <span className={styles.divider}>|</span>
        <span className={styles.statItem}>
          <span className={styles.statLabel}>지원자수</span>
          <span className={styles.statValue}>{project.applyCount ?? 0}명</span>
        </span>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [heroWord, setHeroWord] = useState(0)
  const [activeTab, setActiveTab] = useState(0)
  const [sort, setSort] = useState('latest')
  const [projects, setProjects] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const row1Ref = useRef(null)
  const row2Ref = useRef(null)

  // hero word rotation
  useEffect(() => {
    const t = setInterval(() => setHeroWord((w) => (w + 1) % HERO_WORDS.length), 2000)
    return () => clearInterval(t)
  }, [])

  // partner marquee scroll
  useEffect(() => {
    let frame
    let pos1 = 0
    let pos2 = 0
    const speed = 0.5
    const animate = () => {
      if (row1Ref.current) {
        pos1 += speed
        if (pos1 >= row1Ref.current.scrollWidth / 2) pos1 = 0
        row1Ref.current.scrollLeft = pos1
      }
      if (row2Ref.current) {
        pos2 += speed
        if (pos2 >= row2Ref.current.scrollWidth / 2) pos2 = 0
        row2Ref.current.scrollLeft = pos2
      }
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  // fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ sort, page: currentPage })
        const res = await fetch(`/api/projects?${params}`, { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setProjects(data.content ?? [])
          setTotalPages(data.totalPages ?? 0)
        }
      } catch { /* ignore */ }
      finally { setLoading(false) }
    }
    fetchProjects()
  }, [sort, currentPage])

  const doubled1 = [...PARTNERS_ROW1, ...PARTNERS_ROW1]
  const doubled2 = [...PARTNERS_ROW2, ...PARTNERS_ROW2]

  return (
    <div className={styles.page}>
      <Header />

      {/* ── Hero Section ── */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.heroLine1}>
            당신이 찾는{' '}
            <span className={styles.heroAnimated} key={heroWord}>
              {HERO_WORDS[heroWord]}
            </span>
          </p>
          <p className={styles.heroLine2}>
            지금 <span className={styles.orange}>프리모아</span>에서{' '}
            <span className={styles.orange}>3일</span>만에
          </p>
        </div>

        {/* Partner marquee */}
        <div className={styles.marqueeWrap}>
          <div className={styles.marqueeRow} ref={row1Ref}>
            {doubled1.map((p, i) => <PartnerCard key={i} {...p} />)}
          </div>
          <div className={styles.marqueeRow} ref={row2Ref}>
            {doubled2.map((p, i) => <PartnerCard key={i} {...p} />)}
          </div>
        </div>

        {/* Search + CTA */}
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <input
              className={styles.searchInput}
              placeholder="어떤 유형의 IT포트폴리오를 찾으시나요?"
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>
          <div className={styles.ctas}>
            <button className={styles.ctaPrimary}>무료 견적 의뢰</button>
            <p className={styles.ctaOr}>또는</p>
            <button className={styles.ctaSecondary}>간편 견적 조회</button>
          </div>
        </div>

        <div className={styles.pills}>
          {CATEGORY_PILLS.map((p) => (
            <button key={p} className={styles.pill}>{p}</button>
          ))}
        </div>
      </section>

      {/* ── Projects Section ── */}
      <section className={styles.projectsSection}>
        <div className={styles.projectsHeader}>
          <h2 className={styles.sectionTitle}>진행중인 비교견적</h2>
          <button className={styles.moreBtn}>더보기 →</button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map((tab, i) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === i ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className={styles.sortRow}>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`${styles.sortBtn} ${sort === opt.value ? styles.activeSortBtn : ''}`}
              onClick={() => { setSort(opt.value); setCurrentPage(0) }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        {loading ? (
          <div className={styles.loading}>불러오는 중...</div>
        ) : (
          <div className={styles.grid}>
            {projects.map((p) => <ProjectCard key={p.projectId} project={p} />)}
            {projects.length === 0 && (
              <p className={styles.empty}>등록된 프로젝트가 없습니다.</p>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`${styles.pageBtn} ${currentPage === i ? styles.activePageBtn : ''}`}
                onClick={() => setCurrentPage(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
