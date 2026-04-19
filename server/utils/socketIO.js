import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from '../models/Message.js';
import path from 'path';
import fs from 'fs';

export function socketIO(httpServer) {
  //online people
  const people = {};
  const socketIds = {};

  //create a new socket
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
    maxHttpBufferSize: 50 * 1024 * 1024, // To handle large file uploads
  });

  //when connection is established
  io.on("connection", (socket) => {

    console.log('user connected')

    const token = socket.handshake.auth.token;

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userData) => {
      if (err) return null;

      const { userId, username } = userData;
      socket.userId = userId;
      socket.username = username;
    });

    socket.on("addOnlinePeople", (id) => {
      people[id] = socket.username;
      socketIds[id] = socket.id;

      io.emit("getOnlinePeople", people);
    });

    socket.on("message", async (msg, callback) => {
      console.log('━━━ MESSAGE RECEIVED ━━━');
      console.log('Received message:', typeof msg);
      const msgData = typeof msg === 'string' ? JSON.parse(msg.toString()) : msg;
      console.log('Text:', msgData.text);
      console.log('Message has file:', !!msgData.file);
      
      const { recipient, text, file } = msgData;
      let fileName = null;

      if (file && file.data && file.name) {
        try {
          console.log('Processing file:', file.name);
          fileName = `${Date.now()}-${file.name}`;

          const __dirname = path.resolve();
          const filePath = __dirname + "/uploads/" + fileName;
          
          const base64Data = file.data.includes(',') 
            ? file.data.split(",")[1] 
            : file.data;
          
          console.log('Base64 length:', base64Data.length);
          const bufferData = Buffer.from(base64Data, "base64");
          console.log('Buffer size:', bufferData.length);

          fs.writeFileSync(filePath, bufferData);
          console.log("✓ File saved successfully:", filePath);
        } catch (error) {
          console.error("✗ Error saving file:", error.message);
          if (callback) callback({ success: false, error: `File save failed: ${error.message}` });
          return;
        }
      } else if (file) {
        console.log('File object incomplete:', { 
          hasData: !!file.data, 
          hasName: !!file.name, 
          keys: Object.keys(file || {}) 
        });
      }

      if (recipient && (text || file)) {
        console.log('Creating message in DB');
        try {
          const messageDB = await Message.create({
            sender: socket.userId,
            recipient,
            text,
            file: file ? fileName : null,
          });
          console.log('Message created:', messageDB._id);

          const recipientSocketId = socketIds[recipient];
          console.log('Recipient socket ID:', recipientSocketId);
          if (recipientSocketId) {
            socket.to(recipientSocketId).emit('getMessage', messageDB);
            console.log('Message sent to recipient');
          } else {
            console.log('Recipient not connected');
          }

          if (callback) callback({ success: true, message: messageDB });
        } catch (error) {
          console.error('Message DB error:', error);
          if (callback) callback({ success: false, error: error.message });
        }
      } else if (callback) {
        callback({ success: false, error: 'Missing recipient or message content' });
      }
    });

    //when socket disconnects, 
    socket.on("disconnect", () => {
      console.log('user diconnected');
      delete people[socket.userId];
      delete socketIds[socket.userId];
      io.emit("getOnlinePeople", people);
    });

  });

}
