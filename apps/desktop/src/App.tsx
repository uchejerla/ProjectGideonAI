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

  const statusClass = useMemo(
    () => `status-pill status-${panelState}`,
    [panelState],
  );

  const handleCaptureToggle = () => {
    setPanelState((current: PanelState) =>
      current === "capturing" ? "idle" : "capturing",
    );
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
            onClick={handleCaptureToggle}
          >
            {panelState === "capturing" ? "Stop Capture" : "Capture"}
          </button>
        </div>
      </section>
    </main>
  );
}
