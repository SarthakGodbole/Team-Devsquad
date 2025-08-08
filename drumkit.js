class DrumKit {
  constructor() {
    this.drums = document.querySelectorAll('.drum');
    this.init();
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners() {
    // Click events
    this.drums.forEach(drum => {
      drum.addEventListener('click', () => {
        this.playDrum(drum);
      });
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
      const drum = document.querySelector(`[data-key="${e.key.toLowerCase()}"]`);
      if (drum) {
        this.playDrum(drum);
      }
    });

    document.addEventListener('keyup', (e) => {
      const drum = document.querySelector(`[data-key="${e.key.toLowerCase()}"]`);
      if (drum) {
        drum.classList.remove('active');
      }
    });

    // Touch events for mobile
    this.drums.forEach(drum => {
      drum.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.playDrum(drum);
      });

      drum.addEventListener('touchend', (e) => {
        e.preventDefault();
        setTimeout(() => {
          drum.classList.remove('active');
        }, 100);
      });
    });
  }

  playDrum(drum) {
    const sound = drum.getAttribute('data-sound');
    this.playSound(sound);
    
    drum.classList.add('active');
    setTimeout(() => {
      drum.classList.remove('active');
    }, 200);
  }

  playSound(sound) {
    try {
      const audio = new Audio(`Sounds/drumkit/${sound}.mp3`);
      audio.currentTime = 0;
      audio.volume = 0.8;
      audio.play().catch(e => {
        console.log('Audio play failed:', e);
        this.createBeep(sound);
      });
    } catch (error) {
      console.log('Audio file not found:', error);
      this.createBeep(sound);
    }
  }

  createBeep(sound) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    const drumSounds = {
      'kick': { freq: 60, type: 'sine', duration: 0.5, filter: 'lowpass' },
      'snare': { freq: 200, type: 'sawtooth', duration: 0.2, filter: 'highpass' },
      'hihat-closed': { freq: 8000, type: 'square', duration: 0.1, filter: 'highpass' },
      'hihat-open': { freq: 6000, type: 'square', duration: 0.3, filter: 'highpass' },
      'tom1': { freq: 150, type: 'sine', duration: 0.3, filter: 'lowpass' },
      'tom2': { freq: 100, type: 'sine', duration: 0.3, filter: 'lowpass' },
      'crash': { freq: 5000, type: 'sawtooth', duration: 1.0, filter: 'bandpass' },
      'ride': { freq: 3000, type: 'triangle', duration: 0.8, filter: 'bandpass' }
    };
    
    const drumSpec = drumSounds[sound] || drumSounds['kick'];
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = drumSpec.freq;
    oscillator.type = drumSpec.type;
    filter.type = drumSpec.filter;
    filter.frequency.value = drumSpec.freq * 1.5;
    
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + drumSpec.duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + drumSpec.duration);
  }
}

// Initialize drumkit when page loads
document.addEventListener('DOMContentLoaded', () => {
  new DrumKit();
});