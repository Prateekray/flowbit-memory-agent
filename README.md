```markdown
# Flowbit AI Memory Agent 🧠

An intelligent invoice processing agent capable of **Adaptive Learning**, **Logic Validation**, and **Duplicate Detection**.

This project implements a **Human-in-the-Loop (HITL) Memory System**. It solves the problem of recurring errors by "learning" from user corrections and persisting that knowledge for future transactions.

## 🚀 Core Capabilities

* **One-Shot Learning:** Instantly remembers field mappings (e.g., "Leistungsdatum" → `serviceDate`) after a single correction.
* **Heuristic Computation:** Applies complex logic rules (e.g., Reverse Tax Calculation) based on vendor patterns.
* **Auditable:** Every decision and memory retrieval is logged in a structured `auditTrail` for transparency.
* **Persistence Layer:** Uses **SQLite** for a lightweight, file-based memory store that survives restarts.

## ✨ Level 4 Features (New)

The agent has been upgraded to handle complex enterprise scenarios:

1.  **Cross-Referencing:** Validates invoices against internal Purchase Orders (PO Matching).
2.  **Duplicate Detection:** Blocks duplicate submissions to prevent double payments.
3.  **Data Recovery:** Automatically infers missing currency or context from unstructured text.
4.  **SKU Mapping:** Translates vendor-specific product codes into internal standard SKUs.

## 🛠️ Tech Stack

* **Runtime:** Node.js (v20+)
* **Language:** TypeScript (Strict Mode)
* **Database:** SQLite (via `sqlite3`)
* **Architecture:** Modular (Processor ↔ Memory Manager ↔ Database)

## 📊 Scenarios Demonstrated

The following scenarios run automatically in the demo:

| Scenario | Vendor | Challenge | Agent Action |
| :--- | :--- | :--- | :--- |
| **A** | Supplier GmbH | Date formatting & PO Match | Extracts `20.01.2024` and matches `PO-A-051` |
| **B** | Parts AG | Missing Data | Recovers `EUR` currency from text context |
| **C** | Freight & Co | SKU Mapping | Maps vendor SKU to internal code `FREIGHT` |
| **D** | **Security** | **Duplicate Check** | ⛔ BLOCKED duplicate invoice `INV-C-002-DUP` |

## 💻 How to Run
1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Run the Demo:**
    ```bash
    npx ts-node src/index.ts
    ```

## 🧪 Scenarios Covered
1.  **Supplier GmbH:** Learns to map "Leistungsdatum" to `serviceDate` dynamically.
2.  **Parts AG:** Detects "MwSt. inkl" and automatically recalculates the Net Total.
