class VoiceAgentService {
  constructor() {
    this.audioContext = null;
    this.currentAudio = null;
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.selectedVoiceProfile = "falcon-studio";
    this.onSpeechResultCallback = null;
    this.onStateChangeCallback = null;
    this.onVisualizerDataCallback = null;
    this.speechRate = 1.0;
    this.speechPitch = 1.0;

    this.initAudioContext();
    this.initSpeechRecognition();
  }

  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    } catch (e) {
      // ignore
    }
  }

  // Play gentle, luxury two-tone audio chime when assistant starts speaking
  playAssistantChime() {
    if (!this.audioContext) return;
    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.12); // A5

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      // Audio autoplay restriction may catch this before user interaction
    }
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

  // Speak agent response using Murf Falcon audio URL or high-fidelity neural voice synthesis
  async speak({ text, murfVoice = null }) {
    this.stopSpeaking();
    this.isSpeaking = true;
    this.playAssistantChime();
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
          console.warn("[VoiceAgent] Murf audio playback failed, falling back to neural synthesis:", e);
          this.naturalNeuralSynthesis(text);
        };

        await this.currentAudio.play();
        return;
      } catch (err) {
        console.warn("[VoiceAgent] Audio URL play exception:", err);
      }
    }

    // High quality natural neural fallback with Falcon conversational cadence
    this.naturalNeuralSynthesis(text);
  }

  naturalNeuralSynthesis(text) {
    if (!window.speechSynthesis) {
      this.isSpeaking = false;
      this.notifyState("idle");
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown bold or code symbols from spoken text for pure smooth vocalization
    const cleanSpeech = text
      .replace(/\*\*/g, "")
      .replace(/__/g, "")
      .replace(/`/g, "")
      .replace(/#\s*/g, "")
      .replace(/\$([0-9]+(\.[0-9]+)?)/g, "$1 dollars");

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = this.speechRate;
    utterance.pitch = this.speechPitch;

    // Pick highest quality available English voice on this system
    const voices = window.speechSynthesis.getVoices();
    
    // Priority order for natural human-like voice synthesis
    const preferredVoice = voices.find(v => v.name === "Google US English") ||
      voices.find(v => v.name.includes("Natural") && v.lang.startsWith("en")) ||
      voices.find(v => v.name.includes("Enhanced") && v.lang.startsWith("en")) ||
      voices.find(v => v.name.includes("Ava") || v.name.includes("Samantha") || v.name.includes("Nicky")) ||
      voices.find(v => v.lang === "en-US" && !v.name.includes("Bad") && !v.name.includes("Whisper")) ||
      voices.find(v => v.lang.startsWith("en"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      this.isSpeaking = false;
      this.notifyState("idle");
    };

    utterance.onerror = (err) => {
      console.warn("[VoiceAgent] Utterance error:", err);
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
