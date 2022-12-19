import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const mongoUri =
  process.env.MONGO_URI ||
  'mongodb+srv://admin:qwerty123456@cluster0.mulnvjg.mongodb.net/?retryWrites=true&w=majority';
const dbName = process.env.mongoDBName || 'blogPlatform';

export async function runDB() {
  try {
    await mongoose.connect(mongoUri, { dbName });
    console.log(`Connected successfully to mongo server: ${mongoUri}`);
  } catch {
    console.log('Can`t connect to db');
    await mongoose.disconnect();
  }
}
