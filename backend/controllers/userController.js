import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Otp from "../models/otpModel.js";

// @desc Register a new user
// @route POST /api/users/register

// export const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password, profession, interests, forPeople, bio } = req.body;

//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     res.status(400);
//     throw new Error("User already exists");
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const user = await User.create({
//     name,
//     email,
//     password: hashedPassword,
//     profession,
//     interests,
//     forPeople,
//     bio
//   });

//   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//     expiresIn: "30d",
//   });

//   res.cookie("jwt", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//   });

//   res.status(201).json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     profession: user.profession,
//     interests: user.interests,
//     forPeople: user.forPeople,
//     bio: user.bio,
//   });
// });
import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";

// Initialize Brevo
const brevoApi = new TransactionalEmailsApi();
brevoApi.authentications.apiKey.apiKey = process.env.BREVO_API_KEY;

// STEP 1 – Send OTP
export const registerStep1 = asyncHandler(async (req, res) => {
  const { name, email, password, profession, interests, forPeople, bio } =
    req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Remove old OTP if exists
  // const existingOtp = await Otp.findOne({ email });
  // if (existingOtp) await existingOtp.deleteOne();

  const existingOtp = await Otp.findOne({ email });
  if (existingOtp && existingOtp.expiresAt > new Date()) {
    // OTP is still valid
    console.log("OTP already sent and not expired");
    return res.status(200).json({
      message: "An OTP has already been sent. Please check your email.",
      code: "1",
    });
  }

  // Otherwise, proceed to delete old OTP and send a new one
  if (existingOtp) await existingOtp.deleteOne();

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP in DB
  await Otp.create({
    email,
    otp,
    data: {
      name,
      email,
      password: hashedPassword,
      profession,
      interests,
      forPeople,
      bio,
    },
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });

  // Email Content
  // Email Content
  const mail = new SendSmtpEmail();
  mail.sender = { name: "WisdomWell", email: "pg2413@srmist.edu.in" };
  mail.to = [{ email }];
  mail.subject = "Your WisdomWell Registration OTP";

  // Professional HTML content
  mail.htmlContent = `
  <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #f9fafb;">
    
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: #4f46e5;">Welcome to <span style="color:#10b981;">WisdomWell</span>!</h1>
      <p style="color: #6b7280; font-size: 16px;">We're excited to have you onboard. Your journey to knowledge and growth starts here.</p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <p style="font-size: 18px; color: #374151;">Here is your OTP to complete your registration:</p>
      <p style="font-size: 28px; font-weight: bold; color: #4f46e5; letter-spacing: 2px;">${otp}</p>
      <p style="color: #6b7280;">This OTP will expire in 10 minutes.</p>
    </div>

    <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
      <p style="color: #374151; font-size: 14px;">
        Best regards,<br/>
        <strong>Praveen Kumar</strong><br/>
        Founder, <strong>Workfys.in</strong><br/>
        Bringing your ideas to life with technology and innovation.
      </p>
    </div>

    <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">
      If you did not request this OTP, please ignore this email.
    </p>
  </div>
`;

  // Send Email
  try {
    const response = await brevoApi.sendTransacEmail(mail);
    console.log("Email sent response:", response);
    console.log(`OTP for ${email}: ${otp}`); // For testing purposes

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send OTP email" });
  }
});

// STEP 2 – Verify OTP and Create User
export const registerVerify = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email, otp });

  // if (!record || record.expiresAt < Date.now()) {
  //   res.status(400);
  //   throw new Error("Invalid or expired OTP");
  // }
   if (!record) {
    res.status(400);
    throw new Error("Wrong OTP !");
  }
  if (record.expiresAt < Date.now()) {
    res.status(400);
    throw new Error("OTP expired try again !");
  }

  const userData = record.data;

  // Create user
  const user = await User.create(userData);

  // Delete OTP entry
  await record.deleteOne();

  // JWT Token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profession: user.profession,
    interests: user.interests,
    forPeople: user.forPeople,
    bio: user.bio,
  });
});

// @desc Login user
// @route POST /api/users/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc Logout user
// @route POST /api/users/logout
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logged out" });
});

// @desc Get user by ID
// @route GET /api/users/getuser
export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    res.status(400);
    throw new Error("User ID is required");
  }
  const user = await userId.findById(userId).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const getUserProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc Update user profile
// @route PUT /api/users/profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id; // From auth middleware
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update fields if provided
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.profession = req.body.profession || user.profession;
  user.interests = req.body.interests || user.interests;
  user.forPeople = req.body.forPeople || user.forPeople;
  user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;

  // Optionally allow password update
  if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 10);
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    profession: updatedUser.profession,
    interests: updatedUser.interests,
    forPeople: updatedUser.forPeople,
    bio: updatedUser.bio,
  });
});

// Forget Password - Send OTP
// const brevoApi = new TransactionalEmailsApi();
brevoApi.authentications.apiKey.apiKey = process.env.BREVO_API_KEY;

// STEP 1 – Send OTP for Forgot Password
export const forgotPasswordStep1 = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User with this email does not exist");
  }

  // Check existing OTP
  let existingOtp = await Otp.findOne({ email });

  if (existingOtp) {
    const currentTime = Date.now();
    const expiryTime = new Date(existingOtp.expiresAt).getTime();

    if (expiryTime > currentTime) {
      // OTP still valid — DO NOT resend

      console.log(`OTP for ${email} in not expired`);
      return res.json({
        message: "1",
        alreadySent: true,
      });
    } else {
      // OTP expired — delete old
      await existingOtp.deleteOne();
    }
  }

  // Generate fresh 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store new OTP
  await Otp.create({
    email,
    otp,
    data: { email },
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
  });

  // Prepare Email
  const mail = new SendSmtpEmail();
  mail.sender = { name: "WisdomWell", email: "pg2413@srmist.edu.in" };
  mail.to = [{ email }];
  mail.subject = "Your OTP to Reset Password";
  mail.htmlContent = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #f9fafb;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4f46e5;">Password Reset Request</h1>
        <p style="color: #6b7280; font-size: 16px;">Use the OTP below to reset your password.</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 28px; font-weight: bold; color: #4f46e5; letter-spacing: 2px;">${otp}</p>
        <p style="color: #6b7280;">This OTP will expire in 10 minutes.</p>
      </div>
      <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
        <p style="color: #374151; font-size: 14px;">
          Best regards,<br/>
          <strong>Praveen Kumar</strong><br/>
          Founder, <strong>Workfys.in</strong>
        </p>
      </div>
    </div>
  `;

  try {
    await brevoApi.sendTransacEmail(mail);
    console.log(`OTP for ${email}`);
    res.json({ message: "OTP sent to email", alreadySent: false });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send OTP email" });
  }
});

// STEP 2 – Verify OTP and Reset Password
export const forgotPasswordStep2 = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const record = await Otp.findOne({ email, otp });
  if (!record) {
    res.status(400);
    throw new Error("Wrong OTP !");
  }
  if (record.expiresAt < Date.now()) {
    res.status(400);
    throw new Error("OTP expired try again !");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const user = await User.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { new: true }
  );

  await record.deleteOne();

  res.json({ message: "Password reset successfully!" });
});
