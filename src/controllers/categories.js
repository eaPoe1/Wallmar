const Category = require('../models/Category');

const createCategory = async(request, response) => {
	const { name } = request.body;

	if(request.user.role !== 'admin'){
		const err = new Error('you do not have permission to create a category');
		return response.status(400).json({msg: err.message});
	}

	const categoryExists = await Category.findOne({name});
	if(categoryExists){
		const err = new Error(`category ${name} already exists`);
		return response.status(400).json({msg: err.message});
	}
	const newCategory = new Category({name});
	const newCategorySaved = await newCategory.save();
	response.status(201).json(newCategorySaved); 
};

const updateCategory = async(request, response) => {
	const { id } = request.params;
	const { name } = request.body;

	if(request.user.role !== 'admin'){
		const err = new Error('you do not have permission to update a category');
		return response.status(400).json({msg: err.message});
	}

	const updateCategory = await Category.findById({_id: id});
	if(!updateCategory){
		const err = new Error('category not found');
		return response.status(404).json({msg: err.message});
	}

	updateCategory.name = name || updateCategory.name;
	const categoryUpdated = await updateCategory.save();
	response.json(categoryUpdated);
    
};

const removeCategory = async(request, response) => {
	const { id } = request.params;

	if(request.user.role !== 'admin'){
		const err = new Error('you do not have permission to remove a category');
		return response.status(400).json({msg: err.message});
	}

	const removeCategory = await Category.findById({_id: id});
	if(!removeCategory){
		const err = new Error('category not found');
		return response.status(404).json({msg: err.message});
	}

	await removeCategory.deleteOne();
	response.json({msg: 'removed'});
};


module.exports = {
	createCategory,
	updateCategory,
	removeCategory
};