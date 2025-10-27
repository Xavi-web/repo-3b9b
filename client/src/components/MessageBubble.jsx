import '../styles/message-bubble.css';

export default function MessageBubble({ role, content }) {
  const isUser = role === 'user';

  return (
    <div className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--assistant'}`}>
      <div className="message-bubble__role">{isUser ? 'Tú' : 'Llama 3'}</div>
      <div className="message-bubble__content">{content}</div>
    </div>
  );
}
