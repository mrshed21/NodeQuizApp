const express = require("express");
const router = express.Router();
const Quiz = require("../models/quiz.model");

// GET /api/quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/quizzes/:id => get quiz by id
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });
    res.json(quiz);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/quizzes/:id/questions/:questionId => get question by id
router.get("/:id/questions/:questionId", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });
    const question = quiz.questions.id(req.params.questionId);
    if (!question) return res.status(404).json({ msg: "Question not found" });
    res.json(question);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/quizzes
router.post("/", async (req, res) => {
  try {
    const { category, questions } = req.body;

    //
    let quiz = await Quiz.findOne({ category });

    if (quiz) {
      //
      const existingQuestions = quiz.questions.map((q) =>
        q.question.trim().toLowerCase()
      );

      const newUniqueQuestions = questions.filter(
        (q) => !existingQuestions.includes(q.question.trim().toLowerCase())
      );

      if (newUniqueQuestions.length === 0) {
        return res.status(200).json({
          message: "All questions already exist for this category",
          quiz,
        });
      }

      //
      quiz.questions.push(...newUniqueQuestions);
      await quiz.save();

      return res.status(200).json({
        message: "New unique questions added to existing quiz",
        addedCount: newUniqueQuestions.length,
        quiz,
      });
    }

    //
    const newQuiz = new Quiz(req.body);
    const saved = await newQuiz.save();
    res.status(201).json({
      message: "New quiz created successfully",
      quiz: saved,
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});



// POST /api/quizzes/:id/questions  =>  add new question to existing quiz
router.post("/:id/questions", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

    const newQuestion = req.body;

    // تحقق إذا كان السؤال موجود بالفعل (مثلاً بناءً على النص أو المعرف)
    const isDuplicate = quiz.questions.some(q => q.text === newQuestion.text);
    if (isDuplicate) {
      return res.status(400).json({ msg: "Question already exists in the quiz" });
    }

    await quiz.questions.push(newQuestion);
    console.log("pushed",quiz);
    await quiz.save();
    console.log("saved",quiz);
    res.json(quiz);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// patch /api/quizzes/:id
// PATCH /api/quizzes/:quizId/questions/:questionId
router.patch("/:quizId/questions/:questionId", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

    const question = quiz.questions.id(req.params.questionId);
    if (!question) return res.status(404).json({ msg: "Question not found" });

    // تعديل الحقول المطلوبة
    Object.assign(question, req.body);

    await quiz.save();
    res.json(quiz);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});



// DELETE /api/quizzes/:quizId/questions/:questionId
router.delete("/:quizId/questions/:questionId", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    // console.log("quiz",quiz);
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

    const question = quiz.questions.id(req.params.questionId);
    console.log("question",question);
    if (!question) return res.status(404).json({ msg: "Question not found" });


    quiz.questions.pull(question);
    await quiz.save();
    res.json(quiz );
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});



// PUT /api/quizzes/:id  => update quiz
router.put("/:id", async (req, res) => {
  try {
    const updated = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE /api/quizzes/:id  => delete quiz
router.delete("/:id", async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
