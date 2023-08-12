import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar"
import path from "path"
import "dotenv/config";
import fs from "fs/promises";
import { nanoid } from "nanoid";
import User from "../models/user.js";
import {HttpError, sendEmail} from "../helpers/index.js";
import {ctrlWrapper} from "../decorators/index.js";

const {JWT_SECRET, BASE_URL} = process.env;

const avatarsDir = path.resolve("public", "avatars")

const signup = async( req, res )=> {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, "Email in use")
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const avatarURL = gravatar.url(email); 
    const verificationToken = nanoid();

    const newUser = await User.create({...req.body, password: hashPassword, avatarURL, verificationToken});
   
    const verifyEmail = {
        to: email, subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`
    };
    
    await sendEmail(verifyEmail);

    res.status(201).json({
        user: {
            email:  newUser.email,
            subscription: newUser.subscription,
            // avatar,
        }
    })   
}

const verifyEmail = async(req, res)=> {   
    const {verificationToken} = req.params;
    const user = await User.findOne({verificationToken});
    if(!user){
        throw HttpError(404, "User not found");
    }
    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: "" });

    res.json ({
        message: "Verification successful",
    })
}

const resendVerifyEmail = async(req, res)=> {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw HttpError(404, "User not found")
    }
    if(user.verifyEmail) {
        throw HttpError(400, "Verification has already been passed")
    }
    const verifyEmail = {
        to: email, subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a>`
    };

    await sendEmail(verifyEmail);

    res.json({
        message: "Email resend" 
    })   
} 

const signin = async( req, res )=> {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "email or password invalid");
    }

    if(!user.verify) {
        throw HttpError(404, "User not Found");
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
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
}