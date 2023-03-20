import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import dotenv from 'dotenv';

import routes from './routes';
import mongoose from 'mongoose';

// dotenv config
dotenv.config();

// constants
const PORT = process.env.PORT || 5004;
export const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

export const upload = multer({ storage });

// express config
const app = express();
app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://admin.xzstorez.com',
      'http://xzstorez.com',
      'https://admin.xzstorez.com',
      'https://xzstorez.com',
    ],
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static('./uploads'));

routes(app);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

async function mongodbConnect() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/shop');
    console.log('MongoDB connected');
  } catch (error) {
    console.log(`[Error] MongoDB connecting error!\n${error}\n`);
  }
}
mongodbConnect();
