const bpmInput = document.getElementById('bpm');
const subdivisionsInput = document.getElementById('subdivisions');
const volumeControl = document.getElementById('volumeControl');
const startStopButton = document.getElementById('startStop');
const beatIndicator = document.getElementById('beatIndicator');
const soundTypeSelect = document.getElementById('soundType');

let isRunning = false;
let currentSubdivision = 0;
let interval;
let audioContext;
let gainNode;

function setupAudio() {
    audioContext = new AudioContext();
    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    updateVolume(); // Asegura que el volumen se inicialice correctamente
}

function playClick() {
    const soundType = soundTypeSelect.value;
    const subdivisions = parseInt(subdivisionsInput.value);
    currentSubdivision = (currentSubdivision % subdivisions) + 1;
    const isAccent = currentSubdivision === 1;

    const oscillator = audioContext.createOscillator();
    oscillator.type = soundType;
    oscillator.connect(gainNode);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
    updateVolume(isAccent); // Actualiza el volumen dependiendo si es acentuado o no
}

function updateVolume(isAccent = false) {
    gainNode.gain.value = isAccent ? 1 * volumeControl.value : 0.5 * volumeControl.value;
}

function updateBeat() {
    playClick();
}

function startMetronome() {
    if (!audioContext) {
        setupAudio();
    }
    if (isRunning) {
        clearInterval(interval);
    }
    const bpm = parseInt(bpmInput.value);
    const intervalTime = 60000 / bpm / parseInt(subdivisionsInput.value);
    interval = setInterval(updateBeat, intervalTime);
    isRunning = true;
    startStopButton.textContent = 'Detener';
    updateIndicatorAnimation(intervalTime * parseInt(subdivisionsInput.value));
}

function stopMetronome() {
    if (isRunning) {
        clearInterval(interval);
        isRunning = false;
        startStopButton.textContent = 'Iniciar';
        beatIndicator.style.animation = 'none';
    }
}

function updateIndicatorAnimation(totalIntervalTime) {
    beatIndicator.style.animation = `beat ${totalIntervalTime / 1000}s infinite linear`;
}

startStopButton.addEventListener('click', () => {
    if (isRunning) {
        stopMetronome();
    } else {
        startMetronome();
    }
});

bpmInput.addEventListener('input', startMetronome);
subdivisionsInput.addEventListener('input', startMetronome);
volumeControl.addEventListener('input', () => {
    updateVolume(currentSubdivision === 1);
});
