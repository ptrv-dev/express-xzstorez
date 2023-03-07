import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';

// Dotenv config
dotenv.config();

// constants
const PORT = process.env.PORT || 5004;

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const app = express();

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(5004, () => {
  console.log('Server started');
});
