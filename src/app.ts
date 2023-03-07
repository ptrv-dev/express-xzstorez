import express from 'express';
import dotenv from 'dotenv';

// Dotenv config
dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(5004, () => {
  console.log('Server started');
});
