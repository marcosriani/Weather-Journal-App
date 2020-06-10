// Require Express to run server and routes
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Setup empty JS object to act as endpoint for all routes
const projectData = { data: [] };

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('public'));

// Routers
app.get('/', (req, res) => {
  res.sendFile(__dirname + 'index.html');
  res.send(projectData);
});

app.post('/database', (req, res) => {
  const { temp, currentTime, userResponse } = req.body.main;
  const returnedTemp = `${temp}°C`;
  const returnedcurrentDate = currentTime;
  const returneduserResponse = userResponse;

  projectData.data.push({
    temperature: returnedTemp,
    currentDate: returnedcurrentDate,
    userResponse: returneduserResponse,
  });

  res.send(projectData);
});

app.get('/all', (req, res) => {
  res.send(projectData);
});

// Setup Server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`'App running on port ${port}`);
});
