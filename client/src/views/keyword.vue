<template>
  <div>
    <div>
        <div class="button">

        </div>
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
      <textarea v-model="this.fullTransc"></textarea>
      <ul>
        <li v-for="{text, id} in listTransc" :key="id">
          <p>{{ text }}</p>
          <button @click="deleteData(id)"> delete script </button> ||
          <button @click="getKeyword(text)"> Cek </button> ||
          <button @click="getMed(text)"> cek obat </button>
        </li>
      </ul>
    </div>
    <div>
      <label for="sort">sort by</label>
      <select v-model="category" :disabled="medicine.length === 0">
        <option value="" disabled hidden>Pilih</option>
        <option value="byPrice">Harga</option>
        <option value="byName">Nama</option>
      </select>
      <p>
        category sekarang : {{this.category}}
      </p>
    </div>
    <div>
        <div v-for="kata in katakunci" :key="kata.word">   
            <div v-if="kata.entity_group === 'DISO'">penyakit : {{kata.word}} </div>
            <div v-else>
                anatomi : {{kata.word}} 
            </div>
                <button @click="getMed(kata.word)"> cari obat </button>
        </div>
    </div>
    <div>
      <div v-for="med in sortCat" :key="med.external_id" class="p-4 shadow-md border-gray-200 border-[1px]">
        <p>{{ med.name }}</p>
        <img :src="med.image_url" :alt="med.name" class="w-40 mx-auto" />
        <p>Range Harga: Rp.{{ med.min_price }} - Rp.{{ med.base_price }}</p>
        <button @click="detailMed(med.slug)">Details</button>
      </div>
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
import {getData, getMedicineDetail} from "../components/medicine.js"
import {runQuery} from "../components/keyword.js"

export default {
  data() {
    return {
      isListening: false,
      transcript: "",
      currTransc: "",
      fullTransc: "",
      endTransc: "",
      recognition: null,
      listTransc: [],
      medicine:"",
      diagnoze: null,
      savedDiagnoze: [],
      medicine: [],
      category: null,
      katakunci: [],
    };  
  },
  methods: {
    async getMed(query){
      try {
        console.log(query);
        const api = await getData(query);
        console.log(api);
        this.medicine = api;
      }
      catch (error) {
        console.log("disini eror");
        console.error(error);
      }
    },
    async detailMed(slug){
      try {
        await getMedicineDetail(slug);
      } 
      catch (error) {
        console.error(error);
      }
    },
    async getKeyword(text){
      try{
        const keyword = await runQuery(text);
        //console.log(keyword);
        this.katakunci = keyword;
      }
      catch(err){
        console.error(err);
      }
    },
    async AddData(){
      try {
        this.endTransc = this.fullTransc + this.currTransc;
        const docVal = await addDoc(collection(db, "keyword"),{
          //isi : document.getElementById("transc"),
          text : this.endTransc
        });
        const docUpd = doc(db, "keyword", docVal.id);
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
        const querySnapshot = await getDocs(collection(db, "keyword"));
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
        await deleteDoc(doc (db, "keyword", id));
        console.log("id :", id, "berhasil dihapus");
      }
      catch(err) {
        console.log("data gagal dihapus", err.massage)
      }
      this.loadData();
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
  computed: {
    sortCat(){
      if(this.category === "byPrice"){
        return this.medicine.sort((a, b) => a.min_price - b.min_price)
      }
      else if(this.category === "byName"){
        return this.medicine.sort((a, b) => a.name.localeCompare(b.name));
      }
      else{
        return this.medicine
      }
    }
  }
}
</script>
