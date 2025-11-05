import Event from '../models/Event.js';

export const listMyEvents = async (req, res) => {
  const events = await Event.find({ userId: req.user.id }).sort({ startTime: 1 });
  return res.json({ events });
};

export const createEvent = async (req, res) => {
  const { title, startTime, endTime, status } = req.body;
  if (!title || !startTime || !endTime) return res.status(400).json({ message: 'Missing fields' });
  const event = await Event.create({ title, startTime, endTime, status: status || 'BUSY', userId: req.user.id });
  return res.status(201).json({ event });
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const event = await Event.findOne({ _id: id, userId: req.user.id });
  if (!event) return res.status(404).json({ message: 'Not found' });
  const updatable = ['title', 'startTime', 'endTime', 'status'];
  for (const key of updatable) if (req.body[key] !== undefined) event[key] = req.body[key];
  await event.save();
  return res.json({ event });
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const event = await Event.findOneAndDelete({ _id: id, userId: req.user.id });
  if (!event) return res.status(404).json({ message: 'Not found' });
  return res.json({ ok: true });
};

export const listSwappableFromOthers = async (req, res) => {
  const events = await Event.find({ userId: { $ne: req.user.id }, status: 'SWAPPABLE' }).sort({ startTime: 1 });
  return res.json({ events });
};


