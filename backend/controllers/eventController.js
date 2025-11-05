import Event from '../models/Event.js';

export const listMyEvents = async (req, res) => {
  const events = await Event.find({ userId: req.user.id }).sort({ startTime: 1 });
  return res.json({ events });
};

export const createEvent = async (req, res) => {
  const io = req.app.get('io');
  const { title, startTime, endTime, status } = req.body;
  if (!title || !startTime || !endTime) return res.status(400).json({ message: 'Missing fields' });
  const event = await Event.create({ title, startTime, endTime, status: status || 'BUSY', userId: req.user.id });
  
  // Broadcast new event creation (only if SWAPPABLE, so marketplace can update)
  if (io && event.status === 'SWAPPABLE') {
    io.emit('event:created', { eventId: event._id.toString() });
  }
  
  return res.status(201).json({ event });
};

export const updateEvent = async (req, res) => {
  const io = req.app.get('io');
  const { id } = req.params;
  const event = await Event.findOne({ _id: id, userId: req.user.id });
  if (!event) return res.status(404).json({ message: 'Not found' });
  
  const oldStatus = event.status;
  const updatable = ['title', 'startTime', 'endTime', 'status'];
  for (const key of updatable) if (req.body[key] !== undefined) event[key] = req.body[key];
  await event.save();
  
  // Broadcast if status changed (affects marketplace visibility)
  if (io && (oldStatus !== event.status || req.body.status !== undefined)) {
    io.emit('event:updated', { 
      eventIds: [event._id.toString()],
      status: event.status
    });
  }
  
  return res.json({ event });
};

export const deleteEvent = async (req, res) => {
  const io = req.app.get('io');
  const { id } = req.params;
  const event = await Event.findOneAndDelete({ _id: id, userId: req.user.id });
  if (!event) return res.status(404).json({ message: 'Not found' });
  
  // Broadcast to all connected users that an event was deleted
  if (io) {
    io.emit('event:deleted', { eventId: id, userId: req.user.id });
  }
  
  return res.json({ ok: true });
};

export const listSwappableFromOthers = async (req, res) => {
  // Only show swappable slots from others that are not pending
  const events = await Event.find({ 
    userId: { $ne: req.user.id }, 
    status: 'SWAPPABLE' // Exclude SWAP_PENDING - those are already in a swap
  })
    .populate('userId', 'name email')
    .sort({ startTime: 1 });
  return res.json({ events });
};


