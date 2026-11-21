const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { customerProfile } = require("./data/customer");
const { catalog } = require("./data/catalog");
const { generateAgoraToken } = require("./services/agoraService");
const { generateMurfSpeech } = require("./services/murfService");
const {
  processAgentWorkflow,
  toolExecutors,
  getActiveCart,
  getOrdersDatabase,
  AGENT_TOOLS
} = require("./services/agentEngine");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ShopAgora Conversational AI Commerce Engine",
    deployment: "Vercel / Node.js Production Ready",
    time: new Date().toISOString(),
    agoraConfigured: Boolean(process.env.AGORA_APP_ID && process.env.AGORA_APP_CERTIFICATE),
    murfConfigured: Boolean(process.env.MURF_API_KEY && !process.env.MURF_API_KEY.includes("your-"))
  });
});

// 1. BEFORE: Retrieve customer profile, past history, and active vouchers
app.get("/api/profile", (req, res) => {
  res.json({
    success: true,
    phase: "BEFORE",
    data: customerProfile
  });
});

// 2. DURING: Catalog discovery & search
app.get("/api/catalog", (req, res) => {
  const { query, category, maxPrice } = req.query;
  let results = [...catalog];

  if (category) {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  if (maxPrice) {
    results = results.filter(p => p.price <= parseFloat(maxPrice));
  }

  res.json({
    success: true,
    phase: "DURING_DISCOVERY",
    total: results.length,
    data: results
  });
});

// DURING: Compare products
app.post("/api/compare", async (req, res) => {
  const { skus } = req.body;
  const result = await toolExecutors.compare_products({ skus: skus || [] });
  res.json(result);
});

// 3. ACTION: Real-time inventory check
app.get("/api/inventory/:sku", async (req, res) => {
  const result = await toolExecutors.check_inventory({ sku: req.params.sku });
  res.json(result);
});

// ACTION: Cart operations
app.get("/api/cart", (req, res) => {
  const cart = getActiveCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  res.json({ success: true, cart, subtotal });
});

app.post("/api/cart/add", async (req, res) => {
  const { sku, quantity } = req.body;
  const result = await toolExecutors.add_to_cart({ sku, quantity: quantity || 1 });
  res.json(result);
});

// ACTION: Apply promotional voucher
app.post("/api/discounts/apply", async (req, res) => {
  const { couponCode } = req.body;
  const result = await toolExecutors.apply_discount({ couponCode });
  res.json(result);
});

// ACTION: Sandbox checkout
app.post("/api/checkout", async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  const result = await toolExecutors.initiate_checkout({ shippingAddress, paymentMethod });
  res.json(result);
});

// 4. AFTER: Order tracking & orders history
app.get("/api/orders", (req, res) => {
  res.json({
    success: true,
    phase: "AFTER",
    orders: getOrdersDatabase()
  });
});

app.get("/api/orders/track/:orderId", async (req, res) => {
  const result = await toolExecutors.track_order({ orderId: req.params.orderId });
  res.json(result);
});

// AFTER: Post-purchase support & return processing
app.post("/api/support/return", async (req, res) => {
  const { orderId, reason } = req.body;
  const result = await toolExecutors.process_return({ orderId, reason });
  res.json(result);
});

// AGORA RTC & CONVERSATIONAL AI TOKEN ENDPOINT
app.post("/api/agora/token", (req, res) => {
  const { channelName = "shopping-channel", uid = 0, role = "publisher" } = req.body;
  const tokenData = generateAgoraToken({ channelName, uid, role });
  res.json(tokenData);
});

// MURF AI FALCON TTS GENERATION ENDPOINT
app.post("/api/tts/murf", async (req, res) => {
  const { text, voiceId = "en-US-falcon", speed = 1.0, pitch = 0 } = req.body;
  const speechData = await generateMurfSpeech({ text, voiceId, speed, pitch });
  res.json(speechData);
});

// AGENT TOOLS SCHEMA ENDPOINT
app.get("/api/agent/tools", (req, res) => {
  res.json({ success: true, tools: AGENT_TOOLS });
});

// FULL AGENTIC WORKFLOW REASONING & EXECUTION ENDPOINT
app.post("/api/agent/chat", async (req, res) => {
  try {
    const { message, context } = req.body;
    const response = await processAgentWorkflow({ message, context });
    res.json(response);
  } catch (error) {
    console.error("[AgentEndpoint] Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = app;
