import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';

export const verifyUser = (req,res)=>{

    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if( token == null ) return res.status(401).json({msg:'no token found'});

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if(err) return res.status(403).json('invalid token');
        
        return res.status(200).json({
            id : user.userId,
            username : user.username
        });
    });
}