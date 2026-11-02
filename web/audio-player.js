export class AudioPlayer {
  constructor(createAudio = (source) => new Audio(source)) {
    this.createAudio = createAudio;
    this.playback = null;
  }

  play(source, { rate = 1, onEnd } = {}) {
    this.stop();
    return new Promise((resolve) => {
      const media = this.createAudio(source);
      const playback = { media, resolve, closed: false };
      this.playback = playback;
      media.playbackRate = rate;

      const finish = (succeeded) => {
        if (playback.closed) return;
        playback.closed = true;
        media.onended = null;
        media.onerror = null;
        if (this.playback === playback) this.playback = null;
        resolve(succeeded);
        onEnd?.(succeeded);
      };

      media.onended = () => finish(true);
      media.onerror = () => finish(false);
      try {
        Promise.resolve(media.play()).catch(() => finish(false));
      } catch {
        finish(false);
      }
    });
  }

  stop() {
    const playback = this.playback;
    if (!playback) return;
    this.playback = null;
    playback.closed = true;
    playback.media.onended = null;
    playback.media.onerror = null;
    playback.media.pause();
    // A cancelled model must never count as a completed listening activity.
    playback.resolve(false);
  }
}

const SUCCESS_CHIMES = [
  [523, 659, 784],
  [587, 740, 880],
  [659, 784, 988],
];
const RETRY_CHIME = [330, 294];
const STAGE_CHIME = [523, 659, 784, 1046];

export class SoundEffects {
  constructor(isEnabled, scope = globalThis) {
    this.isEnabled = isEnabled;
    this.scope = scope;
    this.context = null;
    this.successIndex = 0;
  }

  unlock() {
    try {
      const Context = this.scope.AudioContext ?? this.scope.webkitAudioContext;
      if (!Context) return;
      this.context ??= new Context();
      if (this.context.state === 'suspended') this.context.resume().catch(() => {});
    } catch {
      /* Letter recordings still work without optional chimes. */
    }
  }

  play(correct, stageComplete = false) {
    if (!this.isEnabled() || this.context?.state !== 'running') return;
    const notes = !correct
      ? RETRY_CHIME
      : stageComplete
        ? STAGE_CHIME
        : SUCCESS_CHIMES[this.successIndex++ % SUCCESS_CHIMES.length];
    notes.forEach((frequency, index) => {
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      const start = this.context.currentTime + index * 0.11;
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(correct ? 0.055 : 0.035, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
      oscillator.connect(gain).connect(this.context.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.28);
    });
  }
}
