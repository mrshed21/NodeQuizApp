require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const quizzesRouter = require("./routes/quizzes");
const resultsRouter = require("./routes/results");
const authRouter = require("./routes/auth");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/quizzes", quizzesRouter);
app.use("/api/results", resultsRouter);
app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
