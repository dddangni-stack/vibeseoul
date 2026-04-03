/**
 * PlaceFormModal.jsx
 * 장소 추가 / 수정 모달
 *
 * Props:
 *   isOpen       — boolean
 *   onClose      — () => void
 *   initialData  — null(추가 모드) | place 객체(수정 모드)
 */

import { useState, useEffect } from 'react'
import { usePlaceStore } from '../../context/PlaceStoreContext'
import { TAGS } from '../../data/sampleData'

const CATEGORIES = [
  { value: 'cafe', label: '카페' },
  { value: 'restaurant', label: '맛집' },
  { value: 'spot', label: '스팟' },
]

const MOOD_TAGS = TAGS.filter(t => t.type === 'mood')
const SITUATION_TAGS = TAGS.filter(t => t.type === 'situation')
const OTHER_TAGS = TAGS.filter(t => t.type === 'other')

const EMPTY_FORM = {
  name: '',
  region: '',
  category: 'cafe',
  one_liner: '',
  atmosphere_desc: '',
  recommended_situations_text: '',
  detailed_review: '',
  cover_image_url: '',
  tags: [],
}

function formToPlace(form) {
  return {
    name: form.name.trim(),
    region: form.region.trim(),
    category: form.category,
    one_liner: form.one_liner.trim(),
    atmosphere_desc: form.atmosphere_desc.trim(),
    recommended_situations: form.recommended_situations_text
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean),
    detailed_review: form.detailed_review.trim(),
    cover_image_url: form.cover_image_url.trim(),
    images: form.cover_image_url.trim()
      ? [{ image_url: form.cover_image_url.trim(), alt_text: form.name.trim() }]
      : [],
    tags: form.tags,
  }
}

function placeToForm(place) {
  return {
    name: place.name || '',
    region: place.region || '',
    category: place.category || 'cafe',
    one_liner: place.one_liner || '',
    atmosphere_desc: place.atmosphere_desc || '',
    recommended_situations_text: (place.recommended_situations || []).join('\n'),
    detailed_review: place.detailed_review || '',
    cover_image_url: place.cover_image_url || '',
    tags: place.tags || [],
  }
}

export default function PlaceFormModal({ isOpen, onClose, initialData }) {
  const { addPlace, updatePlace } = usePlaceStore()
  const isEdit = Boolean(initialData)

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)

  // 모달 열릴 때 폼 초기화
  useEffect(() => {
    if (isOpen) {
      setForm(initialData ? placeToForm(initialData) : EMPTY_FORM)
      setErrors({})
      setToast(null)
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  function toggleTag(tagId) {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(t => t !== tagId)
        : [...prev.tags, tagId],
    }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = '장소명을 입력해주세요'
    if (!form.region.trim()) errs.region = '지역을 입력해주세요'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const placeData = formToPlace(form)

    if (isEdit) {
      updatePlace(initialData.id, placeData)
      showToast('수정되었어요!')
    } else {
      addPlace(placeData)
      showToast('장소가 추가되었어요!')
    }

    setTimeout(() => onClose(), 800)
  }

  function showToast(msg) {
    setToast(msg)
  }

  return (
    <>
      {/* 백드롭 */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(44,44,44,0.5)',
          zIndex: 1000,
        }}
      />

      {/* 모달 시트 */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '92vh',
          backgroundColor: '#FAF8F5',
          borderRadius: '20px 20px 0 0',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* 핸들 */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: '#D5CFC8' }} />
        </div>

        {/* 헤더 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 20px 16px',
            borderBottom: '1px solid #EDE8E2',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#2C2C2C' }}>
            {isEdit ? '장소 수정' : '장소 추가'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#8C8070',
              fontSize: '22px',
              lineHeight: 1,
              padding: '4px',
            }}
          >
            ×
          </button>
        </div>

        {/* 스크롤 영역 */}
        <form
          onSubmit={handleSubmit}
          style={{ overflowY: 'auto', flex: 1, padding: '20px' }}
        >
          {/* 장소명 */}
          <Field label="장소명" required error={errors.name}>
            <Input
              placeholder="예) 카페 봄날"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              hasError={!!errors.name}
            />
          </Field>

          {/* 지역 */}
          <Field label="지역" required error={errors.region}>
            <Input
              placeholder="예) 연남동, 홍대, 성수동"
              value={form.region}
              onChange={e => set('region', e.target.value)}
              hasError={!!errors.region}
            />
          </Field>

          {/* 카테고리 */}
          <Field label="카테고리">
            <div style={{ display: 'flex', gap: '8px' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => set('category', cat.value)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: '1.5px solid',
                    borderColor: form.category === cat.value ? '#C1714F' : '#EDE8E2',
                    borderRadius: '10px',
                    backgroundColor: form.category === cat.value ? '#FFF5F0' : '#fff',
                    color: form.category === cat.value ? '#C1714F' : '#8C8070',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </Field>

          {/* 한 줄 요약 */}
          <Field label="한 줄 요약">
            <Input
              placeholder="예) 골목 안 햇살 가득한 작은 온실 카페"
              value={form.one_liner}
              onChange={e => set('one_liner', e.target.value)}
            />
          </Field>

          {/* 분위기 */}
          <Field label="분위기 설명">
            <Textarea
              placeholder="이 장소의 분위기를 자유롭게 적어주세요"
              value={form.atmosphere_desc}
              onChange={e => set('atmosphere_desc', e.target.value)}
              rows={3}
            />
          </Field>

          {/* 추천 상황 */}
          <Field label="추천 상황" hint="줄바꿈으로 구분하면 여러 개 입력됩니다">
            <Textarea
              placeholder={"혼자 조용히 책 읽기 좋아요.\n데이트 코스로 추천해요."}
              value={form.recommended_situations_text}
              onChange={e => set('recommended_situations_text', e.target.value)}
              rows={3}
            />
          </Field>

          {/* 상세 설명 */}
          <Field label="상세 설명">
            <Textarea
              placeholder="위치, 메뉴, 분위기 등을 자세히 적어주세요"
              value={form.detailed_review}
              onChange={e => set('detailed_review', e.target.value)}
              rows={4}
            />
          </Field>

          {/* 이미지 URL */}
          <Field label="대표 이미지 URL" hint="없으면 기본 이미지가 표시됩니다">
            <Input
              placeholder="https://..."
              value={form.cover_image_url}
              onChange={e => set('cover_image_url', e.target.value)}
            />
          </Field>

          {/* 태그 선택 */}
          <Field label="태그 선택">
            <TagGroup label="분위기" tags={MOOD_TAGS} selected={form.tags} onToggle={toggleTag} />
            <TagGroup label="상황" tags={SITUATION_TAGS} selected={form.tags} onToggle={toggleTag} />
            <TagGroup label="기타" tags={OTHER_TAGS} selected={form.tags} onToggle={toggleTag} />
          </Field>

          {/* 저장 버튼 */}
          <div style={{ paddingTop: '8px', paddingBottom: '12px' }}>
            {toast ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '14px',
                  backgroundColor: '#F0FAF0',
                  borderRadius: '12px',
                  color: '#2A7A2A',
                  fontWeight: 600,
                  fontSize: '14px',
                  border: '1px solid #C8E6C8',
                }}
              >
                ✓ {toast}
              </div>
            ) : (
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '15px',
                  fontWeight: 700,
                  backgroundColor: '#2C2C2C',
                  color: '#FAF8F5',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  letterSpacing: '-0.2px',
                }}
              >
                {isEdit ? '수정 저장' : '장소 추가'}
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  )
}

// ── 하위 UI 컴포넌트 ──────────────────────────────────────

function Field({ label, required, hint, error, children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label
        style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: '#5C5C5C',
          marginBottom: '6px',
        }}
      >
        {label}
        {required && <span style={{ color: '#C1714F', marginLeft: '3px' }}>*</span>}
        {hint && (
          <span style={{ fontSize: '11px', fontWeight: 400, color: '#B5ADA3', marginLeft: '6px' }}>
            {hint}
          </span>
        )}
      </label>
      {children}
      {error && (
        <p style={{ fontSize: '12px', color: '#C1714F', marginTop: '5px' }}>{error}</p>
      )}
    </div>
  )
}

function Input({ hasError, ...props }) {
  return (
    <input
      {...props}
      style={{
        width: '100%',
        padding: '11px 14px',
        fontSize: '14px',
        color: '#2C2C2C',
        backgroundColor: '#fff',
        border: `1.5px solid ${hasError ? '#C1714F' : '#EDE8E2'}`,
        borderRadius: '10px',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
      }}
      onFocus={e => { e.target.style.borderColor = '#C1714F' }}
      onBlur={e => { e.target.style.borderColor = hasError ? '#C1714F' : '#EDE8E2' }}
    />
  )
}

function Textarea({ rows = 3, ...props }) {
  return (
    <textarea
      rows={rows}
      {...props}
      style={{
        width: '100%',
        padding: '11px 14px',
        fontSize: '14px',
        color: '#2C2C2C',
        backgroundColor: '#fff',
        border: '1.5px solid #EDE8E2',
        borderRadius: '10px',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        resize: 'vertical',
        lineHeight: 1.6,
      }}
      onFocus={e => { e.target.style.borderColor = '#C1714F' }}
      onBlur={e => { e.target.style.borderColor = '#EDE8E2' }}
    />
  )
}

function TagGroup({ label, tags, selected, onToggle }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <span
        style={{
          fontSize: '11px',
          fontWeight: 600,
          color: '#B5ADA3',
          letterSpacing: '0.4px',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '6px',
        }}
      >
        {label}
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {tags.map(tag => {
          const active = selected.includes(tag.id)
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => onToggle(tag.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 11px',
                fontSize: '12px',
                fontWeight: active ? 700 : 500,
                borderRadius: '100px',
                border: `1.5px solid ${active ? '#2C2C2C' : '#EDE8E2'}`,
                backgroundColor: active ? '#2C2C2C' : '#fff',
                color: active ? '#FAF8F5' : '#8C8070',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {tag.emoji} {tag.name_ko}
            </button>
          )
        })}
      </div>
    </div>
  )
}
