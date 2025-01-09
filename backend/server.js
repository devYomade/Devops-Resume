require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;
const COUNTRIES_API_BASE_URL = process.env.COUNTRIES_API_BASE_URL || 'https://restcountries.com/v3.1';

// Middleware
app.use(cors());
app.use(express.json());

// DB connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the 'destinations' table if it doesn't exist
const createTableQuery = `
CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  country VARCHAR(100) NOT NULL,
  capital VARCHAR(100),
  population INTEGER,
  region VARCHAR(100)
);`;

// Ensure the table exists when the server starts
pool.query(createTableQuery)
  .then(() => console.log('Destinations table is ready'))
  .catch((err) => console.error('Error creating destinations table:', err));

// Routes
app.get('/api/destinations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM destinations ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/destinations/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM destinations WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/destinations', async (req, res) => {
  const { country } = req.body;
  try {
    const response = await axios.get(`${COUNTRIES_API_BASE_URL}/name/${country}`);
    const countryInfo = response.data[0];

    const result = await pool.query(
      'INSERT INTO destinations (country, capital, population, region) VALUES ($1, $2, $3, $4) RETURNING *',
      [country, countryInfo.capital ? countryInfo.capital[0] : null, countryInfo.population, countryInfo.region]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/destinations/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM destinations WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json({ message: 'Destination deleted', destination: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.status(200).send("Server is working");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
