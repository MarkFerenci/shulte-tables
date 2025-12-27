import { ShulteGame } from "./game";

window.addEventListener("load", () => {
  new ShulteGame({
    size: 5,
    tableId: "shulteTable",
    timerId: "timer",
    targetId: "currentTarget",
    newGameBtnId: "newGame",
    settingsBtnId: "settingsBtn",
    settingsDialogId: "settingsDialog",
    waveToggleId: "waveToggle",
    closeSettingsId: "closeSettings",
    gridSizeSelectId: "gridSizeSelect",
  });
});
