import { launchConfetti } from "./confetti";
import { loadSettings, saveSettings, GameSettings } from "./settings";
import { createWave, createErrorCross } from "./wave";

export interface GameConfig {
  size: number;
  tableId: string;
  timerId: string;
  targetId: string;
  newGameBtnId: string;
  settingsBtnId: string;
  settingsDialogId: string;
  waveToggleId: string;
  closeSettingsId: string;
  gridSizeSelectId: string;
}

export class ShulteGame {
  private size: number;
  private maxNumber: number;
  private currentNumber: number = 1;
  private startTime: number | null = null;
  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private settings: GameSettings;

  private readonly tableElement: HTMLElement;
  private readonly timerElement: HTMLElement;
  private readonly currentTargetElement: HTMLElement;
  private readonly newGameButton: HTMLElement;

  constructor(config: GameConfig) {
    this.settings = loadSettings();
    this.size = this.settings.gridSize || config.size;
    this.maxNumber = this.size * this.size;

    this.tableElement = this.getRequiredElement(config.tableId);
    this.timerElement = this.getRequiredElement(config.timerId);
    this.currentTargetElement = this.getRequiredElement(config.targetId);
    this.newGameButton = this.getRequiredElement(config.newGameBtnId);

    this.initSettingsUI(config);

    this.newGameButton.addEventListener("click", () => this.startNewGame());
    this.startNewGame();
  }

  private initSettingsUI(config: GameConfig): void {
    const settingsBtn = this.getRequiredElement(config.settingsBtnId);
    const dialog = document.getElementById(config.settingsDialogId) as HTMLDialogElement;
    const waveToggle = document.getElementById(config.waveToggleId) as HTMLInputElement;
    const gridSizeSelect = document.getElementById(config.gridSizeSelectId) as HTMLSelectElement;
    const closeBtn = this.getRequiredElement(config.closeSettingsId);

    if (waveToggle) {
      waveToggle.checked = this.settings.waveOnTouch;
      waveToggle.addEventListener("change", () => {
        this.settings.waveOnTouch = waveToggle.checked;
        saveSettings(this.settings);
      });
    }

    if (gridSizeSelect) {
      gridSizeSelect.value = this.settings.gridSize.toString();
      gridSizeSelect.addEventListener("change", () => {
        this.settings.gridSize = parseInt(gridSizeSelect.value, 10);
        saveSettings(this.settings);
        this.startNewGame();
      });
    }

    if (settingsBtn && dialog) {
      settingsBtn.addEventListener("click", () => dialog.showModal());
    }

    if (closeBtn && dialog) {
      closeBtn.addEventListener("click", () => dialog.close());
    }
  }

  private getRequiredElement(id: string): HTMLElement {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Element with id "${id}" not found`);
    return el;
  }

  private generateNumbers(): number[] {
    const numbers = Array.from({ length: this.maxNumber }, (_, i) => i + 1);
    // Fisher-Yates shuffle
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j]!, numbers[i]!] as [number, number];
    }
    return numbers;
  }

  private createTable(numbers: number[]): void {
    this.tableElement.innerHTML = "";
    this.tableElement.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;

    numbers.forEach((num) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = num.toString();
      cell.addEventListener("click", () => this.handleCellClick(num, cell));
      this.tableElement.appendChild(cell);
    });
  }

  private startTimer(): void {
    this.startTime = Date.now();
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.startTime) {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.timerElement.textContent = `Time: ${elapsed}s`;
      }
    }, 1000);
  }

  private handleCellClick(number: number, cell: HTMLElement): void {
    if (number === this.currentNumber) {
      if (this.settings.waveOnTouch) {
        createWave(cell);
      }

      if (this.currentNumber === 1) {
        this.startTimer();
      }
      if (this.currentNumber === this.maxNumber) {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.showVictory(cell);
      } else {
        this.currentNumber++;
        this.updateCurrentTarget();
      }
    } else {
      if (this.settings.waveOnTouch) {
        createErrorCross(cell);
      }
    }
  }

  private showVictory(cell: HTMLElement): void {
    this.currentTargetElement.textContent = "🎉 Congratulations! You completed the table! 🎉";
    this.currentTargetElement.classList.add("victory");
    const rect = cell.getBoundingClientRect();
    launchConfetti(3000, rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  private updateCurrentTarget(): void {
    this.currentTargetElement.textContent = `Find number: ${this.currentNumber}`;
  }

  public startNewGame(): void {
    this.size = this.settings.gridSize;
    this.maxNumber = this.size * this.size;
    this.currentNumber = 1;
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerElement.textContent = "Time: 0s";
    this.currentTargetElement.classList.remove("victory");
    this.updateCurrentTarget();
    const numbers = this.generateNumbers();
    this.createTable(numbers);
  }
}
