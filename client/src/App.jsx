import { useState } from 'react';
import ChatWindow from './components/ChatWindow.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import useChat from './hooks/useChat.js';
import './styles/app.css';

export default function App() {
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(512);
  const { messages, sendMessage, isLoading, error } = useChat({
    temperature,
    maxTokens
  });

  const handleSend = async (text) => {
    if (!text.trim()) return;
    await sendMessage(text);
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>Chat IA con Llama 3</h1>
        <p>Interfaz minimalista para conversar con el modelo Llama 3 desde un backend Node.</p>
      </header>
      <main className="app__main">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          error={error}
          onSend={handleSend}
        />
        <SettingsPanel
          temperature={temperature}
          maxTokens={maxTokens}
          onTemperatureChange={setTemperature}
          onMaxTokensChange={setMaxTokens}
        />
      </main>
    </div>
  );
}
