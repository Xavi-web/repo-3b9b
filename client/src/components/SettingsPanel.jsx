import '../styles/settings-panel.css';

export default function SettingsPanel({ temperature, maxTokens, onTemperatureChange, onMaxTokensChange }) {
  return (
    <aside className="settings-panel">
      <h2>Parámetros</h2>
      <label className="settings-panel__field">
        <span>Creatividad (temperature)</span>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={temperature}
          onChange={(event) => onTemperatureChange(Number(event.target.value))}
        />
        <span className="settings-panel__value">{temperature.toFixed(1)}</span>
      </label>
      <label className="settings-panel__field">
        <span>Límite de tokens</span>
        <input
          type="number"
          min="64"
          max="4096"
          value={maxTokens}
          onChange={(event) => onMaxTokensChange(Number(event.target.value))}
        />
      </label>
      <p className="settings-panel__note">
        Los valores se envían al backend de Node, que a su vez consulta la API compatible con Llama 3 (por ejemplo, Groq).
      </p>
    </aside>
  );
}
