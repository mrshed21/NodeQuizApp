Quiz App – User Guide

1️⃣ Introduction

This document explains how to use the Quiz App project from other users.
The project allows users:

Create an account and login

View quizzes and solve them

Send results and store them

View their results later

2️⃣ Access to the application

Locally:

Open the terminal and run the server:

node server.js


The interface is available at http://localhost:3000 or through Postman.

Online (hosted):
Use the public server link or the React interface.

3️⃣ Create a new user account

Endpoint: POST /api/auth/register

Body (JSON):

{
  "name": "Your name",
  "email": "Your email",
  "password": "Your password"
}


Result: Successfully created a new account. 

4️⃣ Login

Endpoint: POST /api/auth/login

Body (JSON):

{
  "email": "Your email",
  "password": "Your password"
}


After logging in, you will receive a JWT token.

You must use this token to access protected routes.

5️⃣ View available quizzes

Endpoint: GET /api/quizzes

Result: A list of quizzes will be displayed with:

Title

Category

Questions

Note: You can sort quizzes by category.

6️⃣ Solve a quiz and send the results

Endpoint: POST /api/results

Headers:

Authorization: Bearer <JWT token>


Body (JSON) Example for sending answers:

{
  "quizId": "The quiz ID",
  "answers": [
    { "questionId": "The first question ID", "selected": 0 },
    { "questionId": "The second question ID", "selected": 1 }
  ]
}


Result: JSON containing points for each question and the total score.

7️⃣ View results

Endpoint: GET /api/results/me

Headers:

Authorization: Bearer <JWT token>


Result: All user results will be displayed with details for each answer and points.

8️⃣ Logout

On the client side (React or Postman):

Delete JWT token from local storage (LocalStorage or State).

After that, you will not be able to access protected routes until you log in again.

9️⃣ Additional Notes

Each Quiz contains multiple questions.

You can repeat the question between different quizzes, but each question is unique within the same quiz.

You can sort questions by category to make it easier to choose a specific type of quiz.

When publishing online, make sure:

Using environment variables (.env) to store MongoDB URI and JWT Secret

Protecting routes based on role (user / admin)

Enable CORS if the interface is on a different domain.

10️⃣ User Tips

Use Postman to test all Endpoints before the React interface.

Keep the JWT token in a safe place to send results and view them later.

Make sure to verify quizId and questionId when sending results.

If you like it, I can make a ready PDF copy for printing directly from this document so you can share it with your friends.