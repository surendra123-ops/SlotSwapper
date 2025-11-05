import Event from '../models/Event.js';
import SwapRequest from '../models/SwapRequest.js';
import { emitToUser } from '../socket.js';

export const createSwapRequest = async (req, res) => {
  const io = req.app.get('io');
  const { mySlotId, theirSlotId } = req.body;
  if (!mySlotId || !theirSlotId) return res.status(400).json({ message: 'Missing slot ids' });

  const myEvent = await Event.findOne({ _id: mySlotId, userId: req.user.id });
  const theirEvent = await Event.findOne({ _id: theirSlotId });
  if (!myEvent || !theirEvent) return res.status(404).json({ message: 'Event not found' });
  if (String(theirEvent.userId) === String(req.user.id)) return res.status(400).json({ message: 'Cannot swap with yourself' });
  if (myEvent.status !== 'SWAPPABLE' || theirEvent.status !== 'SWAPPABLE') return res.status(400).json({ message: 'Events must be swappable' });

  const swap = await SwapRequest.create({
    requesterId: req.user.id,
    receiverId: theirEvent.userId,
    mySlotId,
    theirSlotId,
    status: 'PENDING'
  });

  myEvent.status = 'SWAP_PENDING';
  theirEvent.status = 'SWAP_PENDING';
  await myEvent.save();
  await theirEvent.save();

  emitToUser(io, theirEvent.userId, 'swap:requested', { swapId: swap._id });

  return res.status(201).json({ swap });
};

export const respondToSwap = async (req, res) => {
  const io = req.app.get('io');
  const { id } = req.params;
  const { accepted } = req.body;

  const swap = await SwapRequest.findById(id);
  if (!swap) return res.status(404).json({ message: 'Swap not found' });
  if (String(swap.receiverId) !== String(req.user.id)) return res.status(403).json({ message: 'Forbidden' });
  if (swap.status !== 'PENDING') return res.status(400).json({ message: 'Already handled' });

  const myEvent = await Event.findById(swap.mySlotId);
  const theirEvent = await Event.findById(swap.theirSlotId);
  if (!myEvent || !theirEvent) return res.status(404).json({ message: 'Events missing' });

  if (!accepted) {
    swap.status = 'REJECTED';
    await swap.save();
    myEvent.status = 'SWAPPABLE';
    theirEvent.status = 'SWAPPABLE';
    await myEvent.save();
    await theirEvent.save();
    emitToUser(io, swap.requesterId, 'swap:rejected', { swapId: swap._id });
    return res.json({ swap });
  }

  // Accept: swap owners
  swap.status = 'ACCEPTED';
  await swap.save();

  const requesterId = swap.requesterId;
  const receiverId = swap.receiverId;

  // myEvent belongs to requester; theirEvent belongs to receiver
  myEvent.userId = receiverId;
  theirEvent.userId = requesterId;
  myEvent.status = 'BUSY';
  theirEvent.status = 'BUSY';
  await myEvent.save();
  await theirEvent.save();

  emitToUser(io, requesterId, 'swap:accepted', { swapId: swap._id });
  emitToUser(io, receiverId, 'swap:accepted', { swapId: swap._id });

  return res.json({ swap });
};

export const listRequests = async (req, res) => {
  const incoming = await SwapRequest.find({ receiverId: req.user.id })
    .populate('requesterId', 'name email')
    .populate('mySlotId', 'title startTime endTime')
    .populate('theirSlotId', 'title startTime endTime')
    .sort({ createdAt: -1 });
  const outgoing = await SwapRequest.find({ requesterId: req.user.id })
    .populate('receiverId', 'name email')
    .populate('mySlotId', 'title startTime endTime')
    .populate('theirSlotId', 'title startTime endTime')
    .sort({ createdAt: -1 });
  return res.json({ incoming, outgoing });
};


