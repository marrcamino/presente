use tauri_plugin_sql::{Migration, MigrationKind};

fn get_migrations() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "create_initial_tables",
        sql: "
            CREATE TABLE offices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                abbr TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            );

            CREATE TABLE employees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                office_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                photo_path TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (office_id) REFERENCES offices(id) ON DELETE RESTRICT
            );

            CREATE TABLE attendance_status (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT NOT NULL UNIQUE,
                label TEXT NOT NULL
            );

            CREATE TABLE attendance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employee_id INTEGER NOT NULL,
                event_type TEXT NOT NULL,
                status_id INTEGER,
                timestamp TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
                FOREIGN KEY (status_id) REFERENCES attendance_status(id) ON DELETE SET NULL
            );

            INSERT INTO attendance_status (code, label) VALUES
                ('PRESENT', 'Present'),
                ('ABSENT', 'Absent'),
                ('OT', 'On Travel'),
                ('OL', 'On Leave'),
                ('TAS', 'TAS'),
                ('OBA', 'OBA');
        ",
        kind: MigrationKind::Up,
    }]
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:presente.db", get_migrations())
                .build(),
        ).plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
