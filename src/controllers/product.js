const Product = require('../models/Product');


const getProducts = async(request, response) => {
	const products = await Product.find({})
		.populate('category')
		.populate({path: 'user', select: '_id username email'});
	response.json(products); 
};
const getProduct = async(request, response) => {
	const { id } = request.params;

	const products = await Product.findById({_id: id})
		.populate('category')
		.populate({path: 'user', select: '_id username email'});
	response.json(products);
};
const newProducts = async(request, response) => {
	const { name, price } = request.body;
	try {
		const newProduct = new Product({ name, price });
		newProduct.user = request.user._id;
		const productSaved = await newProduct.save();
		response.status(201).json(productSaved);
	} catch (error) {
		console.log(error);
	}
};
const updateProducts = async(request, response) => {
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
};
const deleteProducts = async(request, response) => {
	const { id } = request.params;

	const deleteProduct = await Product.findById({_id: id});
	if(deleteProduct.user._id.toString() !== request.user._id.toString()) {
		const err = new Error('error, you are not admin');
		return response.status(401).json({msg: err.message});
	}
	await deleteProduct.deleteOne();
	response.json({msg: `product delete successfully: ${id}`});
};

const addCategory = async(request, response) => {
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
};

module.exports = {
	getProducts,
	getProduct,
	newProducts,
	updateProducts,
	deleteProducts,
	addCategory
};