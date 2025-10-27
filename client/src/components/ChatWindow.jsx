import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble.jsx';
import '../styles/chat-window.css';

export default function ChatWindow({ messages, onSend, isLoading, error }) {
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <section className="chat-window">
      <div className="chat-window__messages">
        {messages.map((message) => (
          <MessageBubble key={message.id} {...message} />
        ))}
        {isLoading && <div className="chat-window__loading">Llama 3 está pensando…</div>}
        {error && <div className="chat-window__error">{error}</div>}
        <div ref={endRef} />
      </div>
      <form className="chat-window__form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Escribe tu mensaje"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          Enviar
        </button>
      </form>
    </section>
  );
}
