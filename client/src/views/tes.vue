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
        <option value="bySold"> Terjual </option>
        <option value="byStock"> Stock </option>
      </select>

      <select v-model="condition" v-if="category === 'byPrice'">
        <option value="HighPrice">Paling tinggi</option>
        <option value="LowPrice">Paling rendah</option>
      </select>
      <select v-model="condition" v-else-if="category === 'byName'">
        <option value="FromA">Dari A</option>
        <option value="FromZ">Dari Z</option>
      </select>
      <select v-model="condition" v-else-if="category === 'byDistance'">
        <option value="Nearest">Paling dekat</option>
        <option value="Furthest">Paling jauh</option>
      </select>
      <select v-model="condition" v-else-if="category === 'byRating'">
        <option value="HighRating">Paling tinggi</option>
        <option value="LowRating">Paling rendah</option>
      </select>
      <select v-model="condition" v-else-if="category === 'bySold'">
        <option value="MostSold">Paling banyak</option>
        <option value="LeastSold">Paling sedikit</option>
      </select>
      <select v-model="condition" v-else-if="category === 'byStock'">
        <option value="MostStock">Paling banyak</option>
        <option value="LeastStock">Paling sedikit</option>
      </select>
      <p>
        category sekarang : {{this.category}}
        condition sekarang : {{this.condition}}
      </p>
    </div>
    
    <div>
      <div v-for="med in sortCat" :key="med.id" class="p-4 shadow-md border-gray-200 border-[1px]">
        <p>{{ med.name }}</p>
        <img :src="med.image_300" :alt="med.name" class="w-40 mx-auto" />
        <img :src="med.drug_classification_icon" :alt="med.name">
        <p> Jenis Obat : {{med.drug_classification_label}} </p>
        <p> Harga {{med.price.display_amount}} </p>
        <p> Stok : {{med.stock}} </p>
        <p> Nama Apotek : {{med.nama_apotik}} </p>
        <p> Jarak {{med.distance.toLocaleString()}} Kilometer </p>
        <p>Rating : {{med.total_rated_amount}} </p>
        <p> {{med.total_product_sold}} item</p> 
        <button @click="MedSpec(med.id)"> tampilkan category </button>
        <div class="category">
          <ul v-if="med.ShowCat">
            <li  v-for="cat in med.drugs_categories" :key="cat.id">
              {{ cat.name }}
            </li>
          </ul>
        </div>
        <!-- <button @click="MedSpec(med.drugs_categories)">Details</button> -->
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
import {getData, getMedicineDetail, getSpecificMed} from "../components/medicine.js"
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
      SpecMed: [],
      category: null,
      latitude: null,
      longitude: null,
      distance: null,
      condition: null
    };  
  },
  methods: {
    extractNumber(number){
      const regex = /\((\d+)\)/; // Regex untuk mengekstrak angka di dalam tanda kurung
      const match = number.match(regex);

      if (match && match.length > 1) {
        return match[1]; // Mengembalikan angka di dalam tanda kurung
      }

      return number;
    },
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
          const sold = parseInt(item.total_product_sold.split(" ")[1])
          return {
            ...item,
            distance: await this.calculateDistance(item.latitude, item.longitude),
            sold: sold
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
          const result = await getSpecificMed(query);
          console.log(result.data);
          this.medicine = result.data;
          this.addLocation(); // from medicine -> medloc
          this.addDistance(); // from medloc -> medDistance
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
    MedSpec(query){
      const med = this.medDistance.find((item) => item.id === query);
      if(med){
        med.ShowCat = !med.ShowCat
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
        if(this.condition === "HighPrice"){
          return this.medDistance.sort((a, b) => b.price.amount - a.price.amount)
        }
        else if(this.condition === "LowPrice"){
          return this.medDistance.sort((a, b) => a.price.amount - b.price.amount)
        }
        else{
          return this.medDistance
        }
      }

      else if(this.category === "byName"){
        if(this.condition === "FromA"){
          return this.medDistance.sort((a, b) => a.name.localeCompare(b.name));
        }
        else if(this.condition === "FromZ"){
          return this.medDistance.sort((a, b) => b.name.localeCompare(a.name));
        }
        else{
          return this.medDistance
        }
      }

      else if(this.category === "byDistance"){
        if(this.condition === "Nearest"){
          return this.medDistance.sort((a,b) => a.distance - b.distance)
        }
        else if(this.condition === "Furthest"){
          return this.medDistance.sort((a,b) => b.distance - a.distance)
        }
        else{
          return this.medDistance
        }
      }

      else if(this.category === "byRating") {
        if(this.condition === "HighRating"){
          return this.medDistance.sort((a, b) => {
            const ratingA = this.extractNumber(a.total_rated_amount);
            const ratingB = this.extractNumber(b.total_rated_amount);
            //console.log(ratingB, ratingA)
            if(ratingA === ratingB){
              return b.sold - a.sold
            }
            return ratingB - ratingA;
          });
        }
        else if(this.condition === "LowRating"){
          return this.medDistance.sort((a, b) => {
            const ratingA = this.extractNumber(a.total_rated_amount);
            const ratingB = this.extractNumber(b.total_rated_amount);
            //console.log(ratingB, ratingA)
            if(ratingA === ratingB){
              return a.sold - b.sold
            }
            return ratingA - ratingB;
          });
        }
        else{
          return this.medDistance
        }
      }

      else if(this.category === "bySold"){
        if(this.condition === "MostSold"){
          return this.medDistance.sort((a,b) => b.sold - a.sold)
        }
        else if(this.condition === "LeastSold"){
          return this.medDistance.sort((a,b) => a.sold - b.sold)
        }
        else{
          return this.medDistance
        }
      }

      else if(this.category === "byStock"){
        if(this.condition === "MostStock"){
          return this.medDistance.sort((a, b) => b.stock - a.stock)
        }
        else if(this.condition === "LeastStock"){
          return this.medDistance.sort((a, b) => a.stock - b.stock)
        }
        else{
          return this.medDistance
        }
      }

      else{
        return this.medDistance
      }
    }
  }
}
</script>
