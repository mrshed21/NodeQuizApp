const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz.model');

// GET /api/quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/quizzes/:id
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });
    res.json(quiz);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/quizzes
router.post('/', async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body);
    const saved = await newQuiz.save();
    res.status(201).json(saved);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// POST /api/quizzes/:id/questions  => إضافة سؤال جديد لكويز موجود
router.post('/:id/questions', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });
    quiz.questions.push(req.body);
    await quiz.save();
    res.json(quiz);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// PUT /api/quizzes/:id  (تعديل)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// DELETE /api/quizzes/:id
router.delete('/:id', async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
