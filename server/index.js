//node version 14+ doesn't uses require syntax any more.
import dotenv from 'dotenv';
dotenv.config();

//imports
import express from 'express';
import cors from 'cors';
import mongoose, { connect } from 'mongoose';
import { socketIO } from './utils/socketIO.js';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/message.js';
import peopleRoutes from './routes/people.js';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

//db connection
mongoose.connect(process.env.MONGO_URL)
.then( ()=>console.log("db connected") )
.catch( (err)=>console.log(err) );

//middlewares
app.use(express.json({ limit: '20mb' }));       //recognize the incoming Request Object as a JSON Object  //'urlencoded' recognizes the incoming Request Object as strings or arrays.
app.use(cors({
    origin : process.env.CLIENT_URL,
    credentials : true
}))
app.use('/uploads', express.static( path.resolve() + '/uploads'));  //'__dirname is no longer supported, so use path.resolve()'
app.use('/auth',authRoutes);
app.use('/messages',messageRoutes);
app.use('/people',peopleRoutes);

const server =  app.listen(port,()=>console.log('listening to port 3000'));
socketIO( server ); 
