import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let dbInstance: Database | null = null;

export async function initDB(): Promise<Database> {
    if (dbInstance) return dbInstance;

    dbInstance = await open({
        filename: './memory.sqlite',
        driver: sqlite3.Database
    });

    // Table 1: Rules (The "Brain")
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

    // Table 2: History (The "Ledger" for Duplicates)
    await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS invoice_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoice_id TEXT NOT NULL,
            vendor TEXT NOT NULL,
            invoice_number TEXT NOT NULL,
            total_amount REAL,
            processed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    return dbInstance;
}