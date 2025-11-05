import User from '../models/User.js';
import { signToken } from '../middleware/auth.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });
    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ name, email, passwordHash });
    const token = signToken(user);
    return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user);
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    return res.json({ user });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};


