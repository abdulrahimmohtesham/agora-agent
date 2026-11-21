const http = require("http");
const { WebSocketServer } = require("ws");
const app = require("./app");

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws/audio" });

// WebSocket for real-time voice streaming audio metadata
wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ type: "CONNECTED", message: "Agora-Murf Voice Channel Connected" }));
  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === "PING") {
        ws.send(JSON.stringify({ type: "PONG", timestamp: Date.now() }));
      }
    } catch (e) {
      // ignore
    }
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🛍️  ShopAgora AI - Conversational Shopping Server running`);
  console.log(`📍 Port: http://localhost:${PORT}`);
  console.log(`🎙️  Agora RTC & Murf Falcon TTS Integration Ready`);
  console.log(`🤖 Agentic Workflow Tool Calling Active (5 Phases)`);
  console.log(`====================================================`);
});
