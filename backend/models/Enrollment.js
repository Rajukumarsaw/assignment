// Enrollment and Progress models
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  completed: { type: Boolean, default: false },
  quizAttempts: [{
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    score: Number,
    attemptDate: { type: Date, default: Date.now },
  }],
});

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: [progressSchema],
  enrolledAt: { type: Date, default: Date.now },
});

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
