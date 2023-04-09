const recordBtn = document.getElementById('record');
const textArea = document.getElementById('text');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = () => {
  console.log('Recording started!');
};

recognition.onresult = (event) => {
  const current = event.resultIndex;
  const transcript = event.results[current][0].transcript;
  textArea.value += transcript;
};

recordBtn.addEventListener('click', () => {
  recognition.start();
});

