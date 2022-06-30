import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config.js';

const app = express();
const port = 8000;

import users from './app/users.js';

const run = async () => {
  await mongoose.connect(config.db.url + config.db.name, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.use(express.json());
  app.use(cors());
  app.use(express.static('public'));
  app.use('/users', users);

  app.listen(port, () => {
    console.log(`server run on ${port} port`);
  });
};

run().catch(console.log);
