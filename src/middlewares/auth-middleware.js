//import modules
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user-model.js";

//process environment variables
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

//function to check authentication token if user is authorized
export async function authenticate(req, res, next) {
    try {
        // get request header
        const authHeader = req.headers.authorization || "";
        //retrieve authentication token from auth header
        const token = authHeader.startWith("Bearer") ? authHeader.split("")[1]: null;
        //check if auth token is provided
        if (!token) {
            res.status(401).json({message: "No token provided"})
        }
        //verify token
        const payload = jwt.verify(token , jwtSecret);
        //check and retrieve user from the database
        const user = await User.findById(payload.sub).select("email name role");
        //check if user exists
        if (!user) {
            res.status(401).json({message: "Invalid token: User not found"});
        };
        req.user = {id: user._id.toString() , email: user.email , name: user.name , role: user.role};
        //pass authorization to the next function or controller
        next()
    } catch (error) {
        //send error message
        res.status(401).json({message: "Unauthorized"});
    }
}

//check user role
export function requireRole(role) {
    return function(req , res , next){
        if (!req.user) {
            res.status(401).json({message: "Unauthorized"});
        };
        if(req.user.role !== role){
            res.status(403).json({message: "Forbidden"});
        }
        next()
    }
}