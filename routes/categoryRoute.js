const express = require('express');
const categoryController = require('../controllers/categoryController')

const router = express.Router();

router.post('/create', categoryController.createCategory);
router.get('/getAllCategories', categoryController.getAllCategories);
router.get('/getCategoryByID/:id', categoryController.getCategoryByID);
router.put('/updateCategory/:id', categoryController.updateCategory);
router.delete('/deleteCategory/:id', categoryController.deleteCategory);

module.exports = router

