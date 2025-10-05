const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
console.log(process.env.MONGODB_URI);
const mongoose = require('mongoose');
const Quiz = require('../models/quiz.model');
const data = require('./quizzes.json');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to DB, seeding...');
    await Quiz.deleteMany({});
    const inserted = await Quiz.insertMany(data);
    console.log('Inserted', inserted.length, 'quizzes');
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
