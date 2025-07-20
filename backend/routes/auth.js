const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateSignup, validateLogin } = require('../middleware/validators');

const router = express.Router();

// Signup
router.post('/signup', validateSignup, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '7d' });
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
