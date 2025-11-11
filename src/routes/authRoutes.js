//import modules
import express from "express";
import { body } from "express-validator";
import {
  changePassword,
  downgradeUser,
  getAllUsers,
  login,
  profile,
  promoteUser,
  register,
  registerAdmin,
} from "../controllers/auth-controller.js";
import { authenticate, requireRole } from "../middlewares/auth-middleware.js";

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
    body("adminSecret").
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
  //login user controller
  login
);

//check user profile
router.get(
  //route
  "/profile",
  //auth middleware
  authenticate,
  //user profile controller
  profile
);

//change password
router.post(
  // route
  "/change-password",
  //auth middleware
  authenticate,
  // express body validation middleware to make sure valid data is being provided
  [
    body("currentPassword").exists(),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  //change password controller
  changePassword
);

//management endpoints (Admin only)
//get all users
router.get(
    //route
    "/users",
    //auth middleware
    authenticate,
    //role middleware
    requireRole("admin"),
    // list users controller 
    getAllUsers
)

//upgrade user to admin
router.post(
    //route
    "/users/upgrade",
     //auth middleware
    authenticate,
    //role middleware
    requireRole("admin"),
    //upgrade user controller
    promoteUser
)

//downgrade user role
router.post(
    //route
    "/users/downgrade",
     //auth middleware
    authenticate,
    //role middleware
    requireRole("admin"),
    //downgrade user controller
    downgradeUser
)

export default router;
