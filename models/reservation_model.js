const mongoose = require("mongoose");

const Reservation = mongoose.Schema({
	
	BycicleName: {
		type: String,
		required: true,
	},
	Quantity: {
		type: Number,
		required: true,
	},
	BycicleImage:{
		type: String,
		required: true,
	},
	Brand:{
		type: String,
		required: true,	
	},
	ReservationTable: {
		type: Array,
		required: false,
	},

});

module.exports = mongoose.model("ReservationTable", Reservation);
