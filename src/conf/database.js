const mongoose = require('mongoose');

mongoose.connect(process.env.NODE_ENV === 'test' 
	? process.env.MONGO_URI_TEST 
	: process.env.MONGO_URI)
	.then(connection => console.log(connection.connection.name))
	.catch(err => console.error(err));