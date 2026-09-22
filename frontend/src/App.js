import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Tasks from './pages/Tasks';
import './App.css';

// Защищённый маршрут: пускает только если есть токен
function PrivateRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) return <p>Загрузка...</p>;

  return token ? children : <Navigate to="/login" />;
}

// Публичный маршрут: если уже вошёл — редирект на /tasks
function PublicRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) return <p>Загрузка...</p>;

  return token ? <Navigate to="/tasks" /> : children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Tasks />
            </PrivateRoute>
          }
        />
        {/* Если зашли на неизвестный путь — редирект на /tasks */}
        <Route path="*" element={<Navigate to="/tasks" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;