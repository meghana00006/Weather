const express = require('express');  // Require express
const axios = require('axios');  // Import Axios to make HTTP requests
const cors = require('cors');  // Import CORS middleware

const app = express();  // Initialize the app

// Enable CORS
app.use(cors());

// Middleware to parse JSON data
app.use(express.json());

// In-memory store for favorites (this will be replaced with a database later)
let favorites = [];

// Create a route to fetch weather data
app.get('/weather', async (req, res) => {
  const city = req.query.city || 'Mumbai'; // Default city is Mumbai
  const apiKey = 'c8b2fcefa8bf357f4472e668abcb2a66'; // Replace with your actual API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    const weatherData = response.data;
    res.json({
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
      city: weatherData.name,
    });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch weather data' });
  }
});

// Route to add a city to favorites
app.post('/favorites', (req, res) => {
  const { city } = req.body;  // Get city from the request body

  if (!city) {
    return res.status(400).json({ error: 'City is required' });  // If no city is provided
  }

  // Add city to favorites list
  favorites.push(city);

  res.json({
    message: 'City added to favorites!',
    favorites: favorites,  // Return the updated favorites list
  });
});

// Set up the server to listen on a specific port
const port = 3000;  // You can change this to any available port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

