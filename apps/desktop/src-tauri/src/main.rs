#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::time::{SystemTime, UNIX_EPOCH};

#[tauri::command]
fn capture_screen() -> Result<String, String> {
  let screens = screenshots::Screen::all().map_err(|error| {
    format!(
      "Unable to access screens. Ensure screen capture permissions are granted. {error}"
    )
  })?;
  let screen = screens
    .first()
    .ok_or_else(|| "No screens detected for capture.".to_string())?;
  let image = screen.capture().map_err(|error| {
    format!(
      "Screen capture failed. Ensure screen recording permissions are granted. {error}"
    )
  })?;
  let timestamp = SystemTime::now()
    .duration_since(UNIX_EPOCH)
    .map_err(|error| format!("Unable to read system time. {error}"))?
    .as_millis();
  let mut path = std::env::temp_dir();
  path.push(format!("gideon-capture-{timestamp}.png"));
  image.save(&path).map_err(|error| {
    format!(
      "Unable to save capture to the temp directory. Check permissions. {error}"
    )
  })?;
  Ok(path.to_string_lossy().to_string())
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![capture_screen])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
