import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (!token) {
      return res.status(400).json('Вы не авторизованы');
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, 'secret123');
        req.userId = decoded.id;
        next();
      } catch (err) {
        res.status(403).json('Нет доступа');
      }
    }
  } catch (err) {
    res.status(403).json('У вас нет доступа');
  }
};
