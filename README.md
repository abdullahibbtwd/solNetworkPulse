## **Overview**

Solana Network Pulse is built to handle continuous streams of blockchain data under load without degrading performance.
It leverages WebSocket-based event ingestion and off-thread processing to maintain consistent state updates while keeping the UI responsive.

The system focuses on:

* High-throughput event ingestion
* Low-latency data processing
* Reliable state synchronization under real-time conditions

---

## **Systems Design**

* **Event Ingestion Layer:**
  Subscribes to live transaction streams via Helius WebSockets, handling high-frequency blockchain events in real time.

* **Processing Layer:**
  Offloads parsing, aggregation, and filtering to Web Workers to prevent blocking the main execution thread.

* **State Synchronization:**
  Buffers and batches incoming high-frequency updates before committing them to the UI, ensuring consistency and avoiding render thrashing.

* **Resilience & Fault Tolerance:**
  Independent worker-managed WebSocket connections with automatic reconnection and recovery logic.

---

## **Core Features**

### **Real-Time Network Telemetry**

* **Market Data Integration:** Real-time SOL price tracking via CoinGecko with historical trend visualization
* **Transaction Throughput (TPS):** Live computation of network activity using smoothed event frequency
* **Slot Performance Monitoring:** Millisecond-level tracking of slot timing and latency
* **Network Health Classification:** Dynamic system state detection (Fast, Normal, Congested) based on live metrics

---

### **Event Intelligence & Analysis**

* **Whale Activity Detection:** Identification of large transaction flows within sliding time windows
* **Program Activity Tracking:** Real-time ranking of most active on-chain programs
* **Transaction Stream Filtering:** High-frequency event filtering and normalization for signal clarity

---

### **Performance Engineering**

* **Concurrent Data Processing:**
  Web Workers handle all high-frequency event parsing and computation off the main thread

* **Buffered Update Pipeline:**
  High-frequency signals are aggregated and flushed at controlled intervals to maintain stability and reduce CPU load

* **Low-Latency Rendering:**
  UI updates are synchronized with processed state to ensure smooth, real-time visualization without blocking

---

## **Technical Stack**

* **Language:** TypeScript
* **Framework:** Next.js (App Router)
* **Real-Time Transport:** WebSockets (Helius RPC)
* **Concurrency Model:** Web Workers (off-thread processing)
* **Data Sources:**

  * Helius RPC / WebSocket API (transaction streams)
  * CoinGecko API (market data)

---

## **Key Engineering Concepts**

* Real-time event-driven architecture
* High-throughput data ingestion
* On-chain event normalization
* Off-thread computation for performance isolation
* Consistent state synchronization under continuous updates

---

## **Getting Started**

### **Prerequisites**

* Helius API key for real-time Solana data access

### **Installation**

```bash
git clone <repo-url>
cd <repo>
npm install
```

Configure your environment variables with your Helius API key.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

---

## **Architecture Guidelines**

### **State Management**

Avoid high-frequency updates directly in the main React tree.
Use buffered update patterns to maintain stable rendering under continuous data flow.

### **Worker-Based Processing**

All event ingestion and transformation logic runs inside Web Workers.
The main thread is reserved strictly for rendering and user interaction.

---

## **Design Goal**

Designed to handle high-throughput, real-time blockchain data streams while maintaining consistent state updates and non-blocking UI performance.

---

## **Summary**

This project demonstrates the design and implementation of a real-time event processing system capable of handling high-frequency blockchain data, with a focus on performance, concurrency, and data consistency.


If you want, next step I can help you:
👉 Add **1–2 GitHub screenshots + captions** that make this even more convincing to recruiters.
