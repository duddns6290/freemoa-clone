import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import styles from './ProjectDetailPage.module.css'

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/
const PHONE_REGEX = /\d{2,4}[-\s.]?\d{3,4}[-\s.]\d{4}/

const PROJECT_TYPE_LABEL = {
  planning: '기획',
  design: '디자인',
  development: '개발',
  maintenance: '유지보수',
  upgrade: '고도화',
}

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showApply, setShowApply] = useState(false)
  const [showMyApp, setShowMyApp] = useState(false)
  const [myApplication, setMyApplication] = useState(null)
  const [alreadyApplied, setAlreadyApplied] = useState(false)
  const [applying, setApplying] = useState(false)
  const [applyMsg, setApplyMsg] = useState('')

  // 도급 form
  const [workDays, setWorkDays] = useState('')
  const [bidAmount, setBidAmount] = useState('')
  // 상주 form
  const [skillType, setSkillType] = useState('')
  const [careerLevel, setCareerLevel] = useState(
    user?.careerYears != null
      ? user.careerYears === 0 ? '신입' : user.careerYears >= 20 ? '20년차 이상' : `${user.careerYears}년차`
      : ''
  )
  const [salary, setSalary] = useState('')
  const [coverLetter, setCoverLetter] = useState('')

  useEffect(() => {
    fetch(`/api/projects/${projectId}`, { credentials: 'include' })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setProject(d))
      .finally(() => setLoading(false))

    if (user?.role === 'developer') {
      fetch(`/api/projects/${projectId}/applied?userId=${user.userId}`, { credentials: 'include' })
        .then((r) => r.ok ? r.json() : false)
        .then((v) => setAlreadyApplied(v))
    }
  }, [projectId])

  const formatMoney = (v) => v != null ? `${v.toLocaleString()}만원` : '-'

  const handleApply = async () => {
    if (!coverLetter.trim()) { setApplyMsg('지원 내용을 입력해주세요.'); return }
    if (EMAIL_REGEX.test(coverLetter)) { setApplyMsg('지원 내용에 이메일을 포함할 수 없습니다.'); return }
    if (PHONE_REGEX.test(coverLetter)) { setApplyMsg('지원 내용에 전화번호를 포함할 수 없습니다.'); return }

    const isFixed = project.recruitType === 'fixed'
    if (isFixed && (!workDays || !bidAmount)) { setApplyMsg('작업기간과 지원금액을 입력해주세요.'); return }
    if (!isFixed && (!skillType || !careerLevel || !salary)) { setApplyMsg('모든 항목을 입력해주세요.'); return }

    setApplying(true)
    setApplyMsg('')
    try {
      const body = {
        userId: user.userId,
        coverLetter,
        ...(isFixed
          ? { workDays: Number(workDays), bidAmount: Number(bidAmount) }
          : { skillType, careerLevel, salary: Number(salary) }),
      }
      const res = await fetch(`/api/projects/${projectId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setApplyMsg('지원이 완료되었습니다!')
        setProject((p) => ({ ...p, applyCount: (p.applyCount ?? 0) + 1 }))
        setAlreadyApplied(true)
        setTimeout(() => setShowApply(false), 1500)
      } else {
        const txt = await res.text()
        try { setApplyMsg(JSON.parse(txt).message || '지원에 실패했습니다.') }
        catch { setApplyMsg(txt || '지원에 실패했습니다.') }
      }
    } finally {
      setApplying(false)
    }
  }

  const handleOpenMyApp = async () => {
    if (!myApplication) {
      const res = await fetch(`/api/projects/${projectId}/my-application?userId=${user.userId}`, { credentials: 'include' })
      if (res.ok) setMyApplication(await res.json())
    }
    setShowMyApp(true)
  }

  if (loading) return <div className={styles.page}><Header /><div className={styles.loading}>불러오는 중...</div></div>
  if (!project) return <div className={styles.page}><Header /><div className={styles.loading}>프로젝트를 찾을 수 없습니다.</div></div>

  const recruitLabel = project.recruitType === 'fixed' ? '도급외주' : project.recruitType === 'resident' ? '기간제 상주' : '-'
  const statusLabel = project.status === 'open' ? '모집중' : project.status === 'closed' ? '마감' : '-'
  const isFixed = project.recruitType === 'fixed'

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.inner}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← 목록으로</button>

        <div className={styles.card}>
          <div className={styles.tabBar}>
            <button className={`${styles.tab} ${styles.activeTab}`}>요약</button>
          </div>

          <div className={styles.content}>
            <div className={styles.topRow}>
              <div>
                <span className={styles.fieldTag}>{project.field || '개발'}</span>
                <span className={styles.recruitBadge}>{recruitLabel}</span>
                <span className={`${styles.statusBadge} ${project.status === 'open' ? styles.open : styles.closed}`}>{statusLabel}</span>
              </div>
              {user?.role === 'developer' && project.status === 'open' && (
                alreadyApplied
                  ? <button className={styles.myAppBtn} onClick={handleOpenMyApp}>나의 지원서</button>
                  : <button className={styles.applyBtn} onClick={() => setShowApply(true)}>지원하기</button>
              )}
            </div>

            <h1 className={styles.title}>{project.title}</h1>

            <div className={styles.metaGrid}>
              <div className={styles.metaItem}><span className={styles.metaLabel}>분야</span><span>{project.field || '-'}</span></div>
              <div className={styles.metaItem}><span className={styles.metaLabel}>기술스택</span><span>{project.techStack || '-'}</span></div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>{isFixed ? '예상비용' : '월 인금'}</span>
                <span>{isFixed ? formatMoney(project.budgetMax) : formatMoney(project.budgetMin)}</span>
              </div>
              <div className={styles.metaItem}><span className={styles.metaLabel}>예상기간</span><span>{project.durationDays ?? '-'}일</span></div>
              <div className={styles.metaItem}><span className={styles.metaLabel}>지원자수</span><span>{project.applyCount ?? 0}명</span></div>
              <div className={styles.metaItem}><span className={styles.metaLabel}>마감일</span><span>{project.hopeStartDate ?? '-'}</span></div>
              <div className={styles.metaItem}><span className={styles.metaLabel}>등록일</span><span>{project.createdAt ? project.createdAt.slice(0, 10) : '-'}</span></div>
              {project.recommendRegion && (
                <div className={styles.metaItem}><span className={styles.metaLabel}>미팅 희망 지역</span><span>{project.recommendRegion}</span></div>
              )}
              {project.prepareStatus && (
                <div className={styles.metaItem}><span className={styles.metaLabel}>기획 상태</span><span>{project.prepareStatus}</span></div>
              )}
              {project.projectType && (
                <div className={styles.metaItem}><span className={styles.metaLabel}>진행 방식</span><span>{PROJECT_TYPE_LABEL[project.projectType] ?? project.projectType}</span></div>
              )}
            </div>

            {project.description && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>상세정보</h3>
                <p className={styles.description}>{project.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 지원하기 모달 */}
      {showApply && (
        <div className={styles.overlay} onClick={() => setShowApply(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>프로젝트 지원하기</h2>
            <p className={styles.modalSub}>{isFixed ? '도급외주' : '기간제 상주'}</p>

            {isFixed ? (
              <>
                <div className={styles.formRow}>
                  <label>작업기간 (일)</label>
                  <input type="number" value={workDays} onChange={(e) => setWorkDays(e.target.value)} placeholder="예: 30" className={styles.input} />
                </div>
                <div className={styles.formRow}>
                  <label>지원 금액 (원)</label>
                  <input type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} placeholder="예: 3000000" className={styles.input} />
                </div>
              </>
            ) : (
              <>
                <div className={styles.formRow}>
                  <label>기술 구분</label>
                  <input value={skillType} onChange={(e) => setSkillType(e.target.value)} placeholder="예: React, Java" className={styles.input} />
                </div>
                <div className={styles.formRow}>
                  <label>연차 구분</label>
                  <input value={careerLevel} onChange={(e) => setCareerLevel(e.target.value)} placeholder="예: 3년차" className={styles.input} />
                </div>
                <div className={styles.formRow}>
                  <label>인원수</label>
                  <input value="1명 (본인)" disabled className={styles.input} />
                </div>
                <div className={styles.formRow}>
                  <label>월 인금 (원)</label>
                  <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="예: 4000000" className={styles.input} />
                </div>
              </>
            )}

            <div className={styles.formRow}>
              <label>지원 내용 <span className={styles.warn}>(이메일·전화번호 포함 불가)</span></label>
              <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="자기소개 및 지원 동기를 입력해주세요." className={styles.textarea} rows={5} />
            </div>

            {applyMsg && <p className={`${styles.applyMsg} ${applyMsg.includes('완료') ? styles.success : styles.error}`}>{applyMsg}</p>}

            <div className={styles.modalBtns}>
              <button className={styles.cancelBtn} onClick={() => setShowApply(false)}>취소</button>
              <button className={styles.submitBtn} onClick={handleApply} disabled={applying}>
                {applying ? '제출 중...' : '지원 제출'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 나의 지원서 모달 */}
      {showMyApp && myApplication && (
        <div className={styles.overlay} onClick={() => setShowMyApp(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>나의 지원서</h2>
            <p className={styles.modalSub}>{isFixed ? '도급외주' : '기간제 상주'}</p>

            {isFixed ? (
              <>
                <div className={styles.formRow}><label>작업기간</label><span className={styles.readVal}>{myApplication.workDays}일</span></div>
                <div className={styles.formRow}><label>지원 금액</label><span className={styles.readVal}>{myApplication.bidAmount?.toLocaleString()}원</span></div>
              </>
            ) : (
              <>
                <div className={styles.formRow}><label>기술 구분</label><span className={styles.readVal}>{myApplication.skillType}</span></div>
                <div className={styles.formRow}><label>연차 구분</label><span className={styles.readVal}>{myApplication.careerLevel}</span></div>
                <div className={styles.formRow}><label>인원수</label><span className={styles.readVal}>1명 (본인)</span></div>
                <div className={styles.formRow}><label>월 인금</label><span className={styles.readVal}>{myApplication.salary?.toLocaleString()}원</span></div>
              </>
            )}
            <div className={styles.formRow}><label>지원 내용</label><p className={styles.readVal}>{myApplication.coverLetter}</p></div>

            <div className={styles.modalBtns}>
              <button className={styles.cancelBtn} onClick={() => setShowMyApp(false)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
