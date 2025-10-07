// admin.js
const API_BASE = "https://nodequizapp-ftcy.onrender.com/api/quizzes"; // server

const quizForm = document.getElementById("quizForm");
const quizList = document.getElementById("quizList");

// Get quizzes from database
async function fetchQuizzes() {
  const res = await fetch(API_BASE);
  const data = await res.json();
  renderQuizzes(data);
}

// Display quizzes in the page
function renderQuizzes(quizzes) {
  quizList.innerHTML = "";
  if (quizzes.length === 0) {
    quizList.innerHTML = "<p>🚫 No quizzes found.</p>";
    return;
  }

  quizzes.forEach((quiz) => {
    const div = document.createElement("div");
    div.className = "quiz-item";
    div.innerHTML = `
      <div>
        <strong>${quiz.title}</strong><br>
        <small>${quiz.category || "No category"} - ${quiz.description || "No description"}</small>
      </div>
      <div class="actions">
        <button onclick="editQuiz('${quiz._id}')">✏️ edit</button>
        <button onclick="addQuestions('${quiz._id}')" >✏️ Questions</button>
        <button class="delete" onclick="deleteQuiz('${quiz._id}')">🗑️ delete</button>
      </div>
    `;
    quizList.appendChild(div);
    
  });
  

}

// Send data (add or edit)
quizForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("quizId").value;
  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!title) {
    alert("Please enter a title");
    return;
  }

  const quizData = { title, category, description };

  if (id) {
    // edit
    await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quizData),
    });
  } else {
    // add new
    await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quizData),
    });
  }

  quizForm.reset();
  document.getElementById("quizId").value = "";
  fetchQuizzes();
});

// Load quiz data to edit
async function editQuiz(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  const quiz = await res.json();

  document.getElementById("quizId").value = quiz._id;
  document.getElementById("title").value = quiz.title;
  document.getElementById("category").value = quiz.category || "";
  document.getElementById("description").value = quiz.description || "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Delete quiz
async function deleteQuiz(id) {
  if (confirm("Are you sure you want to delete this quiz?")) {
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    fetchQuizzes();
  }
}

function addQuestions(id) {
    localStorage.setItem("currentQuizId", id);
    window.location.href = "addQuestions.html";
}


function showQuestions(quiz) {
    const container = document.getElementById("questionsContainer");
    container.innerHTML = "";
    
    quiz.questions.forEach(q => {
      const div = document.createElement("div");
      div.className = "question-card";
      div.innerHTML = `
        <p><strong>Question:</strong> ${q.text}</p>
        <p><strong>Options:</strong> ${q.options.join(", ")}</p>
        <p><strong>Correct:</strong> ${q.options[q.correct]}</p>
        <button onclick="editQuestion('${quiz._id}', '${q._id}')">✏️ Edit</button>
        <button onclick="deleteQuestion('${quiz._id}', '${q._id}')">🗑️ Delete</button>
      `;
      container.appendChild(div);
    });
  }

  document.getElementById("backToQuizzes").addEventListener("click", () => {
    document.getElementById("quizList").style.display = "block";
    document.getElementById("questionSection").style.display = "none";
  });
  

  



// When page loads
fetchQuizzes();
