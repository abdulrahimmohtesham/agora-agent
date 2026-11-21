// Murf AI Falcon TTS Integration
// Provides low-latency speech synthesis for real-time conversational shopping

async function generateMurfSpeech({ text, voiceId = "en-US-falcon", speed = 1.0, pitch = 0 }) {
  const apiKey = process.env.MURF_API_KEY;

  if (!apiKey || apiKey === "demo" || apiKey.includes("your-")) {
    // Return graceful demo payload indicating client should use browser speech synthesis with Falcon voice profile
    return {
      success: true,
      provider: "murf-falcon-simulation",
      text,
      voiceId: voiceId || "en-US-falcon",
      isDemo: true,
      audioUrl: null,
      message: "Murf Falcon API key not configured. Using client-side neural speech synthesis tuned for Falcon TTS response cadence."
    };
  }

  try {
    const response = await fetch("https://api.murf.ai/v1/speech/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
        "Accept": "application/json"
      },
      body: JSON.stringify({
        voiceId: voiceId || "en-US-falcon",
        text,
        format: "MP3",
        channelType: "MONO",
        sampleRate: 24000,
        speed,
        pitch
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("[MurfService] Murf Falcon API returned error status:", response.status, errorText);
      return {
        success: false,
        provider: "murf-falcon",
        error: `Murf API responded with ${response.status}`,
        fallbackToClientSynthesis: true,
        text
      };
    }

    const data = await response.json();
    return {
      success: true,
      provider: "murf-falcon",
      audioUrl: data.audioFile || data.url || null,
      audioLengthInSeconds: data.audioLengthInSeconds || 0,
      consumedCharacters: data.consumedCharacters || text.length,
      isDemo: false
    };
  } catch (err) {
    console.error("[MurfService] Exception in Murf Falcon TTS generation:", err);
    return {
      success: false,
      provider: "murf-falcon",
      error: err.message,
      fallbackToClientSynthesis: true,
      text
    };
  }
}

module.exports = { generateMurfSpeech };
