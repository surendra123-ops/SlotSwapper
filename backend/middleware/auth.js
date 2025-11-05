import jwt from 'jsonwebtoken';

export const authRequired = (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.user = { id: payload.id };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const signToken = (user) => {
  const payload = { id: String(user._id), email: user.email };
  return jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
};


