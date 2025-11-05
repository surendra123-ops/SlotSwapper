// Maps userId to socket ids
const userIdToSocketIds = new Map();

export const registerSocketHandlers = (io, socket) => {
  const { userId } = socket.handshake.auth || {};
  if (userId) {
    if (!userIdToSocketIds.has(userId)) userIdToSocketIds.set(userId, new Set());
    userIdToSocketIds.get(userId).add(socket.id);
  }

  socket.on('disconnect', () => {
    if (userId && userIdToSocketIds.has(userId)) {
      userIdToSocketIds.get(userId).delete(socket.id);
      if (userIdToSocketIds.get(userId).size === 0) userIdToSocketIds.delete(userId);
    }
  });
};

export const emitToUser = (io, userId, event, payload) => {
  const socketIds = userIdToSocketIds.get(String(userId));
  if (!socketIds) return;
  for (const sid of socketIds) io.to(sid).emit(event, payload);
};


