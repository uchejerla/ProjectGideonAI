const { invoke } = window.__TAURI__.tauri;

const button = document.querySelector("#capture");
const result = document.querySelector("#result");

button.addEventListener("click", async () => {
  result.textContent = "Capturing...";
  try {
    const path = await invoke("capture_screen");
    result.textContent = `Saved screenshot to: ${path}`;
  } catch (error) {
    result.textContent = `Capture failed: ${error}`;
  }
});
