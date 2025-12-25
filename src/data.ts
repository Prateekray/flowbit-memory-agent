import { Invoice } from './types';

export const SAMPLE_INVOICES: Invoice[] = [
    // 0. Supplier GmbH (Learn Date)
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
        textPayload: "Rechnungsnr: INV-2024-001\nLeistungsdatum: 01.01.2024"
    },
    // 1. Supplier GmbH (Apply Date + PO Match)
    {
        invoiceId: "INV-A-003",
        vendor: "Supplier GmbH",
        invoiceNumber: "INV-2024-003",
        invoiceDate: "25.01.2024",
        serviceDate: null,
        currency: "EUR",
        netTotal: 500.0,
        taxRate: 0.19,
        taxTotal: 95.0,
        grossTotal: 595.0,
        lineItems: [{ description: "Widget Pro", sku: "WIDGET-002", qty: 20, unitPrice: 25.0 }],
        textPayload: "Rechnungsnr: INV-2024-003\nLeistungsdatum: 20.01.2024"
    },
    // 2. Parts AG (Learn Tax)
    {
        invoiceId: "INV-B-001",
        vendor: "Parts AG",
        invoiceNumber: "PA-7781",
        invoiceDate: "05-02-2024",
        serviceDate: null,
        currency: "EUR",
        netTotal: 2000.0, // Wrong extraction (Gross used as Net)
        taxRate: 0.19,
        taxTotal: 400.0,
        grossTotal: 2400.0,
        lineItems: [{ description: "Bolts", sku: "BOLT-99", qty: 200, unitPrice: 10.0 }],
        textPayload: "Invoice No: PA-7781\nPrices incl. VAT (MwSt. inkl.)\nTotal: 2400.00 EUR"
    },
    // 3. Parts AG (Missing Currency)
    {
        invoiceId: "INV-B-003",
        vendor: "Parts AG",
        invoiceNumber: "PA-7810",
        invoiceDate: "03-03-2024",
        serviceDate: null,
        currency: null, // MISSING!
        netTotal: 1000.0,
        taxRate: 0.19,
        taxTotal: 190.0,
        grossTotal: 1190.0,
        lineItems: [{ description: "Nuts", sku: "NUT-10", qty: 500, unitPrice: 2.0 }],
        textPayload: "Invoice No: PA-7810\nTotal: 1190.00 EUR"
    },
    // 4. Freight & Co (Skonto + SKU Mapping)
    {
        invoiceId: "INV-C-002",
        vendor: "Freight & Co",
        invoiceNumber: "FC-1002",
        invoiceDate: "10.03.2024",
        serviceDate: null,
        currency: "EUR",
        netTotal: 1000.0,
        taxRate: 0.19,
        taxTotal: 190.0,
        grossTotal: 1190.0,
        lineItems: [{ description: "Seefracht / Shipping", sku: null, qty: 1, unitPrice: 1000.0 }],
        textPayload: "Invoice: FC-1002\n2% Skonto if paid within 10 days\nService: Seefracht"
    },
    // 5. Duplicate Check (Same as #4 but new ID)
    {
        invoiceId: "INV-C-002-DUP",
        vendor: "Freight & Co",
        invoiceNumber: "FC-1002", // SAME NUMBER
        invoiceDate: "10.03.2024",
        serviceDate: null,
        currency: "EUR",
        netTotal: 1000.0,
        taxRate: 0.19,
        taxTotal: 190.0,
        grossTotal: 1190.0,
        lineItems: [{ description: "Seefracht / Shipping", sku: null, qty: 1, unitPrice: 1000.0 }],
        textPayload: "Invoice: FC-1002"
    }
];