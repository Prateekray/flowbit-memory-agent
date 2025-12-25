import { Invoice, ProcessedInvoice, MemoryRule } from './types';
import { MemoryManager } from './memoryManager';

export class InvoiceProcessor {
    private memory: MemoryManager;

    constructor(memory: MemoryManager) {
        this.memory = memory;
    }

    async process(invoice: Invoice): Promise<ProcessedInvoice> {
        const rules = await this.memory.recallRules(invoice.vendor);
        
        // Clone invoice to avoid mutating original
        let processed = { ...invoice };
        const corrections: string[] = [];
        const auditTrail: string[] = [];
        let confidence = 0.5; // Base confidence

        auditTrail.push(`Processing invoice ${invoice.invoiceId} from ${invoice.vendor}`);

        if (rules.length > 0) {
            auditTrail.push(`Recalled ${rules.length} memory rules.`);
        }

        // --- CORE LOGIC ---

        // 1. Apply Rules (Learned Memory)
        for (const rule of rules) {
            if (rule.type === 'extraction' && invoice.textPayload.includes(rule.trigger_text)) {
                // Example: Extract date using regex pattern
                const regex = new RegExp(rule.action_value);
                const match = invoice.textPayload.match(regex);
                if (match) {
                    (processed as any)[rule.target_field] = match[0];
                    corrections.push(`Extracted ${rule.target_field}: ${match[0]}`);
                    confidence += 0.2;
                }
            }
            
            if (rule.type === 'calculation' && invoice.textPayload.includes(rule.trigger_text)) {
                // Special logic for Parts AG Tax
                if (rule.target_field === 'netTotal') {
                    // Logic: Net = Gross / 1.19
                    const newNet = Number((processed.grossTotal / 1.19).toFixed(2));
                    const newTax = Number((processed.grossTotal - newNet).toFixed(2));
                    
                    processed.netTotal = newNet;
                    processed.taxTotal = newTax;
                    corrections.push(`Recalculated Tax (Inclusive VAT)`);
                    confidence = 0.95;
                }
            }
        }

        // 2. Hardcoded Heuristics (Pre-baked "Common Sense")
        // If text contains "Skonto", flag it even if no specific rule exists yet
        if (invoice.textPayload.toLowerCase().includes('skonto')) {
            auditTrail.push("Detected 'Skonto' terms - Recommendation: Update Payment Terms");
        }

        return {
            originalId: invoice.invoiceId,
            normalizedInvoice: processed,
            correctionsApplied: corrections,
            confidenceScore: Math.min(confidence, 1.0),
            auditTrail: auditTrail,
            requiresHumanReview: corrections.length === 0 && confidence < 0.8
        };
    }
}