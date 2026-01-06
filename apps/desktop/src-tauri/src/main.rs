#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};

use screenshots::Screen;

type CaptureResult<T> = Result<T, String>;

#[tauri::command]
fn capture_screen() -> CaptureResult<String> {
    let screens = Screen::all().map_err(|error| error.to_string())?;
    let screen = screens.first().ok_or_else(|| "No screens detected".to_string())?;
    let image = screen.capture().map_err(|error| error.to_string())?;

    let mut path = tauri::api::path::picture_dir()
        .or_else(|| Some(std::env::temp_dir()))
        .unwrap_or_else(|| PathBuf::from("."));

    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|error| error.to_string())?
        .as_millis();

    path.push(format!("gideon-capture-{timestamp}.png"));
    image.save(&path).map_err(|error| error.to_string())?;

    Ok(path.to_string_lossy().to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![capture_screen])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
