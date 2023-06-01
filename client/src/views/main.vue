<template>
  <div>
    <div>
        <div class="button">
          <button @click="getLocation()"> tentukan kordinat </button>
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
      <textarea name="full" id="fulltransc" cols="20" rows="10" v-model="this.fullTransc">{{ this.fullTransc }}{{this.transcript}} </textarea>
      <br>

      <button @click="clearful">Clear</button> || 
      <button @click="AddData"> Add transcript  </button>

      <br>
      
    </div>
    <div>
      <textarea v-model="endTransc"></textarea>
      <ul>
        <li v-for="{text, id} in listTransc" :key="id">
          <p>{{ text }}</p>
          <button @click="deleteData(id)"> delete script </button> ||
          <button @click="getMed(text)"> cek obat </button>
        </li>
      </ul>
    </div>
    <div>
      <label for="sort">sort by</label>
      <select v-model="category" :disabled="medicine.length === 0">
        <option value="" disabled hidden>Pilih</option>
        <option value="byPrice"> Harga </option>
        <option value="byName"> Nama </option>
        <option value="byDistance"> Jarak </option>
        <option value="byRating"> Rating </option>
      </select>
      <p>
        category sekarang : {{this.category}}
      </p>
    </div>
    
    <div>
      <div v-for="med in sortCat" :key="med.external_id" class="p-4 shadow-md border-gray-200 border-[1px]">
        <p>{{ med.name }}</p>
        <img :src="med.image_url" :alt="med.name" class="w-40 mx-auto" />
        <p>Range Harga: Rp.{{ med.min_price.toLocaleString() }} - Rp.{{ med.base_price.toLocaleString() }}</p> <br>
        <p> Nama Apotek {{med.nama_apotik}} </p>
        <p>Rating: {{med.rating}} ({{med.total_rater}}) </p> <br>
        <p> Jarak {{med.distance}}M </p> 
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
import data from "../components/apotek.js"
import {countDistance, getCoordinat} from "../components/location.js"
//import { getDistance } from 'geolib';

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
      medloc: [],
      medDistance: [],
      category: null,
      latitude: null,
      longitude: null,
      distance: null,
    };  
  },
  methods: {
    async calculateDistance(latDest, longDest) {
      try {
        const dist = await countDistance(this.latitude, this.longitude, latDest, longDest);
        console.log(dist);
        return dist;
      } catch (error) {
        console.error(error);
      }
    },
    async getLocation(){
      try{
        const {latitude, longitude} = await getCoordinat()
        //console.log(latitude, longitude)
        this.latitude = latitude
        this.longitude = longitude
        console.log(this.latitude, this.longitude)
      }
      catch (error){
        console.error(error)
      }
    },
    async addLocation(){
      try{
        const med_loc = this.medicine.map(function(item, index){
          return {
            ...item, ...data[index % data.length]
          }
        })
        console.log(med_loc)
        this.medloc = med_loc
      }
      catch (error) {
        console.error(error);
      }
    },
    async addDistance(){
      try {
        const med_dist = await Promise.all(this.medloc.map(async (item) => {
          return {
            ...item,
            distance: await this.calculateDistance(item.latitude, item.longitude)
          }
        }))
        this.medDistance = med_dist
        console.log(med_dist)
      }
      catch(error) {
        console.error(error)
      }
    },
    async getMed(query){
      try {
        if (this.latitude != null && this.longitude != null){
          console.log(query);
          const api = await getData(query);
          console.log(api);
          this.medicine = api;
          this.addLocation();
          this.addDistance();
        }
        else{
          window.alert("tentukan kordinat dulu dekkk!!")
        }
      }
      catch (error) {
        console.log("obat tidak tersedia");
        //console.error(error);
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
        console.log(keyword);
      }
      catch(err){
        console.error(err);
      }
    },
    async AddData(){
      try {
        this.endTransc = this.fullTransc + this.currTransc;
        const docVal = await addDoc(collection(db, "transkrip"),{
          //isi : document.getElementById("transc"),
          text : this.endTransc
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
        return this.medDistance.sort((a, b) => a.min_price - b.min_price)
      }
      else if(this.category === "byName"){
        return this.medDistance.sort((a, b) => a.name.localeCompare(b.name));
      }
      else if(this.category === "byDistance"){
        return this.medDistance.sort((a,b) => a.distance - b.distance)
      }
      else if(this.category === "byRating"){
        return this.medDistance.sort((a,b) => {
          if (a.rating === b.rating) {
            return b.total_rater - a.total_rater
          }
          return b.rating - a.rating
        })
      }
      else{
        return this.medDistance
      }
    }
  }
}
</script>
