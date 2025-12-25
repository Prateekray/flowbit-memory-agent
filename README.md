# AI Agent with Learned Memory 🧠

This project implements a **Human-in-the-Loop (HITL) Memory System** for invoice processing. It solves the problem of recurring errors by "learning" from user corrections and persisting that knowledge for future transactions.

## 🚀 Key Features
* **One-Shot Learning:** Instantly remembers field mappings (e.g., "Leistungsdatum" → `serviceDate`) after a single correction.
* **Heuristic Computation:** Applies complex logic rules (e.g., Reverse Tax Calculation) based on vendor patterns.
* **Auditable:** Every decision and memory retrieval is logged in a structured `auditTrail`.
* **Persistence Layer:** Uses SQLite for a lightweight, file-based memory store that survives restarts.

## 🛠️ Tech Stack
* **Runtime:** Node.js (v20+)
* **Language:** TypeScript (Strict Mode)
* **Database:** SQLite (via `sqlite3`)

## 🏗️ Architecture
The system operates on a **Recall-Apply-Learn** loop:
1.  **Recall:** Before processing an invoice, the system queries the `memories` database for rules matching the specific Vendor.
2.  **Apply:**
    * *Extraction Rules:* Uses Regex to pull missing data from raw text.
    * *Calculation Rules:* Recomputes fields (e.g., Net/Gross) if specific triggers (like "MwSt. inkl") are found.
3.  **Learn:** When a human corrects a field, the `MemoryManager` stores a new high-confidence rule, ensuring the mistake doesn't happen again.

## 🏃‍♂️ How to Run
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
