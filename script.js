const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const masterGain = audioCtx.createGain(); // master gain
masterGain.connect(audioCtx.destination); // soundcard
masterGain.gain.value = 0;

const filter = audioCtx.createBiquadFilter(); // filter node
filter.connect(masterGain);
filter.type = 'lowpass';
filter.frequency.setTargetAtTime(2000, audioCtx.currentTime, 0);
filter.gain.value = 0.10;

function Oscillator(type, frequency) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    gainNode.gain.value = 0.10; // oscillator gain
    gainNode.connect(filter);
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);

    return {
        getType: () => oscillator.type,
        getFrequency: () => oscillator.frequency.value,
        setType: (type => { oscillator.type = type }),
        connect: (destination) => gainNode.connect(destination),
        disconnect: () => gainNode.disconnect(),
        getGainNode: () => gainNode,
        getTuning: () => oscillator.detune.value,
        setFrequency: (frequency) => { 
            oscillator.frequency.setValueAtTime( frequency, audioCtx.currentTime )
        },
        detune: (value) => oscillator.detune.value = value,
        start: () => oscillator.start(),
        stop: () => oscillator.stop(),
    }
} 

const oscillator1 = Oscillator('sine', 440); // create oscillator1
const oscillator2 = Oscillator('sine', 440); // create oscillator2

// event handlers

function adjustVolume(value) {
    masterGain.gain.value = value;
    filter.gain.value = value;
}
function playSound() {
    oscillator1.start();
    oscillator2.start();
}
function stopSound() {
    oscillator1.stop();
    oscillator2.stop();
}
function updateOscillatorOneType(waveType) {
    oscillator1.setType(waveType);
}
function updateOscillatorTwoType(waveType) {
    oscillator2.setType(waveType);
}
function detuneOscillator(cents, oscillator) {
    (eval(oscillator).detune(cents));
}
function mute(checkbox) {
    checkbox.checked ? eval(checkbox.id).connect(filter) : eval(checkbox.id).disconnect();
}
function filterCutoff(frequencyHz) {
    filter.frequency.setTargetAtTime(frequencyHz, audioCtx.currentTime, 0);
}
function transposeOctaveDown(parent) {
    (parent === 'octaveDown1') 
      ? oscillator1.setFrequency(oscillator1.getFrequency() / 2)
      : oscillator2.setFrequency(oscillator2.getFrequency() / 2)
}
function transposeOctaveUp(parent) {
    (parent === 'octaveUp1') 
      ? oscillator1.setFrequency(oscillator1.getFrequency() * 2)
      : oscillator2.setFrequency(oscillator2.getFrequency() * 2)
}
function transpose(frequency) {
    oscillator1.setFrequency(frequency);
}