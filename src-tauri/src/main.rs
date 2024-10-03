// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, WindowEvent};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();
            let main_window_clone = main_window.clone();

            main_window.on_window_event(move |event| match event {
                WindowEvent::Focused(is_focused) => {
                    if *is_focused {
                        let _ = main_window_clone.set_ignore_cursor_events(false);
                        println!("Window gained focus");
                    } else {
                        let _ = main_window_clone.set_ignore_cursor_events(true);
                        println!("Window lost focus");
                    }
                }
                _ => {}
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}
