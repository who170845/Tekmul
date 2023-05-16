<template>
  <div>
    <div>
        <button @click="startRecognition" :disabled="isListening">
        Start
        </button> || 
        <!-- <button @click="stopRecognition" :disabled="!isListening">
          Stop
        </button> <br> -->
        <button @click="clear">
          Clear
        </button> || 
        <button @click="stopRecognition">
          Stop
        </button>
    </div>
    <br>
    <div>   
      <textarea name="result" id="transc" cols="20" rows="10" disabled>{{ transcript }}</textarea> ~~
      <textarea name="full" id="fulltransc" cols="20" rows="10" disabled>{{ this.fullTransc }}{{this.transcript}} </textarea>
      <br>

      <button @click="clearful">Clear</button> || 
      <button @click="AddData"> Add transcript  </button>

      <br>
      
    </div>
    <div>
      <textarea name="result" id="" cols="30" rows="10" disabled>{{  }}</textarea>
      <ul>
        <li v-for="{text, id} in listTransc" :key="id">
          <p>{{ text }}</p>
          <button @click="deleteData(id)"> delete script </button>
          <button @click="runQuery(text)">Cek</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

import { db,app } from "../stores/index.js"
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  querySnapshot,
  getDocs,
  doc,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import fetch from "node-fetch"

export default {
  data() {
    return {
      isListening: false,
      transcript: "",
      currTransc: "",
      fullTransc: "",
      endTrancs: "",
      recognition: null,
      listTransc: [],
    };
  },
  methods: {
    checkTextarea() {
      var textarea = document.getElementById("transc");
      if (textarea.value.trim() === "") {
        console.log("Textarea is empty");
      } else {
        console.log("Textarea is not empty");
      }
    },
    async AddData(){
      try {
        this.endTrancs = this.fullTransc + this.currTransc;
        const docVal = await addDoc(collection(db, "transkrip"),{
          //isi : document.getElementById("transc"),
          text : this.endTrancs
        });
        const docUpd = doc(db, "transkrip", docVal.id);
        await updateDoc(docUpd, {id: docVal.id});
        console.log("script berhasil ditambahkan", docVal.id);
      }
      catch(err) {
        console.log("script gagal ditambahkan", err);
      }
      this.loadData();
    },
    async loadData(){
      try {
        const querySnapshot = await getDocs(collection(db, "transkrip"));
        this.listTransc = [];
        querySnapshot.forEach((doc) =>{
          console.log(doc.data());
          this.listTransc.push(doc.data());
        });
        console.log("data berhasil dimuat");
      }
      catch(err){
        console.log("data gagal dimuat", err);
      }
    },
    async deleteData(id){
      try {
        await deleteDoc(doc (db, "transkrip", id));
        console.log("id :", id, "berhasil dihapus");
      }
      catch(err) {
        console.log("data gagal dihapus", err.massage)
      }
      this.loadData();
    },
    async runQuery(text) {
      try {
        const response = await fetch(
          "https://api-inference.huggingface.co/models/abid/indonesia-bioner",
          {
            headers: {
              Authorization: "Bearer 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",
            },
            method: "POST",
            body: JSON.stringify({
              "inputs": text,
            }),
          }
        );
        const result = await response.json();
        console.log(JSON.stringify(result));
      } 
      catch (error) {
        console.error(error);
      }
    },
    startRecognition() {
      var textarea = document.getElementById("transc");
      if (textarea.value.trim() != ""){
        this.fullTransc += this.currTransc;
      }
      this.recognition.start();
    },
    clear(){
      let textarea = this.transcript;
      this.transcript = "";
    },
    clearful(){
      // let textarea = document.getElementById('transc');
      // textarea.value = "";
      this.fullTransc = "";
    },
    stopRecognition() {
      this.recognition.stop();
      this.isListening = false; // menandakan bahwa proses pengenalan suara sudah dihentikan
    },
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
      //this.fullTransc += this.transcript + " ";
      console.log(this.transcript);
    };

    this.recognition.onend = () => {
    this.currTransc = this.transcript + " ";
    console.log("Text to Speech telah mati");
    // if (!this.isListening) {
    //   // proses pengenalan suara sudah dihentikan secara manual
    //   return;
    // }
    // this.recognition.start(); // memulai kembali proses pengenalan suara
    this.isListening = false;
  };

    this.recognition.onerror = (event) => {
      console.log("Error occurred in recognition: " + event.error);
      this.isListening = false;
    };
    this.loadData();
  },
    
  
};
</script>
