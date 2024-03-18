import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../util/error.js";
import Jwt from "jsonwebtoken";

export const signup = async (request, response, next) => {
    const {username, email, password} = request.body;
    const hashedPassword = bcryptjs.hashSync(password, 10); 
    const newUser = new User({username: username, email, password: hashedPassword});
    try {
        await newUser.save();
        response.status(201).json({message: "User created successfully"});
    } catch (err) {
        next(err);
        // next(errorHandler, "smoething went wrong");
    }
};

export const signin = async (request, response, next) => {
    const {email, password} = request.body;
    try {
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404, 'User not found'));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword) return next(errorHandler(401, 'worng credentials'));
        const token = Jwt.sign({id: validUser._id}, process.env.JWT_SECRET); // process.env.jwt_secret is extra security
        const {password: hashedPassword, ...rest} = validUser._doc;
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour
        response.cookie('token', token, {httpOnly: true, expires: expiryDate}).status(200).json(rest);
    } catch (err) {
        next(err)
    }
};

export const google = async (request, response, next) => {
    try {
        const user = await User.findOne({email: request.body.email});
        if(user) {
            const token = Jwt.sign({id: user._id}, process.env.JWT_SECRET);
            const {password: hashedPassword, ...rest} = user._doc;
            const expiryDate = new Date(Date.now() + 3600000);
            response.cookie('token', token, {httpOnly: true, expires: expiryDate}).status(200).json(rest);
        }else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const randomNum = Math.floor(Math.random() * 10000).toString();
            const newUser = new User({username: request.body.name.split(" ").join("").toLowerCase() + randomNum, email: request.body.email, password: hashedPassword, profilePicture: request.body.photo});
            await newUser.save();
            const token = Jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
            const {password: hashedPassword2, ...rest} = newUser._doc;
            const expiryDate = new Date(Date.now() + 3600000);
            response.cookie('token', token, {httpOnly: true, expires: expiryDate}).status(200).json(rest);
        }
    }catch(error){
        next(error);
    }
};

export const signout = (request, response) => {
    response.clearCookie('token').status(200).json('Signout success!');
}