<template>
  <div style="height:300px; width:400px" class="maps">
    <l-map ref="map" v-model:zoom="zoom" :center="[latitude, longitude]" >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
    </l-map>
  </div>
  <div>
    <button @click="locatorButtonPressed()">cek lokasi</button> <br>
    <button @click="countDistance()"> cek jarak dari kos </button> <br>
    <button @click="getCurrentLocation()"> cek lokasi 2 </button>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
import { geolib, getDistance } from 'geolib';
import data from "../components/apotek"
//import {countDistance} from ".."
export default {
  components: {
    LMap,
    LTileLayer,
  },
  data() {
    return {
      zoom: 50,
      latitude: -7.291861,
      longitude: 112.797249
    };
  },
  methods: {
    async getCurrentLocation() {
      console.log("tes");
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log('Latitude:', latitude);
            console.log('Longitude:', longitude);
            this.showMap(latitude, longitude);
          },
          (error) => {
            console.error('Error getting geolocation:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    },
    showMap(latitude, longitude){
      console.log(latitude, longitude);
    },
    async locatorButtonPressed() {
      navigator.geolocation.getCurrentPosition(
          position => {
            console.log(position.coords.latitude);
            console.log(position.coords.longitude);
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            // this.latitude = -7.293861;
            // this.longitude = 112.799249;
          },
          error => {
            console.log(error.message);
          },
      )
    },
    calculateDistance() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log(
                'You are ',
                geolib.getDistance(position.coords, {
                    latitude: 51.525,
                    longitude: 7.4575,
                }),
                'meters away from 51.525, 7.4575'
            );
        },
        () => {
            alert('Position could not be determined.');
        }
    );
    },
    countDistance(){
      const hasil = getDistance(
        { latitude: this.latitude, longitude: this.longitude },
        { latitude: -7.291861, longitude: 112.797249 }
      );
      console.log(hasil);
    }
  },
  created(){
    this.getCurrentLocation()
    console.log(data)
  }
};
</script>

<style>
.maps{
  /* align-content: center;
  justify-content: center; */
  margin: auto;
}
</style>