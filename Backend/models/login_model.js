const mongoose = require("mongoose");

const Reservation = mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	email:{
		type: String,
		required: true,
	}

});

module.exports = mongoose.model("ReservationTable", Reservation);
