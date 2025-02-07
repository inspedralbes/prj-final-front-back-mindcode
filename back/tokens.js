import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY;

export function login(user, SECRET_KEY) {
  const { id } = user;
  const token = jwt.sign(
      { id },
      SECRET_KEY,
      { expiresIn: '1h' }
  );

  return token;
}

export function verifyTokenMiddleware(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your_secret_key'); 
    req.user = decoded;
    next(); 
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}