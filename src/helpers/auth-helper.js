import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;
const tokenTimeout = process.env.TOKEN_TIMEOUT;
export  function signToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: tokenTimeout });
}