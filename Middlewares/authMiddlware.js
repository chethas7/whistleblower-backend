import Jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secret = process.env.JWT_KEY;

const authMiddlware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    console.log(token);
    if (token) {
      const decoded = Jwt.verify(token, secret);
      req.body.id = decoded?.id;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};
export default authMiddlware;
