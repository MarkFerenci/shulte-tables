export interface GameSettings {
  waveOnTouch: boolean;
  gridSize: number;
}

const STORAGE_KEY = "schulte-settings";

const defaultSettings: GameSettings = {
  waveOnTouch: true,
  gridSize: 5,
};

export function loadSettings(): GameSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: GameSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
