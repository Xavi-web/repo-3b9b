import { useCallback, useState } from 'react';

let messageId = 0;

const createMessage = (overrides) => ({
  id: ++messageId,
  role: 'user',
  content: '',
  ...overrides
});

export default function useChat({ temperature, maxTokens }) {
  const [messages, setMessages] = useState([createMessage({ role: 'assistant', content: '¡Hola! Soy tu asistente Llama 3. ¿En qué puedo ayudarte hoy?' })]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (text) => {
    const userMessage = createMessage({ role: 'user', content: text });
    setMessages((current) => [...current, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
          temperature,
          maxTokens
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Error desconocido en el servidor.' }));
        throw new Error(data.error || 'Error desconocido en el servidor.');
      }

      const data = await response.json();
      const assistantMessage = createMessage({ role: 'assistant', content: data.content || 'No recibí respuesta del modelo.' });
      setMessages((current) => [...current, assistantMessage]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [messages, temperature, maxTokens]);

  return { messages, sendMessage, isLoading, error };
}
