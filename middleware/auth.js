import User from '../models/User.js';

const auth = async (req, res, next) => {
  let token = req.get('Authenticate');
  if (!token) return res.status(400).send({ error: 'Token not provided' });

  let user = await User.findOne({ token });
  if (!user) return res.status(401).send({ error: 'Unauthorized' });

  req.user = user;
  next();
};

export default auth;
