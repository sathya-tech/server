const express = require('express');
const app = express();
const cors = require("cors");
const bodyparser = require('body-parser');
require('dotenv').config();


const axios = require('axios');

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.use(bodyparser.json());



app.post('/', async function(req,res){
  try {
    const { source, destination, date } = await req.body;
    
    const response = await axios.get(API_URL, {
      params: {
        fly_from: source,
        fly_to: destination,
        date_from: date,
        date_to: date,
        partner_market:'in',
        partner: process.env.USER_NAME,
        
      },
      headers: {
        'apikey': API_KEY,
      },
    });

    const { data } = response.data;

    if (data && data.length > 0) {
      const flightPrices = {};
      data.forEach((flight) => {
        console.log(flight)
        flightPrices[flight.airlines.join(', ')] = `₹${flight.price}`;
      });

      res.json(flightPrices);
    }

    throw new Error('No flight prices found for the given cities and date.');
  } catch (error) {
    console.error('An error occurred while fetching flight prices:', error.message);
  }
}
)



app.listen(3000, (req, res) => {
  console.log("LISTENING ON PORT 3000");
})


// const API_KEY = 'GTApL1brOYfbFH1MwFmrKNMeINp6pfHn';
// const API_URL = 'https://tequila-api.kiwi.com/v2/search';

// async function getFlightPrices(source, destination, date) {
//   try {
//     const response = await axios.get(API_URL, {
//       params: {
//         fly_from: source,
//         fly_to: destination,
//         date_from: date,
//         date_to: date,
//         partner_market:'in',
//         partner: 'Sathya Iyer', // Replace with your partner name
        
//       },
//       headers: {
//         'apikey': API_KEY,
//       },
//     });

//     const { data } = response.data;

//     if (data && data.length > 0) {
//       const flightPrices = {};
//       data.forEach((flight) => {
//         flightPrices[flight.airlines.join(', ')] = `₹${flight.price}`;
//       });

//       return flightPrices;
//     }

//     throw new Error('No flight prices found for the given cities and date.');
//   } catch (error) {
//     console.error('An error occurred while fetching flight prices:', error.message);
//   }
// }

// // Usage
// const source = 'DEL';
// const destination = 'JAI';
// const date = '15/06/2023';

// getFlightPrices(source, destination, date)
//   .then((flightPrices) => {
//     console.log(flightPrices);
//   })
//   .catch((error) => {
//     console.error(error);
//   });
