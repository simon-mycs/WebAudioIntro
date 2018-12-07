const AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();

class Sound {

    constructor(context) {
      this.context = context;
    }
  
    init() {
      this.oscillator = this.context.createOscillator();
      this.gainNode = this.context.createGain();
  
      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.context.destination);
      this.oscillator.type = 'sine';
    }
  
    play(value, time) {
      this.init();
      this.oscillator.frequency.value = value;
      this.gainNode.gain.setValueAtTime(1, this.context.currentTime);  
      this.oscillator.start(time);
    }

    getState() {
      return this.oscillator.context.state;
    }
  
    stop(time) {
      this.gainNode.gain.exponentialRampToValueAtTime(0.001, time + 1);
      this.oscillator.stop(time + 1);
    }
  
  }

  let oscillatorPool = [];
  
  document.addEventListener('keydown', (event) => {
    if ( ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k'].indexOf(event.key) === -1 || event.repeat)  {
        return;
    }
    const note = new Sound(context);
    oscillatorPool.push(note);
    note.play(keyToNoteFrequency(event.key), context.currentTime);

  }, false);

  document.addEventListener('keyup', (event) => {
    oscillatorPool.forEach(note => {
        if (Math.floor(note.oscillator.frequency.value) === Math.floor(keyToNoteFrequency(event.key))) {
            note.stop(context.currentTime);
        }
    });
  }, false);

  function keyToNoteFrequency(keyPressed) {
      switch (keyPressed) {
        case 'a':
            return 261.6300048828125;
            break;
        case 's':
            return 293.6600036621094;
            break;    
        case 'd':
            return 329.6300048828125;
            break;    
        case 'f':
            return 349.2300109863281;
            break;    
        case 'g':
            return 392;
            break;    
        case 'h':
            return 440;
            break;    
        case 'j':
            return 493.8800048828125;
            break;    
        case 'k':
            return 523.25;
            break;    
        default:
            return 0;
      }
  }

