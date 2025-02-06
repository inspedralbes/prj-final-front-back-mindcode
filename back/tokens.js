import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config
const SECRET_KEY = process.env.SECRET_KEY;

export function login(db, SECRET_KEY, req, res) {
    const { gmail, name } = req.body;  
  
    const query = `SELECT * FROM USER WHERE gmail = ?`;
    db.query(query, [gmail], async (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'DB error' });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const user = results[0];
      const token = jwt.sign({ name: user.name, gmail: user.gmail }, SECRET_KEY, { expiresIn: '1h' });
      console.log(token)
      res.status(200).json({
        id: user.id,
        token: token,
        name: user.name,
        gmail: user.gmail,
        teacher: user.teacher,
        language: user.language,
        googleId: user.googleId,
        class: user.class,
      });
      db.end();
    });
  }
  
export function verifyToken(SECRET_KEY, req) {
    console.log('Header Auth: ', req.headers.authorization);
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Token de Sessió: ', token);

    if (!token) {
      return { message: "Token required", login: false, user: null, status: 401 };
    }
    try {
      console.log('clave secreta: ', SECRET_KEY)
      const decoded = jwt.verify(token, SECRET_KEY);
      return { message: "Valid token", login: false, user: decoded, status: 200 };
    } 
    
    catch (err) {
      console.log(err)
      if (err.name === "Token Expired") {
        return { message: "Token expired.", login: true, user: null, status: 401 };
      }
      return { message: "Invalid token", login: false, user: null, status: 401 };
    }}

  export function verifyTokenMiddleware(req, res, next) {
    console.log('Token verification');
    const verificacio = verifyToken(SECRET_KEY, req);
    console.log('Resultado de la verificación del token:', verificacio);
    
    if (verificacio.status === 401) {
      console.log('Token expired');
      return res.status(401).json(verificacio);
    }
    
    next();
  }