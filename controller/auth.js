import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

export const register = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;

    // Check if the username or email already exists in the database
    const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Username or email already exists' });
    }

    // Hash the password before saving it to the database
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      userName,
      email,
      password: hash,
    });
    await newUser.save();

    // Generate a JWT token and send it as a response
    const token = jwt.sign({ id: newUser._id }, process.env.JWT, {
      expiresIn: '1d',
    });
    res.cookie('access_token', token, { httpOnly: true });
    res.json({ access_token: token, user: newUser });
  } catch (error) {
    next(error);
  }
};

export const googleSignin = async (req, res, next) => {
  try {
    // Extract user data from the request body
    const { name, email, picture } = req.body;

    // Check if the email is valid and not empty
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if the username or email already exists in the database
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {

      const token = jwt.sign({ id: existingUser._id }, process.env.JWT, {
        expiresIn: '1d'
      });
      res.cookie('access_token', token, { httpOnly: true });
      return res.status(200).json({access_token: token, user: existingUser });
    } else {
      // Create a new user if they don't exist
      const newUser = new User({
        name,
        email,
        picture
      });
      await newUser.save();

      // Generate a JWT token and send it as a response
      const token = jwt.sign({ id: newUser._id }, process.env.JWT, {
        expiresIn: '1d'
      });

      res.cookie('access_token', token, { httpOnly: true });
      res.status(201).json({ access_token: token, user: newUser });
    }
  } catch (error) {
    // Handle errors and pass them to the error handling middleware
    next(error);
  }
};



export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    // Find the user based on email or username
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const queryField = isEmail ? 'email' : 'userName';
    const user = await User.findOne({ [queryField]: identifier });

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Invalid email or username or password' });
    }

    // Check if the password is correct using bcrypt
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: 'Invalid email or username or password' });
    }
    const token = generateToken(user._id);
    res.cookie('access_token', token, { httpOnly: true });
    res.json({ access_token: token, user });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, userId } = req.body;
    console.log(userId)
    const user = await User.findById(userId);

    if (!bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(404).json({ message: 'Incorrect Current Password' });
    }

    const salt = bcrypt.genSaltSync(10);
    const newHashPassword = bcrypt.hashSync(newPassword, salt);
    user.password = newHashPassword;
    await user.save();
    res.json('Password Changed Successfully');
  } catch (error) {
    next(error);
  }
};
