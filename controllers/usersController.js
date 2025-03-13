import { User } from "../models/index.js";

export const createUser = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.create({ name });
    console.log(user);
    return res
      .status(201)
      .json({ status: true, message: "User created successfully", user });
  } catch (error) {
    return res.status(400).json({ message: "Invalid request body" });
  }
};
