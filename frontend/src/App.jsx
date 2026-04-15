import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext.jsx'
import { Navbar } from './components/layout/Navbar.jsx'
import { LandingPage } from './pages/LandingPage.jsx'
import { OnboardingPage } from './pages/OnboardingPage.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { ProfileDetailPage } from './pages/ProfileDetailPage.jsx'
import { RequestsPage } from './pages/RequestsPage.jsx'
import { AdminPage } from './pages/AdminPage.jsx'
import { PrivateRoute } from './routes/PrivateRoute.jsx'
import { AdminRoute } from './routes/AdminRoute.jsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="root-container min-h-screen">
          <Navbar />
          <main className="mx-auto px-4 pb-16 pt-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/onboarding"
                element={
                  <PrivateRoute>
                    <OnboardingPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <PrivateRoute>
                    <ProfileDetailPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/requests"
                element={
                  <PrivateRoute>
                    <RequestsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
