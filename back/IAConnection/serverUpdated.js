require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const helmet = require('helmet');
const winston = require('winston');

const app = express();
const PORT = process.env.PORT || 4567;
const AI_API_URL = process.env.AI_URL;

if (!AI_API_URL) {
    console.warn('⚠️  AI_URL no está definida en el entorno. Verifica la configuración.');
}

// Configurar logger
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Función para enviar el mensaje recibido a la IA
const sendToAI = async (message) => {
    try {
        if (typeof message !== 'string') {
            throw new Error('El mensaje debe ser un string.');
        }

        const response = await axios.post(`${AI_API_URL}/process`, { message }, { timeout: 5000 });
        return response.data;
    } catch (error) {
        console.error('Error al interactuar con la IA:', error);

        if (error.response) {
            throw new Error(`La IA respondió con un error: ${error.response.status} - ${error.response.data}`);
        } else if (error.request) {
            throw new Error('No se recibió respuesta de la IA. Verifica la conexión o la URL.');
        } else {
            throw new Error('Error al configurar la solicitud a la IA.');
        }
    }
};

// Endpoint para recibir el mensaje del front y reenviarlo a la IA
app.post('/api/ai', async (req, res) => {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({ error: 'El mensaje es obligatorio y no puede estar vacío.' });
    }

    try {
        const aiResponse = await sendToAI(message);
        res.status(200).json(aiResponse);
    } catch (error) {
        console.error('Error en el servidor:', error.message);

        if (error.message.includes('La IA respondió con un error')) {
            res.status(502).json({ error: 'Error en la comunicación con la IA: ' + error.message });
        } else if (error.message.includes('No se recibió respuesta de la IA')) {
            res.status(504).json({ error: 'La IA no está disponible en este momento.' });
        } else {
            res.status(500).json({ error: 'Hubo un problema al procesar la solicitud.' });
        }
    }
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada. Servidor levantado y corriendo' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ error: 'Ocurrió un error inesperado en el servidor.' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
