const express = require('express');
const { auth } = require('../middleware/auth');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');

const router = express.Router();

// Enroll in a course
router.post('/enroll/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const enrollment = new Enrollment({ user: req.user._id, course: courseId });
    await enrollment.save();
    res.status(201).json({ message: 'Enrolled successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mark lesson as completed
router.post('/progress/:enrollmentId/lesson/:lessonId', auth, async (req, res) => {
  try {
    const { enrollmentId, lessonId } = req.params;
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment || !enrollment.user.equals(req.user._id)) return res.status(404).json({ message: 'Enrollment not found' });
    let progress = enrollment.progress.find(p => p.lesson.equals(lessonId));
    if (!progress) {
      progress = { lesson: lessonId, completed: true };
      enrollment.progress.push(progress);
    } else {
      progress.completed = true;
    }
    await enrollment.save();
    res.json({ message: 'Lesson marked as completed' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Attempt quiz
router.post('/progress/:enrollmentId/quiz/:quizId', auth, async (req, res) => {
  try {
    const { enrollmentId, quizId } = req.params;
    const { score } = req.body;
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment || !enrollment.user.equals(req.user._id)) return res.status(404).json({ message: 'Enrollment not found' });
    let progress = enrollment.progress.find(p => p.quizAttempts.some(a => a.quiz.equals(quizId)));
    if (!progress) {
      progress = { lesson: null, completed: false, quizAttempts: [] };
      enrollment.progress.push(progress);
    }
    progress.quizAttempts.push({ quiz: quizId, score });
    await enrollment.save();
    res.json({ message: 'Quiz attempt recorded' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get user progress for a course
router.get('/progress/:enrollmentId', auth, async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const enrollment = await Enrollment.findById(enrollmentId).populate('progress.lesson').populate('progress.quizAttempts.quiz');
    if (!enrollment || !enrollment.user.equals(req.user._id)) return res.status(404).json({ message: 'Enrollment not found' });
    // Calculate % completed
    const totalLessons = await Lesson.countDocuments({ course: enrollment.course });
    const completedLessons = enrollment.progress.filter(p => p.completed).length;
    const percentCompleted = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
    res.json({ enrollment, percentCompleted });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
