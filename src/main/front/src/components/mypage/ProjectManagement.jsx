import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ProjectManagement.module.css'

export default function ProjectManagement({ userId }) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(`/api/users/${userId}/applications`, { credentials: 'include' })
        if (res.ok) setApplications(await res.json())
      } catch { /* ignore */ }
      finally { setLoading(false) }
    }
    fetchApplications()
  }, [userId])

  const formatMoney = (v) => v != null ? `${(v / 10000).toLocaleString()}만원` : '-'

  if (loading) return <div className={styles.loading}>불러오는 중...</div>

  return (
    <div className={styles.wrap}>
      <h3 className={styles.sectionTitle}>지원한 프로젝트</h3>

      {applications.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>⚠</div>
          <p className={styles.emptyTitle}>지원한 프로젝트가 없습니다.</p>
          <p className={styles.emptyDesc}>프로젝트를 검색하고 지원해보세요.</p>
          <button className={styles.goBtn} onClick={() => navigate('/')}>프로젝트 찾기</button>
        </div>
      ) : (
        <div className={styles.list}>
          {applications.map((app) => (
            <div key={app.applicationId} className={styles.projectRow}>
              <div className={styles.projectInfo}>
                <span className={styles.projectTitle}>{app.projectTitle}</span>
                <div className={styles.metaRow}>
                  <span className={styles.meta}>견적: {app.bidAmount ? formatMoney(app.bidAmount) : (app.salary ? `월 ${formatMoney(app.salary)}` : '-')}</span>
                  <span className={styles.metaDivider}>|</span>
                  <span className={styles.meta}>지원자: {app.applyCount ?? 0}명</span>
                  <span className={styles.metaDivider}>|</span>
                  <span className={styles.meta}>과업기간: {app.durationDays ?? app.workDays ?? '-'}일</span>
                </div>
              </div>
              <div className={styles.rowActions}>
                <button className={styles.detailBtn} onClick={() => navigate(`/projects/${app.projectId}`)}>
                  상세보기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 지원서 상세 모달 */}
      {selectedApp && (
        <div className={styles.overlay} onClick={() => setSelectedApp(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>나의 지원서</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedApp(null)}>✕</button>
            </div>
            <p className={styles.modalProject}>{selectedApp.projectTitle}</p>

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
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>지원일시</span>
                <span>{selectedApp.appliedAt ? new Date(selectedApp.appliedAt).toLocaleDateString() : '-'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
