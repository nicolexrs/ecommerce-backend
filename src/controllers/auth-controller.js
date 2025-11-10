import User from "../models/user-model.js";
import bcrypt, { hash } from "bcrypt";
import dotenv from "dotenv";
import { signToken } from "../helpers/auth-helper.js";

dotenv.config();
//declare variables
const adminSecret = process.env.ADMIN_SECRET;

//sign token function
export async function register(req, res) {
  try {
    //destructure request body
    const { email, name, password } = req.body;

    //check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return req.status(409).json({ message: "User already exists" });
    }

    //generate salt
    const salt = await bcrypt.genSalt(10);

    //hash the password
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
    const user = new User({
      email: email,
      password: hashedPassword,
      name: name,
      role: "user",
    });

    //save user to database
    await user.save();

    //generate a session token
    const token = signToken({
      sub: user._id,
      email: user.email,
      role: user.role,
    });

    //send response
    return res
      .status(201)
      .json({ message: "Registration successful", token: token, user: user });
  } catch (error) {
    //error response
    return res
      .status(500)
      .json({ message: "Unable to register user", error: error.message });
  }
}

//Admin registration
export async function registerAdmin(req, res) {
  try {
    //destructure request body
    const { email, password, name, adminKey } = req.body;

    //check if admin registration is enabled
    //the admin secret key determines if its enabled or not
    if (!adminSecret) {
      return res.status(403).json({ message: "Admin registration disabled" });
    }

    //check if the admin key matches the admin secret to authorize registration
    if (adminKey !== adminSecret) {
      return res.status(403).json({ message: "Invalid admin key" });
    }

    //check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return req.status(409).json({ message: "User already exists" });
    }

    //generate salt
    const salt = await bcrypt.genSalt(10);

    //hash the password
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
    const user = new User({
      email: email,
      password: hashedPassword,
      name: name,
      role: "admin",
    });

    //save user to database
    await user.save();

    //generate a session token
    const token = signToken({
      sub: user._id,
      email: user.email,
      role: user.role,
    });

    //send response
    return res.status(201).json({
      message: "Admin registration successful",
      token: token,
      user: user,
    });
  } catch (error) {
    //error response
    return res
      .status(500)
      .json({ message: "Unable to register admin", error: error.message });
  }
}

//login user
export async function login(req, res) {
  try {
    //destructure request body
    const { email, password } = req.body;

    //check if email and password are provided
    if (!email || !password) {
      return res
        .status(403)
        .json({ message: "Email and password are required" });
    }

    //check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //check if the password matches the hashed password
    const matchedPassword = await bcrypt.compare(password, user.password);
    if (!matchedPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //generate a session token
    const token = signToken({
      sub: user._id,
      email: user.email,
      role: user.role,
    });

    //return a response
    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: user,
    });
  } catch (error) {
    //error response
    return res
      .status(500)
      .json({ message: "Unable to login", error: error.message });
  }
}

//user profile
export async function profile(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  const { id, email, name, role } = req.user;
  return res.status(200).json({ user: { id, email, name, role } });
}

//change password
export async function changePassword(req, res) {
  try {
    //destructure request body
    const { currentPassword, newPassword } = req.body;

    //check for user
    const user = await User.findById(req.user.id);

    //check if the password match the initial password
    const matchedPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!matchedPassword) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    //generate salt
    const salt = await bcrypt.genSalt(10);

    // hash the new password and update the user password
    user.password = await bcrypt.hash(newPassword, salt);
    //save the user
    await user.save();
    //send response
    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    //error response
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

//TODO: implement forgot password

//list all users(Admin only)
export async function getAllUsers(req, res) {
  try {
    //check and retrieve all users from database
    const users = await User.find()
      //retrive certain properties from the user
      .select("_id email name role createdAt")
      // remove excess data
      .lean();

    //send response to the frontend including the users retrieved
    res.status(200).json({ message: "Users retrieved successfully", users });
  } catch (error) {
    //send error message
    res
      .status(500)
      .json({ message: "Unable to retrieve users", error: error.message });
  }
}

//upgrade user status to admin(Admin only)
export async function promoteUser(req, res) {
  try {
    //destructure user id from request body
    const { userId } = req.body;
    //check and retrieve the user from database using the user id
    const user = await User.findById(userId);
    //check if user exists
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    //check if user is admin
    if (user.id === "admin") {
      res.status(400).json({ message: "User  is already admin" });
    }
    //asign admin role
    user.role = "admin";
    //save the updated detail
    await user.save();
    // send response
    res
      .status(200)
      .json({
        message: "User upgraded successfully",
        userDetails: { id: user._id, email: user.email, role: user.role },
      });
  } catch (error) {
    //send error message
     res
      .status(500)
      .json({ message: "Unable to upgrade user", error: error.message });
  
  }
}

//downgrade user status to user(Admin only)
export async function promoteUser(req, res) {
  try {
    //destructure user id from request body
    const { userId } = req.body;
    //check and retrieve the user from database using the user id
    const user = await User.findById(userId);
    //check if user exists
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    //check if user status is already user
    if (user.id === "user") {
      return
    }
    //asign user role
    user.role = "user";
    //save the updated detail
    await user.save();
    // send response
    res
      .status(200)
      .json({
        message: "User upgraded successfully",
        userDetails: { id: user._id, email: user.email, role: user.role },
      });
  } catch (error) {
    //send error message
     res
      .status(500)
      .json({ message: "Unable to upgrade user", error: error.message });
  }
}