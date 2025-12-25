import { Database } from 'sqlite';
import { MemoryRule } from './types';

export class MemoryManager {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    async recallRules(vendor: string): Promise<MemoryRule[]> {
        return await this.db.all<MemoryRule[]>(
            'SELECT * FROM memories WHERE vendor = ? ORDER BY confidence DESC',
            [vendor]
        );
    }

    async learnRule(rule: MemoryRule): Promise<void> {
        // Check if rule exists to avoid duplicates
        const existing = await this.db.get(
            'SELECT * FROM memories WHERE vendor = ? AND trigger_text = ?',
            [rule.vendor, rule.trigger_text]
        );

        if (existing) {
            console.log(`[Memory] Reinforcing existing rule for ${rule.vendor}`);
            await this.db.run(
                'UPDATE memories SET confidence = confidence + 0.1 WHERE id = ?',
                [existing.id]
            );
        } else {
            console.log(`[Memory] Learning NEW rule for ${rule.vendor}: ${rule.type}`);
            await this.db.run(
                `INSERT INTO memories (vendor, type, trigger_text, target_field, action_value, confidence)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [rule.vendor, rule.type, rule.trigger_text, rule.target_field, rule.action_value, rule.confidence]
            );
        }
    }
}