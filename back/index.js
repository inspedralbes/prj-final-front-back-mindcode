import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

async function createConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Database connection successful');
        return connection;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}

async function testConnection() {
    const connection = await createConnection();
    try {
        await connection.ping();
        console.log('Database connection test successful');
    } catch (error) {
        console.error('Database connection test failed:', error);
    } finally {
        await connection.end();
        console.log('Database connection closed');
    }
}

testConnection();

app.post('/api/class', async (req, res) => {
    const { name, teacher_id } = req.body;

    if (!name || !teacher_id) {
        return res.status(400).json({ error: 'Class name and teacher ID are required' });
    }

    try {
        const connection = await createConnection();
        const [rows] = await connection.execute(
            'SELECT id FROM users WHERE googleId = ? AND teacher = "1"',
            [teacher_id]
        );
        await connection.end();

        if (rows.length === 0) {
            return res.status(401).json({ error: 'You are not authorized to take that action' });
        }
    } catch (error) {
        console.error('Error verifying teacher ID:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    try {
        const connection = await createConnection();
        const [result] = await connection.execute(
            'INSERT INTO CLASS (name, teacher_id) VALUES (?, ?)',
            [name, JSON.stringify([teacher_id])]
        );
        await connection.end();

        res.status(201).json({ message: 'Class created successfully', classId: result.insertId });
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/join-student', async (req, res) => {
    const { classCode, studentId } = req.body;

    if (!classCode || !studentId) {
        return res.status(400).json({ error: 'Class code and student ID are required' });
    }

    try {
        const connection = await createConnection();
        const [rows] = await connection.execute(
            'SELECT id FROM CLASS WHERE code = ?',
            [classCode]
        );
        await connection.end();

        if (rows.length === 0) {
            return res.status(400).json({ error: 'Class does not exist' });
        } else {
            const classId = rows[0].id;
            try {
                const connection = await createConnection();
                const [result] = await connection.execute(
                    'UPDATE USER SET class_id = ? WHERE googleId = ?',
                    [classId, studentId]
                );
                await connection.end();

                if (result.affectedRows === 0) {
                    return res.status(400).json({ error: 'Student could not be added to class' });
                } else {
                    res.json({ message: 'Student added to class successfully' });
                }
            } catch (error) {
                console.error('Error adding student to class:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        }
    } catch (error) {
        console.error('Error verifying class code:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});