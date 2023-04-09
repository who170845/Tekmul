const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new speechRecognition();

recognition.lang = 'id-ID';
recognition.interimResults = true;
recognition.maxAlternatives = 1;

const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const text = document.getElementById('text');

let transcript = '';

recognition.onstart = () => {
  console.log('Speech recognition service has started');
  startBtn.disabled = true;
  stopBtn.disabled = false;
};

recognition.onresult = (event) => {
  const resultIndex = event.resultIndex;
  const transcript = event.results[resultIndex][0].transcript;
  console.log(transcript);
  text.innerHTML = transcript;
};

recognition.onend = () => {
  console.log('Speech recognition service disconnected');
  startBtn.disabled = false;
  stopBtn.disabled = true;
};

recognition.onerror = (event) => {
  console.log('Error occurred in recognition: ' + event.error);
};

startBtn.addEventListener('click', () => {
  recognition.start();
});

stopBtn.addEventListener('click', () => {
  recognition.stop();
});
