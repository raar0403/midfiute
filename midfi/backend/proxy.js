'use strict'

const express = require('express');
const cors = require('cors');
const createClient = require('hafas-client');
const nahshProfile = require('hafas-client/p/nahsh');

const app = express();
const client = createClient(nahshProfile, 'nahsh-hafas-proxy');

app.use(cors());

app.get('/api/locations', async (req, res) => {
  const query = req.query.query;
  const num = parseInt(req.query.num,10);
  if (!query) {
    return res.status(400).json({ error: 'Query parameter "query" is required' });
  }

  try {
    const locations = await client.locations(query, {
        fuzzy:     true// find only exact matches?
      , results:   num // how many search results?
      , stops:     true // return stops/stations?
      , addresses: false
      , poi:       false // points of interest
      , subStops: false // parse & expose sub-stops of stations?
      , entrances: false // parse & expose entrances of stops/stations?
      , linesOfStops: false // parse & expose lines at each stop/station?
      , language: 'de' // language to get results in
  });
    let answer = []
    console.log(req.query)
    if(req.query.id){
      answer = locations;
    }else{
      locations.forEach(element => {

        answer.push(element.name)
    });
    }
  
    res.json(answer);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err.message)
  }
});






app.get('/api/route', async (req, res) => {
  const query = req.query;
  const from = query.from;
  const to = query.to;
  console.log(query)
  if (!query) {
    return res.status(400).json({ error: 'Query parameter "query" is required' });
  }
 
  try {
    const journey = await client.journeys(from, to, {
      results: 1,
      stopovers: true,
      tickets: true
    })
    const fs = require('fs');

fs.writeFileSync('journeys.json', JSON.stringify(journey, null, 2), 'utf8');
    console.log(journey.journeys[0].legs)
    res.json(journey);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err.message)
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy läuft auf http://localhost:${PORT}`);
});