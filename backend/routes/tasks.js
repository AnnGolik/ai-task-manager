const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');
const axios = require('axios');

// Все роуты ниже требуют валидного токена
router.use(authMiddleware);

// ============================================
// GET /tasks - получить только СВОИ задачи
// ============================================
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ============================================
// POST /tasks - создать задачу для СЕБЯ
// При этом текст задачи отправляется в Python-сервис для анализа
// ============================================
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title обязателен' });

  // Значения по умолчанию, если Python-сервис недоступен
  let priority = 'medium';
  let category = 'general';

  // Пытаемся получить анализ от Python-сервиса
  try {
    const analyzeResponse = await axios.post('http://localhost:8000/analyze', {
      text: `${title} ${description || ''}`.trim()
    });
    priority = analyzeResponse.data.priority;
    category = analyzeResponse.data.category;
    console.log(`Анализ: priority=${priority}, category=${category}`);
  } catch (err) {
    // Если Python-сервис упал — просто используем значения по умолчанию
    console.warn('Python-сервис недоступен, использую значения по умолчанию');
  }

  try {
    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, description, priority, category)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.userId, title, description || '', priority, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ============================================
// PUT /tasks/:id - изменить статус СВОЕЙ задачи
// ============================================
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ['new', 'in_progress', 'done'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Недопустимый статус' });
  }

  try {
    const result = await pool.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [status, id, req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ============================================
// DELETE /tasks/:id - удалить СВОЮ задачу
// ============================================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    res.json({ message: 'Задача удалена' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;