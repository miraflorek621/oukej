// Import .env variables
require("dotenv/config");

const express = require("express");
const router = express.Router();
const path = require("path");
const newReservation = require("../models/reservation_model");

function isDateInRange(start1, end1, start2, end2) {
	return (
		(start1 >= start2 && start1 <= end2) || (end1 >= start2 && end1 <= end2)
	);
}

router.post("/", async (req, res) => {
	try {
		const dateFrom = new Date(req.body.timeFrom);
		const dateTo = new Date(req.body.timeTo);

		let results = await newReservation.find();

		let filteredDateResults = [];

		for (let i = 0; i < results.length; i++) {
			for (let j = 0; j < results[i].ReservationTable.length; j++) {
				if (
					!isDateInRange(
						new Date(results[i].ReservationTable[j].timeFrom),
						new Date(results[i].ReservationTable[j].timeTo),
						dateFrom,
						dateTo
					)
				) {
					filteredDateResults.push(results[i]);
				}
			}
		}

		const filtredResults = [];

		
		for (let i = 0; i < filteredDateResults.length; i++) {
			if(filteredDateResults[i].ReservationTable[0].Quantity < filteredDateResults[i].Quantity){
				filtredResults.push(filteredDateResults[i]);
			}
		}

		return res.json(filtredResults);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

module.exports = router;
