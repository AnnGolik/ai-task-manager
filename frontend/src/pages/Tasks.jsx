import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Ошибка загрузки задач:', err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setError('');

    try {
      await api.post('/tasks', { title, description });
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка создания задачи');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/tasks/${id}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error('Ошибка изменения статуса:', err);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Удалить задачу?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const priorityLabel = {
    high: 'Высокий',
    medium: 'Средний',
    low: 'Низкий',
  };

  const categoryLabel = {
    business: 'Работа',
    study: 'Учёба',
    personal: 'Личное',
    health: 'Здоровье',
    finance: 'Финансы',
    general: 'Общее',
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Task Manager</h1>
        <div className="user-info">
          <div className="user-avatar">
            {user?.email?.[0] || '?'}
          </div>
          <span>{user?.email}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </div>

      <form className="task-form" onSubmit={createTask}>
        <input
          type="text"
          placeholder="Название задачи"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Создать</button>
      </form>

      {error && <p className="error">{error}</p>}

      <table className="task-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Описание</th>
            <th>Статус</th>
            <th>Приоритет</th>
            <th>Категория</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="8" className="empty">
                Задач пока нет. Создайте первую.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task.id}>
                <td>#{task.id}</td>
                <td><strong style={{ fontWeight: 500 }}>{task.title}</strong></td>
                <td>{task.description || <span style={{ color: '#9ca3af' }}>—</span>}</td>
                <td>
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task.id, e.target.value)}
                  >
                    <option value="new">Новая</option>
                    <option value="in_progress">В работе</option>
                    <option value="done">Выполнена</option>
                  </select>
                </td>
                <td>
                  <span className={`badge priority-${task.priority}`}>
                    {priorityLabel[task.priority] || task.priority}
                  </span>
                </td>
                <td>
                  <span className="category-badge">
                    {categoryLabel[task.category] || task.category}
                  </span>
                </td>
                <td>{new Date(task.created_at).toLocaleString('ru-RU')}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Tasks;