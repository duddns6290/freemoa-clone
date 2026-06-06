import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ProjectManagement.module.css'

const SUB_FILTERS = ['전체 프로젝트', '지원요청 프로젝트', '관심 프로젝트', '숨김 프로젝트']
const STATUS_TABS = ['전체', '지원', '미팅', '상세견적', '계약중', '진행중', '완료', '보류/실패']

export default function ProjectManagement({ userId }) {
  const [subFilter, setSubFilter] = useState(0)
  const [statusTab, setStatusTab] = useState(0)
  const [search, setSearch] = useState('')
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const res = await fetch(`/api/projects/applied?userId=${userId}`, { credentials: 'include' })
        if (res.ok) setProjects(await res.json())
      } catch { /* ignore */ }
    }
    fetchMyProjects()
  }, [userId])

  const formatMoney = (v) => v != null ? `${(v / 10000).toLocaleString()}만원` : '-'

  return (
    <div className={styles.wrap}>
      {/* 서브 필터 + 검색 */}
      <div className={styles.filterRow}>
        <div className={styles.filters}>
          {SUB_FILTERS.map((f, i) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${subFilter === i ? styles.activeFilter : ''}`}
              onClick={() => setSubFilter(i)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className={styles.searchBox}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="제목을 검색하세요."
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
      </div>

      {/* 상태 탭 (화살표 흐름) */}
      <div className={styles.statusRow}>
        {STATUS_TABS.map((s, i) => (
          <span key={s} className={styles.statusGroup}>
            <button
              className={`${styles.statusTab} ${statusTab === i ? styles.activeStatusTab : ''}`}
              onClick={() => setStatusTab(i)}
            >
              {s}(0)
            </button>
            {i < STATUS_TABS.length - 1 && i !== STATUS_TABS.length - 2 && (
              <span className={styles.arrow}>→</span>
            )}
          </span>
        ))}
      </div>

      {/* 프로젝트 목록 또는 빈 상태 */}
      {projects.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>⚠</div>
          <p className={styles.emptyTitle}>진행중인 프로젝트가 없습니다.</p>
          <div className={styles.emptyIllustration}>👩‍💼</div>
          <p className={styles.emptyDesc}>
            프로젝트 미팅 선정률을 높이는방법은 무엇일까요?<br />
            포트폴리오, 경력/기술 정보가 잘 작성된 경우, 평균(30%) 높은 미팅 선정률을 보이고 있습니다.<br />
            프로필 업데이트를 통해 신뢰감과 미팅선정률을 높여보세요.
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {projects.map((p) => (
            <div key={p.projectId} className={styles.projectRow} onClick={() => navigate(`/projects/${p.projectId}`)}>
              <div className={styles.projectInfo}>
                <span className={styles.fieldTag}>{p.field || '개발'}</span>
                <span className={styles.projectTitle}>{p.title}</span>
              </div>
              <div className={styles.projectMeta}>
                <span>{formatMoney(p.budgetMin)} ~ {formatMoney(p.budgetMax)}</span>
                <span>{p.durationDays}일</span>
                <span>지원자 {p.applyCount}명</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
