import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()
const auth = async (req, res, next) => {
    const headers = req.headers.authorization;
    const token = headers.split(' ')[1];
    if(!token) {
        return res.status(403).json({msg: 'Forbidden.'});
    }
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
            if(error) return res.status(500).json({msg: error.message});
            req.user = user;
            next();
        })
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export default auth;