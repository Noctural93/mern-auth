import Jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (request, response, next) => {
    const token = request.cookies.token;

    // if(!token) return response.status(401).json("You need to Login");
    if(!token) return next(errorHandler(401, 'You are not authenticated!'));


    Jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        // if(error) return response.status(403).json("Token is not valid");
        if(error) return next(errorHandler(403, 'Token is not valid!'));

        request.user = user;
        next();
    });
}