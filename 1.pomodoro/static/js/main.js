const FIXED_DURATION_SECONDS = 25 * 60;

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startDisplayLoop() {
  const timeNode = document.getElementById("remaining-time");
  if (!timeNode) {
    return;
  }

  const startedAt = Date.now();

  const tick = () => {
    const elapsedSeconds = (Date.now() - startedAt) / 1000;
    const remainingSeconds = FIXED_DURATION_SECONDS - elapsedSeconds;
    timeNode.textContent = formatTime(remainingSeconds);
  };

  tick();
  window.setInterval(tick, 250);
}

document.addEventListener("DOMContentLoaded", startDisplayLoop);
