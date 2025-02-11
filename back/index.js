import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import ShortUniqueId from 'short-unique-id';
import admin from 'firebase-admin';
import fs from 'fs';
import cors from 'cors';
import {login, verifyTokenMiddleware} from './tokens.js';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { log } from 'console';

dotenv.config();

const serviceaccount = JSON.parse(
  fs.readFileSync("./serviceaccount.json", "utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceaccount),
});

// Create an Express application
const app = express();
app.use(cors('*'));
const port = process.env.PORT;

// Parse JSON bodies for this app
app.use(express.json());

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

const AIHOST = process.env.AIHOST;

// Unique ID generator used in class code generation
const uid = new ShortUniqueId({ length: 10 });

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


app.post('/api/class', verifyTokenMiddleware, async (req, res) => {
   const { name, teacher_id } = req.body;

  const language = "[]"; /* TODO: Add language array to class creation */

    if (!name || !teacher_id) {
        return res.status(400).json({ error: 'Class name and teacher ID are required' });
    }


    try {
        const connection = await createConnection();
        const [rows] = await connection.execute(
            'SELECT id FROM USER WHERE id = ? AND teacher = "1"',
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


    const class_code = uid.rnd();


    console.log(class_code);


    try {
        const connection = await createConnection();
        const [result] = await connection.execute(
            'INSERT INTO CLASS (name, teacher_id, language, code) VALUES (?, ?, ?, ?)',
            [name, JSON.stringify([teacher_id]), language, class_code]
        );
        await connection.end();


        res.status(201).json({ class_id: result.insertId, name, teacher_id, language, class_code });
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/class/enroll', verifyTokenMiddleware, async (req, res) => {
   const { class_code } = req.body;
   const verified_user_id = req.verified_user_id


  if (!class_code) {
    return res
      .status(400)
      .json({ error: "Class code is required" });
  }

    try {
        const connection = await createConnection();
        const [rows] = await connection.execute(
            'SELECT idclass FROM CLASS WHERE code = ?',
            [class_code]
        );
        await connection.end();


        if (rows.length === 0) {
            return res.status(400).json({ error: 'Class does not exist' });
        } else {
            const class_id = rows[0].idclass;
            // const teacher_info = JSON.parse(rows[0].teacher_id);
            // const language_info = JSON.parse(rows[0].language);
            try {

                // check for teacher

                const connection = await createConnection();
                const [userRows] = await connection.execute(
                    'SELECT teacher FROM USER WHERE id = ?',
                    [user_id]
                );
                await connection.end();

                if (userRows.length === 0) {
                    return res.status(400).json({ error: 'User does not exist' });
                }

                const isTeacher = userRows[0].teacher === 1;

                if (isTeacher) {
                    const connection = await createConnection();
                    const [classRows] = await connection.execute(
                        'SELECT teacher_id FROM CLASS WHERE idclass = ?',
                        [class_id]
                    );
                    await connection.end();

                    if (classRows.length === 0) {
                        return res.status(400).json({ error: 'Class does not exist' });
                    }

                    let teacher_ids = JSON.parse(classRows[0].teacher_id);
                    teacher_ids.push(user_id);

                    const updateConnection = await createConnection();
                    await updateConnection.execute(
                        'UPDATE CLASS SET teacher_id = ? WHERE idclass = ?',
                        [JSON.stringify(teacher_ids), class_id]
                    );
                    await updateConnection.end();

                } else {

                    const connection = await createConnection();
                    await connection.execute(
                        'UPDATE USER SET class = ? WHERE id = ?',
                        [class_id, user_id]
                    );
                    await connection.end();
                }


                const { name, language_info, teacher_info, classmate_info } = await getClassInfo(class_id);


                const class_details = { name, class_id, language_info, teacher_info, classmate_info };
                res.json({ message: 'Student has been successfully enrolled in the class', class_details });

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

app.post('/message/create', async (req, res) => {
    const { message, language_id, class_id, verified_user_id } = req.body;

    console.log(message);

  // Validación del mensaje
  if (!message || typeof message !== "string" || message.trim() === "") {
    return res
      .status(400)
      .json({ error: "El mensaje es obligatorio y no puede estar vacío." });
  }

    // Validación del ID de idioma
    if (!language_id || typeof language_id !== 'number') {
        return res.status(400).json({ error: 'El ID de idioma es obligatorio y debe ser un número.' });
    }

    // Validación del ID de clase
    if (!class_id || typeof class_id !== 'number') {
        return res.status(400).json({ error: 'El ID de clase es obligatorio y debe ser un número.' });
    }

    // Validación del ID de usuario verificado
    if (!verified_user_id || typeof verified_user_id !== 'number') {
        return res.status(400).json({ error: 'El ID de usuario verificado es obligatorio y debe ser un número.' });
    }

    try {
        const connection = await createConnection();
        const [rows] = await connection.execute(
            'SELECT id FROM USER WHERE id = ? AND class = ?',
            [verified_user_id, class_id]
        );
        await connection.end();

        if (rows.length === 0) {
            return res.status(401).json({ error: 'No perteneces a esta clase.' });
        }

    } catch (error) {
        console.error('Error fetching class language:', error);
        return res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.end();
    }
    
    let language;
    let languageToSend;

    try {
        const connection = await createConnection();
        const [rows] = await connection.execute(
            'SELECT language FROM CLASS WHERE idclass = ?',
            [class_id]
        );
        await connection.end();

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Class not found' });
        }

        language = rows[0].language;
        console.log("Language: ", language);
    } catch (error) {
        console.error('Error fetching class language:', error);
        return res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.end();
    }

    const parsedLanguages = JSON.parse(language);

    languageToSend = parsedLanguages.find((language) => language.id === language_id);

    let restriction

    if (languageToSend === undefined) {
        return res.status(400).json({ error: 'El lenguaje del mensaje no coincide con el lenguaje de la clase.' });
    } else {

        console.log(languageToSend);
        console.log(languageToSend.restrictionId);

        try {
            const connection = await createConnection();
            const [rows] = await connection.execute(
                'SELECT content FROM RESTRICTION WHERE idrestriction = ?',
                [languageToSend.restrictionId]
            );

            if (rows.length === 0) {
                return res.status(404).json({ error: 'Restriction not found' });
            }

            restriction = rows[0].content;
        } catch (error) {

            console.error('Error fetching restriction:', error);
            return res.status(500).json({ error: 'Internal server error' });
        } finally {
            connection.end();
        }
    }

    try {
        const aiResponse = await sendToAI(message, languageToSend.name, restriction);

    const returnMessage = aiResponse.content;

        // Extract the content within <think> tags
        const thinkTagContent = returnMessage.match(/<think>(.*?)<\/think>/s);

        let restOfContent = "Sorry, something went wrong. Please try again.";

    if (thinkTagContent && thinkTagContent[1]) {
      const extractedContent = thinkTagContent[1];
      console.log("Extracted Content: ", extractedContent);

      restOfContent = returnMessage.replace(thinkTagContent[0], "").trim();
      console.log("Rest of Content: ", restOfContent);
    } else {
      console.log("No <think> tag found in the response.");
    }

    res.status(200).json(restOfContent);
  } catch (error) {
    console.error("Error en el servidor:", error);

    // Manejo de errores específicos
    // if (error.message.includes('La IA respondió con un error')) {
    //     res.status(502).json({ error: 'Error en la comunicación con la IA: ' + error.message });
    // } else if (error.message.includes('No se recibió respuesta de la IA')) {
    //     res.status(504).json({ error: 'La IA no está disponible en este momento.' });
    // } else {
    //     res.status(500).json({ error: 'Hubo un problema al procesar la solicitud.' });
    // }
    
  }
});

app.post('/api/language', async (req, res) => {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
        const connection = await createConnection();
        const [result] = await connection.execute(
            'INSERT INTO LANGUAGE (name) VALUES (?)',
            [name]
        );
        await connection.end();

        res.status(201).json({ idlanguage: result.insertId, name });
    } catch (error) {
        console.error('Error creating language:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/sublanguages', async (req, res) => {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
        const connection = await createConnection();
        const [result] = await connection.execute(
            'INSERT INTO SUBLANGUAGE (name) VALUES (?)',
            [name]
        );
        await connection.end();

        res.status(201).json({ idlanguage: result.insertId, name });
    } catch (error) {
        console.error('Error creating sublanguage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.put('/api/language/class', async (req, res) => {
    const { classId, languages } = req.body;

    if (!classId || !Array.isArray(languages) || languages.length === 0) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
        const connection = await createConnection();
        const [classRows] = await connection.execute(
            'SELECT idclass FROM CLASS WHERE idclass = ?',
            [classId]
        );

        if (classRows.length === 0) {
            await connection.end();
            return res.status(404).json({ error: 'Class not found' });
        }

        await connection.execute(
            'UPDATE CLASS SET language = ? WHERE idclass = ?',
            [JSON.stringify(languages), classId]
        );

        await connection.end();

        res.status(200).json({ classId, languages });
    } catch (error) {
        console.error('Error updating languages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/language', async (req, res) => {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
        const connection = await createConnection();
        const [result] = await connection.execute(
            'INSERT INTO LANGUAGE (name) VALUES (?)',
            [name]
        );
        await connection.end();

        res.status(201).json({ idlanguage: result.insertId, name });
    } catch (error) {
        console.error('Error creating language:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/language/class', async (req, res) => {
    const { classId, languages } = req.body;

    if (!classId || !Array.isArray(languages) || languages.length === 0) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
        const connection = await createConnection();
        const [classRows] = await connection.execute(
            'SELECT idclass FROM CLASS WHERE idclass = ?',
            [classId]
        );

        if (classRows.length === 0) {
            await connection.end();
            return res.status(404).json({ error: 'Class not found' });
        }

        await connection.execute(
            'UPDATE CLASS SET language = ? WHERE idclass = ?',
            [JSON.stringify(languages), classId]
        );

        await connection.end();

        res.status(200).json({ classId, languages });
    } catch (error) {
        console.error('Error updating languages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

function getClassInfo(class_id) {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await createConnection();
            const [rows] = await connection.execute(
                'SELECT name, language, teacher_id FROM CLASS WHERE idclass = ?',
                [class_id]
            );
            await connection.end();


            if (rows.length === 0) {
                reject('Class does not exist info info info');
            } else {
                const connection = await createConnection();
                const [classmates] = await connection.execute(
                    'SELECT id, name FROM USER WHERE class = ?',
                    [class_id]
                );
                await connection.end();


                const classmate_info = classmates.map(({ id, name }) => ({ id, name }));


                const { name, language, teacher_id } = rows[0];


                const parsed_teacher_id = JSON.parse(teacher_id);


                console.log("ID professors: ", parsed_teacher_id);


                const teacher_info = await Promise.all(parsed_teacher_id.map(async (id) => {
                    const connection = await createConnection();
                    const [teacher] = await connection.execute(
                        'SELECT name FROM USER WHERE id = ?',
                        [id]
                    );
                    await connection.end();

                    console.log("Teacher info after SELECT: ", teacher[0]);

                    return { id, name: teacher[0].name };
                }));




        const language_info = JSON.parse(language);

                resolve({ class_id, name, language_info, teacher_info, classmate_info });
            }
        } catch (error) {
            reject('Internal server error');
        }
    });
}

const sendToAI = async (message, language, restriction) => {
    console.log("sending message");
    const response = await fetch(`http://${AIHOST}:4567`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userPrompt: message, language, restriction })
    });

  console.log("answer recieved");

  if (!response.ok) {
    throw new Error("La IA respondió con un error: " + response.statusText);
  }

  const aiResponse = await response.json();

  if (!aiResponse) {
    throw new Error("No se recibió respuesta de la IA");
  }

  console.log(aiResponse);

  console.log("answer sent back");

  return aiResponse;
};

app.post('/api/auth/google', async (req, res) => {
    const { uid, name, gmail } = req.body;

    if (!gmail.endsWith('@inspedralbes.cat')) {
        return res.status(400).json({ error: 'Incorrect Credentials' });
    }

    const ltterNum = /^[a-zA-Z]\d/;
    const ltterLtter = /^[a-zA-Z]{2}/;


  let teacher = 0;

  if (ltterLtter.test(gmail)) {
    teacher = 1;
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM USER WHERE googleId = ?",
      [uid]
    );

    let userId;

    let classId = null;

    if (rows.length === 0) {
      const[result] = await connection.execute(
        "INSERT INTO USER (googleId, name, gmail, teacher) VALUES (?, ?, ?, ?)",
        [uid, name, gmail, teacher]
      );
      userId = result.insertId;

      console.log("New user created in the database");
    } else {
      userId = rows[0].id;
      classId = rows[0].class;
      console.log("User already exists in the database");
    }

    let class_info = null

    if(classId != null) {
      class_info = await getClassInfo(classId);
    }

    // const [classRows] = await connection.execute(
    //     "SELECT class FROM USER " +
    //     "WHERE id = ?",
    //     [userId]
    //   );
  
    //   let classInfo = null;
    //   if (classRows.length > 0) {
    //     const classData = classRows[0];
    //     classInfo = {
    //       class_id: classData.idclass,
    //       name: classData.name,
    //       teacher_id: classData.teacher_id,
    //       language: classData.language,
    //       class_code: classData.code
    //     };
    //   }

    await connection.end();
    const user = { id: userId };
    const token = login(user, process.env.SECRET_KEY)

    res.json({
      message: "User authenticated correctly",
      token, 
      id: userId,
      name,
      gmail,
      teacher,
      class_id: class_info ? class_info.class_id : null,
      class_info: class_info
    });
  } catch (error) {
    console.error("Authenticated failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/language", verifyTokenMiddleware, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Language name are required" });
  }

  try {
    const connection = await createConnection();
    const [result] = await connection.execute(
      "INSERT into LANGUAGES (name) VALUES (?)",
      [name]
    );
    await connection.end();

    res.status(201).json({ idlanguage: result.insertId, name });
  } catch (error) {
    console.error("Error creating LANGUAGE:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/class/languages", verifyTokenMiddleware, async (req, res) => {
  const { class_id } = req.query;

  if (!class_id) {
    return res.status(400).json({ error: "Class ID is required" });
  }

  try {
    const connection = await createConnection();
    const [rows] = await connection.execute(
      "SELECT language FROM CLASS WHERE idclass = ?",
      [class_id]
    );
    await connection.end();

    if (rows.length === 0) {
      return res.status(404).json({ error: "Class not found" });
    }

    const language_info = JSON.parse(rows[0].language);
    res
      .status(200)
      .json({ count: language_info.length, languages: language_info });
  } catch (error) {
    console.error("Error fetching languages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/language", verifyTokenMiddleware, async (req, res) => {
  const { idlanguage } = req.body;

  if (!idlanguage) {
    return res.status(400).json({ error: "Idlanguage is required" });
  }

  try {
    const connection = await createConnection();

    const [result] = await connection.execute(
      `DELETE FROM LANGUAGES WHERE idlanguage = ?`,
      [idlanguage]
    );

    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Language not found" });
    }

    res.status(200).json({ message: "Language deleted successfully" });
  } catch (error) {
    console.error("Error in attempt to delete language", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/user", verifyTokenMiddleware, async (req, res) => {
  const { class_id } = req.query;

  if (!class_id) {
    return res.status(400).json({ error: "Class ID is required" });
  }

  try {
    const connection = await createConnection();
    const [rows] = await connection.execute(
      "SELECT name, gmail FROM USER WHERE class_id = ?",
      [class_id]
    );
    await connection.end();

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/quiz",  async (req, res) => {
    const { id } = req.query;
  
    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }
  
    try {
      const connection = await createConnection();
      const [rows] = await connection.execute(
        "SELECT questions, results, language_id, sublanguage_id, data, answered FROM QUIZ WHERE id = ?",
        [id]
      );
      await connection.end();
  
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/quizToSolve",  async (req, res) => {
    const { user_id,quiz_id } = req.query;
  
    if (!user_id | !quiz_id) {
      return res.status(400).json({ error: "User_id and quiz_id are required" });
    }
  
    try {
      const connection = await createConnection();
      const [rows] = await connection.execute(
        "SELECT questions FROM QUIZ WHERE quiz_id = ?",
        [quiz_id]
      );
      await connection.end();
  
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


app.get('/', (req, res) => {
    res.send('This is the back end!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
