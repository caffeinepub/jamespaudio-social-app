import { useState, useEffect } from 'react';

interface VoiceSettings {
  enabled: boolean;
  volume: number; // 0-100
  volumeNormalized: number; // 0.0-1.0
  muted: boolean;
}

const VOICE_ENABLED_KEY = 'aiVoiceEnabled';
const VOICE_VOLUME_KEY = 'aiVoiceVolume';
const VOICE_MUTED_KEY = 'aiVoiceMuted';
const VOICE_SETTINGS_CHANGE_EVENT = 'voiceSettingsChange';

export function useVoiceSettings(): VoiceSettings {
  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem(VOICE_ENABLED_KEY);
    return saved !== null ? JSON.parse(saved) : true; // Default to enabled
  });

  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem(VOICE_VOLUME_KEY);
    return saved ? parseInt(saved) : 100; // Default to 100%
  });

  const [muted, setMuted] = useState(() => {
    const saved = localStorage.getItem(VOICE_MUTED_KEY);
    return saved !== null ? JSON.parse(saved) : false; // Default to not muted
  });

  useEffect(() => {
    // Listen for same-tab changes (custom event)
    const handleSameTabChange = () => {
      const savedEnabled = localStorage.getItem(VOICE_ENABLED_KEY);
      const savedVolume = localStorage.getItem(VOICE_VOLUME_KEY);
      const savedMuted = localStorage.getItem(VOICE_MUTED_KEY);
      
      if (savedEnabled !== null) {
        setEnabled(JSON.parse(savedEnabled));
      }
      if (savedVolume !== null) {
        setVolume(parseInt(savedVolume));
      }
      if (savedMuted !== null) {
        setMuted(JSON.parse(savedMuted));
      }
    };

    // Listen for cross-tab changes (storage event)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === VOICE_ENABLED_KEY && e.newValue !== null) {
        setEnabled(JSON.parse(e.newValue));
      }
      if (e.key === VOICE_VOLUME_KEY && e.newValue !== null) {
        setVolume(parseInt(e.newValue));
      }
      if (e.key === VOICE_MUTED_KEY && e.newValue !== null) {
        setMuted(JSON.parse(e.newValue));
      }
    };

    window.addEventListener(VOICE_SETTINGS_CHANGE_EVENT, handleSameTabChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(VOICE_SETTINGS_CHANGE_EVENT, handleSameTabChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    enabled,
    volume,
    volumeNormalized: volume / 100,
    muted,
  };
}

// Helper function to dispatch same-tab change event
export function notifyVoiceSettingsChange() {
  window.dispatchEvent(new Event(VOICE_SETTINGS_CHANGE_EVENT));
}
