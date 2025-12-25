import { Invoice } from './types';

export const SAMPLE_INVOICES: Invoice[] = [
    // 1. Supplier GmbH: Missing Service Date (Needs Learning)
    {
        invoiceId: "INV-A-001",
        vendor: "Supplier GmbH",
        invoiceNumber: "INV-2024-001",
        invoiceDate: "12.01.2024",
        serviceDate: null, 
        currency: "EUR",
        netTotal: 2500.0,
        taxRate: 0.19,
        taxTotal: 475.0,
        grossTotal: 2975.0,
        lineItems: [{ description: "Widget", sku: "WIDGET-001", qty: 100, unitPrice: 25.0 }],
        textPayload: "Rechnungsnr: INV-2024-001\nLeistungsdatum: 01.01.2024\nBestellnr: PO-A-050"
    },
    // 2. Supplier GmbH: Same issue (Test if memory works)
    {
        invoiceId: "INV-A-002",
        vendor: "Supplier GmbH",
        invoiceNumber: "INV-2024-002",
        invoiceDate: "18.01.2024",
        serviceDate: null,
        currency: "EUR",
        netTotal: 2375.0,
        taxRate: 0.19,
        taxTotal: 451.25,
        grossTotal: 2826.25,
        lineItems: [{ description: "Widget", sku: "WIDGET-001", qty: 95, unitPrice: 25.0 }],
        textPayload: "Rechnungsnr: INV-2024-002\nLeistungsdatum: 15.01.2024\nBestellnr: PO-A-050"
    },
    // 3. Parts AG: Tax Calculation Issue (Needs specific logic)
    {
        invoiceId: "INV-B-001",
        vendor: "Parts AG",
        invoiceNumber: "PA-7781",
        invoiceDate: "05-02-2024",
        serviceDate: null,
        currency: "EUR",
        netTotal: 2000.0, // Extracted wrong, should be recalculated
        taxRate: 0.19,
        taxTotal: 400.0,
        grossTotal: 2400.0,
        lineItems: [{ description: "Bolts", sku: "BOLT-99", qty: 200, unitPrice: 10.0 }],
        textPayload: "Invoice No: PA-7781\nPrices incl. VAT (MwSt. inkl.)\nTotal: 2400.00 EUR"
    },
    // 4. Freight & Co: Skonto extraction
    {
        invoiceId: "INV-C-001",
        vendor: "Freight & Co",
        invoiceNumber: "FC-1001",
        invoiceDate: "01.03.2024",
        serviceDate: null,
        currency: "EUR",
        netTotal: 1000.0,
        taxRate: 0.19,
        taxTotal: 190.0,
        grossTotal: 1190.0,
        lineItems: [{ description: "Transport charges", qty: 1, unitPrice: 1000.0 }],
        textPayload: "Invoice: FC-1001\n2% Skonto if paid within 10 days"
    }
];