import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const groqApiUrl = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
const llamaModel = process.env.LLAMA_MODEL || 'llama3-8b-8192';

if (!process.env.GROQ_API_KEY) {
  console.warn('⚠️  GROQ_API_KEY no está definido. El backend no podrá reenviar mensajes a la API de Groq.');
}

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, maxTokens = 512, temperature = 0.7 } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Debes enviar al menos un mensaje.' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'El servidor no tiene una GROQ_API_KEY configurada.' });
    }

    const response = await fetch(groqApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: llamaModel,
        messages,
        max_tokens: maxTokens,
        temperature
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Respuesta inválida del proveedor Llama 3.' }));
      return res.status(response.status).json({ error: error.error || error.message || 'Error al consultar el modelo Llama 3.' });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    res.json({ content, raw: data });
  } catch (error) {
    console.error('Error en /api/chat', error);
    res.status(500).json({ error: 'Ocurrió un error en el servidor al comunicarse con Llama 3.' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', model: llamaModel });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
