export interface Invoice {
    invoiceId: string;
    vendor: string;
    invoiceNumber: string;
    invoiceDate: string;
    serviceDate: string | null; // This is what we need to fix
    currency: string;
    netTotal: number;
    taxRate: number;
    taxTotal: number;
    grossTotal: number;
    lineItems: Array<{
        description: string;
        sku?: string | null;
        qty: number;
        unitPrice: number;
    }>;
    textPayload: string; // The raw OCR text
}

export interface MemoryRule {
    id?: number;
    vendor: string;
    type: 'extraction' | 'calculation' | 'mapping';
    trigger_text: string;   // e.g., "Leistungsdatum" or "MwSt. inkl"
    target_field: string;   // e.g., "serviceDate" or "netTotal"
    action_value: string;   // e.g., regex pattern or formula
    confidence: number;
}

export interface ProcessedInvoice {
    originalId: string;
    normalizedInvoice: Invoice;
    correctionsApplied: string[];
    confidenceScore: number;
    auditTrail: string[];
    requiresHumanReview: boolean;
}