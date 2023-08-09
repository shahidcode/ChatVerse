import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from '../models/Message.js';
import path from 'path';
import fs from 'fs';

export function socketIO(httpServer) {
  //online people
  let people = {};

  //create a new socket
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
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

      io.emit("getOnlinePeople", people);
    });

    socket.on("message", async (msg) => {
      const msgData = JSON.parse(msg.toString());
      const { recipient, text, file } = msgData;
      let fileName = null;

      if (file) {
        fileName = `${Date.now() + "-" + file.name}`;

        const __dirname = path.resolve();
        const filePath = __dirname + "/uploads/" + fileName;
        const bufferData = Buffer.from(file.data.split(",")[1], "base64");

        fs.writeFile(filePath, bufferData, () => {
          console.log("file saved:" + filePath);
        });
      }
      if (recipient && (text || file)) {
        //add messages to db
        const messageDB = await Message.create({
          sender: socket.userId,
          recipient,
          text,
          file: file ? fileName : null,
        });

        //send message to client(current user -> selected user only)
        Object.keys(people).filter( ( id ) => id === recipient && io.emit('getMessage' ,{
          text,
          recipient,
          sender : socket.userId,
          file : file ? fileName : null,
          _id : messageDB._id
        }) )
      }
    });

    //when socket disconnects, 
    socket.on("disconnect", () => {
      console.log('user diconnected');
      delete people[socket.userId]
      io.emit("getOnlinePeople", people);
    });

  });

}
