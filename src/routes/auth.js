const express = require('express');
const {nanoid} = require('nanoid'); 
const generateJwt = require('../helpers/generateJwt');
const User = require('../models/User');
const checkAuth = require('../utils/chechAuth');


const router = express.Router();


/*
*signup
*/
router.post('/signup', async(request, response) => {
    const { username, email, password } = request.body; 

    try {
        const newUser = new User({ username, email, password });
        newUser.token = nanoid();
        const userSaved = await newUser.save();
        response.json(userSaved);

    } catch (error) {
        const err = new Error('error to register');
        return response.json({msg: err.message});
    }
});

/*
*confirm
*/

router.get('/confirm/:id', async(request, response) => {
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
});

/*
*login 
*/
router.post('/login', async(request, response) => {
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
});



module.exports = router;