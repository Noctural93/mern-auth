import User from "../models/user.models.js";
import { errorHandler } from "../util/error.js";
import bcryptjs from 'bcryptjs';

export const test = (request, response) => {
    response.json({
        message: 'API is working',
    });
};

// update user

export const updateUser = async (request, response, next) => {
    if(request.user.id !== request.params.id) {
        // return response.status(401).json("You can update only your account!");
        return next(errorHandler(401, 'You can update only your account!'));
    }
    try {
        if(request.body.password) {
            request.body.password = bcryptjs.hashSync(request.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            request.params.id, {
                $set: {
                    username: request.body.username,
                    email: request.body.email,
                    password: request.body.password,
                    profilePicture: request.body.profilePicture,
                }
            },
            {new: true}
        );
        const {password, ...rest} = updatedUser._doc;
        response.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}