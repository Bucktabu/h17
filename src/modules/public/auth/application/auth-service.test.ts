import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

//jest.setTimeout(100000000)

describe('Integration test for auth service', () => {
  let mongoServer: MongoMemoryServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
});
