// Import .env variables
require("dotenv/config");

const express = require("express");
const router = express.Router();
const path = require("path");
const newReservation = require("../models/reservation_model");

router.post("/", async (req, res) => {
	const dateFrom = req.body.dateFrom;
	const dateTo = req.body.dateTo;

	let results = await newReservation.find();

	let filtredResults = [];

	for (let i = 0; i < results.length; i++) {
		if (results[i].ReservationTable.length == 0) {
			filtredResults.push(results[i]);
		}
		else{
			for (let j = 0; j < results[i].ReservationTable.length; j++) {
				if (results[i].ReservationTable[j].timeFrom > dateTo || results[i].ReservationTable[j].timeTo < dateFrom) {
					filtredResults.push(results[i]);
				}
			}
		}


		
	}

	return res.json(filtredResults);
});

module.exports = router;
