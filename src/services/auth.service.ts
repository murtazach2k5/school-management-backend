import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import jwt from "jsonwebtoken";

interface SignupInput {
  email: string;
  password: string;
  role: "SUPER_ADMIN" | "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";
}

export const signupUser = async (input: SignupInput) => {
  const { email, password, role } = input;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
    },
  });

  // Never send the password back, even hashed
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

interface LoginInput {
  email: string;
  password: string;
}

export const loginUser = async (input: LoginInput) => {
  const { email, password } = input;

  // Find the user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare given password with stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};