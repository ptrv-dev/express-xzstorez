import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(5004, () => {
  console.log('Server started');
});
