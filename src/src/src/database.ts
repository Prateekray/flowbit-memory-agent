import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let dbInstance: Database | null = null;

export async function initDB(): Promise<Database> {
    if (dbInstance) return dbInstance;

    dbInstance = await open({
        filename: './memory.sqlite',
        driver: sqlite3.Database
    });

    // Create the memory table
    await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS memories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vendor TEXT NOT NULL,
            type TEXT NOT NULL,
            trigger_text TEXT,
            target_field TEXT,
            action_value TEXT,
            confidence REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    return dbInstance;
}