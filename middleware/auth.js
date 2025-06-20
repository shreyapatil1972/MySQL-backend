const jwt = require('jsonwebtoken');
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    const tokenBearer = req.headers.authorization;

    if (!tokenBearer || !tokenBearer.startsWith('Bearer ')) {
      return res.status(401).send({ message: "Invalid or missing authorization header" });
    }

    const token = tokenBearer.split(' ')[1];

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded; // this includes id and isAdmin (if added at login)
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).send({ message: "Unauthorized", error: error.message });
  }
};
module.exports = { auth };
