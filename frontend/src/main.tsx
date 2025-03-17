import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage.tsx'
import RegisterPage from './pages/auth/RegisterPage.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import { AuthProvider } from './provider/AuthProvider.tsx'
import { Dashboard } from './pages/Dashboard.tsx'
import AppLayout from './components/AppLayout.tsx'
import { ProjectsPage } from './pages/ProjectsPage.tsx'
import ProjectPage from './pages/ProjectPage.tsx'
import { ThemeProvider } from './provider/ThemeProvider.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppLayout>
        <Outlet />
      </AppLayout>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/app" />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
              <h1>Settings</h1>
          </ProtectedRoute>
        ),
      },
      {
        path: 'app',
        element: (
          <ProtectedRoute>
              <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'projects',
        element: (
          <ProtectedRoute>
              <ProjectsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'projects/:projectId',
        element: (
          <ProtectedRoute>
              <ProjectPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'calendar',
        element: (
          <ProtectedRoute>
              <h1>Calendar</h1>
          </ProtectedRoute>
        ),
      },
      {
        path: 'tasks',
        element: (
          <ProtectedRoute>
              <h1>Tasks</h1>
          </ProtectedRoute>
        ),
      }
    ],
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
