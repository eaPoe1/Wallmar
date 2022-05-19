const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkAuth = async(request, response, next) => {
	let token;
	const simple = request.headers.authorization;
	if(simple && simple.toLowerCase().startsWith('bearer')){
		token = simple.split(' ')[1];

		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			request.user = await User.findById({_id: decoded.id}).select('-password -token -confirm -createdAt -updatedAt -__v');

			return next();
		} catch (error) {
			const err = new Error('invalid token');
			return response.status(401).json({msg: err.message});
		}
	}

	if(!token){
		const err = new Error('invalid token');
		return response.status(401).json({msg: err.message});
	}

};

module.exports = checkAuth;