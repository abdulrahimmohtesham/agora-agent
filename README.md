# 🛍️ ShopAgora AI — End-to-End Conversational Shopping Prototype
> **PS41 — Agentic Workflow Opportunity Example: End-to-End Conversational Shopping**  
> Powered by **Agora Conversational AI / RTC**, **Murf AI Falcon Low-Latency TTS**, and **Autonomous Tool-Calling Workflows**.

---

## 🌟 Executive Summary & Problem Statement Alignment

**ShopAgora AI** is an agentic conversational commerce platform that turns e-commerce into a fluid, voice-first, multimodal shopping experience. Built for **PS41**, it implements every required phase of the end-to-end shopping journey:

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   1. BEFORE     │ ──▶ │ 2. DURING: DISC. │ ──▶ │ 3. DURING: REC.  │ ──▶ │    4. ACTION     │ ──▶ │    5. AFTER     │
│ Context & Hist. │     │ Semantic Search  │     │ Product Matrix   │     │ Inventory & Buy  │     │ Track & Support │
└─────────────────┘     └──────────────────┘     └──────────────────┘     └──────────────────┘     └─────────────────┘
```

1. **Before**: Automatically establishes customer context (`Alex Morgan`, Platinum VIP Tier, 5% cashback), past purchase history (`Sony WH-1000XM4` purchased 2 years ago), and active personal vouchers (`TECH20`, `FALCON15`, `FREESHIP`).
2. **During (Discover)**: Natural voice queries trigger semantic catalog querying with real-time stock levels and technical specifications.
3. **During (Recommend)**: Compares products head-to-head (e.g. Sony XM5 vs Bose QuietComfort Ultra) across battery life, active noise cancellation, and personalized upgrade benefits.
4. **Action (Execute)**: Tool calling automatically checks live warehouse inventory, applies the customer's `TECH20` voucher (saving $80), updates the active cart, and executes sandbox 1-click checkout with a saved Visa card.
5. **After (Follow Up & Support)**: Confirms the order with an invoice and tracking ID, renders a real-time courier milestone map, and handles return and exchange assistance.

---

## 🛠️ Technology Architecture

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Voice & RTC Transport** | **Agora RTC Web SDK NG** (`agora-rtc-sdk-ng`) | Low-latency real-time voice streaming channel with audio track management & volume metering. |
| **Speech Generation** | **Murf AI Falcon TTS** | High-fidelity, ultra-low latency voice synthesis engine tuned for conversational retail concierges. |
| **Agent Reasoning Engine** | **Node.js Express + Tool Calling** | Multi-step agentic orchestrator that converts natural utterances into structured tool calls. |
| **Multimodal Frontend** | **React 18 + Tailwind CSS + Lucide** | Real-time synchronized UI with dynamic product spotlights, waveform visualizer, and checkout modals. |
| **APIs & Inventory** | **REST + WebSockets** | Real-time catalog queries, warehouse inventory lookup, and order state synchronization. |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Installation
All dependencies for the root, server, and client are installed with a single command:
```bash
npm run install:all
```

### 2. Configure Credentials (Optional)
The project comes with a built-in **Interactive Sandbox Demo Mode** that runs immediately with zero setup!

To connect to live Agora RTC production channels and Murf AI Falcon TTS:
1. Open `server/.env` (or click the **Settings** ⚙️ icon in the web app).
2. Enter your credentials:
```env
# Agora Credentials
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_app_certificate
AGORA_CHANNEL_NAME=shopping-concierge-channel

# Murf AI Falcon Credentials
MURF_API_KEY=your_murf_api_key
MURF_VOICE_ID=en-US-falcon
```

### 3. Run the Fullstack Application
Start both the backend server (port 5001) and the React client (port 3000) concurrently:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🎬 5-Step Evaluator Demo Walkthrough

Click the voice prompt buttons or speak directly to test the complete lifecycle:

### Step 1: Context & Initiation (Before)
- **Prompt**: Click `"1. Discover: Find top noise-cancelling headphones"` or say:
  > *"Find top noise-cancelling headphones."*
- **Agent Action**: Calls `retrieve_customer_context` -> Recognizes Alex Morgan's Platinum VIP status and past Sony XM4 ownership -> Calls `search_catalog` -> Spotlights top headphones on screen and speaks recommendations via Murf Falcon TTS.

### Step 2: Head-to-Head Comparison (During)
- **Prompt**: Click `"2. Compare: Compare Sony XM5 vs Bose QuietComfort"` or say:
  > *"Compare the Sony XM5 and Bose QuietComfort Ultra."*
- **Agent Action**: Calls `compare_products` with SKUs `SNY-XM5-BLK` and `BSE-QCU-SLV` -> Launches the interactive comparison matrix detailing ANC, battery life (30h vs 24h), and explains why the XM5 is the best upgrade for an XM4 owner.

### Step 3: Warehouse Inventory Verification (Action)
- **Prompt**: Click `"3. Stock: Check inventory at San Francisco warehouse"` or say:
  > *"Check inventory and stock at the San Francisco warehouse."*
- **Agent Action**: Calls `check_inventory(sku="SNY-XM5-BLK")` -> Confirms 14 units available in San Francisco Fulfillment Center with guaranteed next-day delivery.

### Step 4: Add to Cart & Apply VIP Voucher (Action)
- **Prompt**: Click `"4. Buy & Discount: Add Sony XM5 and apply my VIP discount"` or say:
  > *"Add Sony XM5 to my cart and apply my discount."*
- **Agent Action**: Calls `add_to_cart` -> Calls `apply_discount(couponCode="TECH20")` -> Calculates an **$80 instant discount** -> Slides open the live cart showing the updated total of $319.99 with free priority shipping.

### Step 5: Sandbox Checkout & Order Follow-Up (After)
- **Prompt**: Click `"5. Checkout: Proceed to checkout with my saved Visa"` or say:
  > *"Proceed to checkout with my saved card."*
- **Agent Action**: Calls `initiate_checkout` -> Simulates sandbox payment -> Triggers celebratory confetti -> Generates confirmed Order `#ORD-XXXXXX` and tracking number with courier milestone updates.
- **Bonus Follow-Up**: Click `"6. Track: Track my delivery status"` or `"7. Returns: How do I return my previous order?"` to test delivery milestones and pre-approved RMA return generation.

---

## 🔌 API & Agentic Tool Schema Reference

| Tool Name | Stage | Description |
| :--- | :--- | :--- |
| `retrieve_customer_context` | **BEFORE** | Retrieves customer preferences, past orders (Sony XM4), loyalty perks, and active vouchers. |
| `search_catalog` | **DURING (Discover)** | Queries products by keyword, category, price, and feature tags. |
| `compare_products` | **DURING (Recommend)** | Compares two or more product SKUs side-by-side with feature matrices and pros/cons. |
| `check_inventory` | **ACTION** | Checks live warehouse stock counts and shipping transit windows. |
| `add_to_cart` | **ACTION** | Updates the session shopping cart state in real-time. |
| `apply_discount` | **ACTION** | Validates and applies promo codes (`TECH20`, `FALCON15`, `FREESHIP`). |
| `initiate_checkout` | **ACTION** | Authorizes sandbox payment with customer's saved Visa card and creates confirmed order. |
| `track_order` | **AFTER** | Looks up courier delivery milestones (Fulfillment Hub -> Courier Van -> Delivery). |
| `process_return` | **AFTER** | Issues pre-approved RMA return labels and refund details for previous purchases. |

---

## 📂 Repository Structure

```
.
├── client/                     # Multimodal React Frontend
│   ├── src/
│   │   ├── components/         # Header, Orb, Catalog, Modals, Drawer, Tracker
│   │   ├── services/
│   │   │   ├── agoraClient.js  # Agora RTC Web SDK NG client & audio engine
│   │   │   └── voiceAgent.js   # Murf Falcon TTS player & speech recognition
│   │   ├── App.jsx             # Main reactive app orchestrator
│   │   └── index.css           # Custom Tailwind styling & glassmorphism
│   ├── package.json
│   └── vite.config.js          # API proxy to backend
├── server/                     # Backend API & Agentic Engine
│   ├── data/
│   │   ├── catalog.js          # Products, inventory, warehouse locations, specs
│   │   └── customer.js         # Customer profile, loyalty tier, purchase history
│   ├── services/
│   │   ├── agoraService.js     # Agora RTC token builder (RtcTokenBuilder)
│   │   ├── murfService.js      # Murf AI Falcon low-latency TTS integration
│   │   └── agentEngine.js      # 5-phase Agentic Workflow reasoning & tool calling
│   ├── server.js               # Express REST & WebSocket server
│   ├── package.json
│   └── .env.example
├── package.json                # Root orchestrator scripts
└── README.md                   # Documentation & Walkthrough Guide
```

---

## 🏆 Innovation & Extra Credit Features
- **Zero-Friction Sandbox Fallback**: Evaluators can run the demo immediately without requiring external API keys, while retaining 100% full compatibility with live Agora RTC and Murf Falcon API keys.
- **Multimodal Visual Synchronization**: The interface spotlight, comparison matrix, cart drawer, and order tracker dynamically react in real time as the agent speaks.
- **Tool Calling Inspector**: Judges can inspect real-time JSON payloads of each agent tool execution right in the UI.
