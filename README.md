# Chat IA con Llama 3 (React + Node)

Este proyecto ofrece un ejemplo completo de cómo construir un chat con un frontend en React y un backend en Node/Express que actúa como proxy hacia un proveedor con soporte para los modelos Llama 3 (por ejemplo, la API de Groq).

## Estructura

```
.
├── client/   # Interfaz en React + Vite
└── server/   # API en Node que reenvía peticiones al modelo Llama 3
```

## Requisitos previos

* Node.js 18 o superior (incluye `fetch` nativo en el backend).
* Una cuenta en un proveedor con acceso a Llama 3 (se utiliza el endpoint compatible con OpenAI de Groq).
* Clave de API (`GROQ_API_KEY`).

## Configuración

1. Instala dependencias:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
   > 💡 Si recibes un `403 Forbidden` al instalar, asegúrate de usar el registro público de npm:
   > ```bash
   > npm config set registry https://registry.npmjs.org/
   > ```
2. Crea un archivo `server/.env` con el siguiente contenido:
   ```env
   GROQ_API_KEY=tu_clave
   GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
   LLAMA_MODEL=llama3-8b-8192
   PORT=4000
   ```
   Ajusta `LLAMA_MODEL` o la URL si tu proveedor usa otros identificadores.
3. Arranca el backend y comprueba que responde:
   ```bash
   cd server
   npm run dev
   # en otra terminal puedes verificar el chequeo de salud
   curl http://localhost:4000/health
   ```
4. En otra terminal, arranca el frontend:
   ```bash
   cd client
   npm run dev
   ```
5. Abre <http://localhost:5173>. El proxy configurado en Vite reenviará `/api/*` al backend y podrás enviar mensajes a Llama 3.

## Personalización

* **Temperatura y tokens máximos**: la interfaz expone controles que envían estos parámetros al backend en cada mensaje.
* **Mensajes iniciales**: edita `client/src/hooks/useChat.js` para personalizar el saludo y el manejo del historial.
* **Proveedor**: si prefieres otro servicio compatible con Llama 3, modifica `GROQ_API_URL` y el nombre del modelo en el backend.

## Scripts útiles

* `npm run dev` (en `server/`): recarga en caliente el servidor Express.
* `npm run dev` (en `client/`): inicia Vite con proxy al backend.
* `npm run build` (en `client/`): genera la versión lista para producción de la interfaz.

## Prueba rápida sin frontend

Si deseas validar el backend sin levantar la interfaz, ejecuta:

```bash
curl -X POST http://localhost:4000/api/chat \
  -H 'Content-Type: application/json' \
  -d '{
        "messages": [
          { "role": "system", "content": "Eres un asistente útil." },
          { "role": "user", "content": "Hola, ¿cómo estás?" }
        ],
        "temperature": 0.7,
        "maxTokens": 512
      }'
```

Deberías recibir una respuesta con el mensaje del asistente si tu clave de API es válida.

## Notas

Este repositorio no incluye la clave de API ni automatiza el despliegue. Recuerda proteger tus credenciales y revisar los límites de uso del proveedor del modelo.
