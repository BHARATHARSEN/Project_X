import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import crypto from "crypto";
import {getResetPasswordTemplate} from "../utils/emailTemplates.js";
import sendEmail from "../utils/sendEmail.js";
import { upload_file } from "../utils/cloudinary.js";


// ---------------------------------------------------------------------------------------------------------



// Register User - /api/v1/register

export const registerUser = catchAsyncErrors(async(req,res,next) => {

    const{ name, email, password} = req.body ;

    const user = await User.create({
        name, email, password,

    });

    //Check if password is correct

    sendToken(user, 201, res);

});

// ---------------------------------------------------------------------------------------------------------
// Login User - /api/v1/login

export const loginUser = catchAsyncErrors(async(req,res,next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  //Finding user in the database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email & password", 400));
  }

  //Check if password is correct
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email & password", 400));
  }

  sendToken(user, 200, res);
});

// ==========================LOGOUT USER=======================

export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    message: "Logged Out",
  });
});


// ==========================Upload AVATAR==============/API/V1/ME/UPLOAD_AVATAR=====

export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
  const avatarResponse = await upload_file(req.body.avatar, "Project_X/avatars")

  const user = await User.findByIdAndUpdate(req?.user?._id, {
    avatar : avatarResponse,
  });
  res.status(200).json({
    user,
  });
});




//-------------------------------FORGOT PASSWORD------------------------------------------------------




export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //Finding user in the database
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  //get reset Password token 
  const resetToken = user.getResetPasswordToken();

  await user.save();

  // creating user reset password URL
  const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;

  const message = getResetPasswordTemplate(user?.name, resetUrl);

  try {

    sendEmail({
      email : user.email,
      subject : "Project_X Password Recovery",
      message,
    });

    res.status(200).json({
      message :`Email has been sent to : ${user.email} `,
    })

    
  } catch (error) {

    user.resetPasswordToken = undefined; 
    user.resetPasswordExpire = undefined;

    await user.save();
    return next(new ErrorHandler(error?.message, 500));
    
  }

  
});

// --------------------------------RESET PASSWORD--------------------------------------------------------------------

export const resetPassword = catchAsyncErrors(async (req, res, next) => {

  //Hashing the URL token
  const resetPasswordToken = crypto
  .createHash("sha256")
  .update(req.params.token)
  .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire : { $gt : Date.now()}
  })

  if (!user) {
    return next(new ErrorHandler("Password reset token is invalid or has been expired", 400));
  }

  if(req.body.password !== req.body.confirmPassword){
    return next(
      new ErrorHandler(
        "Password doesn't match",
        400
      )
    );
  }
    // setting the new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);





});

// =====================================================================================================

export const getUserProfile = catchAsyncErrors(async (req, res, next) => {

  const user = await User.findById(req?.user?._id);

  res.status(200).json({
    user,
  });



});


export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  
  const user = await User.findById(req?.user?._id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if(!isPasswordMatched){
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  user.password = req.body.password;
  user.save();

  res.status(200).json({
    success : true,
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {

  const newUserData = {
    name : req.body.name,
    email : req.body.email,
  }
  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {new:true});

  res.status(200).json({
    user,
  })

});

export const allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    users,
  });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User can't be found with id : ${req.params.id}`, 404))
  }

  res.status(200).json({
    user,
  });
});

// ================Admin Update User Details ====================

export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
  });

  res.status(200).json({
    user,
  });
});

//---------------------------------------------------------------------------

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User can't be found with id : ${req.params.id}`, 404)
    );
  }

  // TODO in future remove avatar from cloudinary

  user.deleteOne();

  res.status(200).json({
    success : true
  });
});

