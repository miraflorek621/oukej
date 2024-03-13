const mongoose = require("mongoose");

const Reservation = mongoose.Schema({
	
	BycicleName: {
		type: String,
		required: false,
	},
	Quantity: {
		type: Number,
		required: false,
	},
	Price:{
		type: Number,
		required: false,
	},
	ReservationTable: {
		type: Array,
		required: false,
	},

});

module.exports = mongoose.model("ReservationTable", Reservation);
