const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'movies.db',
});

const Movie = sequelize.define('Movie', {
  title: DataTypes.STRING,
  yearOfRelease: DataTypes.INTEGER,
  synopsis: DataTypes.TEXT,
});

sequelize.sync().then(async () => {
  console.log('Database synced');

  try {
    await Movie.bulkCreate([
      {
        title: 'Inception',
        yearOfRelease: 2010,
        synopsis: 'A thief who enters the dreams of others to steal their secrets.'
      },
      {
        title: 'Interstellar',
        yearOfRelease: 2014,
        synopsis: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.'
      },
      {
        title: 'The Dark Knight',
        yearOfRelease: 2008,
        synopsis: 'When the menace known as The Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.'
      }
    ]);
    console.log('Example data inserted successfully');
  } catch (error) {
    console.error('Error inserting example data:', error);
  }
});

const app = express();
app.use(express.json());

app.post('/movies', async (req, res) => {
  try {
    const { title, yearOfRelease, synopsis } = req.body;
    const movie = await Movie.create({ title, yearOfRelease, synopsis });
    res.status(201).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/movies', async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const { rows: movies, count: total } = await Movie.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    res.json({ data: movies, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByPk(id);
    if (!movie) {
      res.status(404).json({ error: 'Movie not found' });
    } else {
      res.json(movie);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
  
    const movie = await Movie.findByPk(id);
    if (!movie) {
      res.status(404).json({ error: 'Movie not found' });
    } else {
      await movie.destroy();
      res.json({ message: 'Movie deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});