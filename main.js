// Piano functionality
class VirtualPiano {
    constructor() {
        this.audioContext = null;
        this.initAudio();
        this.initEventListeners();
        this.keyMap = this.createKeyMap();
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.error('Web Audio API not supported:', error);
        }
    }

    createKeyMap() {
        return {
            // White keys
            'q': 'C4', 'w': 'D4', 'e': 'E4', 'r': 'F4', 't': 'G4', 'y': 'A4', 'u': 'B4',
            'i': 'C5', 'o': 'D5', 'p': 'E5', 'a': 'F5', 's': 'G5', 'd': 'A5', 'f': 'B5',
            'g': 'C6',
            // Black keys
            '1': 'C#4', '2': 'D#4', '3': 'F#4', '4': 'G#4', '5': 'A#4',
            '6': 'C#5', '7': 'D#5', '8': 'F#5', '9': 'G#5', '0': 'A#5'
        };
    }

    getFrequency(note) {
        const noteFrequencies = {
            'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13,
            'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00,
            'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
            'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25,
            'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99,
            'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
            'C6': 1046.50
        };
        return noteFrequencies[note] || 440;
    }

    playNote(note) {
        if (!this.audioContext) return;

        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(this.getFrequency(note), this.audioContext.currentTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1.0);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 1.0);
    }

    initEventListeners() {
        // Mouse events for piano keys
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('key')) {
                const note = e.target.getAttribute('data-note');
                this.playNote(note);
                this.animateKey(e.target);
            }
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (this.keyMap[key]) {
                const note = this.keyMap[key];
                this.playNote(note);
                
                const keyElement = document.querySelector(`[data-note="${note}"]`);
                if (keyElement) {
                    this.animateKey(keyElement);
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (this.keyMap[key]) {
                const note = this.keyMap[key];
                const keyElement = document.querySelector(`[data-note="${note}"]`);
                if (keyElement) {
                    keyElement.classList.remove('active');
                }
            }
        });
    }

    animateKey(keyElement) {
        keyElement.classList.add('active');
        setTimeout(() => {
            keyElement.classList.remove('active');
        }, 150);
    }
}

// Initialize piano when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VirtualPiano();
});

// Mobile menu toggle (if needed)
document.querySelector('.side_icon')?.addEventListener('click', () => {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});