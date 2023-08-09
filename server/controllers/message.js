import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Message from '../models/Message.js';

dotenv.config();

async function getOurId(req){

  return new Promise((resolve, reject) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, {}, (err, userData) => {
        if (err) throw err;
        resolve(userData);
      });
    } else {
      reject('no token');
    }
  });

}

export const message = async (req, res)=> {
    const {selectedUserId} = req.params; 
    const {userId} = await getOurId(req);
    
    try{
      const messages = await Message.find({
        sender : {$in : [selectedUserId, userId] },   //fetch only those messages between us and selected user id. 
        recipient : { $in : [selectedUserId, userId] }
      }).sort({ createdAt : 1 });
    
      res.json( messages );
  }
  catch(err){
    console.log('unique err msg',err.message);
  }
}