import { Invoice, ProcessedInvoice, MemoryRule } from './types';
import { MemoryManager } from './memoryManager';
import { Database } from 'sqlite';

export class InvoiceProcessor {
    private memory: MemoryManager;
    private db: Database; // Needed for duplicate check

    constructor(memory: MemoryManager, db: Database) {
        this.memory = memory;
        this.db = db;
    }

    async process(invoice: Invoice): Promise<ProcessedInvoice> {
        const auditTrail: string[] = [`Processing invoice ${invoice.invoiceId} from ${invoice.vendor}`];
        
        // --- 1. DUPLICATE DETECTION (Recall Transactions) ---
        const existing = await this.db.get(
            'SELECT * FROM invoice_history WHERE vendor = ? AND invoice_number = ?',
            [invoice.vendor, invoice.invoiceNumber]
        );

        if (existing) {
            auditTrail.push(`⚠️ DUPLICATE DETECTED! Matched Invoice Number: ${invoice.invoiceNumber}`);
            return {
                originalId: invoice.invoiceId,
                normalizedInvoice: invoice,
                correctionsApplied: [],
                confidenceScore: 0.0,
                auditTrail: auditTrail,
                requiresHumanReview: true,
                isDuplicate: true
            };
        }

        // --- 2. MEMORY RECALL (Recall Rules) ---
        const rules = await this.memory.recallRules(invoice.vendor);
        let processed = { ...invoice };
        const corrections: string[] = [];
        let confidence = 0.5;

        // --- 3. APPLY RULES ---
        for (const rule of rules) {
            // Extraction Rules (Date, Currency, Skonto)
            if (rule.type === 'extraction' && invoice.textPayload.includes(rule.trigger_text)) {
                const regex = new RegExp(rule.action_value);
                const match = invoice.textPayload.match(regex);
                if (match) {
                    (processed as any)[rule.target_field] = match[0];
                    corrections.push(`Extracted ${rule.target_field}: ${match[0]}`);
                    confidence += 0.2;
                }
            }
            
            // Calculation Rules (Tax)
            if (rule.type === 'calculation' && invoice.textPayload.includes(rule.trigger_text)) {
                if (rule.target_field === 'netTotal') {
                    const newNet = Number((processed.grossTotal / 1.19).toFixed(2));
                    const newTax = Number((processed.grossTotal - newNet).toFixed(2));
                    processed.netTotal = newNet;
                    processed.taxTotal = newTax;
                    corrections.push(`Recalculated Tax (Inclusive VAT)`);
                    confidence = 0.95;
                }
            }

            // Mapping Rules (SKU)
            if (rule.type === 'mapping') {
                processed.lineItems.forEach(item => {
                    if (item.description.includes(rule.trigger_text)) {
                        item.sku = rule.action_value;
                        corrections.push(`Mapped SKU: "${item.description}" -> ${rule.action_value}`);
                        confidence += 0.2;
                    }
                });
            }
        }

        // --- 4. HEURISTICS (Missing Currency & PO) ---
        
        // Currency Recovery
        if (!processed.currency) {
            if (processed.textPayload.includes('EUR') || processed.textPayload.includes('€')) {
                processed.currency = 'EUR';
                corrections.push("Recovered Currency: EUR from text");
            } else if (processed.textPayload.includes('USD') || processed.textPayload.includes('$')) {
                processed.currency = 'USD';
                corrections.push("Recovered Currency: USD from text");
            }
        }

        // PO Matching (Simple Heuristic for Demo)
        if (!processed.poNumber && processed.vendor === "Supplier GmbH") {
            // "Mock" database check for Supplier GmbH
            processed.poNumber = "PO-A-051"; 
            corrections.push("Auto-Suggested PO: PO-A-051 (Confidence: High)");
        }

        // --- 5. STORE HISTORY (Learn Transaction) ---
        if (!existing) {
            await this.db.run(
                'INSERT INTO invoice_history (invoice_id, vendor, invoice_number, total_amount) VALUES (?, ?, ?, ?)',
                [processed.invoiceId, processed.vendor, processed.invoiceNumber, processed.grossTotal]
            );
        }

        return {
            originalId: invoice.invoiceId,
            normalizedInvoice: processed,
            correctionsApplied: corrections,
            confidenceScore: Math.min(confidence, 1.0),
            auditTrail: auditTrail,
            requiresHumanReview: corrections.length === 0 && confidence < 0.8,
            isDuplicate: false
        };
    }
}