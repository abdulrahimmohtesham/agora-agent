const { customerProfile } = require("../data/customer");
const { catalog } = require("../data/catalog");
const { generateMurfSpeech } = require("./murfService");

// Mutable in-memory store for active session cart and orders
let activeCart = [];
let appliedDiscounts = [];
let ordersDatabase = [
  {
    orderId: "ORD-89421",
    date: "2024-03-15",
    items: [{ sku: "SNY-XM4-BLK", name: "Sony WH-1000XM4 Noise-Cancelling Headphones", price: 349.99, qty: 1 }],
    total: 349.99,
    status: "Delivered",
    trackingNumber: "TRK-FEDEX-9921448",
    deliveryAddress: customerProfile.defaultShippingAddress.street
  }
];

// Available Agentic Tools Schema
const AGENT_TOOLS = [
  {
    name: "retrieve_customer_context",
    description: "Phase: BEFORE. Retrieves customer profile, purchase history, loyalty tier, and available promotional offers.",
    parameters: { type: "object", properties: { customerId: { type: "string" } } }
  },
  {
    name: "search_catalog",
    description: "Phase: DURING (Discover). Searches products by query keyword, category, price limit, or tags.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string" },
        category: { type: "string" },
        maxPrice: { type: "number" }
      }
    }
  },
  {
    name: "compare_products",
    description: "Phase: DURING (Recommend). Generates a side-by-side comparison matrix for two or more product SKUs.",
    parameters: {
      type: "object",
      properties: {
        skus: { type: "array", items: { type: "string" } }
      },
      required: ["skus"]
    }
  },
  {
    name: "check_inventory",
    description: "Phase: ACTION. Real-time warehouse inventory and shipping ETA lookup for a product SKU.",
    parameters: {
      type: "object",
      properties: { sku: { type: "string" } },
      required: ["sku"]
    }
  },
  {
    name: "add_to_cart",
    description: "Phase: ACTION. Adds a product to the customer's active shopping cart.",
    parameters: {
      type: "object",
      properties: {
        sku: { type: "string" },
        quantity: { type: "number", default: 1 }
      },
      required: ["sku"]
    }
  },
  {
    name: "apply_discount",
    description: "Phase: ACTION. Validates and applies a promotional discount code to the cart.",
    parameters: {
      type: "object",
      properties: { couponCode: { type: "string" } },
      required: ["couponCode"]
    }
  },
  {
    name: "initiate_checkout",
    description: "Phase: ACTION. Executes sandbox checkout, charges saved payment method, and confirms order.",
    parameters: {
      type: "object",
      properties: {
        shippingAddress: { type: "string" },
        paymentMethod: { type: "string" }
      }
    }
  },
  {
    name: "track_order",
    description: "Phase: AFTER. Looks up order tracking status, carrier milestones, and delivery estimates.",
    parameters: {
      type: "object",
      properties: { orderId: { type: "string" } }
    }
  },
  {
    name: "process_return",
    description: "Phase: AFTER. Initiates return or exchange policy assistant for a past order.",
    parameters: {
      type: "object",
      properties: {
        orderId: { type: "string" },
        reason: { type: "string" }
      },
      required: ["orderId"]
    }
  }
];

// Smart Tokenized Catalog Search
function executeSmartCatalogSearch({ query = "", category = null, maxPrice = null }) {
  let results = [...catalog];
  
  if (category) {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (query && query.trim().length > 0) {
    // Clean stop words
    const stopWords = new Set(["find", "show", "get", "me", "the", "a", "an", "top", "best", "some", "good", "looking", "for", "recommend", "please"]);
    const tokens = query.toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .split(/\s+/)
      .filter(w => !stopWords.has(w) && w.length > 1);

    if (tokens.length > 0) {
      results = results.filter(p => {
        const textToSearch = `${p.name} ${p.brand} ${p.category} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
        // Match if any token is contained in product metadata
        return tokens.some(token => textToSearch.includes(token));
      });
    }
  }

  if (maxPrice) {
    results = results.filter(p => p.price <= maxPrice);
  }

  // If search yielded no specific matches, default to flagship audio items
  if (results.length === 0) {
    results = catalog.slice(0, 3);
  }

  return results;
}

// Tool Executors
const toolExecutors = {
  retrieve_customer_context: async () => {
    return {
      success: true,
      phase: "BEFORE",
      profile: {
        name: customerProfile.name,
        tier: customerProfile.tier,
        cashbackRate: customerProfile.cashbackRate,
        loyaltyPoints: 2450,
        preferences: customerProfile.preferences,
        previousPurchases: customerProfile.purchaseHistory,
        availableOffers: customerProfile.availableOffers
      }
    };
  },

  search_catalog: async ({ query, category, maxPrice }) => {
    const products = executeSmartCatalogSearch({ query, category, maxPrice });
    return {
      success: true,
      phase: "DURING_DISCOVER",
      query,
      count: products.length,
      products
    };
  },

  compare_products: async ({ skus }) => {
    let products = catalog.filter(p => 
      skus?.some(s => p.sku.toLowerCase().includes(s.toLowerCase()) || p.id.toLowerCase().includes(s.toLowerCase()))
    );

    if (products.length < 2) {
      // Default to comparing flagship Sony XM5 and Bose QC Ultra
      const defaultSkus = ["SNY-XM5-BLK", "BSE-QCU-SLV"];
      products = catalog.filter(p => defaultSkus.includes(p.sku));
    }

    return {
      success: true,
      phase: "DURING_RECOMMEND",
      comparison: {
        items: products,
        winnerForANC: "Sony WH-1000XM5 (Dual Processor V1 + 8 Mics)",
        winnerForBattery: "Sony WH-1000XM5 (30h vs 24h on Bose)",
        winnerForSpatialAudio: "Bose QuietComfort Ultra (Bose Immersive Sound)",
        recommendation: "Since customer Alex Morgan has owned the Sony XM4 for 2 years, the Sony XM5 provides identical sound signature familiarity, upgraded 30-hour battery, and saves $80 with voucher TECH20."
      }
    };
  },

  check_inventory: async ({ sku }) => {
    const product = catalog.find(p => p.sku.toLowerCase() === (sku || "").toLowerCase() || p.id.toLowerCase() === (sku || "").toLowerCase()) || catalog[0];
    return {
      success: true,
      phase: "ACTION",
      sku: product.sku,
      productName: product.name,
      inStock: product.inventory.inStock,
      stockCount: product.inventory.stockCount,
      warehouse: product.inventory.warehouse,
      estimatedDeliveryDays: product.inventory.estimatedDeliveryDays,
      estimatedDeliveryDate: "Tomorrow by 2:00 PM (San Francisco Priority Express)"
    };
  },

  add_to_cart: async ({ sku, quantity = 1 }) => {
    const product = catalog.find(p => p.sku.toLowerCase() === (sku || "").toLowerCase() || p.id.toLowerCase() === (sku || "").toLowerCase()) || catalog[0];
    const existingIndex = activeCart.findIndex(item => item.sku === product.sku);
    if (existingIndex > -1) {
      activeCart[existingIndex].quantity += quantity;
    } else {
      activeCart.push({
        sku: product.sku,
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }

    const subtotal = activeCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return {
      success: true,
      phase: "ACTION",
      message: `Added ${product.name} to cart.`,
      addedItem: product,
      cart: activeCart,
      subtotal: parseFloat(subtotal.toFixed(2))
    };
  },

  apply_discount: async ({ couponCode }) => {
    const code = (couponCode || "TECH20").toUpperCase().trim();
    const offer = customerProfile.availableOffers.find(o => o.code === code) || customerProfile.availableOffers[0];

    if (!appliedDiscounts.some(d => d.code === offer.code)) {
      appliedDiscounts.push(offer);
    }

    const subtotal = activeCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let totalDiscount = 0;
    for (const d of appliedDiscounts) {
      if (d.discountType === "percentage") {
        totalDiscount += subtotal * (d.discountValue / 100);
      }
    }
    const finalTotal = Math.max(0, subtotal - totalDiscount);

    return {
      success: true,
      phase: "ACTION",
      appliedOffer: offer,
      allDiscounts: appliedDiscounts,
      subtotal: parseFloat(subtotal.toFixed(2)),
      discountAmount: parseFloat(totalDiscount.toFixed(2)),
      finalTotal: parseFloat(finalTotal.toFixed(2)),
      message: `Applied loyalty reward ${offer.code}: ${offer.discountValue}% OFF saved $${totalDiscount.toFixed(2)}!`
    };
  },

  initiate_checkout: async ({ shippingAddress, paymentMethod }) => {
    if (activeCart.length === 0) {
      // Auto-add Sony XM5 for demonstration if cart is empty
      const defaultProd = catalog[0];
      activeCart.push({
        sku: defaultProd.sku,
        id: defaultProd.id,
        name: defaultProd.name,
        brand: defaultProd.brand,
        price: defaultProd.price,
        image: defaultProd.image,
        quantity: 1
      });
      appliedDiscounts = [customerProfile.availableOffers[0]];
    }

    const subtotal = activeCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = appliedDiscounts.reduce((acc, d) => acc + (d.discountType === "percentage" ? (subtotal * d.discountValue / 100) : 0), 0);
    const finalTotal = parseFloat(Math.max(0, subtotal - discountAmount).toFixed(2));
    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = "TRK-EXP-" + Math.floor(10000000 + Math.random() * 90000000);

    const newOrder = {
      orderId,
      date: new Date().toISOString().split("T")[0],
      items: [...activeCart],
      subtotal,
      discountAmount,
      total: finalTotal,
      discounts: [...appliedDiscounts],
      status: "Confirmed - Preparing Priority Dispatch",
      trackingNumber,
      estimatedDelivery: "Tomorrow by 2:00 PM (San Francisco Priority Hub)",
      courier: "FedEx Express (Van #42)",
      shippingAddress: shippingAddress || customerProfile.defaultShippingAddress.street + ", " + customerProfile.defaultShippingAddress.city,
      paymentMethod: paymentMethod || "Visa ending in 4242 (1-Click VIP Authorization)"
    };

    ordersDatabase.unshift(newOrder);
    const checkoutSummary = { ...newOrder };
    activeCart = [];
    appliedDiscounts = [];

    return {
      success: true,
      phase: "ACTION_CONFIRMED",
      order: checkoutSummary,
      message: `Order #${orderId} confirmed! Total charged: $${finalTotal}. Priority delivery scheduled for tomorrow.`
    };
  },

  track_order: async ({ orderId }) => {
    const order = ordersDatabase.find(o => !orderId || o.orderId.toLowerCase() === orderId.toLowerCase()) || ordersDatabase[0];
    return {
      success: true,
      phase: "AFTER_TRACK",
      orderId: order.orderId,
      status: order.status || "In Transit",
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery || "Tomorrow by 2:00 PM",
      courier: "FedEx Priority Van #42 (Driver: Michael R.)",
      location: "San Francisco Fulfillment Center -> Out for Delivery",
      timeline: [
        { title: "Order Verified & Payment Authorized", time: "10:32 AM", done: true },
        { title: "Allocated at SF Fulfillment Center (West-01)", time: "10:35 AM", done: true },
        { title: "Picked, Packed & Sonic Inspected", time: "11:15 AM", done: true },
        { title: "Loaded onto Priority Courier Van #42", time: "Current Milestone", current: true },
        { title: "Delivery to 742 Evergreen Terrace", time: "Tomorrow 2:00 PM", done: false }
      ]
    };
  },

  process_return: async ({ orderId, reason }) => {
    return {
      success: true,
      phase: "AFTER_SUPPORT",
      orderId: orderId || "ORD-89421",
      item: "Sony WH-1000XM4 Noise-Cancelling Headphones",
      returnStatus: "Pre-Approved (Platinum VIP 30-Day Guarantee)",
      rmaNumber: "RMA-SF-" + Math.floor(10000 + Math.random() * 90000),
      prepaidLabelUrl: "https://shopagora.ai/labels/return-label.pdf",
      qrCode: "RMA-QR-9821-EXCHANGE",
      refundAmount: 349.99,
      instructions: "No box needed! Simply show the QR code at any FedEx or Walgreens location. Instant refund will credit to your Visa card within 2 hours of drop-off."
    };
  }
};

// Orchestrate Conversational Agentic Workflow
async function processAgentWorkflow({ message, context = {} }) {
  const userText = (message || "").toLowerCase().trim();
  const toolExecutions = [];
  let speechText = "";
  let uiAction = null;
  let highlightedProducts = [];
  let comparisonData = null;
  let orderData = null;

  // STEP 1: BEFORE PHASE - Always retrieve customer context if not already established
  const customerContext = await toolExecutors.retrieve_customer_context();
  toolExecutions.push({
    tool: "retrieve_customer_context",
    phase: "BEFORE",
    output: { customer: customerProfile.name, tier: customerProfile.tier, offers: customerProfile.availableOffers.map(o => o.code) }
  });

  // STEP 2: INTENT DETECTION & AGENTIC DISPATCH
  if (userText.includes("compare") || (userText.includes("bose") && userText.includes("sony")) || userText.includes("difference") || userText.includes("vs")) {
    // Stage: DURING - Compare & Recommend
    const compResult = await toolExecutors.compare_products({ skus: ["SNY-XM5-BLK", "BSE-QCU-SLV"] });
    toolExecutions.push({
      tool: "compare_products",
      phase: "DURING_RECOMMEND",
      output: compResult
    });

    comparisonData = compResult.comparison;
    speechText = `I have placed the Sony WH-1000XM5 and Bose QuietComfort Ultra side-by-side for you. The Sony XM5 leads in battery life at 30 hours and features dual Integrated V1 processors for superior ambient noise rejection. Because you've enjoyed your Sony XM4 for over two years, the XM5 is your most seamless upgrade, and your VIP code TECH20 drops the price down to $319.99!`;
    uiAction = "SHOW_COMPARISON";
    highlightedProducts = compResult.comparison.items;
  } else if (userText.includes("inventory") || userText.includes("available") || userText.includes("stock") || userText.includes("warehouse") || userText.includes("how many")) {
    // Stage: ACTION - Check Inventory
    const invResult = await toolExecutors.check_inventory({ sku: "SNY-XM5-BLK" });
    toolExecutions.push({
      tool: "check_inventory",
      phase: "ACTION",
      output: invResult
    });

    speechText = `Good news! We have 14 units of the Sony WH-1000XM5 in stock right at our San Francisco Fulfillment Center. As a Platinum member, you qualify for free overnight courier dispatch, arriving tomorrow by 2:00 PM.`;
    uiAction = "SHOW_INVENTORY";
    highlightedProducts = [catalog[0]];
  } else if (userText.includes("add") || userText.includes("buy sony") || userText.includes("put in cart") || userText.includes("get the xm5") || userText.includes("cart")) {
    // Stage: ACTION - Add to cart + Check Inventory + Apply Discount
    const invResult = await toolExecutors.check_inventory({ sku: "SNY-XM5-BLK" });
    toolExecutions.push({ tool: "check_inventory", phase: "ACTION", output: invResult });

    const cartResult = await toolExecutors.add_to_cart({ sku: "SNY-XM5-BLK", quantity: 1 });
    toolExecutions.push({ tool: "add_to_cart", phase: "ACTION", output: cartResult });

    const discountResult = await toolExecutors.apply_discount({ couponCode: "TECH20" });
    toolExecutions.push({ tool: "apply_discount", phase: "ACTION", output: discountResult });

    speechText = `I've added the Sony WH-1000XM5 to your cart and applied your Platinum reward TECH20, saving you $80. Your updated total is $319.99 with free priority shipping. Shall I initiate checkout with your saved Visa card?`;
    uiAction = "SHOW_CART";
    highlightedProducts = [catalog[0]];
  } else if (userText.includes("discount") || userText.includes("coupon") || userText.includes("promo") || userText.includes("code") || userText.includes("tech20")) {
    // Stage: ACTION - Apply Discount
    const discountResult = await toolExecutors.apply_discount({ couponCode: "TECH20" });
    toolExecutions.push({ tool: "apply_discount", phase: "ACTION", output: discountResult });

    speechText = `Your exclusive VIP voucher TECH20 is successfully applied! You saved $80 on flagship audio, bringing your cart balance to $319.99 with complimentary priority delivery.`;
    uiAction = "SHOW_CART";
  } else if (userText.includes("checkout") || userText.includes("order it") || userText.includes("place order") || userText.includes("confirm purchase") || userText.includes("buy now") || userText.includes("visa")) {
    // Stage: ACTION - Initiate Checkout
    const checkoutResult = await toolExecutors.initiate_checkout({
      shippingAddress: customerProfile.defaultShippingAddress.street,
      paymentMethod: "Visa ending in 4242"
    });
    toolExecutions.push({ tool: "initiate_checkout", phase: "ACTION_CONFIRMED", output: checkoutResult });

    orderData = checkoutResult.order;
    speechText = `Success! Order ${checkoutResult.order.orderId} is confirmed for $${checkoutResult.order.total}. Your Sony XM5 has been allocated and is scheduled for priority courier delivery tomorrow by 2:00 PM. A digital receipt has been sent to your email.`;
    uiAction = "SHOW_CONFIRMATION";
  } else if (userText.includes("track") || userText.includes("where is my order") || userText.includes("delivery") || userText.includes("status") || userText.includes("courier")) {
    // Stage: AFTER - Track Delivery
    const trackResult = await toolExecutors.track_order({});
    toolExecutions.push({ tool: "track_order", phase: "AFTER_TRACK", output: trackResult });

    orderData = trackResult;
    speechText = `Your package is on route! Priority Courier Van #42 has dispatched from the San Francisco hub and is estimated to arrive at your doorstep tomorrow at 2:00 PM.`;
    uiAction = "SHOW_TRACKING";
  } else if (userText.includes("return") || userText.includes("refund") || userText.includes("exchange") || userText.includes("support") || userText.includes("rma")) {
    // Stage: AFTER - Return & Support
    const returnResult = await toolExecutors.process_return({ orderId: "ORD-89421", reason: "Upgrade to XM5" });
    toolExecutions.push({ tool: "process_return", phase: "AFTER_SUPPORT", output: returnResult });

    speechText = `As a Platinum VIP member, your return is pre-approved! I have generated prepaid RMA return code ${returnResult.rmaNumber}. Simply show the QR code at any FedEx location—no box or printing required—and your full $349 refund will credit within 2 hours of drop-off.`;
    uiAction = "SHOW_SUPPORT";
  } else {
    // Stage: DURING - Discover / Search
    const searchResult = await toolExecutors.search_catalog({ query: message });
    toolExecutions.push({ tool: "search_catalog", phase: "DURING_DISCOVER", output: searchResult });

    highlightedProducts = searchResult.products;
    speechText = `Welcome Alex! Based on your preference for flagship audio and your past Sony XM4, our top recommendation is the new Sony WH-1000XM5. With your exclusive TECH20 voucher, you can get it for $319.99. Would you like to compare it with Bose or check warehouse stock?`;
    uiAction = "SHOW_DISCOVERY";
  }

  // STEP 3: Murf AI Falcon TTS Voice Synthesis
  const murfVoice = await generateMurfSpeech({
    text: speechText,
    voiceId: "en-US-falcon"
  });

  return {
    success: true,
    speechText,
    murfVoice,
    toolExecutions,
    uiAction,
    highlightedProducts,
    comparisonData,
    orderData,
    cart: activeCart,
    appliedDiscounts
  };
}

module.exports = {
  AGENT_TOOLS,
  toolExecutors,
  processAgentWorkflow,
  getActiveCart: () => activeCart,
  getOrdersDatabase: () => ordersDatabase
};
