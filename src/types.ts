export interface Invoice {
    invoiceId: string;
    vendor: string;
    invoiceNumber: string;
    invoiceDate: string;
    serviceDate: string | null;
    currency: string | null; // Can be null now
    netTotal: number;
    taxRate: number;
    taxTotal: number;
    grossTotal: number;
    poNumber?: string | null; // New field
    lineItems: Array<{
        description: string;
        sku?: string | null;
        qty: number;
        unitPrice: number;
    }>;
    textPayload: string;
}

export interface MemoryRule {
    id?: number;
    vendor: string;
    type: 'extraction' | 'calculation' | 'mapping' | 'validation';
    trigger_text: string;
    target_field: string;
    action_value: string;
    confidence: number;
}

export interface ProcessedInvoice {
    originalId: string;
    normalizedInvoice: Invoice;
    correctionsApplied: string[];
    confidenceScore: number;
    auditTrail: string[];
    requiresHumanReview: boolean;
    isDuplicate: boolean; // New flag
}