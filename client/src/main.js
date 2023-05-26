import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
//import 'tailwindcss/tailwind.css';
//import './input.css'

// const express = require('express');

// var app = express();

// app.use(express.static(path.join(__dirname, 'public')));
createApp(App).use(router).mount('#app')
