import { useState, useEffect } from 'react'
import styles from './ClientProjectManagement.module.css'

const PAGE_SIZE = 2

function dday(dateStr) {
  if (!dateStr) return '-'
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return '마감'
  if (diff === 0) return 'D-day'
  return `D-${diff}`
}

export default function ClientProjectManagement({ userId }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [applicantsPage, setApplicantsPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loadingApplicants, setLoadingApplicants] = useState(false)
  const [selectedApp, setSelectedApp] = useState(null)

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`/api/projects/my/${userId}`, { credentials: 'include' })
        if (res.ok) setProjects(await res.json())
      } finally { setLoading(false) }
    }
    fetch_()
  }, [userId])

  const openDetail = async (project) => {
    setSelectedProject(project)
    setApplicants([])
    setApplicantsPage(0)
    setHasMore(false)
    setSelectedApp(null)
    await loadApplicants(project.projectId, 0, [])
  }

  const loadApplicants = async (projectId, page, existing) => {
    setLoadingApplicants(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/applicants?page=${page}`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        const newItems = data.data ?? []
        setApplicants([...existing, ...newItems])
        setApplicantsPage(page)
        setHasMore(data.hasNext ?? false)
      }
    } finally { setLoadingApplicants(false) }
  }

  const loadMore = () => {
    if (selectedProject) loadApplicants(selectedProject.projectId, applicantsPage + 1, applicants)
  }

  const formatMoney = (v) => v != null ? `${v.toLocaleString()}만원` : '-'

  if (loading) return <div className={styles.loading}>불러오는 중...</div>

  return (
    <div className={styles.wrap}>
      <h3 className={styles.sectionTitle}>프로젝트 관리</h3>

      {projects.length === 0 ? (
        <div className={styles.empty}>
          <p>등록한 프로젝트가 없습니다.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {projects.map((p) => (
            <div key={p.projectId} className={styles.projectRow}>
              <div className={styles.projectInfo}>
                <span className={styles.projectTitle}>{p.title}</span>
                <div className={styles.metaRow}>
                  <span>{p.recruitType === 'fixed' ? '도급외주' : '기간제 상주'}</span>
                  <span className={styles.divider}>|</span>
                  <span>예상금액: {formatMoney(p.recruitType === 'fixed' ? p.budgetMax : p.budgetMin)}</span>
                  <span className={styles.divider}>|</span>
                  <span>지원자: {p.applyCount ?? 0}명</span>
                  <span className={styles.divider}>|</span>
                  <span>마감: {p.hopeStartDate ?? '-'}</span>
                  <span className={`${styles.dday} ${dday(p.hopeStartDate) === '마감' ? styles.ddayClosed : ''}`}>
                    {dday(p.hopeStartDate)}
                  </span>
                </div>
              </div>
              <button className={styles.detailBtn} onClick={() => openDetail(p)}>상세</button>
            </div>
          ))}
        </div>
      )}

      {/* 프로젝트 상세 + 지원자 목록 모달 */}
      {selectedProject && (
        <div className={styles.overlay} onClick={() => { setSelectedProject(null); setSelectedApp(null) }}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>프로젝트 상세</h3>
              <button className={styles.closeBtn} onClick={() => { setSelectedProject(null); setSelectedApp(null) }}>✕</button>
            </div>

            {/* 의뢰내용 요약 */}
            <div className={styles.projectSummary}>
              <div className={styles.summaryTitle}>{selectedProject.title}</div>
              <div className={styles.summaryMeta}>
                <span>{selectedProject.recruitType === 'fixed' ? '도급외주' : '기간제 상주'}</span>
                <span className={styles.divider}>|</span>
                <span>{selectedProject.field || '-'}</span>
                <span className={styles.divider}>|</span>
                <span>예상금액: {formatMoney(selectedProject.recruitType === 'fixed' ? selectedProject.budgetMax : selectedProject.budgetMin)}</span>
              </div>
              {selectedProject.techStack && <div className={styles.techStack}>기술스택: {selectedProject.techStack}</div>}
            </div>

            {/* 지원자 목록 */}
            <div className={styles.applicantsSection}>
              <h4 className={styles.applicantsTitle}>지원자 목록</h4>
              {applicants.length === 0 && !loadingApplicants && (
                <p className={styles.noApplicants}>지원자가 없습니다.</p>
              )}
              {applicants.map((app) => (
                <div key={app.applicationId} className={styles.applicantRow}>
                  <div className={styles.applicantInfo}>
                    <span className={styles.applicantName}>{app.userName}</span>
                    <span className={styles.applicantDate}>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : ''}</span>
                  </div>
                  <button className={styles.viewAppBtn} onClick={() => setSelectedApp(app)}>상세보기</button>
                </div>
              ))}
              {loadingApplicants && <p className={styles.loadingText}>불러오는 중...</p>}
              {hasMore && !loadingApplicants && (
                <button className={styles.moreBtn} onClick={loadMore}>더보기</button>
              )}
              {!hasMore && applicants.length > 0 && (
                <p className={styles.noMore}>더 이상 지원자가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 지원서 상세 모달 */}
      {selectedApp && (
        <div className={styles.overlay} onClick={() => setSelectedApp(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>지원서 상세</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedApp(null)}>✕</button>
            </div>
            <p className={styles.applicantNameBig}>{selectedApp.userName}</p>

            <div className={styles.appDetail}>
              {selectedApp.workDays && (
                <div className={styles.detailRow}><span className={styles.detailLabel}>작업기간</span><span>{selectedApp.workDays}일</span></div>
              )}
              {selectedApp.bidAmount && (
                <div className={styles.detailRow}><span className={styles.detailLabel}>지원금액</span><span>{formatMoney(selectedApp.bidAmount)}</span></div>
              )}
              {selectedApp.skillType && (
                <div className={styles.detailRow}><span className={styles.detailLabel}>기술구분</span><span>{selectedApp.skillType}</span></div>
              )}
              {selectedApp.careerLevel && (
                <div className={styles.detailRow}><span className={styles.detailLabel}>연차구분</span><span>{selectedApp.careerLevel}</span></div>
              )}
              {selectedApp.salary && (
                <div className={styles.detailRow}><span className={styles.detailLabel}>월 인금</span><span>{formatMoney(selectedApp.salary)}</span></div>
              )}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>지원내용</span>
                <span className={styles.coverLetter}>{selectedApp.coverLetter}</span>
              </div>
            </div>
            <button className={styles.backToListBtn} onClick={() => setSelectedApp(null)}>← 지원자 목록으로</button>
          </div>
        </div>
      )}
    </div>
  )
}
