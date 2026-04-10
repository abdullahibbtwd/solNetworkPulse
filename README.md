# Solana Network Telemetry Dashboard

A high-performance, real-time telemetry dashboard for the Solana network. Built for speed and reliability, this terminal provides live network statistics, transaction throughput, and whale activity monitoring with a zero-jitter architecture.

## Overview

This dashboard utilizes a multi-threaded architecture to handle high-frequency Solana network data without impacting UI performance. It leverages Helius WebSockets for low-latency transaction streams and specialized Web Workers for data parsing and metrics calculation.

## Core Features

### Real-Time Network Telemetry
- Market Price Analysis: Integration with CoinGecko for real-time SOL pricing and historical trend visualization.
- Transaction Throughput (TPS): Live tracking of network activity using an exponentially smoothed frequency signal.
- Slot Performance: Millisecond-precision slot monitoring with network-accurate latency tracking.
- Network Health Status: Dynamic classification of network state (Fast, Normal, Congested) based on live performance data.

### Intelligence & Alerts
- Whale Monitoring: Integrated detection of large-scale capital movements within a 60-second sliding window.
- Protocol Intelligence: Real-time leaderboard of the most active programs, including market share dominance.
- Smart Transaction Feed: High-frequency transaction logs filtered for signal-to-noise optimization.

### Performance Engineering
- Autonomous Self-Healing: Background workers maintain independent WebSocket connections with automatic recovery, ensuring the stream remains active even when the browser tab is backgrounded.
- Metrics Pulsar Pattern: High-frequency network signals are buffered and flushed to the UI at stable intervals to prevent CPU thermal throttling on mobile devices.
- GPU Hardware Acceleration: Component-level GPU layer promotion using CSS hardware acceleration to maintain fluid 60FPS animations.

## Technical Stack

- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Concurrency: Web Workers for background data processing
- Styling: Vanilla CSS with Glassmorphism design principles
- Data Sources: 
  - Helius RPC / WebSocket API (Real-time Transaction Stream)
  - CoinGecko API (Market Pricing and Historical Chart Data)

## Getting Started

### Prerequisites

You will need a Helius API key to access live network data.

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your API key in the environment variables.
4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the live dashboard.

## Architecture Guidelines

### State Management
Avoid using high-frequency state updates in the React root. Utilize the provided Wrapper components which implement the Pulsar pattern for performance-critical metrics.

### Web Workers
All network processing should reside in the transaction worker. The main UI thread should only be used for rendering and user interaction.
