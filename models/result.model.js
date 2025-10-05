const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnswerSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, required: true },
  selected: { type: Number, required: true }
});

const ResultSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: Number,
  total: Number,
  answers: [AnswerSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', ResultSchema);
