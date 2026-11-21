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

// Available Agentic Tools
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
        preferences: customerProfile.preferences,
        previousPurchases: customerProfile.purchaseHistory,
        availableOffers: customerProfile.availableOffers
      }
    };
  },

  search_catalog: async ({ query, category, maxPrice }) => {
    let results = catalog;
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
      results = results.filter(p => p.price <= maxPrice);
    }
    return {
      success: true,
      phase: "DURING_DISCOVER",
      query,
      count: results.length,
      products: results
    };
  },

  compare_products: async ({ skus }) => {
    const products = catalog.filter(p => skus.map(s => s.toLowerCase()).includes(p.sku.toLowerCase()) || skus.map(s => s.toLowerCase()).includes(p.id.toLowerCase()));
    if (products.length < 2) {
      // Default to comparing Sony XM5 and Bose QC Ultra if not enough matched
      const defaultSkus = ["SNY-XM5-BLK", "BSE-QCU-SLV"];
      const defaultProducts = catalog.filter(p => defaultSkus.includes(p.sku));
      return {
        success: true,
        phase: "DURING_RECOMMEND",
        comparison: {
          items: defaultProducts,
          winnerForANC: "Sony WH-1000XM5 (Dual Processor V1 + QN1)",
          winnerForBattery: "Sony WH-1000XM5 (30h vs 24h)",
          winnerForSpatialSound: "Bose QuietComfort Ultra (Bose Immersive Audio)",
          recommendation: "Since customer previously owned Sony XM4, Sony XM5 offers seamless upgrade familiarity, upgraded 8-mic ANC, and $80 savings with code TECH20."
        }
      };
    }
    return {
      success: true,
      phase: "DURING_RECOMMEND",
      comparison: {
        items: products,
        winnerForANC: "Sony WH-1000XM5",
        recommendation: "Sony WH-1000XM5 leads in active noise cancellation, lightweight comfort, and battery life."
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
      estimatedDeliveryDays: product.inventory.estimatedDeliveryDays
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
    const code = (couponCode || "").toUpperCase().trim();
    const offer = customerProfile.availableOffers.find(o => o.code === code);
    if (!offer) {
      return {
        success: false,
        phase: "ACTION",
        message: `Coupon code '${code}' is invalid or expired.`
      };
    }

    if (!appliedDiscounts.some(d => d.code === code)) {
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
      message: `Successfully applied voucher ${code} (${offer.discountValue}% OFF)!`
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
      status: "Confirmed - Preparing Dispatch",
      trackingNumber,
      estimatedDelivery: "Tomorrow by 2:00 PM (Expedited Priority)",
      shippingAddress: shippingAddress || customerProfile.defaultShippingAddress.street + ", " + customerProfile.defaultShippingAddress.city,
      paymentMethod: paymentMethod || "Visa ending in 4242 (1-Click VIP Authorization)"
    };

    ordersDatabase.unshift(newOrder);
    const checkoutSummary = { ...newOrder };
    // Clear active cart upon successful checkout
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
      status: order.status,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery || "Tomorrow by 2:00 PM",
      timeline: [
        { title: "Order Confirmed & Payment Verified", time: "10:32 AM", done: true },
        { title: "Allocated at San Francisco Fulfillment Hub", time: "10:35 AM", done: true },
        { title: "Picked & Quality-Inspected", time: "11:00 AM", done: true },
        { title: "In Transit with Courier (Priority Van #42)", time: "Estimated 1:15 PM", current: true },
        { title: "Delivered to Front Door", time: "Estimated 2:00 PM", done: false }
      ]
    };
  },

  process_return: async ({ orderId, reason }) => {
    return {
      success: true,
      phase: "AFTER_SUPPORT",
      orderId: orderId || "ORD-89421",
      returnStatus: "Approved (Instant Platinum Return)",
      rmaNumber: "RMA-RET-" + Math.floor(10000 + Math.random() * 90000),
      prepaidLabelUrl: "https://shopagora.ai/labels/return-label.pdf",
      instructions: "Pack item in original packaging. Hand to FedEx driver or drop at any drop box with prepaid QR code. 100% refund credited within 24 hours of scan."
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
  if (userText.includes("hello") || userText.includes("hi") || userText.includes("start") || userText.includes("hey")) {
    speechText = `Hello Alex! Welcome back to Agora Concierge. I see you've been enjoying your Sony WH-1000XM4 headphones. We have exclusive Platinum discounts today, including 20% off the new XM5 with code TECH20. What can I find for you?`;
    uiAction = "SHOW_WELCOME";
    highlightedProducts = [catalog[0], catalog[1]];
  } else if (userText.includes("compare") || (userText.includes("bose") && userText.includes("sony")) || userText.includes("difference")) {
    // Stage: DURING - Compare & Recommend
    const compResult = await toolExecutors.compare_products({ skus: ["SNY-XM5-BLK", "BSE-QCU-SLV"] });
    toolExecutions.push({
      tool: "compare_products",
      phase: "DURING_RECOMMEND",
      output: compResult
    });

    comparisonData = compResult.comparison;
    speechText = `I compared the Sony WH-1000XM5 and Bose QuietComfort Ultra for you. The Sony XM5 leads in battery life at 30 hours and features dual processor noise cancellation, while the Bose has incredible immersive spatial audio. Because you already love Sony's sound profile, the XM5 is your ideal upgrade, and with code TECH20 it drops to $319.99!`;
    uiAction = "SHOW_COMPARISON";
    highlightedProducts = compResult.comparison.items;
  } else if (userText.includes("inventory") || userText.includes("available") || userText.includes("stock") || userText.includes("how many")) {
    // Stage: ACTION - Check Inventory
    const invResult = await toolExecutors.check_inventory({ sku: "SNY-XM5-BLK" });
    toolExecutions.push({
      tool: "check_inventory",
      phase: "ACTION",
      output: invResult
    });

    speechText = `Good news! We have ${invResult.stockCount} units of the Sony WH-1000XM5 in stock right at the San Francisco Fulfillment Center, ready for guaranteed next-day delivery.`;
    uiAction = "SHOW_INVENTORY";
    highlightedProducts = [catalog[0]];
  } else if (userText.includes("add to cart") || userText.includes("buy sony") || userText.includes("put in cart") || userText.includes("get the xm5")) {
    // Stage: ACTION - Add to cart + Check Inventory
    const invResult = await toolExecutors.check_inventory({ sku: "SNY-XM5-BLK" });
    toolExecutions.push({ tool: "check_inventory", phase: "ACTION", output: invResult });

    const cartResult = await toolExecutors.add_to_cart({ sku: "SNY-XM5-BLK", quantity: 1 });
    toolExecutions.push({ tool: "add_to_cart", phase: "ACTION", output: cartResult });

    // Automatically apply customer's TECH20 VIP discount
    const discountResult = await toolExecutors.apply_discount({ couponCode: "TECH20" });
    toolExecutions.push({ tool: "apply_discount", phase: "ACTION", output: discountResult });

    speechText = `I added the Sony WH-1000XM5 to your cart and automatically applied your Platinum TECH20 coupon, saving you $80. Your updated total is $319.99. Would you like me to initiate checkout?`;
    uiAction = "SHOW_CART";
    highlightedProducts = [catalog[0]];
  } else if (userText.includes("discount") || userText.includes("coupon") || userText.includes("promo") || userText.includes("code")) {
    // Stage: ACTION - Apply Discount
    const discountResult = await toolExecutors.apply_discount({ couponCode: "TECH20" });
    toolExecutions.push({ tool: "apply_discount", phase: "ACTION", output: discountResult });

    speechText = `I applied your VIP coupon TECH20! You saved $80 on flagship audio, bringing your cart balance to $319.99 with free expedited shipping.`;
    uiAction = "SHOW_CART";
  } else if (userText.includes("checkout") || userText.includes("order it") || userText.includes("place order") || userText.includes("confirm purchase") || userText.includes("buy now")) {
    // Stage: ACTION - Initiate Checkout
    const checkoutResult = await toolExecutors.initiate_checkout({
      shippingAddress: customerProfile.defaultShippingAddress.street,
      paymentMethod: "Visa ending in 4242"
    });
    toolExecutions.push({ tool: "initiate_checkout", phase: "ACTION_CONFIRMED", output: checkoutResult });

    orderData = checkoutResult.order;
    speechText = `Success! Order ${checkoutResult.order.orderId} is confirmed for $${checkoutResult.order.total}. Your Sony XM5 is scheduled for priority delivery tomorrow by 2:00 PM. I've sent the invoice to your email!`;
    uiAction = "SHOW_CONFIRMATION";
  } else if (userText.includes("track") || userText.includes("where is my order") || userText.includes("delivery") || userText.includes("status")) {
    // Stage: AFTER - Track Delivery
    const trackResult = await toolExecutors.track_order({});
    toolExecutions.push({ tool: "track_order", phase: "AFTER_TRACK", output: trackResult });

    orderData = trackResult;
    speechText = `Your order ${trackResult.orderId} is in transit! The courier priority van is currently on route in San Francisco and expected to arrive tomorrow at 2:00 PM.`;
    uiAction = "SHOW_TRACKING";
  } else if (userText.includes("return") || userText.includes("refund") || userText.includes("exchange") || userText.includes("support")) {
    // Stage: AFTER - Return & Support
    const returnResult = await toolExecutors.process_return({ orderId: "ORD-89421", reason: "Upgrade to XM5" });
    toolExecutions.push({ tool: "process_return", phase: "AFTER_SUPPORT", output: returnResult });

    speechText = `As a Platinum VIP member, your return is pre-approved! I've generated prepaid RMA return label ${returnResult.rmaNumber}. Just attach it to the box and drop it at any FedEx drop box.`;
    uiAction = "SHOW_SUPPORT";
  } else {
    // Stage: DURING - Discover / Search
    const searchResult = await toolExecutors.search_catalog({ query: message });
    toolExecutions.push({ tool: "search_catalog", phase: "DURING_DISCOVER", output: searchResult });

    if (searchResult.count > 0) {
      highlightedProducts = searchResult.products.slice(0, 3);
      speechText = `I found ${searchResult.count} products matching your request, including the top-rated ${searchResult.products[0].name}. Would you like to check inventory or compare options?`;
    } else {
      highlightedProducts = catalog.slice(0, 3);
      speechText = `Here are our trending flagship items in audio and wearables. Would you like to check out the Sony WH-1000XM5 or compare with Bose?`;
    }
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
