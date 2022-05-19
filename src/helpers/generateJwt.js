const jwt = require('jsonwebtoken');

const generateJwt = (id) => {
	return jwt.sign({id}, process.env.JWT_SECRET);
};

module.exports = generateJwt;