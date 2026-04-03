/**
 * App.jsx
 * 라우터 설정 및 전체 앱 구조 정의
 *
 * 라우트 구조:
 *   /                     → HomePage
 *   /places               → PlaceListPage
 *   /places/:slug         → PlaceDetailPage
 *   /tags                 → TagExplorationPage
 *   /curations            → CurationListPage
 *   /curations/:slug      → CurationDetailPage
 *   /login                → LoginPage
 *   /bookmarks            → BookmarksPage (로그인 필요)
 *   *                     → NotFoundPage
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PlaceStoreProvider } from './context/PlaceStoreContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/layout/ProtectedRoute'

// 페이지 컴포넌트
import HomePage from './pages/HomePage'
import PlaceListPage from './pages/PlaceListPage'
import PlaceDetailPage from './pages/PlaceDetailPage'
import TagExplorationPage from './pages/TagExplorationPage'
import CurationListPage from './pages/CurationListPage'
import CurationDetailPage from './pages/CurationDetailPage'
import LoginPage from './pages/LoginPage'
import BookmarksPage from './pages/BookmarksPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider: 전체 앱에 인증 상태 제공 */}
      <PlaceStoreProvider>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* 상단 네비게이션 */}
          <Navbar />

          {/* 페이지 라우팅 */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/places" element={<PlaceListPage />} />
            <Route path="/places/:slug" element={<PlaceDetailPage />} />
            <Route path="/tags" element={<TagExplorationPage />} />
            <Route path="/curations" element={<CurationListPage />} />
            <Route path="/curations/:slug" element={<CurationDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* ProtectedRoute: 로그인 필요 페이지 */}
            <Route
              path="/bookmarks"
              element={
                <ProtectedRoute>
                  <BookmarksPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          {/* 하단 푸터 */}
          <Footer />
        </div>
      </AuthProvider>
      </PlaceStoreProvider>
    </BrowserRouter>
  )
}
