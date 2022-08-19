import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Users from '../models/userModel.js';
dotenv.config()
const authCtrls = {

    // POST api/auth/register
    register: async (req, res) => {
        const { email, password, secret } = req.body;
        if(!email || !password || !secret) {
            return res.status(400).json({msg: 'Please fill in all the required fields.'})
        }
        if(!validateEmail(email)) {
            return res.status(400).json({msg: 'Invalid Email.'});
        }
        if(password.length < 6) {
            return res.status(400).json({msg: 'Password must be at least 6 characters.'});
        }
        const hashPwd = await bcrypt.hash(password, 10);
        try {
            const user = await Users.findOne({email});
            if(user) return res.status(401).json({msg: 'User already exists.'});
            const newUser = await Users({email, password: hashPwd, secret}).save();
            const {password: pwd, secret:sr,...orther} = newUser._doc;
            res.status(200).json({
                msg: 'Register successfully.',
                user: orther
            })
        } catch (error) {
            res.status(500).json({msg: error.message});
        }
    },

    // POST api/auth/login
    login: async (req, res) => {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({msg: 'Please fill in all the required fields.'})
        }
        try {
            const user = await Users.findOne({email});
            if(!user) {
                return res.status(401).json({msg: 'Not found user.'});
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) {
                return res.status(400).json({msg: 'Wrong password or email.'})
            }
            const accessToken = createAccessToken({_id: user._id});

            const { password: pwd, secret,...orther } = user._doc;
            res.status(200).json({user: orther, accessToken});
        } catch (error) {
            res.status(500).json({msg: error.message});
        }
    },
    // POST api/auth/logout
    logout: async (req, res) => {
        try {
            const user = await Users.findById(req.user._id);
            if(!user) return res.status(400).json({msg: 'Logout error.'});
            res.status(200).json({msg: 'Logout success.'});
        } catch (error) {
            res.status(500).json({msg: error.message});
        }
    },

    // POST api/auth/forgot_password
    forgotPassword: async (req, res) => {
        const { email, secret, password } = req.body;
        if(!email || !secret || !password) {
            return res.status(400).json({msg: 'Please fill in all the required fields.'})
        }
        if(!validateEmail(email)) {
            return res.status(400).json({msg: 'Invalid Email.'});
        }
        try {
            const user = await Users.findOne({email});
            if(!user) {
                return res.status(401).json({msg: 'Not found user.'});
            }
            if(user.secret !== secret) {
                return res.status(400).json({msg: 'Wrong secret answer.'});
            }
            const hashPwd = await bcrypt.hash(password, 10);
            const userUpdated = await Users.findByIdAndUpdate(user._id, {password: hashPwd});
            const { password: pwd, secret:sr,...orther} = userUpdated._doc;
            res.status(200).json({msg: 'Changed successfully.', user: orther});
        } catch (error) {
            res.status(500).json({msg: error.message});
        }
    },

    // POST api/auth/reset_password
    resetPassword: async (req, res) => {
        const { email, password, newPassword } = req.body;
        if(!email || !password || !newPassword) {
            return res.status(400).json({msg: 'Please fill in all the required fields.'})
        }
        try {
            const user = await Users.findOne({email});
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                return res.status(400).json({msg: 'Wrong password.'});
            }
            const hashPwd = await bcrypt.hash(newPassword, 10);
            const userUpdated = await Users.findByIdAndUpdate(user._id, {password: hashPwd});
            const {password: pwd, secret,...orther} = userUpdated._doc;
            res.status(200).json({msg: 'Change password successfully.', user: orther});
        } catch (error) {
            res.status(500).json({msg: error.message});
        }
    }
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function createAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '7d'});
}

export default authCtrls;