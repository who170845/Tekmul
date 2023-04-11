<template>
  <div>
    <button @click="startRecognition" :disabled="isListening">
      Start
    </button>
    <button @click="stopRecognition" :disabled="!isListening">
      Stop
    </button> <br>
    <textarea name="" id="" cols="30" rows="10">{{ transcript }}</textarea>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isListening: false,
      transcript: "",
      recognition: null,
    };
  },
  mounted() {
    const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new speechRecognition();
    this.recognition.lang = "id-ID";
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      console.log("Text to Speech telah hidup");
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      const resultIndex = event.resultIndex;
      this.transcript = event.results[resultIndex][0].transcript;
      console.log(this.transcript);
    };

    this.recognition.onend = () => {
      console.log("Text to Speech telah mati");
      this.isListening = false;
    };

    this.recognition.onerror = (event) => {
      console.log("Error occurred in recognition: " + event.error);
      this.isListening = false;
    };
  },
  methods: {
    startRecognition() {
      this.recognition.start();
    },
    stopRecognition() {
      this.recognition.end();
    },
  },
};
</script>
