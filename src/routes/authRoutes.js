//import modules
import express from "express";
import { body } from "express-validator";
import {
  login,
  profile,
  register,
  registerAdmin,
} from "../controllers/auth-controller.js";
import { authenticate } from "../middlewares/auth-middleware.js";

const router = express.Router();

//user registration
router.post(
  //route
  "/register",
  //express body validation middleware to make sure valid data is being provided
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  //registration controller to register the user
  register
);

//Admin registration
router.post(
  //route
  "/register-admin",
  //express body validation middleware to make sure valid data is being provided
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("adminSecret"),
    exists(),
  ],
  //registration controller to register the admin
  registerAdmin
);

//login (for all users)
router.post(
  //route
  "/login",
  //express body validation middleware to make sure valid data is being provided
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").exists(),
  ],
  //login user
  login
);

//check user profile
router.get("/profile", authenticate, profile);
