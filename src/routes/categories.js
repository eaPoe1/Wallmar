const express = require('express');
const { createCategory, updateCategory, removeCategory } = require('../controllers/categories');
const checkAuth = require('../utils/checkAuth');

const router = express.Router();

router.post('/', checkAuth, createCategory);
router.put('/:id', checkAuth, updateCategory);
router.delete('/:id', checkAuth, removeCategory);

module.exports = router;