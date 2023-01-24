import userModel from "../Model/userModel.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  // const { username, password, firstname, lastname } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPAssword = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPAssword;
  const newUser = new userModel(req.body);
  const { username } = req.body;

  try {
    const oldUser = await userModel.findOne({ username });
    if (oldUser) {
      return res
        .status(400)
        .json({ message: "username is already registered" });
    }
    const user = await newUser.save();
    const token = Jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Login User
export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userModel.findOne({ username: username });
    if (user) {
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        res.status(200).json("wrong password");
      } else {
        const token = Jwt.sign(
          { username: user.username, id: user._id },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );
        res.status(200).json({ user, token });
      }
    } else {
      res.status(404).json("user does not exist");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
