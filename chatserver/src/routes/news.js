const express = require('express');
const router = express.Router();
const db = require('../utils/connectDB');
const newsController = require('../controller/news');

module.exports = router;
