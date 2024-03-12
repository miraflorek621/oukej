const mongoose = require("mongoose");

const System = mongoose.Schema({
	
	Hash: {
		type: String,
		required: false,
	}

});

module.exports = mongoose.model("system", System);
