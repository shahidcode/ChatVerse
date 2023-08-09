import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET_KEY;
const salt = bcryptjs.genSaltSync(10);

export const signUp = async(req,res)=>{

    const {username,password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password,salt);

    try{
        const createdUser = await User.create({
            username,
            password: hashedPassword
        });
        
        console.log("user created successfully");
        return res.status(200).json({msg:"Account Created"})
    }
    catch(error){
        console.log("user creating failed = ",error);
        res.status(500).json({msg:error.message});
    }
}

//authentication
export const signIn = async(req,res)=>{
    try{
        const {username, password} = req.body;
        const userFound = await User.findOne({username});
        const passwordMatches = bcryptjs.compareSync(password,userFound.password);

        if( !userFound ) {
            return res.status(403).json({ msg:'user not found' });
        }

        if( !passwordMatches ) {
            return res.status(401).json({ msg: 'invalid credentials' });
        }

        const token = jwt.sign( { userId : userFound._id, username : userFound.username }, jwtSecret );
        return res.status(200).json({
            msg : 'logged in',
            token,
            userId : userFound._id,
        })
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
}