# SlotSwapper (MERN + JWT + Socket.io + Tailwind)

## Quick Start

### Backend
1. Copy env: rename `backend/env.example` to `.env` and set values.
2. Install deps and run:
```bash
cd backend
npm i
npm run dev
```

### Frontend
1. Copy env: rename `frontend/env.example` to `.env` and set values.
2. Install deps and run:
```bash
cd ../frontend
npm i
npm run dev
```

Open the shown URL (default http://localhost:5173). Ensure backend runs on PORT in backend `.env` (default 5000).

## Environment Variables

Backend `env.example`:
```
MONGO_URI=mongodb://127.0.0.1:27017/slotswapper
JWT_SECRET=supersecretchangeme
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

Frontend `env.example`:
```
VITE_API_URL=http://localhost:5000
```

## Features
- JWT auth (signup/login/me)
- Event CRUD (title, startTime, endTime, status)
- Marketplace of swappable slots
- Swap requests with accept/reject
- Real-time notifications via Socket.io

## API Summary
- POST `/api/auth/signup`, `/api/auth/login` => { token, user }
- GET `/api/auth/me`
- CRUD `/api/events`
- GET `/api/swappable-slots`
- GET `/api/requests`
- POST `/api/swap-request` { mySlotId, theirSlotId }
- POST `/api/swap-response/:id` { accepted }

## Notes
- Token sent as `Authorization: Bearer <token>`
- Socket authenticates via `handshake.auth.userId` (from logged-in user)
- On accept: owners of both events are swapped and status => BUSY


