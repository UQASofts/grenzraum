type CelebrationLanguage = "en" | "cs";

let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  const AudioContextCtor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextCtor) return null;

  if (!sharedAudioContext) {
    sharedAudioContext = new AudioContextCtor();
  }

  if (sharedAudioContext.state === "suspended") {
    void sharedAudioContext.resume();
  }

  return sharedAudioContext;
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  options?: { type?: OscillatorType; volume?: number }
) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const volume = options?.volume ?? 0.12;

  oscillator.type = options?.type ?? "triangle";
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.05);
}

function playCelebrationFanfare(ctx: AudioContext) {
  const now = ctx.currentTime;

  playTone(ctx, 130.81, now, 0.22, { type: "sine", volume: 0.1 });

  const melody = [523.25, 659.25, 783.99, 1046.5];
  melody.forEach((frequency, index) => {
    playTone(ctx, frequency, now + 0.08 + index * 0.11, 0.38, {
      type: "triangle",
      volume: 0.11,
    });
  });

  [1174.66, 1318.51, 1567.98, 2093].forEach((frequency, index) => {
    playTone(ctx, frequency, now + 0.52 + index * 0.07, 0.18, {
      type: "sine",
      volume: 0.05,
    });
  });
}

function pickVoice(language: CelebrationLanguage): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = language === "cs" ? "cs" : "en";

  return (
    voices.find((voice) => voice.lang.toLowerCase().startsWith(langPrefix) && voice.localService) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith(langPrefix)) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith("en"))
  );
}

function speakCelebration(language: CelebrationLanguage) {
  if (!("speechSynthesis" in window)) return;

  const phrase =
    language === "en" ? "Stamp collected! Great job, explorer." : "Razítko získáno! Výborná práce, objeviteli.";

  const speak = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.rate = 1.02;
    utterance.pitch = 1.08;
    utterance.volume = 0.95;

    const voice = pickVoice(language);
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  };

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      speak();
    };
    return;
  }

  speak();
}

/** Achievement fanfare + short spoken celebration when a stamp is collected. */
export function playStampCelebrationSound(language: CelebrationLanguage = "en") {
  try {
    const ctx = getAudioContext();
    if (ctx) {
      playCelebrationFanfare(ctx);
    }
  } catch {
    /* audio blocked or unsupported */
  }

  window.setTimeout(() => speakCelebration(language), 520);
}
