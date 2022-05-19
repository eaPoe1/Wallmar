const express = require('express');
const checkAuth = require('../utils/checkAuth');
const {
	getProducts,
	getProduct,
	newProducts,
	updateProducts,
	deleteProducts,
	addCategory } = require('../controllers/product');


const router = express.Router();


router.get('/',getProducts);

router.get('/:id', getProduct);

router.post('/', checkAuth, newProducts);

router.put('/:id', checkAuth, updateProducts);

router.delete('/:id', checkAuth, deleteProducts);

router.put('/add-category/:id', checkAuth, addCategory);

module.exports = router;