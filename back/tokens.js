import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config
const SECRET_KEY = process.env.SECRET_KEY;
const sessionStore = {};


export function login(db, SECRET_KEY, req, res) {
    const { gmail, name } = req.body;  
  
    const query = `SELECT * FROM USER WHERE gmail = ?`;
    db.query(query, [gmail], async (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const user = results[0];
      const token = jwt.sign({ id: user.id, gmail: user.gmail }, SECRET_KEY, { expiresIn: '1h' });
  
      sessionStore[token] = {
        id: user.id,
        name: user.name,
        gmail: user.gmail,
        teacher: user.teacher,
        language: user.language,
        googleId: user.googleId,
        class: user.class,
      };
      console.log(sessionStore)
  
      res.status(200).json({
        token: token,
        ...sessionStore[token],
      });
  
      db.end();
    });
  }
  