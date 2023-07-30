import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import "dotenv/config";

import User from "../models/user.js";

import {HttpError} from "../helpers/index.js";

import {ctrlWrapper} from "../decorators/index.js";

const {JWT_SECRET} = process.env;

const signup = async( req, res )=> {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, "Email in use")
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({...req.body, password: hashPassword});

    res.status(201).json({
        user: {
            email:  newUser.email,
            subscription: newUser.subscription,
        }
    })   
}

const signin = async( req, res )=> {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "email or password invalid");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if(!passwordCompare) {
        throw HttpError(401, "email or password invalid")
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "29d"});
    await User.findByIdAndUpdate(user.id, {token});

    res.json({
        token,
        user: {
            email,
            subscription: user.subscription,
        },
    })
}

const getCurrent = (req, res)=> {
    const {email, subscription} = req.user;

    res.json({
        email, 
        subscription,

    })
}

const logout = async (req, res)=> {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});
    
    res.json({
        status: 204,
        message: "No Content",
    })
}

export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
}