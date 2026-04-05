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
import { useAuth } from '../../context/AuthContext'
import { TAGS } from '../../lib/tags'
import { supabase } from '../../lib/supabase'

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
  const { triggerRefresh } = usePlaceStore()
  const { user } = useAuth()
  const isEdit = Boolean(initialData)

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)
  const [submitting, setSubmitting] = useState(false)

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

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSubmitting(true)

    const placeData = formToPlace(form)

    try {
      if (!supabase) {
        throw new Error('Supabase가 연결되어 있지 않습니다. .env.local에 키를 설정해주세요.')
      }
      if (!user) {
        throw new Error('로그인이 필요합니다. 로그인 후 장소를 추가할 수 있어요.')
      }
      await handleSupabaseSubmit(placeData)
      setToast(isEdit ? '수정되었어요!' : '장소가 추가되었어요!')
      setTimeout(() => onClose(), 800)
    } catch (err) {
      setErrors({ submit: err.message || '저장 중 오류가 발생했어요. 다시 시도해주세요.' })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSupabaseSubmit(placeData) {
    // 태그 ID(t1, t2...) → slug → Supabase UUID 변환
    const tagSlugs = form.tags
      .map(tid => TAGS.find(t => t.id === tid)?.slug)
      .filter(Boolean)

    if (isEdit) {
      // 소유자 확인
      if (initialData.user_id && initialData.user_id !== user.id) {
        throw new Error('본인이 추가한 장소만 수정할 수 있어요.')
      }
      // 수정: place 업데이트 후 tags/images 재삽입
      const { error: upErr } = await supabase
        .from('places')
        .update({
          name: placeData.name,
          region: placeData.region,
          category: placeData.category,
          one_liner: placeData.one_liner,
          atmosphere_desc: placeData.atmosphere_desc,
          recommended_situations: placeData.recommended_situations,
          detailed_review: placeData.detailed_review,
          cover_image_url: placeData.cover_image_url,
        })
        .eq('id', initialData.id)
      if (upErr) throw upErr

      // 태그 재삽입
      await supabase.from('place_tags').delete().eq('place_id', initialData.id)
      if (tagSlugs.length > 0) {
        const { data: tagRows, error: tagErr } = await supabase
          .from('tags').select('id').in('slug', tagSlugs)
        if (tagErr) throw tagErr
        if (tagRows?.length) {
          const { error: ptErr } = await supabase.from('place_tags')
            .insert(tagRows.map(t => ({ place_id: initialData.id, tag_id: t.id })))
          if (ptErr) throw ptErr
        }
      }

      // 이미지 재삽입
      await supabase.from('place_images').delete().eq('place_id', initialData.id)
      if (placeData.cover_image_url) {
        await supabase.from('place_images').insert({
          place_id: initialData.id,
          image_url: placeData.cover_image_url,
          alt_text: placeData.name,
          display_order: 0,
        })
      }
    } else {
      // 추가: place insert → tags → images 순서
      const { data: newPlace, error: insErr } = await supabase
        .from('places')
        .insert({
          slug: `custom-${Date.now()}`,
          name: placeData.name,
          region: placeData.region,
          category: placeData.category,
          one_liner: placeData.one_liner,
          atmosphere_desc: placeData.atmosphere_desc,
          recommended_situations: placeData.recommended_situations,
          detailed_review: placeData.detailed_review,
          cover_image_url: placeData.cover_image_url,
          is_published: true,
          source: 'custom',
          user_id: user.id,
        })
        .select('id')
        .single()
      if (insErr) throw insErr

      if (tagSlugs.length > 0) {
        const { data: tagRows, error: tagErr } = await supabase
          .from('tags').select('id').in('slug', tagSlugs)
        if (tagErr) throw tagErr
        if (tagRows?.length) {
          const { error: ptErr } = await supabase.from('place_tags')
            .insert(tagRows.map(t => ({ place_id: newPlace.id, tag_id: t.id })))
          if (ptErr) throw ptErr
        }
      }

      if (placeData.cover_image_url) {
        await supabase.from('place_images').insert({
          place_id: newPlace.id,
          image_url: placeData.cover_image_url,
          alt_text: placeData.name,
          display_order: 0,
        })
      }
    }

    triggerRefresh()
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
              <>
                {errors.submit && (
                  <p style={{ fontSize: '13px', color: '#C1714F', marginBottom: '10px', textAlign: 'center' }}>
                    {errors.submit}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '15px',
                    fontSize: '15px',
                    fontWeight: 700,
                    backgroundColor: submitting ? '#8C8070' : '#2C2C2C',
                    color: '#FAF8F5',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    letterSpacing: '-0.2px',
                    transition: 'background-color 0.15s',
                  }}
                >
                  {submitting ? '저장 중...' : isEdit ? '수정 저장' : '장소 추가'}
                </button>
              </>
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
