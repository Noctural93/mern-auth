import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";

export const signup = async (request, response) => {
    const {username, email, password} = request.body;
    const hashedPassword = bcryptjs.hashSync(password, 10); 
    const newUser = new User({username, email, password: hashedPassword});
    try {
        await newUser.save();
        response.status(201).json({message: "User created successfully"});
    } catch (err) {
        response.status(500).json(err.message);
    }
};