/**
 * imageUtils.js
 * 이미지 관련 유틸리티
 *
 * - FALLBACK_IMAGE: 단일 fallback URL (전역 공통)
 * - getPlaceImage: 장소 커버 이미지 반환 (없으면 fallback)
 * - uploadPlaceImage: Supabase Storage에 이미지 업로드
 */

export const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=70'

/**
 * 장소의 대표 이미지 URL을 반환합니다.
 * cover_image_url이 없으면 FALLBACK_IMAGE를 반환합니다.
 */
export function getPlaceImage(place) {
  return place?.cover_image_url || FALLBACK_IMAGE
}

/**
 * 이미지 파일을 Supabase Storage 'place-images' 버킷에 업로드합니다.
 * @param {SupabaseClient} supabase
 * @param {File} file
 * @param {string} userId
 * @returns {Promise<string>} 업로드된 이미지의 공개 URL
 */
export async function uploadPlaceImage(supabase, file, userId) {
  const ext = file.name.split('.').pop().toLowerCase()
  const path = `${userId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('place-images')
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('place-images').getPublicUrl(path)
  return data.publicUrl
}
