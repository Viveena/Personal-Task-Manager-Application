import { type JSX, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import '../css/Settings.css'; // Import the CSS file

const Settings = (): JSX.Element => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error('Settings component must be used within a ThemeProvider');
  }

  const { theme, toggleTheme } = themeContext;

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2 className="settings-title">Theme Selection</h2>
        <p className="current-theme-text">
          Current theme: <span className="font-semibold capitalize">{theme}</span>
        </p>
        <button
          onClick={toggleTheme}
          className="settings-button"
        >
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>
    </div>
  );
};

export default Settings;
