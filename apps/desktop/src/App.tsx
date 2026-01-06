import { invoke, convertFileSrc } from "@tauri-apps/api/tauri";
import { useMemo, useState } from "react";
import "./index.css";

type PanelState = "idle" | "listening" | "thinking" | "capturing";

const STATE_LABELS: Record<PanelState, string> = {
  idle: "Idle",
  listening: "Listening",
  thinking: "Thinking",
  capturing: "Capturing",
};

const STATE_DESCRIPTIONS: Record<PanelState, string> = {
  idle: "Standing by for a wake word or task.",
  listening: "Audio input is active.",
  thinking: "Processing the latest request.",
  capturing: "Screen capture is running.",
};

export default function App() {
  const [panelState, setPanelState] = useState<PanelState>("idle");
  const [capturePreview, setCapturePreview] = useState<string | null>(null);
  const [captureError, setCaptureError] = useState<string | null>(null);

  const statusClass = useMemo(
    () => `status-pill status-${panelState}`,
    [panelState],
  );

  const handleCapture = async () => {
    if (panelState === "capturing") {
      return;
    }

    setPanelState("capturing");
    setCaptureError(null);
    try {
      const path = await invoke<string>("capture_screen");
      setCapturePreview(convertFileSrc(path));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Capture failed.";
      setCaptureError(message);
    } finally {
      setPanelState("idle");
    }
  };

  return (
    <main className="app">
      <section className="floating-panel">
        <header className="panel-header">
          <span className="panel-title">Gideon AI</span>
          <span className={statusClass}>{STATE_LABELS[panelState]}</span>
        </header>
        <p className="panel-description">{STATE_DESCRIPTIONS[panelState]}</p>
        <div className="panel-controls">
          <div className="state-buttons">
            {(["idle", "listening", "thinking"] as PanelState[]).map(
              (state) => (
                <button
                  key={state}
                  type="button"
                  className={
                    panelState === state
                      ? "state-button is-active"
                      : "state-button"
                  }
                  onClick={() => setPanelState(state)}
                >
                  {STATE_LABELS[state]}
                </button>
              ),
            )}
          </div>
          <button
            type="button"
            className={
              panelState === "capturing"
                ? "capture-button is-active"
                : "capture-button"
            }
            onClick={handleCapture}
            disabled={panelState === "capturing"}
          >
            {panelState === "capturing" ? "Capturing..." : "Capture"}
          </button>
        </div>
        {captureError && <p className="panel-error">{captureError}</p>}
        {capturePreview && (
          <div className="capture-preview">
            <span className="preview-label">Latest capture</span>
            <img
              className="preview-image"
              src={capturePreview}
              alt="Latest screen capture"
            />
          </div>
        )}
      </section>
    </main>
  );
}
