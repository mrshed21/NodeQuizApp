// routes/results.js
const express = require('express');
const router = express.Router();
const Result = require('../models/result.model');
const Quiz = require('../models/quiz.model');
const auth = require('../middleware/auth');

// POST /api/results  (protected)
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id; // from the token now
    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });

    let score = 0;
    let total = 0;
    for (const ans of answers) {
      const q = quiz.questions.id(ans.questionId);
      if (!q) continue;
      total += q.points || 1;
      if (q.correct === ans.selected) score += q.points || 1;
    }

    const result = new Result({
      user: userId,
      quiz: quizId,
      score,
      total,
      answers
    });

    const saved = await result.save();
    res.status(201).json(saved);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
