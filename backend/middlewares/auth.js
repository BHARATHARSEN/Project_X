// checks if user is authenticated or not

import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {

    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler ("Login to access the resource", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id)

    next();

})

export const authorizeRoles = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`${req.user.role} is cannot access this resource`, 403));
        }

        next();

    }

}