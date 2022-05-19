const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name: {type: String, required: true, trim: true},
	price: {type: Number, required: true, trim: true},
	description: {type: String, default: 'this product has not a description', trim: true},
	category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('Product', productSchema);