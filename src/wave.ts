export function createWave(cell: HTMLElement): void {
  const rect = cell.getBoundingClientRect();
  const wave = document.createElement("div");
  wave.className = "wave";
  // Position relative to cell center
  wave.style.left = `${rect.left + rect.width / 2}px`;
  wave.style.top = `${rect.top + rect.height / 2}px`;
  document.body.appendChild(wave);

  wave.addEventListener("animationend", () => {
    wave.remove();
  });
}

export function createErrorCross(cell: HTMLElement): void {
  const rect = cell.getBoundingClientRect();
  const cross = document.createElement("div");
  cross.className = "error-cross";
  cross.style.left = `${rect.left + rect.width / 2}px`;
  cross.style.top = `${rect.top + rect.height / 2}px`;
  cross.style.width = `${rect.width}px`;
  cross.style.height = `${rect.height}px`;
  document.body.appendChild(cross);

  cross.addEventListener("animationend", () => {
    cross.remove();
  });
}
