import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar"
import path from "path"
import "dotenv/config";
import fs from "fs/promises";
import User from "../models/user.js";
import {HttpError} from "../helpers/index.js";
import {ctrlWrapper} from "../decorators/index.js";

const {JWT_SECRET} = process.env;

const avatarsDir = path.resolve("public", "avatars")

const signup = async( req, res )=> {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, "Email in use")
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const avatarURL = gravatar.url(email); 

    const newUser = await User.create({...req.body, password: hashPassword, avatarURL});

    res.status(201).json({
        user: {
            email:  newUser.email,
            subscription: newUser.subscription,
            // avatar,
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
    res.status(204).send({message: "No Content"})
}

const updateAvatar = async (req ,res) => {
    const {_id} = req.user;
    const {path: tmpUpload, originalname} = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tmpUpload, resultUpload)

    const avatarURL = path.join("avatars", filename)
    await User.findByIdAndUpdate(_id, {avatarURL});

    res.json({
        avatarURL,
    })
}

export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}