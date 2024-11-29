const express = require('express'); 
const app = express();
const axios = require('axios');

// Middleware to parse JSON data
app.use(express.json());

// Store favorite cities in memory (this can be updated later for database integration)
let favorites = [];

// Define your API key here
const apiKey = '11497f3e784d662c8d36c031adc2879b';  // Replace with your actual API key

// Route to fetch weather data and handle unit preferences
app.get('/weather', async (req, res) => {
  const city = req.query.city || 'Mumbai';
  const units = req.query.units === 'imperial' ? 'imperial' : 'metric'; // Fahrenheit if 'imperial'

  try {
    // Get city coordinates (latitude and longitude)
    const cityDataUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
    const cityDataResponse = await axios.get(cityDataUrl);
    const { lat, lon } = cityDataResponse.data.coord;

    // Fetch 5-day forecast data with units and location (free plan supports this)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    const forecastResponse = await axios.get(forecastUrl);

    // Extract necessary data for the current weather
    const currentWeather = {
      temperature: cityDataResponse.data.main.temp,
      description: cityDataResponse.data.weather[0].description,
      city: cityDataResponse.data.name,
      units: units === 'metric' ? 'Celsius' : 'Fahrenheit', // Update the unit for current weather
    };

    // Extract necessary data for the 5-day forecast (max and min temperatures for each day)
    const forecastData = forecastResponse.data.list.filter(forecast => forecast.dt_txt.includes('12:00:00')) // Filter for daily forecasts at noon
      .map(forecast => ({
        date: new Date(forecast.dt * 1000).toISOString().split('T')[0], // Convert to readable date format
        temperature: {
          min: forecast.main.temp_min,
          max: forecast.main.temp_max,
        },
        description: forecast.weather[0].description,
      }));

    // Respond with the current weather and forecast data
    res.json({
      currentWeather,
      forecast: forecastData,
      units: units === 'metric' ? 'Celsius' : 'Fahrenheit',
    });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch weather data' });
  }
});

// Add city to favorites
app.post('/favorites', (req, res) => {
  const { city } = req.body;
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }
  favorites.push(city);
  res.json({ message: 'City added to favorites!', favorites });
});

// Set up the server to listen on a specific port
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
