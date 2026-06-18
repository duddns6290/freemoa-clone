import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import styles from './HomePage.module.css'

const RECRUIT_TYPES = [
  { value: '', label: '전체' },
  { value: 'fixed', label: '도급외주' },
  { value: 'resident', label: '기간제 상주' },
]
const SORT_OPTIONS = [
  { value: 'latest', label: '최신 등록 순' },
  { value: 'budget_high', label: '금액 높은 순' },
  { value: 'budget_low', label: '금액 낮은 순' },
  { value: 'deadline', label: '마감 임박 순' },
]

function ProjectCard({ project }) {
  const navigate = useNavigate()
  const formatMoney = (v) => v != null ? `${v.toLocaleString()}만원` : '-'
  const recruitLabel = project.recruitType === 'fixed' ? '도급외주' : project.recruitType === 'resident' ? '기간제 상주' : ''
  const statusLabel = project.status === 'open' ? '모집중' : project.status === 'closed' ? '마감' : ''
  const budgetLabel = project.recruitType === 'resident' ? '월 인금' : '예상비용'
  const budgetValue = project.recruitType === 'resident'
    ? (project.budgetMin != null ? formatMoney(project.budgetMin) : '-')
    : (project.budgetMax != null ? formatMoney(project.budgetMax) : '-')

  return (
    <div className={styles.projectCard} onClick={() => navigate(`/projects/${project.projectId}`)}>
      <div className={styles.cardTopRow}>
        <span className={styles.fieldTag}>{project.field || '개발'}</span>
        <div className={styles.badgeRow}>
          {recruitLabel && <span className={styles.recruitBadge}>{recruitLabel}</span>}
          {statusLabel && <span className={`${styles.statusBadge} ${project.status === 'open' ? styles.open : styles.closed}`}>{statusLabel}</span>}
        </div>
      </div>
      <h3 className={styles.projectTitle}>{project.title}</h3>
      {project.techStack && (
        <div className={styles.techStack}>{project.techStack}</div>
      )}
      <div className={styles.statsRow}>
        <span className={styles.statItem}>
          <span className={styles.statLabel}>{budgetLabel}</span>
          <span className={styles.statValue}>{budgetValue}</span>
        </span>
        <span className={styles.divider}>|</span>
        <span className={styles.statItem}>
          <span className={styles.statLabel}>예상기간</span>
          <span className={styles.statValue}>{project.durationDays ?? '-'}일</span>
        </span>
        <span className={styles.divider}>|</span>
        <span className={styles.statItem}>
          <span className={styles.statLabel}>지원자수</span>
          <span className={styles.statValue}>{project.applyCount ?? 0}명</span>
        </span>
        {project.hopeStartDate && (
          <>
            <span className={styles.divider}>|</span>
            <span className={styles.statItem}>
              <span className={styles.statLabel}>마감일</span>
              <span className={styles.statValue}>{project.hopeStartDate}</span>
            </span>
          </>
        )}
        {project.createdAt && (
          <>
            <span className={styles.divider}>|</span>
            <span className={styles.statItem}>
              <span className={styles.statLabel}>등록일</span>
              <span className={styles.statValue}>{project.createdAt.slice(0, 10)}</span>
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [recruitType, setRecruitType] = useState('')
  const [sort, setSort] = useState('latest')
  const [sortOpen, setSortOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const sortRef = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ sort, page: currentPage })
        if (recruitType) params.set('recruitType', recruitType)
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
  }, [sort, currentPage, recruitType])

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.layout}>
        {/* 좌측 필터 사이드바 */}
        <aside className={styles.filterPanel}>
          <p className={styles.filterTitle}>프로젝트 필터</p>

          <div className={styles.filterGroup}>
            <p className={styles.filterLabel}>프로젝트 형태</p>
            {RECRUIT_TYPES.map((rt) => (
              <label key={rt.value} className={styles.filterRadio}>
                <input
                  type="radio"
                  name="recruitType"
                  value={rt.value}
                  checked={recruitType === rt.value}
                  onChange={() => { setRecruitType(rt.value); setCurrentPage(0) }}
                />
                {rt.label}
              </label>
            ))}
          </div>
        </aside>

        {/* 우측 프로젝트 목록 */}
        <section className={styles.projectsSection}>
          <div className={styles.sortRow}>
            <div className={styles.sortDropdown} ref={sortRef}>
              <button className={styles.sortTrigger} onClick={() => setSortOpen((v) => !v)}>
                {SORT_OPTIONS.find((o) => o.value === sort)?.label ?? '정렬'}
                <span className={styles.sortArrow}>▾</span>
              </button>
              {sortOpen && (
                <div className={styles.sortMenu}>
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      className={`${styles.sortMenuItem} ${sort === opt.value ? styles.activeSortMenuItem : ''}`}
                      onClick={() => { setSort(opt.value); setCurrentPage(0); setSortOpen(false) }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

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
    </div>
  )
}
