// Quiz and Question models
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
  }],
});

const quizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  questions: [questionSchema],
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
