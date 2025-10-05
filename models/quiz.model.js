const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correct: { type: Number, required: true }, // index of the correct option
  points: { type: Number, default: 1 }
}, { _id: true }); // each question gets an _id (helpful)

const QuizSchema = new Schema({
  title: { type: String, required: true },
  category: String,
  description: String,
  questions: [QuestionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
