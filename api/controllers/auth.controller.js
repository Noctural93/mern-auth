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
}