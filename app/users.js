import express from 'express';
import fs from 'fs';
import User from '../models/User.js';
import multer from 'multer';
import config from '../config.js';
import path from 'path';
import { nanoid } from 'nanoid';
import auth from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, nanoid() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    let user = new User({
      username: req.body.username,
      email: req.body.email,
      sex: req.body.sex,
      birthdate: req.body.birthdate,
      password: req.body.password,
    });
    if (req.file) {
      user.image = req.file.filename;
    }
    user.generateToken();
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/me', auth, async (req, res) => {
  let token = req.get('Authenticate');
  try {
    const user = await User.findOne({ token });
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.put('/edit', [auth, upload.single('image')], async (req, res) => {
  let token = req.get('Authenticate');
  try {
    let curUser = await User.findOne({ token });
    curUser.username = req.body.username;
    curUser.password = req.body.password;
    if (curUser.image)
      await fs.unlinkSync(path.join(config.uploadPath, curUser.image));
    if (req.file) {
      curUser.image = req.file.filename;
    }
    await curUser.save();
    res.send(curUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/people', auth, (req, res) => {
  let token = req.get('Authenticate');
  try {
    const users = User.find({ token: { $ne: token } });
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/sessions', async (req, res) => {
  try {
    let user = await User.findOne({ username: req.body.username });
    if (!user)
      return res.status(401).send({ error: 'Username or password are wrong!' });

    const isMatch = await user.checkPassword(req.body.password);
    if (!isMatch)
      return res.status(401).send({ error: 'Username or password are wrong!' });

    user.generateToken();
    await user.save();

    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/sessions', async (req, res) => {
  const success = { message: 'Success!' };
  let token = req.get('Authenticate');
  if (!token) return res.send(success);

  const user = await User.findOne({ token });
  if (!user) return res.send(success);

  user.generateToken();
  try {
    await user.save({ validateBeforeSave: false });
    res.send(success);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
