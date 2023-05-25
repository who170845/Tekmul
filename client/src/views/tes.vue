<template>
  <div class="min-h-screen w-full p-5">
    <h1 class="font-semibold text-center text-2xl mb-4">Diagnoze</h1>
    <div class="h-full w-full flex flex-col lg:flex-row lg:justify-center gap-8">
      <div class="h-64 w-full max-w-lg shadow-md border-gray-200 border-[1px] mx-auto lg:mx-2 p-2">
        <h2 class="font-medium text-center text-lg mb-3">Tell your condition</h2>
        <div class="w-full flex flex-col justify-center">
          <div v-if="isListen" class="w-fit p-8 mx-auto border-gray-200 border-[1px]">
            <p class="text-center">{{ diagnoze }}</p>
          </div>
          <span v-if="isListen">▶️<span class="text-gray-400">Speak now</span></span>
          <button @click="toggleListen">
            <span v-if="isListen" class="px-2 py-1 rounded-lg bg-slate-200 font-semibold text-xs">Off</span>
            <span v-else class="px-2 py-1 rounded-lg bg-slate-200 font-semibold text-xs">ON</span>
          </button>
          <button @click="handleSaveDiagnoze" :disabled="!diagnoze">
            Save Diagnoze
          </button>
        </div>
      </div>
      <div class="h-64 w-full max-w-lg shadow-md border-gray-200 border-[1px] mx-auto lg:mx-2 p-2">
        <h2 class="font-medium text-center text-lg">Diagnoze</h2>
        <p v-for="n in savedDiagnoze" :key="n">{{ n }}</p>
        <button @click="handleClearDiagnoze">Clear Diagnoze</button>
      </div>
    </div>
    <div class="w-full h-full mt-3 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-7 p-2 px-7">
      <div v-for="med in medicine" :key="med.external_id" class="p-4 shadow-md border-gray-200 border-[1px]">
        <p>{{ med.name }}</p>
        <img :src="med.image_url" :alt="med.name" class="w-40 mx-auto" />
        <p>Range Harga: Rp.{{ med.min_price }} - Rp.{{ med.base_price }}</p>
        <button @click="getMedicineDetail(med.slug)">Details</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isListen: false,
      diagnoze: null,
      savedDiagnoze: [],
      medicine: []
    };
  },
  mounted() {
    this.initSpeechRecognition();
    this.handleListen();
  },
  methods: {
    async getData(query) {
      try {
        const response = await axios.get('http://localhost:5000/api/buy-medicine/products/search', {
          params: {
            query: query
          }
        });
        const { api } = response.data.result;
        this.medicine = { api };
      } catch (error) {
        console.error(error);
      }
    },
    async getMedicineDetail(slug) {
    try {
        const response = await axios.get(`http://localhost:5000/api/buy-medicine/products/details`, {
            params: {
            query: slug
            }
        });
        console.log(response);
        alert(response.data.description);
        } catch (error) {
            console.error(error);
        }
        },
    async handleSaveDiagnoze() {
        await this.getData(this.diagnoze);
        this.setSavedDiagnoze([...this.savedDiagnoze, this.diagnoze]);
        this.setDiagnoze('');
        },
    handleClearDiagnoze() {
            this.setSavedDiagnoze([]);
        },
    }
}
