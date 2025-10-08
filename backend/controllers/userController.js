import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// @desc Register a new user
// @route POST /api/users/register
export const registerUser = asyncHandler(async (req, res) => {
    // console.log(req);
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  // console.log(userExists);
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
});

// @desc Login user
// @route POST /api/users/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc Logout user
// @route POST /api/users/logout
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: 'Logged out' });
});


// @desc Get user by ID
// @route GET /api/users/getuser
export const getUserById = asyncHandler(async (req, res) => {
  const {userId} = req.query
  if(!userId){
    res.status(400);
    throw new Error('User ID is required');
  }
  const user = await userId.findById(userId).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
  
});
// export const getUserById = asyncHandler(async (req, res) => {
//   const {userId} = req.query
//   console.log(userId, req.user);
//   if(req.user._id.equals(userId)){
//     const user = await User.findById(userId).select('-password');
//   if (user) {
//     res.json(user);
//   } else {
//     res.status(404);
//     throw new Error('User not found');
//   }
//   }else{
//     res.status(403);
//     console.log(userId, req.user._id);
//     throw new Error('Not authorized to access this user');
//   }
  
// });


// @desc Get user profile
// @route GET /api/users/profile

export const getUserProfile = asyncHandler(async(req,res)=>{
  res.json(req.user);
})