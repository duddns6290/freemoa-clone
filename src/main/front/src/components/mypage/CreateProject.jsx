import { useState } from 'react'
import styles from './CreateProject.module.css'

const FIELD_OPTIONS = ['개발', '디자인', '기획', '영상', '마케팅']
const TECH_OPTIONS = ['React', 'Vue.js', 'Angular', 'Java', 'Spring', 'Node.js', 'Python', 'Django', 'iOS', 'Android', 'Flutter', 'MySQL', 'MongoDB', 'AWS', '기타']

export default function CreateProject({ userId, onSuccess }) {
  const [title, setTitle] = useState('')
  const [hopeStartDate, setHopeStartDate] = useState('')
  const [recruitType, setRecruitType] = useState('fixed')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [selectedFields, setSelectedFields] = useState([])
  const [fieldInput, setFieldInput] = useState('')
  const [prepareStatus, setPrepareStatus] = useState('')
  const [recommendRegion, setRecommendRegion] = useState('')
  const [description, setDescription] = useState('')
  const [projectType, setProjectType] = useState('')
  const [selectedTech, setSelectedTech] = useState([])
  const [techInput, setTechInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')

  const toggleField = (f) => setSelectedFields((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f])
  const addField = () => {
    const t = fieldInput.trim()
    if (t && !selectedFields.includes(t)) setSelectedFields((prev) => [...prev, t])
    setFieldInput('')
  }
  const removeField = (f) => setSelectedFields((prev) => prev.filter((x) => x !== f))

  const toggleTech = (t) => setSelectedTech((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])
  const addTech = () => {
    const t = techInput.trim()
    if (t && !selectedTech.includes(t)) setSelectedTech((prev) => [...prev, t])
    setTechInput('')
  }
  const removeTech = (t) => setSelectedTech((prev) => prev.filter((x) => x !== t))

  const handleSubmit = async () => {
    if (!title.trim()) { setMsg('프로젝트명을 입력해주세요.'); return }
    if (!hopeStartDate) { setMsg('모집마감일을 입력해주세요.'); return }
    if (!description.trim()) { setMsg('업무내용을 입력해주세요.'); return }

    setSubmitting(true)
    setMsg('')
    try {
      const body = {
        userId,
        title,
        hopeStartDate,
        recruitType,
        budgetMin: budgetMin ? Number(budgetMin) : null,
        budgetMax: budgetMax ? Number(budgetMax) : null,
        field: selectedFields.join(', '),
        prepareStatus,
        recommendRegion,
        description,
        projectType,
        techStack: selectedTech.join(', '),
        status: 'open',
      }
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setMsg('프로젝트가 등록되었습니다!')
        if (onSuccess) onSuccess()
      } else {
        const txt = await res.text()
        setMsg(txt || '등록에 실패했습니다.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <h3 className={styles.title}>프로젝트 의뢰하기</h3>

      <div className={styles.form}>
        <div className={styles.row}>
          <label className={styles.label}>프로젝트명 <span className={styles.req}>*</span></label>
          <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="프로젝트명을 입력해주세요" />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>모집 마감일 <span className={styles.req}>*</span></label>
          <input type="date" className={styles.input} value={hopeStartDate} onChange={(e) => setHopeStartDate(e.target.value)} />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>고용형태 <span className={styles.req}>*</span></label>
          <div className={styles.radioGroup}>
            <label className={styles.radio}>
              <input type="radio" value="fixed" checked={recruitType === 'fixed'} onChange={() => setRecruitType('fixed')} />
              도급외주
            </label>
            <label className={styles.radio}>
              <input type="radio" value="resident" checked={recruitType === 'resident'} onChange={() => setRecruitType('resident')} />
              상주
            </label>
          </div>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>{recruitType === 'resident' ? '월 급여 (만원)' : '예산 (만원)'} </label>
          {recruitType === 'fixed' ? (
            <div className={styles.budgetRow}>
              <input type="number" className={styles.input} value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} placeholder="최소 금액 (만원)" />
              <span>~</span>
              <input type="number" className={styles.input} value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} placeholder="최대 금액 (만원)" />
            </div>
          ) : (
            <input type="number" className={styles.input} value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} placeholder="월 급여 (만원)" />
          )}
        </div>

        <div className={styles.row}>
          <label className={styles.label}>프로젝트 분야</label>
          <div>
            <div className={styles.checkGroup}>
              {FIELD_OPTIONS.map((f) => (
                <label key={f} className={styles.checkItem}>
                  <input type="checkbox" checked={selectedFields.includes(f)} onChange={() => toggleField(f)} />
                  {f}
                </label>
              ))}
            </div>
            <div className={styles.tagInputRow}>
              <input
                className={styles.tagInput}
                value={fieldInput}
                onChange={(e) => setFieldInput(e.target.value)}
                placeholder="직접 입력 후 추가"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addField())}
              />
              <button className={styles.addBtn} onClick={addField}>추가</button>
            </div>
            {selectedFields.length > 0 && (
              <div className={styles.tagList}>
                {selectedFields.map((f) => (
                  <span key={f} className={styles.tag}>{f}<button className={styles.tagX} onClick={() => removeField(f)}>✕</button></span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>기획상태</label>
          <input className={styles.input} value={prepareStatus} onChange={(e) => setPrepareStatus(e.target.value)} placeholder="예: 기획 완료, 기획 중" />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>미팅 희망 지역</label>
          <input className={styles.input} value={recommendRegion} onChange={(e) => setRecommendRegion(e.target.value)} placeholder="예: 서울 강남" />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>업무내용 <span className={styles.req}>*</span></label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="업무 내용을 자세히 입력해주세요."
            rows={5}
          />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>프로젝트 진행방식</label>
          <select className={styles.input} value={projectType} onChange={(e) => setProjectType(e.target.value)}>
            <option value="">선택 안함</option>
            <option value="planning">기획</option>
            <option value="design">디자인</option>
            <option value="development">개발</option>
            <option value="maintenance">유지보수</option>
            <option value="upgrade">고도화</option>
          </select>
        </div>

        <div className={styles.row}>
          <label className={styles.label}>필요 기술스택</label>
          <div>
            <div className={styles.checkGroup}>
              {TECH_OPTIONS.map((t) => (
                <label key={t} className={styles.checkItem}>
                  <input type="checkbox" checked={selectedTech.includes(t)} onChange={() => toggleTech(t)} />
                  {t}
                </label>
              ))}
            </div>
            <div className={styles.tagInputRow}>
              <input
                className={styles.tagInput}
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="직접 입력 후 추가"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
              />
              <button className={styles.addBtn} onClick={addTech}>추가</button>
            </div>
            {selectedTech.length > 0 && (
              <div className={styles.tagList}>
                {selectedTech.map((t) => (
                  <span key={t} className={styles.tag}>{t}<button className={styles.tagX} onClick={() => removeTech(t)}>✕</button></span>
                ))}
              </div>
            )}
          </div>
        </div>

        {msg && <p className={`${styles.msg} ${msg.includes('등록') ? styles.success : styles.error}`}>{msg}</p>}

        <div className={styles.submitRow}>
          <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
            {submitting ? '등록 중...' : '프로젝트 등록'}
          </button>
        </div>
      </div>
    </div>
  )
}
