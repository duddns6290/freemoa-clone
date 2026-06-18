import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import styles from './ProfileManagement.module.css'

const PROFILE_TABS = ['기본정보']
const FIELDS_OPTIONS = ['개발', '디자인', '기획']
const REGION_CITIES = ['특별시.광역시.도', '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시', '경기도', '강원도', '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도']

const REGION_DISTRICTS = {
  '서울특별시': ['종로구','중구','용산구','성동구','광진구','동대문구','중랑구','성북구','강북구','도봉구','노원구','은평구','서대문구','마포구','양천구','강서구','구로구','금천구','영등포구','동작구','관악구','서초구','강남구','송파구','강동구'],
  '부산광역시': ['중구','서구','동구','영도구','부산진구','동래구','남구','북구','해운대구','사하구','금정구','강서구','연제구','수영구','사상구','기장군'],
  '대구광역시': ['중구','동구','서구','남구','북구','수성구','달서구','달성군'],
  '인천광역시': ['중구','동구','미추홀구','연수구','남동구','부평구','계양구','서구','강화군','옹진군'],
  '광주광역시': ['동구','서구','남구','북구','광산구'],
  '대전광역시': ['동구','중구','서구','유성구','대덕구'],
  '울산광역시': ['중구','남구','동구','북구','울주군'],
  '경기도': ['수원시','성남시','의정부시','안양시','부천시','광명시','평택시','동두천시','안산시','고양시','과천시','구리시','남양주시','오산시','시흥시','군포시','의왕시','하남시','용인시','파주시','이천시','안성시','김포시','화성시','광주시','양주시','포천시','여주시','연천군','가평군','양평군'],
  '강원도': ['춘천시','원주시','강릉시','동해시','태백시','속초시','삼척시','홍천군','횡성군','영월군','평창군','정선군','철원군','화천군','양구군','인제군','고성군','양양군'],
  '충청북도': ['청주시','충주시','제천시','보은군','옥천군','영동군','증평군','진천군','괴산군','음성군','단양군'],
  '충청남도': ['천안시','공주시','보령시','아산시','서산시','논산시','계룡시','당진시','금산군','부여군','서천군','청양군','홍성군','예산군','태안군'],
  '전라북도': ['전주시','군산시','익산시','정읍시','남원시','김제시','완주군','진안군','무주군','장수군','임실군','순창군','고창군','부안군'],
  '전라남도': ['목포시','여수시','순천시','나주시','광양시','담양군','곡성군','구례군','고흥군','보성군','화순군','장흥군','강진군','해남군','영암군','무안군','함평군','영광군','장성군','완도군','진도군','신안군'],
  '경상북도': ['포항시','경주시','김천시','안동시','구미시','영주시','영천시','상주시','문경시','경산시','군위군','의성군','청송군','영양군','영덕군','청도군','고령군','성주군','칠곡군','예천군','봉화군','울진군','울릉군'],
  '경상남도': ['창원시','진주시','통영시','사천시','김해시','밀양시','거제시','양산시','의령군','함안군','창녕군','고성군','남해군','하동군','산청군','함양군','거창군','합천군'],
  '제주특별자치도': ['제주시','서귀포시'],
}
const BUSINESS_TYPES = [
  { value: 'freelancer', label: '개인프리랜서' },
  { value: 'team_freelancer', label: '팀프리랜서' },
  { value: 'sole_proprietor', label: '개인사업자' },
  { value: 'corporation', label: '법인사업자' },
]

export default function ProfileManagement({ user }) {
  const { login } = useAuth()
  // form state
  const [fields, setFields] = useState(user.fields ?? [])
  const [isActive, setIsActive] = useState(user.isActive ?? false)
  const [isResident, setIsResident] = useState(user.isResident ?? false)
  const [regionCity, setRegionCity] = useState(user.regionCity ?? '')
  const [regionDistrict, setRegionDistrict] = useState(user.regionDistrict ?? '')
  const [businessType, setBusinessType] = useState(user.businessType ?? 'freelancer')
  const [careerYears, setCareerYears] = useState(user.careerYears ?? 0)
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
    const newTags = tagInput.split(',').map((t) => t.trim()).filter((t) => t && !tags.includes(t))
    if (!newTags.length) { setTagInput(''); return }
    if (tags.length + newTags.length > 5) { alert('검색태그는 5개까지만 등록할 수 있습니다.'); return }
    setTags([...tags, ...newTags])
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
        login({ ...user, profileImage: data.profileImage })
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
        body: JSON.stringify({ isActive, isResident, regionCity, regionDistrict, businessType, careerYears: Number(careerYears), bio, fields, tags }),
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
      {(
        <div className={styles.formSection}>
          <h3 className={styles.formTitle}>기본정보</h3>

          {/* 프로필 이미지 */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>프로필 이미지</label>
            <div className={styles.imageArea}>
              <img
                src={profileImage ? `/base_img/${profileImage}` : '/base_img/profile_base_img.png'}
                className={styles.previewImg}
                alt=""
              />
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
              <select className={styles.select} value={regionCity} onChange={(e) => { setRegionCity(e.target.value); setRegionDistrict('') }}>
                {REGION_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className={styles.select} value={regionDistrict} onChange={(e) => setRegionDistrict(e.target.value)}>
                <option value="">시.군.구</option>
                {(REGION_DISTRICTS[regionCity] ?? []).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* 형태 + 연차 */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>형태 <span className={styles.required}>*</span></label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <select className={styles.select} value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
                {BUSINESS_TYPES.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
              <select className={styles.select} value={careerYears} onChange={(e) => setCareerYears(e.target.value)}>
                {Array.from({ length: 21 }, (_, i) => (
                  <option key={i} value={i}>{i === 0 ? '신입' : i === 20 ? '20년차 이상' : `${i}년차`}</option>
                ))}
              </select>
            </div>
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
