const express = require('express');
const router = express.Router();

// Sample route for getting current weather
router.get('/', (req, res) => {
  res.json({ message: 'Current weather data' });
});

module.exports = router;
