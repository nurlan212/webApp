import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import config from './config.js';

import User from './models/User.js';
mongoose.connect(config.db.url + config.db.name, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.once('open', async () => {
  try {
    db.dropCollection('users');
  } catch (err) {
    console.log('Collection were not presented. Skipping drop');
  }

  await User.create(
    {
      username: 'user1',
      email: 'user1@asd.asd',
      image: 'user1.jpg',
      sex: 'male',
      birthdate: new Date(2001, 5, 6),
      password: '123',
      token: nanoid(),
    },
    {
      username: 'user2',
      email: 'user2@asd.asd',
      image: 'user2.jpg',
      sex: 'male',
      birthdate: new Date(2003, 1, 12),
      password: '123',
      token: nanoid(),
    }
  );

  await db.close();
});
