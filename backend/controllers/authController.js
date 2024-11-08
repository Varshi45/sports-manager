//controllers/authController.js

const bcrypt = require("bcrypt");
const { Admin, Player } = require("../models");
const { generateToken } = require("../utils/jwtUtils");

const authController = {
  async login(req, res) {
    const { email, password } = req.body;

    // Check if user exists in Admin or Player model
    let user = await Admin.findOne({ where: { email } });
    let role = "admin";

    if (!user) {
      user = await Player.findOne({ where: { email } });
      role = "player";
    }

    // If user not found or password is incorrect
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    // Attach role to the user data before returning
    res.json({ token, user: { ...user.toJSON(), role } });
  },

  async signup(req, res) {
    const { firstName, lastName, email, password, role } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);
    let user;

    if (role === "admin") {
      user = await Admin.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
    } else {
      user = await Player.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
    }

    // Attach role to the user data before returning
    res.status(201).json({ ...user.toJSON(), role });
  },

  async signout(req, res) {
    res.json({ message: "Successfully signed out" });
  },
};

module.exports = authController;
