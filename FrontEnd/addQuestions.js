window.addEventListener("DOMContentLoaded", async () => {
  const quizId = localStorage.getItem("currentQuizId");
  if (!quizId) return;

  // جلب بيانات الكويز من السيرفر
  const res = await fetch(`https://nodequizapp-ftcy.onrender.com/api/quizzes/${quizId}`);
  const quizData = await res.json();

  // عرض الأسئلة
  showQuestions(quizData);
  console.log(quizData);
  document.getElementById("quizId").value = quizData._id;
  document.getElementById("category").value = quizData.title;

  // يمكنك الآن إضافة أزرار أو فورمات لإضافة/تعديل/حذف الأسئلة
});
let addbtn = "Add";
let editquestionId = "";
const submitBtn = document.getElementById("submitBtn");
function showQuestions(quiz) {
  document.getElementById("quizTitle").textContent = quiz.title;
  const container = document.getElementById("questionsContainer");
  container.innerHTML = "";
  console.log(quiz);
  quiz.questions.forEach((q) => {
    const div = document.createElement("div");
    div.className = "question-card";

    div.innerHTML = `
        <p><strong>Question:</strong> ${q.text}</p>
        <p><strong>Options:</strong> ${q.options.join(", ")}</p>
        <p><strong>Correct:</strong> ${q.options[q.correct]}</p>
        <button onclick="editQuestion('${quiz._id}', '${
      q._id
    }')">✏️ Edit</button>
        <button onclick="deleteQuestion('${quiz._id}', '${
      q._id
    }')">🗑️ Delete</button>
      `;
    container.appendChild(div);
  });
}

document.getElementById("backToQuizzes").addEventListener("click", () => {
  window.location.href = "./index.html";
});

//------------- add question -------------
const addQuestionBtn = document.getElementById("addQuestionBtn");
addQuestionBtn.addEventListener("click", () => {
  addbtn = "Add";
  submitBtn.textContent = "Add Question";
  document.getElementById("addQuestionBtn").textContent = addbtn;
  document.getElementById("questionFormContainer").style.display = "block";
  document.getElementById("close").addEventListener("click", () => {
    document.getElementById("questionFormContainer").style.display = "none";
  });
});

const questionForm = document.getElementById("questionForm");
questionForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (addbtn === "Add") {
    const quizId = document.getElementById("quizId").value;
    const newQuestion = {
      text: document.getElementById("questionText").value,
      options: [
        document.getElementById("option1").value,
        document.getElementById("option2").value,
        document.getElementById("option3").value,
        document.getElementById("option4").value,
      ],
      correct: parseInt(document.getElementById("correctOption").value),
    };

    try {
      const res = await fetch(
        `https://nodequizapp-ftcy.onrender.com/api/quizzes/${quizId}/questions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newQuestion),
        }
      );

      const updatedQuiz = await res.json();
      // console.log("Updated quiz:", updatedQuiz);

      // show updated quiz
      showQuestions(updatedQuiz);
      showToast("Question added successfully!");

      // reset form
      questionForm.reset();
    } catch (err) {
      console.error("Error adding question:", err);
      showToast("Error adding question", "error");
    }

    // try to fetch the current quiz to display the questions even if adding fails
    try {
      const res = await fetch(`https://nodequizapp-ftcy.onrender.com/api/quizzes/${quizId}`);
      const quiz = await res.json();
      showQuestions(quiz);
    } catch (fetchErr) {
      console.error("Error fetching quiz:", fetchErr);
    }
  } else {
    const quizId = document.getElementById("quizId").value;
    const updatedQuestion = {
      text: document.getElementById("questionText").value,
      options: [
        document.getElementById("option1").value,
        document.getElementById("option2").value,
        document.getElementById("option3").value,
        document.getElementById("option4").value,
      ],
      correct: parseInt(document.getElementById("correctOption").value),
    };

    try {
      const res = await fetch(
        `https://nodequizapp-ftcy.onrender.com/api/quizzes/${quizId}/questions/${editquestionId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedQuestion),
        }
      );

      const updatedQuiz = await res.json();
      // console.log("Updated quiz:", updatedQuiz);

      // show updated quiz
      showQuestions(updatedQuiz);
      showToast("Question updated successfully!");

      // reset form
      questionForm.reset();
    } catch (err) {
      console.error("Error updating question:", err);
      showToast("Error updating question", "error");
    }
    addbtn = "Add";
    submitBtn.textContent = "Add Question";
    document.getElementById("addQuestionBtn").textContent = addbtn;
    document.getElementById("questionFormContainer").style.display = "none";
    questionForm.reset();
  }
});

//------------- edit question -------------
async function editQuestion(quizId, questionId) {
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  submitBtn.textContent = "Edit Question";
  addbtn = "Edit";
  editquestionId = questionId;

  document.getElementById("addQuestionBtn").textContent = addbtn;
  console.log(quizId, questionId);
  try {
    const res = await fetch(
      `https://nodequizapp-ftcy.onrender.com/api/quizzes/${quizId}/questions/${questionId}`
    );
    const question = await res.json();
    document.getElementById("questionText").value = question.text;
    document.getElementById("option1").value = question.options[0];
    document.getElementById("option2").value = question.options[1];
    document.getElementById("option3").value = question.options[2];
    document.getElementById("option4").value = question.options[3];
    document.getElementById("correctOption").value = question.correct;
    document.getElementById("questionFormContainer").style.display = "block";
    document.getElementById("close").addEventListener("click", () => {
      document.getElementById("questionFormContainer").style.display = "none";
      submitBtn.textContent = "Add Question";
      addbtn = "Add";
      document.getElementById("addQuestionBtn").textContent = addbtn;
      questionForm.reset();
    });
  } catch (err) {
    console.error("Error editing question:", err);
    showToast("Error editing question", "error");
  }
}

//------------- delete question -------------
async function deleteQuestion(quizId, questionId) {
  if (!confirm("Are you sure you want to delete this question?")) return;
  console.log(quizId, questionId);
  try {
    const res = await fetch(
      `https://nodequizapp-ftcy.onrender.com/api/quizzes/${quizId}/questions/${questionId}`,
      {
        method: "DELETE",
      }
    );
    const updatedQuiz = await res.json();
    showQuestions(updatedQuiz);
    showToast("Question deleted successfully!");
  } catch (err) {
    console.error("Error deleting question:", err);
    showToast("Error deleting question", "error");
  }
}

//------------- toast -------------
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast " + (type === "error" ? "error" : "");
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 3000);
}
