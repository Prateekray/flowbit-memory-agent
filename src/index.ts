import { initDB } from './database';
import { MemoryManager } from './memoryManager';
import { InvoiceProcessor } from './processor';
import { SAMPLE_INVOICES } from './data';
import type { MemoryRule } from './types';

async function main() {
    console.log("🚀 Starting Flowbit AI Memory Agent (Full Suite)...\n");

    const db = await initDB();
    const memoryManager = new MemoryManager(db);
    const processor = new InvoiceProcessor(memoryManager, db);

    // --- 1. SUPPLIER GmbH (Date Learning + PO Match) ---
    console.log("--- SCENARIO 1: Supplier GmbH ---");
    
    // Teach Date Rule
    await memoryManager.learnRule({
        vendor: "Supplier GmbH",
        type: "extraction",
        trigger_text: "Leistungsdatum",
        target_field: "serviceDate",
        action_value: "(?<=Leistungsdatum: )\\d{2}\\.\\d{2}\\.\\d{4}",
        confidence: 1.0
    });

    const invA3 = SAMPLE_INVOICES[1]!;
    console.log(`\n📄 Processing ${invA3.invoiceId} (Date + PO Match)...`);
    const resA3 = await processor.process(invA3);
    console.log(`✅ Date Found: ${resA3.normalizedInvoice.serviceDate}`);
    console.log(`✅ PO Match:   ${resA3.normalizedInvoice.poNumber}`);

    // --- 2. PARTS AG (Tax Recalc + Missing Currency) ---
    console.log("\n--- SCENARIO 2: Parts AG ---");

    // Teach Tax Rule
    await memoryManager.learnRule({
        vendor: "Parts AG",
        type: "calculation",
        trigger_text: "MwSt. inkl",
        target_field: "netTotal",
        action_value: "reverse_tax",
        confidence: 0.9
    });

    const invB3 = SAMPLE_INVOICES[3]!; // The one with missing currency
    console.log(`\n📄 Processing ${invB3.invoiceId} (Missing Currency)...`);
    const resB3 = await processor.process(invB3);
    console.log(`✅ Currency:   ${resB3.normalizedInvoice.currency || 'FAILED'}`);
    console.log(`📝 Log:        ${resB3.correctionsApplied.join(', ')}`);

    // --- 3. FREIGHT & CO (Skonto + SKU Mapping) ---
    console.log("\n--- SCENARIO 3: Freight & Co ---");
    
    // Teach SKU Mapping
    await memoryManager.learnRule({
        vendor: "Freight & Co",
        type: "mapping",
        trigger_text: "Seefracht",
        target_field: "sku",
        action_value: "FREIGHT",
        confidence: 0.8
    });

    const invC2 = SAMPLE_INVOICES[4]!;
    console.log(`\n📄 Processing ${invC2.invoiceId} (SKU Mapping)...`);
    const resC2 = await processor.process(invC2);
    console.log(`✅ SKU Mapped: ${resC2.normalizedInvoice.lineItems[0].sku}`);
    
    // Check Skonto
    if (resC2.normalizedInvoice.textPayload.includes("Skonto")) {
        console.log(`✅ Skonto:     Detected in Payment Terms`);
    }

    // --- 4. DUPLICATE DETECTION ---
    console.log("\n--- SCENARIO 4: Duplicate Detection ---");
    
    const dupInv = SAMPLE_INVOICES[5]!;
    console.log(`\n📄 Processing ${dupInv.invoiceId} (Duplicate Check)...`);
    const resDup = await processor.process(dupInv);
    
    if (resDup.isDuplicate) {
        console.log(`⛔ BLOCKED: ${resDup.auditTrail[1]}`);
    } else {
        console.log(`❌ Failed to detect duplicate`);
    }

    console.log("\n🏁 Full Demo Complete.");
}

main().catch(console.error);