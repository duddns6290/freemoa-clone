import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import styles from './ProfileManagement.module.css'

const PROFILE_TABS = ['기본정보', '기술정보', '경력정보', '포트폴리오', '인터뷰']
const FIELDS_OPTIONS = ['개발', '디자인', '기획']
const REGION_CITIES = ['특별시.광역시.도', '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시', '경기도', '강원도', '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도']
const BUSINESS_TYPES = [
  { value: 'freelancer', label: '개인프리랜서' },
  { value: 'team_freelancer', label: '팀프리랜서' },
  { value: 'sole_proprietor', label: '개인사업자' },
  { value: 'corporation', label: '법인사업자' },
]

export default function ProfileManagement({ user }) {
  const { login } = useAuth()
  const [activeTab, setActiveTab] = useState(0)

  // form state
  const [fields, setFields] = useState(user.fields ?? [])
  const [isActive, setIsActive] = useState(user.isActive ?? false)
  const [isResident, setIsResident] = useState(user.isResident ?? false)
  const [regionCity, setRegionCity] = useState(user.regionCity ?? '')
  const [regionDistrict, setRegionDistrict] = useState(user.regionDistrict ?? '')
  const [businessType, setBusinessType] = useState(user.businessType ?? 'freelancer')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState(user.tags ?? [])
  const [bio, setBio] = useState(user.bio ?? '')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  const [profileImage, setProfileImage] = useState(user.profileImage ?? null)
  const fileRef = useRef(null)

  const toggleField = (f) => {
    setFields((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f])
  }

  const addTag = () => {
    const t = tagInput.trim()
    if (!t) return
    if (tags.length >= 5) { alert('검색태그는 5개까지만 등록할 수 있습니다.'); return }
    if (!tags.includes(t)) setTags([...tags, t])
    setTagInput('')
  }

  const removeTag = (t) => setTags(tags.filter((x) => x !== t))

  const handleTagKey = (e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUploading(true)
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await fetch(`/api/user/${user.userId}/image`, {
        method: 'POST',
        credentials: 'include',
        body: form,
      })
      if (res.ok) {
        const data = await res.json()
        setProfileImage(data.profileImage)
      }
    } finally {
      setImageUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch(`/api/user/${user.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive, isResident, regionCity, regionDistrict, businessType, bio, fields, tags }),
      })
      if (res.ok) {
        const updated = await res.json()
        login(updated)
        setSaveMsg('저장되었습니다.')
      } else {
        setSaveMsg('저장에 실패했습니다.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.wrap}>
      {/* 서브 탭 */}
      <div className={styles.subTabs}>
        {PROFILE_TABS.map((t, i) => (
          <button
            key={t}
            className={`${styles.subTab} ${activeTab === i ? styles.activeSubTab : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab !== 0 && (
        <div className={styles.notReady}>준비 중입니다.</div>
      )}

      {activeTab === 0 && (
        <div className={styles.formSection}>
          <h3 className={styles.formTitle}>기본정보</h3>

          {/* 프로필 이미지 */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>프로필 이미지</label>
            <div className={styles.imageArea}>
              {profileImage ? (
                <img src={`/base_img/${profileImage}`} className={styles.previewImg} alt="" />
              ) : (
                <div className={styles.previewDefault}>👤</div>
              )}
              <div className={styles.imageActions}>
                <button
                  className={styles.uploadBtn}
                  onClick={() => fileRef.current?.click()}
                  disabled={imageUploading}
                >
                  {imageUploading ? '업로드 중...' : '업데이트'}
                </button>
                <button className={styles.deleteBtn} onClick={() => setProfileImage(null)}>🗑</button>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </div>
              <p className={styles.imageHint}>
                * 개인/팀 프로필 등의 이미지를 등록해주세요.<br />
                미팅 선정률이 30% 이상 높아집니다.
              </p>
            </div>
          </div>

          {/* 지원분야 */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>지원분야 <span className={styles.required}>*</span></label>
            <div className={styles.checkGroup}>
              {FIELDS_OPTIONS.map((f) => (
                <label key={f} className={styles.checkItem}>
                  <input
                    type="checkbox"
                    checked={fields.includes(f)}
                    onChange={() => toggleField(f)}
                  />
                  {f}
                </label>
              ))}
            </div>
          </div>

          {/* 활동여부 */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>활동여부</label>
            <div>
              <label className={styles.checkItem}>
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                가능시 체크
              </label>
              <p className={styles.hint}>* 플랫폼에서 지원요청을 받으려면 반드시 활동중으로 체크해주세요.</p>
            </div>
          </div>

          {/* 상주가능여부 */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>상주가능여부</label>
            <div className={styles.residentRow}>
              <label className={styles.checkItem}>
                <input type="checkbox" checked={isResident} onChange={(e) => setIsResident(e.target.checked)} />
                가능시 체크
              </label>
              <button className={styles.resumeBtn}>이력서 첨부</button>
              <p className={styles.hint}>* 이력서 첨부 시 개별팩으로 적합한 프로젝트를 추천해 드립니다.</p>
            </div>
          </div>

          {/* 지역 */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>지역 <span className={styles.required}>*</span></label>
            <div className={styles.selectRow}>
              <select className={styles.select} value={regionCity} onChange={(e) => setRegionCity(e.target.value)}>
                {REGION_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className={styles.select} value={regionDistrict} onChange={(e) => setRegionDistrict(e.target.value)}>
                <option value="">시.군.구</option>
              </select>
            </div>
          </div>

          {/* 형태 */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>형태 <span className={styles.required}>*</span></label>
            <select className={styles.select} value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
              {BUSINESS_TYPES.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          </div>

          {/* 검색태그 */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>검색태그</label>
            <div className={styles.tagArea}>
              <div className={styles.tagInputRow}>
                <textarea
                  className={styles.tagInput}
                  placeholder="태그와 태그는 쉼표로 구분하며, 5개까지 입력하실 수 있습니다."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKey}
                  rows={2}
                />
                <button className={styles.tagAddBtn} onClick={addTag}>추가</button>
              </div>
              {tags.length > 0 && (
                <div className={styles.tagList}>
                  {tags.map((t) => (
                    <span key={t} className={styles.tag}>
                      {t}
                      <button className={styles.tagX} onClick={() => removeTag(t)}>✕</button>
                    </span>
                  ))}
                </div>
              )}
              <p className={styles.hint}>* 대표하는 기술 및 검색태그를 반드시 입력해주세요. (검색 노출 유리)</p>
            </div>
          </div>

          {/* 소개글 */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>소개글 <span className={styles.required}>*</span></label>
            <div style={{ flex: 1 }}>
              <textarea
                className={styles.bioInput}
                placeholder="회사소개를 입력해주세요."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
              />
              <p className={styles.hint}>* 고객이 카드검색을 통해 개별 견적 요청을 드릴 수 있습니다.</p>
            </div>
          </div>

          {saveMsg && <p className={styles.saveMsg}>{saveMsg}</p>}

          <div className={styles.saveRow}>
            <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
