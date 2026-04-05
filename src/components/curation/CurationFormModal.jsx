/**
 * CurationFormModal.jsx
 * 큐레이션 생성 / 수정 모달
 *
 * Props:
 *   isOpen       — boolean
 *   onClose      — () => void
 *   initialData  — null(추가 모드) | curation 객체(수정 모드)
 */

import { useState, useEffect } from 'react'
import { usePlaceStore } from '../../context/PlaceStoreContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { uploadPlaceImage, FALLBACK_IMAGE } from '../../lib/imageUtils'
import { usePlaces } from '../../hooks/usePlaces'

const EMPTY_FORM = {
  title: '',
  subtitle: '',
  description: '',
  cover_image_url: '',
  is_published: true,
}

function curationToForm(curation) {
  return {
    title: curation.title || '',
    subtitle: curation.subtitle || '',
    description: curation.description || '',
    cover_image_url: curation.cover_image_url || '',
    is_published: curation.is_published !== false,
  }
}

export default function CurationFormModal({ isOpen, onClose, initialData }) {
  const { triggerCurationRefresh } = usePlaceStore()
  const { user } = useAuth()
  const isEdit = Boolean(initialData)

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  // 장소 검색
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const { data: searchResults, loading: searchLoading } = usePlaces({
    search: debouncedQuery,
    limit: 8,
  })

  // 선택된 장소 목록: [{ place, note }]
  const [selectedPlaces, setSelectedPlaces] = useState([])

  // 검색어 디바운스
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  // 모달 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setForm(initialData ? curationToForm(initialData) : EMPTY_FORM)
      setErrors({})
      setToast(null)
      setUploadError(null)
      setSearchQuery('')
      setDebouncedQuery('')

      // 수정 모드: 기존 curation_places 로드
      if (initialData?.curation_places) {
        const sorted = [...initialData.curation_places].sort(
          (a, b) => a.display_order - b.display_order
        )
        setSelectedPlaces(sorted.map(cp => ({ place: cp.places, note: cp.note || '' })))
      } else {
        setSelectedPlaces([])
      }
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  function addPlace(place) {
    if (selectedPlaces.find(sp => sp.place.id === place.id)) return
    setSelectedPlaces(prev => [...prev, { place, note: '' }])
    setSearchQuery('')
    setDebouncedQuery('')
  }

  function removePlace(placeId) {
    setSelectedPlaces(prev => prev.filter(sp => sp.place.id !== placeId))
  }

  function setNote(placeId, note) {
    setSelectedPlaces(prev =>
      prev.map(sp => sp.place.id === placeId ? { ...sp, note } : sp)
    )
  }

  function validate() {
    const errs = {}
    if (!form.title.trim()) errs.title = '제목을 입력해주세요'
    return errs
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!supabase || !user) return
    setUploading(true)
    setUploadError(null)
    try {
      const url = await uploadPlaceImage(supabase, file, user.id)
      set('cover_image_url', url)
    } catch (err) {
      console.error('[imageUpload]', err)
      const msg = err?.message || ''
      let hint = '이미지 업로드에 실패했어요.'
      if (msg.includes('Bucket not found')) hint = '스토리지 버킷이 없습니다. Supabase에서 "place-images" 버킷을 먼저 생성해주세요.'
      else if (msg.includes('violates row-level security') || msg.includes('not authorized')) hint = '업로드 권한이 없습니다. 버킷 RLS 정책을 확인해주세요.'
      else if (msg.includes('Payload too large') || msg.includes('too large')) hint = '파일 크기가 너무 큽니다. 더 작은 이미지를 선택해주세요.'
      else if (msg) hint = `업로드 실패: ${msg}`
      setUploadError(hint)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSubmitting(true)

    try {
      if (!supabase) throw new Error('Supabase가 연결되어 있지 않습니다.')
      if (!user) throw new Error('로그인이 필요합니다.')
      await handleSupabaseSubmit()
      setToast(isEdit ? '수정되었어요!' : '큐레이션이 추가되었어요!')
      setTimeout(() => onClose(), 800)
    } catch (err) {
      setErrors({ submit: err.message || '저장 중 오류가 발생했어요.' })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSupabaseSubmit() {
    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      cover_image_url: form.cover_image_url.trim() || null,
      is_published: form.is_published,
    }

    let curationId

    if (isEdit) {
      const { error: upErr } = await supabase
        .from('curations')
        .update(payload)
        .eq('id', initialData.id)
      if (upErr) throw upErr
      curationId = initialData.id
    } else {
      const { data: newCuration, error: insErr } = await supabase
        .from('curations')
        .insert({ ...payload, slug: `custom-curation-${Date.now()}`, user_id: user.id })
        .select('id')
        .single()
      if (insErr) throw insErr
      curationId = newCuration.id
    }

    // curation_places: DELETE + re-INSERT
    const { error: delErr } = await supabase
      .from('curation_places')
      .delete()
      .eq('curation_id', curationId)
    if (delErr) throw delErr

    if (selectedPlaces.length > 0) {
      const { error: cpErr } = await supabase
        .from('curation_places')
        .insert(
          selectedPlaces.map((sp, i) => ({
            curation_id: curationId,
            place_id: sp.place.id,
            display_order: i,
            note: sp.note.trim() || null,
          }))
        )
      if (cpErr) throw cpErr
    }

    triggerCurationRefresh()
  }

  // 이미 선택된 장소 id 집합
  const selectedIds = new Set(selectedPlaces.map(sp => sp.place.id))

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
            {isEdit ? '큐레이션 수정' : '큐레이션 추가'}
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
          {/* 제목 */}
          <Field label="제목" required error={errors.title}>
            <Input
              placeholder="예) 혼자 가기 좋은 성수동 카페"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              hasError={!!errors.title}
            />
          </Field>

          {/* 부제목 */}
          <Field label="부제목">
            <Input
              placeholder="예) 조용하고 넓어서 집중이 잘 되는"
              value={form.subtitle}
              onChange={e => set('subtitle', e.target.value)}
            />
          </Field>

          {/* 소개글 */}
          <Field label="소개글">
            <Textarea
              placeholder="이 큐레이션에 대해 자유롭게 소개해주세요"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={3}
            />
          </Field>

          {/* 커버 이미지 */}
          <Field label="커버 이미지" hint="없으면 기본 이미지가 표시됩니다">
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                fontSize: '13px',
                fontWeight: 600,
                color: uploading ? '#B5ADA3' : '#5C5C5C',
                backgroundColor: '#FAF8F5',
                border: '1.5px solid #EDE8E2',
                borderRadius: '10px',
                cursor: uploading ? 'not-allowed' : 'pointer',
                marginBottom: '10px',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              {uploading ? '업로드 중...' : '파일 선택'}
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>

            {uploadError && (
              <p style={{ fontSize: '12px', color: '#C1714F', marginBottom: '8px' }}>{uploadError}</p>
            )}

            {form.cover_image_url && (
              <div style={{ marginBottom: '10px' }}>
                <img
                  src={form.cover_image_url}
                  alt="미리보기"
                  onError={e => { e.target.src = FALLBACK_IMAGE }}
                  style={{
                    width: '100%',
                    height: '140px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    border: '1.5px solid #EDE8E2',
                  }}
                />
              </div>
            )}

            <Input
              placeholder="또는 이미지 URL 직접 입력 (https://...)"
              value={form.cover_image_url}
              onChange={e => set('cover_image_url', e.target.value)}
            />
          </Field>

          {/* 공개 여부 */}
          <Field label="공개 여부">
            <div style={{ display: 'flex', gap: '8px' }}>
              {[{ value: true, label: '공개' }, { value: false, label: '비공개' }].map(opt => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => set('is_published', opt.value)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: '1.5px solid',
                    borderColor: form.is_published === opt.value ? '#C1714F' : '#EDE8E2',
                    borderRadius: '10px',
                    backgroundColor: form.is_published === opt.value ? '#FFF5F0' : '#fff',
                    color: form.is_published === opt.value ? '#C1714F' : '#8C8070',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>

          {/* 장소 검색 */}
          <Field label="장소 추가">
            <Input
              placeholder="장소명으로 검색..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />

            {debouncedQuery.length > 0 && (
              <div
                style={{
                  marginTop: '6px',
                  border: '1.5px solid #EDE8E2',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  backgroundColor: '#fff',
                }}
              >
                {searchLoading && (
                  <p style={{ padding: '12px 14px', fontSize: '13px', color: '#B5ADA3' }}>검색 중...</p>
                )}
                {!searchLoading && searchResults.length === 0 && (
                  <p style={{ padding: '12px 14px', fontSize: '13px', color: '#B5ADA3' }}>결과 없음</p>
                )}
                {!searchLoading && searchResults.map(place => {
                  const already = selectedIds.has(place.id)
                  return (
                    <button
                      key={place.id}
                      type="button"
                      disabled={already}
                      onClick={() => addPlace(place)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: already ? '#B5ADA3' : '#2C2C2C',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid #F2EDE6',
                        cursor: already ? 'default' : 'pointer',
                        fontFamily: 'inherit',
                        textAlign: 'left',
                      }}
                    >
                      <span>{place.name}</span>
                      <span style={{ fontSize: '11px', color: '#B5ADA3' }}>
                        {already ? '추가됨' : place.region}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </Field>

          {/* 선택된 장소 목록 */}
          {selectedPlaces.length > 0 && (
            <Field label={`선택된 장소 ${selectedPlaces.length}곳`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedPlaces.map((sp, i) => (
                  <div
                    key={sp.place.id}
                    style={{
                      backgroundColor: '#fff',
                      border: '1.5px solid #EDE8E2',
                      borderRadius: '10px',
                      padding: '10px 12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: '#C1714F',
                            color: '#FAF8F5',
                            fontSize: '11px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {i + 1}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#2C2C2C' }}>
                          {sp.place.name}
                        </span>
                        <span style={{ fontSize: '11px', color: '#B5ADA3' }}>{sp.place.region}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePlace(sp.place.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#B5ADA3',
                          fontSize: '16px',
                          lineHeight: 1,
                          padding: '2px',
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="에디터 노트 (선택)"
                      value={sp.note}
                      onChange={e => setNote(sp.place.id, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        fontSize: '12px',
                        color: '#5C5C5C',
                        backgroundColor: '#FAF8F5',
                        border: '1px solid #EDE8E2',
                        borderRadius: '8px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                ))}
              </div>
            </Field>
          )}

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
                  {submitting ? '저장 중...' : isEdit ? '수정 저장' : '큐레이션 추가'}
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
