// import express from 'express';
// import cors from 'cors';
// import axios from 'axios';
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());

app.get('/', async (req, res) => {
    res.send("hello world")
});

app.get('/run-query', async (req, res) => {
  const { query } = req.query; 
  // console.log({query});
  try {
    const response = await axios.get(`https://magneto.api.halodoc.com/api/v1/buy-medicine/products/search/${query}`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(response.data);
    console.log(response.data);
  } catch (error) {
    console.log("eroorrororor");
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/buy-medicine/products/details', async (req, res) => {
  const { query } = req.query;

  try {
    console.log(query)
    const response = await axios.get(`https://magneto.api.halodoc.com/api/v1/buy-medicine/products/detail/${query}`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));