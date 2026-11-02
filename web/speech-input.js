const ERROR_STATES = new Set(['unavailable', 'permission', 'network', 'language', 'uncertain']);

export class SpeechInput {
  constructor({ onResult, onStatus, scope = globalThis, timeout = 14000 }) {
    this.onResult = onResult;
    this.onStatus = onStatus;
    this.scope = scope;
    this.timeout = timeout;
    this.recognizer = null;
    this.active = false;
    this.generation = 0;
    this.timer = null;
    this.handleNativeEvent = (event) => this.receiveNativeEvent(event.detail);
    scope.addEventListener('littlewild-voice', this.handleNativeEvent);
  }

  get nativeBridge() {
    return this.scope.AndroidVoice;
  }
  get Recognition() {
    return this.scope.SpeechRecognition ?? this.scope.webkitSpeechRecognition;
  }

  isAvailable() {
    try {
      return this.nativeBridge ? this.nativeBridge.isAvailable() : Boolean(this.Recognition);
    } catch {
      return false;
    }
  }

  start() {
    this.stop();
    if (!this.isAvailable()) {
      this.onStatus('unavailable');
      return;
    }
    this.active = true;
    const generation = this.generation;
    this.onStatus('listening');
    this.timer = setTimeout(() => this.fail('uncertain', generation), this.timeout);
    try {
      if (this.nativeBridge) {
        this.nativeBridge.start();
        return;
      }
      const recognizer = new this.Recognition();
      this.recognizer = recognizer;
      recognizer.lang = 'en-US';
      recognizer.continuous = false;
      recognizer.interimResults = false;
      recognizer.maxAlternatives = 4;
      recognizer.onresult = (event) => {
        const alternatives = Array.from(event.results[0], (result) => result.transcript);
        this.finish(alternatives, generation);
      };
      recognizer.onerror = (event) => {
        const status = ['not-allowed', 'service-not-allowed'].includes(event.error)
          ? 'permission'
          : event.error === 'network'
            ? 'network'
            : 'uncertain';
        this.fail(status, generation);
      };
      recognizer.onend = () => this.fail('uncertain', generation);
      recognizer.start();
    } catch {
      this.fail('unavailable', generation);
    }
  }

  finish(alternatives, generation) {
    if (!this.active || generation !== this.generation) return;
    this.stop();
    this.onResult(alternatives.filter((value) => typeof value === 'string'));
  }

  fail(status, generation) {
    if (!this.active || generation !== this.generation) return;
    this.stop();
    this.onStatus(ERROR_STATES.has(status) ? status : 'uncertain');
  }

  receiveNativeEvent(detail) {
    if (!detail || typeof detail !== 'object') return;
    if (detail.status === 'ready') {
      this.stop();
      this.onStatus('ready');
      return;
    }
    if (!this.active) return;
    if (detail.status === 'results') {
      this.finish(Array.isArray(detail.results) ? detail.results : [], this.generation);
    } else if (detail.status === 'listening' || detail.status === 'processing') {
      this.onStatus(detail.status);
    } else this.fail(detail.status, this.generation);
  }

  stop() {
    this.active = false;
    this.generation += 1;
    clearTimeout(this.timer);
    this.timer = null;
    const recognizer = this.recognizer;
    this.recognizer = null;
    if (recognizer) {
      recognizer.onresult = recognizer.onerror = recognizer.onend = null;
      try {
        recognizer.abort();
      } catch {
        /* A finished browser recognizer may already be closed. */
      }
    }
    try {
      this.nativeBridge?.cancel();
    } catch {
      /* Closing the screen must still succeed. */
    }
  }

  dispose() {
    this.stop();
    this.scope.removeEventListener('littlewild-voice', this.handleNativeEvent);
  }
}
