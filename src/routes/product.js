const express = require('express');
const Product = require('../models/Product');
const checkAuth = require('../utils/chechAuth');

const router = express.Router();


router.get('/', async(request, response) => {
    const products = await Product.find({})
        .populate('category')
        .populate({path: 'user', select: '_id username email'});
    response.json(products); 
});

router.post('/', checkAuth, async(request, response) => {
    const { name, price} = request.body;

    try {
        const newProduct = new Product({ name, price });
        newProduct.user = request.user._id;
        await newProduct.save();
        response.status(201).json(newProduct);
    } catch (error) {
        console.log(error)
        const err = new Error('all fields are required');
        return response.status(400).json({msg: err.message});
    }
});

router.put('/:id', checkAuth, async(request, response) => {
    const { name, price } = request.body;
    const { id } = request.params;

    const updateProduct = await Product.findById({_id: id});
    if(updateProduct.user._id.toString() !== request.user._id.toString()) {
        const err = new Error('error, you are not admin');
        return response.status(401).json({msg: err.message});
    }
    updateProduct.name = name || updateProduct.name;
    updateProduct.price = price || updateProduct.price;
    const updatedProduct = await updateProduct.save();
    response.json(updatedProduct);
});

router.delete('/:id', checkAuth, async(request, response) => {
    const { id } = request.params;

    const deleteProduct = await Product.findById({_id: id});
    if(deleteProduct.user._id.toString() !== request.user._id.toString()) {
        const err = new Error('error, you are not admin');
        return response.status(401).json({msg: err.message});
    }
    await deleteProduct.deleteOne();
    response.json({msg: `product delete successfully: ${id}`});
});


router.put('/add-category/:id', checkAuth, async(request, response) => {
    const { id } = request.params;
    const { category } = request.body;

    const addCategory = await Product.findById({_id: id});
    if(addCategory.user._id.toString() !== request.user._id.toString()) {
        const err = new Error('error, you are not admin');
        return response.status(401).json({msg: err.message});
    }
    addCategory.category = category || addCategory.category;

    const categoryAdded = await addCategory.save();
    response.json(categoryAdded);
});

module.exports = router;