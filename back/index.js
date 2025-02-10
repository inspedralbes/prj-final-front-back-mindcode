import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import ShortUniqueId from "short-unique-id";
import admin from "firebase-admin";
import fs from "fs";
import cors from "cors";

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


app.post('/api/class', async (req, res) => {
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

app.post('/api/class/enroll', async (req, res) => {
    const { class_code, user_id } = req.body;

    if (!class_code || !user_id) {
        return res.status(400).json({ error: 'Class code and student ID are required' });
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

app.post("/message/create", async (req, res) => {
  const { message } = req.body;

  console.log(message);

  // Validación del mensaje
  if (!message || typeof message !== "string" || message.trim() === "") {
    return res
      .status(400)
      .json({ error: "El mensaje es obligatorio y no puede estar vacío." });
  }

  try {
    const aiResponse = await sendToAI(message);

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
                reject('Class does not exist');
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

const sendToAI = async (message) => {
  console.log("sending message");
  const response = await fetch(`http://${AIHOST}:4567`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userPrompt: message }),
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

    let classId = 0;

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

    if(classId != 0){
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

    // await connection.end();

    res.json({
      message: "User authenticated correctly",
      token: null, //jwt.sign()
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

app.post("/api/language", async (req, res) => {
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

app.get("/api/class/languages", async (req, res) => {
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

app.delete("/api/language", async (req, res) => {
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

app.get("/api/user", async (req, res) => {
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

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
