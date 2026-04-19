# ChatVerse
A real-time chat application built with React, Socket.io, Node.js, and MongoDB.

## Tech Stack
- Frontend: Vite + ReactJS + Tailwind CSS
- Backend: Node.js + Express + Socket.io
- Database: MongoDB

## Folder structure
```
ChatVerse/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── ChildRoutes.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── components/
│       │   └── chat/
│       │       ├── ChatPage.jsx
│       │       └── Contacts/
│       │           ├── Avatar.jsx
│       │           ├── Contacts.jsx
│       │           └── Conversations/
│       │               └── Conversations.jsx
│       ├── contexts/
│       │   └── UserContext.jsx
│       └── utils/
│           └── backend.js
├── server/
│   ├── index.js
│   ├── package.json
│   ├── vercel.json
│   ├── controllers/
│   │   ├── auth.js
│   │   ├── message.js
│   │   └── people.js
│   ├── middlewares/
│   │   └── verifyUser.js
│   ├── models/
│   │   ├── Message.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── message.js
│   │   └── people.js
│   ├── uploads/
│   └── utils/
│       └── socketIO.js
└── README.md
```

## Setup and run
### 1. Backend
```bash
cd server
yarn install
```
Create a `.env` file in `server/` with:
```env
MONGO_URL=<your-mongodb-connection-string>
JWT_SECRET_KEY=<your-jwt-secret>
CLIENT_URL=http://localhost:5173
PORT=3000
```
Start the backend:
```bash
yarn start
```

### 2. Frontend
```bash
cd ../client
yarn install
```
Create a `.env` file in `client/` with:
```env
VITE_BACKEND_URL=http://localhost:3000
```
Start the frontend:
```bash
yarn run dev
```
