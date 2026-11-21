import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AgentWorkflowTracker from './components/AgentWorkflowTracker';
import VoiceAssistantOrb from './components/VoiceAssistantOrb';
import ProductCatalog from './components/ProductCatalog';
import ProductComparisonModal from './components/ProductComparisonModal';
import CartDrawer from './components/CartDrawer';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import CustomerProfileModal from './components/CustomerProfileModal';
import SettingsModal from './components/SettingsModal';
import { agoraManager } from './services/agoraClient';
import { voiceAgent } from './services/voiceAgent';

export default function App() {
  // State variables
  const [customer, setCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [highlightedProductIds, setHighlightedProductIds] = useState([]);
  const [cart, setCart] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [currentPhase, setCurrentPhase] = useState("BEFORE");
  const [toolLogs, setToolLogs] = useState([]);
  
  // Voice & Agora State
  const [voiceState, setVoiceState] = useState("idle"); // idle | listening | speaking
  const [transcript, setTranscript] = useState("");
  const [lastAgentSpeech, setLastAgentSpeech] = useState("");
  const [agoraStatus, setAgoraStatus] = useState({ isConnected: false, isDemo: true });
  const [isMicActive, setIsMicActive] = useState(false);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  // Initial Load: Fetch Profile (Phase: BEFORE) & Catalog (Phase: DURING)
  useEffect(() => {
    async function initData() {
      try {
        // Fetch Customer Profile & Past Orders (BEFORE)
        const profileRes = await fetch("/api/profile");
        const profileData = await profileRes.json();
        if (profileData.success) {
          setCustomer(profileData.data);
          // Record Phase BEFORE context retrieval in tool logs
          setToolLogs([{
            tool: "retrieve_customer_context",
            phase: "BEFORE",
            output: {
              customer: profileData.data.name,
              tier: profileData.data.tier,
              pastPurchases: profileData.data.purchaseHistory.map(p => p.productName),
              offers: profileData.data.availableOffers.map(o => o.code)
            }
          }]);
        }

        // Fetch Catalog
        const catalogRes = await fetch("/api/catalog");
        const catalogData = await catalogRes.json();
        if (catalogData.success) {
          setProducts(catalogData.data);
        }

        // Fetch Cart
        const cartRes = await fetch("/api/cart");
        const cartData = await cartRes.json();
        if (cartData.success) {
          setCart(cartData.cart);
        }

        // Connect to Agora RTC Channel
        connectAgoraChannel();
      } catch (err) {
        console.warn("[App] Initial fetch notice:", err);
      }
    }

    initData();

    // Voice Agent Listeners
    voiceAgent.onStateChangeCallback = ({ state, text }) => {
      setVoiceState(state);
      if (text) setLastAgentSpeech(text);
    };

    voiceAgent.onSpeechResultCallback = (text) => {
      setTranscript(text);
      handleSendMessage(text);
    };

    agoraManager.onStatusChange((statusObj) => {
      setAgoraStatus(statusObj);
    });

    return () => {
      agoraManager.leaveChannel();
      voiceAgent.stopSpeaking();
    };
  }, []);

  // Connect to Agora Channel
  const connectAgoraChannel = async () => {
    try {
      const tokenRes = await fetch("/api/agora/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelName: "shopping-concierge-channel", uid: 0, role: "publisher" })
      });
      const tokenData = await tokenRes.json();
      await agoraManager.joinChannel({
        appId: tokenData.appId,
        channelName: tokenData.channelName,
        token: tokenData.token,
        uid: tokenData.uid
      });
    } catch (e) {
      console.warn("[App] Agora joinChannel exception:", e);
    }
  };

  // Toggle Microphone
  const handleToggleMic = () => {
    if (isMicActive) {
      voiceAgent.stopListening();
      setIsMicActive(false);
    } else {
      voiceAgent.startListening();
      setIsMicActive(true);
    }
  };

  // Dispatch message through Agentic Workflow Engine
  const handleSendMessage = async (text) => {
    try {
      setVoiceState("speaking"); // indicate processing/speaking
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();

      if (data.success) {
        setLastAgentSpeech(data.speechText);

        // Update Tool Logs with new tool calls
        if (data.toolExecutions && data.toolExecutions.length > 0) {
          setToolLogs(prev => [...data.toolExecutions, ...prev]);
          // Update workflow stage from latest tool
          const latestTool = data.toolExecutions[data.toolExecutions.length - 1];
          if (latestTool?.phase) {
            setCurrentPhase(latestTool.phase);
          }
        }

        // Highlight products
        if (data.highlightedProducts && data.highlightedProducts.length > 0) {
          setHighlightedProductIds(data.highlightedProducts.map(p => p.id || p.sku));
        }

        // Comparison modal action
        if (data.uiAction === "SHOW_COMPARISON" && data.comparisonData) {
          setComparisonData(data.comparisonData);
        }

        // Cart action
        if (data.cart) {
          setCart(data.cart);
        }
        if (data.appliedDiscounts) {
          setDiscounts(data.appliedDiscounts);
        }
        if (data.uiAction === "SHOW_CART") {
          setIsCartOpen(true);
        }

        // Order Confirmation action
        if (data.uiAction === "SHOW_CONFIRMATION" && data.orderData) {
          setOrderConfirmation(data.orderData);
          setCart([]);
          setDiscounts([]);
          setIsCartOpen(false);
        }

        // Play voice response through Murf AI Falcon TTS
        await voiceAgent.speak({
          text: data.speechText,
          murfVoice: data.murfVoice
        });
      }
    } catch (err) {
      console.error("[App] Error in handleSendMessage:", err);
      setVoiceState("idle");
    }
  };

  // Direct UI Add to Cart
  const handleAddToCart = async (sku) => {
    handleSendMessage(`Add ${sku} to cart`);
  };

  // Direct UI Compare
  const handleCompare = async (sku) => {
    handleSendMessage(`Compare ${sku} with Bose QuietComfort Ultra`);
  };

  // Direct UI Apply Discount
  const handleApplyDiscount = async (code) => {
    handleSendMessage(`Apply promo code ${code}`);
  };

  // Direct UI Checkout
  const handleCheckout = async () => {
    handleSendMessage("Proceed to checkout and place order");
  };

  // Direct UI Order Tracking
  const handleTrackDelivery = async (orderId) => {
    handleSendMessage(`Track order ${orderId}`);
  };

  // Direct UI Return Support
  const handleInitiateReturn = async (orderId) => {
    handleSendMessage(`How do I return my previous order ${orderId}?`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
      
      {/* 1. Header */}
      <Header
        agoraStatus={agoraStatus}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        customer={customer}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 2. PS41 Agentic Workflow Stage Tracker & Tool Log Inspector */}
        <AgentWorkflowTracker
          currentPhase={currentPhase}
          toolLogs={toolLogs}
        />

        {/* 3. Central Voice Assistant Orb (Agora RTC + Murf Falcon TTS) */}
        <VoiceAssistantOrb
          voiceState={voiceState}
          onSendMessage={handleSendMessage}
          transcript={transcript}
          lastAgentSpeech={lastAgentSpeech}
          onToggleMic={handleToggleMic}
          isMicActive={isMicActive}
        />

        {/* 4. Dynamic Product Discovery Grid */}
        <ProductCatalog
          products={products}
          highlightedIds={highlightedProductIds}
          onAddToCart={handleAddToCart}
          onCompare={handleCompare}
          onAskAI={handleSendMessage}
        />

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-400">ShopAgora AI • PS41</span>
            <span>•</span>
            <span>Agora Conversational AI RTC</span>
            <span>•</span>
            <span>Murf AI Falcon Low-Latency TTS</span>
          </div>
          <div>
            Built with React, Express, Agora RTC Web SDK NG, & Agentic Tool Calling
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        discounts={discounts}
        onApplyDiscount={handleApplyDiscount}
        onCheckout={handleCheckout}
        customer={customer}
      />

      <ProductComparisonModal
        comparison={comparisonData}
        onClose={() => setComparisonData(null)}
        onAddToCart={handleAddToCart}
      />

      <OrderConfirmationModal
        order={orderConfirmation}
        onClose={() => setOrderConfirmation(null)}
        onTrackDelivery={handleTrackDelivery}
        onInitiateReturn={handleInitiateReturn}
      />

      <CustomerProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        customer={customer}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(cfg) => {
          console.log("[Settings] Updated configuration:", cfg);
          connectAgoraChannel();
        }}
      />

    </div>
  );
}
