const jwt = require('jsonwebtoken');

// Middleware: проверяет JWT-токен в заголовке Authorization
module.exports = function (req, res, next) {
  // Получаем заголовок Authorization
  const authHeader = req.headers.authorization;

  // Если заголовка нет — отказываем
  if (!authHeader) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  // Формат заголовка: "Bearer eyJhbGciOiJIUzI1NiIs..."
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Неверный формат токена' });
  }

  const token = parts[1];

  try {
    // Проверяем токен с помощью секретного ключа
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Сохраняем данные пользователя в req.user — они будут доступны в роутах
    req.user = decoded;
    next(); // пропускаем запрос дальше
  } catch (err) {
    return res.status(401).json({ error: 'Неверный или истёкший токен' });
  }
};