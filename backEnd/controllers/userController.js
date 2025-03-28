const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../model/userModel');

const registerUser = asyncHandler( async (req,res)=>{
	const {name, email, password} = req.body;
	
	if(!name || !email || !password){
		res.status(400);
		throw new Error('Please fill all the fields');
	};

	const userExist = await User.findOne({email});

	if(userExist){
		res.status(400);
		throw new Error('User already exist');
	};

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const user = await User.create({
		name,
		email,
		password: hashedPassword
	});

	if(!user){
		res.status(400);
		throw new Error('Invalid user data');
	}

	res.status(201).json({
		_id: user._id,
		name: user.name,
		email: user.email,
		token : generateToken(user._id)
	});
	
});

const loginUser =asyncHandler( async (req,res)=>{
	const {email, password} = req.body;
	
	if(!email || !password){
		res.status(400);
		throw new Error('Please fill all the fields');
	}

	const user = await User.findOne({email});

	if(!user && !await bcrypt.compare(password, user.password) ){
		res.status(400);
		throw new Error('Invalid credentials');
	};

	res.json({
		_id: user._id,
		name: user.name,
		email: user.email,
		token: generateToken(user._id)
	});

});

const getUser = asyncHandler( async(req,res)=>{
	const user = await User.findById(req.user._id);

	if(!user){
		res.status(404);
		throw new Error('User not found');
	};

	res.json({
		_id: user._id,
		name: user.name,
		email: user.email
	});
});

const generateToken = (id)=>{
	return jwt.sign({id}, process.env.JWT_SECRET, {
		expiresIn: '30d'
	});
};

module.exports = {
	registerUser
	,loginUser
	,getUser
}