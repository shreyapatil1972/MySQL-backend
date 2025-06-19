const {User} = require('../models/userModel')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send({ message: 'User already exists', success: false });
    }

    const newUser = await User.create({ name, email, password });
    res.status(201).send({ message: 'User registered successfully', success: true });
  } catch (error) {
    res.status(500).send({ message: "Registration failed", error });
  }
};
const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const loggedInUser = await User.findOne({ where: { email } });

    if (!loggedInUser) {
      return res.status(401).send({ message: "User not found", success: false });
    }

    // Simple password match (ideally, hash passwords!)
    if (loggedInUser.password !== password) {
      return res.status(401).send({ message: "Incorrect password", success: false });
    }

    const userPayload = {
      id: loggedInUser.id,
      isAdmin: loggedInUser.isAdmin,
    };

    const token = jwt.sign(userPayload, process.env.SECRET_KEY, { expiresIn: '2h' });

    res.status(200).send({
      message: "User logged in successfully",
      success: true,
      token,
      user: {
        id: loggedInUser.id,
        username: loggedInUser.name, // Make sure this matches your User model
        email: loggedInUser.email,
        isAdmin: loggedInUser.isAdmin,
      }
    });
  } catch (error) {
    res.status(500).send({ message: "Login failed", error });
  }
};


const getUserInfo = async (req, res) => {
    console.log('req.user',req.user)
    try {
        loggedUser = await User.findOne({where:{id:req.user.id},attributes:['id','name','email','isAdmin']})
        if (!req.user) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        res.status(200).send({
            message: "Got user info",
            loggedUser:loggedUser
        });
    } catch (error) {
        res.status(500).send({ error });
    }
};


module.exports = {
    registerUser,
    LoginUser,
    getUserInfo
}