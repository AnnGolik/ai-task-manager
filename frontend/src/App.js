import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Адрес backend-сервера
const API_URL = 'http://localhost:5000/tasks';

function App() {
  // Состояния (state) - это данные, которые могут меняться
  const [tasks, setTasks] = useState([]);          // список задач
  const [title, setTitle] = useState('');          // текст в поле "Название"
  const [description, setDescription] = useState(''); // текст в поле "Описание"

  // Функция загрузки всех задач с сервера
  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error('Ошибка загрузки задач:', err);
    }
  };

  // useEffect срабатывает один раз при открытии страницы
  useEffect(() => {
    fetchTasks();
  }, []);

  // Функция создания новой задачи
  const createTask = async (e) => {
    e.preventDefault(); // отменяем перезагрузку страницы
    if (!title.trim()) return; // если поле пустое - ничего не делаем

    try {
      await axios.post(API_URL, { title, description });
      setTitle('');        // очищаем поле
      setDescription('');  // очищаем поле
      fetchTasks();        // обновляем список
    } catch (err) {
      console.error('Ошибка создания задачи:', err);
    }
  };

  // Функция изменения статуса
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/${id}`, { status: newStatus });
      fetchTasks(); // обновляем список
    } catch (err) {
      console.error('Ошибка изменения статуса:', err);
    }
  };

  // Функция удаления задачи
  const deleteTask = async (id) => {
    if (!window.confirm('Удалить задачу?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks(); // обновляем список
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
  };

  return (
    <div className="container">
      <h1>AI Task Manager</h1>

      {/* Форма создания задачи */}
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

      {/* Таблица задач */}
      <table className="task-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Описание</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty">
                Задач пока нет. Создайте первую!
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
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

export default App;