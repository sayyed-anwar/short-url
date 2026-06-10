import bcrypt from "bcrypt";

import * as userRepository from "../repositories/user.repository.js";

import AppError from "../utils/AppError.js";
import { generateToken } from "../utils/jwt.js";

export const register = async ({ name, email, password }) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const user = await userRepository.createUser({ name, email, password });

  const token = generateToken({
    userId: user._id,
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};
