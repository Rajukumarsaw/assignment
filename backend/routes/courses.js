const express = require('express');
const { auth, admin } = require('../middleware/auth');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');

const router = express.Router();

// Admin: Create course
router.post('/', auth, admin, async (req, res) => {
  try {
    const { title, description, instructor, price } = req.body;
    const course = new Course({ title, description, instructor, price });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all courses (with pagination)
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const total = await Course.countDocuments();
  const courses = await Course.find().skip(skip).limit(limit);
  res.json({ total, page, limit, courses });
});

// Get single course with lessons and quizzes
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('lessons')
      .populate('quizzes');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
