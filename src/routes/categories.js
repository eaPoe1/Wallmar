const express = require('express');
const Category = require('../models/Category');

const router = express.Router();

router.get('/', async(request, response) => {
    const categories = await Category.find({});
    response.json(categories);
});

router.post('/', async(request, response) => {
    const { name } = request.body;

    const newProduct = new Category({name});
    const newProductSaved = await newProduct.save();
    response.json(newProductSaved); 
});

//TODO: validate role:


module.exports = router;