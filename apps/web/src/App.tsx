import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { LeadsPage } from './pages/LeadsPage'
import { LoginPage } from './pages/LoginPage'
import { PipelinePage } from './pages/PipelinePage'

function isAuthenticated() {
  return !!localStorage.getItem('lgp_token')
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/pipeline" replace />} />
                <Route path="/pipeline" element={<PipelinePage />} />
                <Route path="/leads" element={<LeadsPage />} />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}
