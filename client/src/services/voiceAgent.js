class VoiceAgentService {
  constructor() {
    this.audioContext = null;
    this.currentAudio = null;
    this.analyser = null;
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.onSpeechResultCallback = null;
    this.onStateChangeCallback = null;
    this.onVisualizerDataCallback = null;

    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = "en-US";

      this.recognition.onstart = () => {
        this.isListening = true;
        this.notifyState("listening");
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("[VoiceAgent] Heard transcript:", transcript);
        if (this.onSpeechResultCallback) {
          this.onSpeechResultCallback(transcript);
        }
      };

      this.recognition.onerror = (event) => {
        console.warn("[VoiceAgent] Speech recognition notice:", event.error);
        this.isListening = false;
        this.notifyState("idle");
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (!this.isSpeaking) {
          this.notifyState("idle");
        }
      };
    } else {
      console.warn("[VoiceAgent] Web Speech API not supported in this browser environment.");
    }
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
      } catch (e) {
        console.warn("[VoiceAgent] Recognition start error:", e);
      }
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.notifyState("idle");
    }
  }

  notifyState(state, meta = {}) {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({ state, isListening: this.isListening, isSpeaking: this.isSpeaking, ...meta });
    }
  }

  // Speak agent response using Murf Falcon audio URL or high-fidelity fallback synthesis
  async speak({ text, murfVoice = null }) {
    this.stopSpeaking();
    this.isSpeaking = true;
    this.notifyState("speaking", { text });

    // If Murf returned a live audio stream URL, play it directly
    if (murfVoice && murfVoice.audioUrl) {
      try {
        this.currentAudio = new Audio(murfVoice.audioUrl);
        this.currentAudio.crossOrigin = "anonymous";

        this.currentAudio.onended = () => {
          this.isSpeaking = false;
          this.notifyState("idle");
        };

        this.currentAudio.onerror = (e) => {
          console.warn("[VoiceAgent] Murf audio playback failed, falling back to local speech synthesis:", e);
          this.fallbackSpeechSynthesis(text);
        };

        await this.currentAudio.play();
        return;
      } catch (err) {
        console.warn("[VoiceAgent] Audio URL play exception:", err);
      }
    }

    // High quality local fallback with Falcon cadence
    this.fallbackSpeechSynthesis(text);
  }

  fallbackSpeechSynthesis(text) {
    if (!window.speechSynthesis) {
      this.isSpeaking = false;
      this.notifyState("idle");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick best available English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes("Natural") || 
      v.name.includes("Google") || 
      v.name.includes("Samantha") || 
      v.name.includes("Daniel") || 
      (v.lang === "en-US" && !v.name.includes("Bad"))
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => {
      this.isSpeaking = false;
      this.notifyState("idle");
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.notifyState("idle");
    };

    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.notifyState("idle");
  }
}

export const voiceAgent = new VoiceAgentService();
