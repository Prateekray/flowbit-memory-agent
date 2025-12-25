import { initDB } from './database';
import { MemoryManager } from './memoryManager';
import { InvoiceProcessor } from './processor';
import { SAMPLE_INVOICES } from './data';
import { MemoryRule } from './types';

async function main() {
    console.log("🚀 Starting Flowbit AI Memory Agent...\n");

    // 1. Initialize
    const db = await initDB();
    const memoryManager = new MemoryManager(db);
    const processor = new InvoiceProcessor(memoryManager);

    // ---------------------------------------------------------
    // SCENARIO 1: Supplier GmbH (The Learning Loop)
    // ---------------------------------------------------------
    console.log("--- SCENARIO A: Supplier GmbH (Learning Service Date) ---");
    
    // Step A: Run Invoice 1 (Should Fail/Low Confidence)
    const invoice1 = SAMPLE_INVOICES[0];
    console.log(`\n📄 Processing ${invoice1.invoiceId} (Run 1)...`);
    const result1 = await processor.process(invoice1);
    
    if (!result1.normalizedInvoice.serviceDate) {
        console.log("❌ Issue: Service Date missing.");
        console.log("🤖 Agent: 'I don't know how to find dates for this vendor.'");
        
        // Step B: TEACH the system (Simulating Human Correction)
        console.log("\n👨‍🏫 Human: 'The date follows the word Leistungsdatum'");
        const newRule: MemoryRule = {
            vendor: "Supplier GmbH",
            type: "extraction",
            trigger_text: "Leistungsdatum",
            target_field: "serviceDate",
            action_value: "(?<=Leistungsdatum: )\\d{2}\\.\\d{2}\\.\\d{4}", // Regex to capture date
            confidence: 1.0
        };
        await memoryManager.learnRule(newRule);
    }

    // Step C: Run Invoice 2 (Should Succeed automatically)
    const invoice2 = SAMPLE_INVOICES[1];
    console.log(`\n📄 Processing ${invoice2.invoiceId} (Run 2 - Same Vendor)...`);
    const result2 = await processor.process(invoice2);
    
    if (result2.normalizedInvoice.serviceDate) {
        console.log(`✅ Success! Extracted Service Date: ${result2.normalizedInvoice.serviceDate}`);
        console.log(`📝 Logic: ${result2.correctionsApplied[0]}`);
    }

    // ---------------------------------------------------------
    // SCENARIO 2: Parts AG (Tax Calculation)
    // ---------------------------------------------------------
    console.log("\n--- SCENARIO B: Parts AG (Tax Logic) ---");
    
    // Pre-load the rule for Parts AG (as if we learned it previously)
    await memoryManager.learnRule({
        vendor: "Parts AG",
        type: "calculation",
        trigger_text: "MwSt. inkl",
        target_field: "netTotal",
        action_value: "reverse_tax",
        confidence: 0.9
    });

    const invoice3 = SAMPLE_INVOICES[2];
    console.log(`\n📄 Processing ${invoice3.invoiceId}...`);
    console.log(`   Original Net Total: ${invoice3.netTotal} (Incorrect)`);
    
    const result3 = await processor.process(invoice3);
    console.log(`✅ Corrected Net Total: ${result3.normalizedInvoice.netTotal}`);
    console.log(`📝 Reason: ${result3.correctionsApplied[0]}`);

    console.log("\n🏁 Demo Complete. Database Updated.");
}

main().catch(console.error);