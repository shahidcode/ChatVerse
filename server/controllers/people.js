import User from '../models/User.js';

export const people = async(req,res) => {
    const offlinePeopleArr = await User.find({});
    res.json( offlinePeopleArr );
}