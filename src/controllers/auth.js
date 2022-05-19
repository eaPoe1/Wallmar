const {nanoid} = require('nanoid'); 
const generateJwt = require('../helpers/generateJwt');
const User = require('../models/User');


const signup = async(request, response) => {
	const { username, email, password, role} = request.body; 

	//TODO: roles does not to build like this, please change it 
	if(role !== ('admin' || 'seller' || 'user')){
		const err = new Error('Invalid role');
		return response.status(400).json({msg: err.message});
	}
	const userExists = await User.findOne({username});
	if(userExists) {
		const err = new Error(`User ${username} already exists`);
		return response.status(400).json({msg: err.message});
	}
	
	try {
		const newUser = new User({ username, email, password, role });
		newUser.token = nanoid();
		const userSaved = await newUser.save();
		response.status(201).json(userSaved);

	} catch (error) {
		console.log(error);
	}
};

const confirm = async(request, response) => {
	const { id } = request.params;
	try {
		const confirmUser = await User.findOne({token: id});
        
		confirmUser.confirm = true;
		confirmUser.token = '';
		await confirmUser.save();
        
		response.json({msg: 'confirmed'});
	} catch (error) {
		const err = new Error('invalid token');
		return response.status(400).json({msg: err.message});
	}
};

const login = async(request, response) => {
	const { username, password } = request.body;

	try {
		const user = await User.findOne({username});
		if(!user.confirm){
			const err = new Error('user is not confirmed');
			return response.status(400).json({msg: err.message});
		}
		if(!await user.comparePassword(password)) {
			const err = new Error('invalid username or password');
			return response.status(400).json({msg: err.message});        
		}
		response.json({
			id: user._id,
			username: user.username, 
			email: user.email,
			token: generateJwt(user._id)
		});
	} catch (error) {
		console.log(error);
		const err = new Error('invalid username or password');
		return response.status(500).json({msg: err.message});
	}
};

const profile = async(request, response) => {
	response.json(request.user);
};


module.exports = {
	signup,
	confirm,
	login,
	profile
};