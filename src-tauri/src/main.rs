// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_autostart;
use tauri_plugin_fs;
use tauri_plugin_opener;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        // ✅ Plugins
        .plugin(tauri_plugin_autostart::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        // ✅ Disable right-click menu via JS (simplest + reliable)
        .on_page_load(|window, _| {
            let js = r#"
                window.addEventListener('contextmenu', (e) => e.preventDefault());
            "#;
            let _ = window.eval(js);
        })
        // ✅ Run the app
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
