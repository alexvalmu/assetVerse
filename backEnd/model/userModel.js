const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {	
		type: String, 
		required: [true, 'Please tell us your name!']
	},
	email: {	
		type: String, 
		required: [true, 'Please tell us your email!'],
		unique: true
	},
	password: {	
		type: String, 
		required: [true, 'Please tell us your password!']
	},

},
{
	timestamps: true
}
);

module.exports = mongoose.model('User', userSchema);