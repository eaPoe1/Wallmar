const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
	username: {type: String, required: true, unique: true, trim: true},
	email: {type: String, required: true, unique: true, trim: true},
	password: {type: String, required: true, trim: true},
	token: {type: String},
	confirm: {type: Boolean, default: false},
	role: {type: String, enum: ['admin', 'seller', 'user']}
}, { timestamps: true });

userSchema.pre('save', async function(next){
	if(!this.isModified('password')) return next();
    
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(password) {
	return await bcrypt.compare(password, this.password);
};
module.exports = mongoose.model('User', userSchema);
