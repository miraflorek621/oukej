// Import .env variables
require("dotenv/config");

const express = require("express");
const router = express.Router();
const path = require("path");
const newReservation = require("../models/reservation_model");

router.post("/", async (req, res) => {
	console.log(req.body);

	const dateFrom = req.body.timeFrom;
	const dateTo = req.body.timeTo;

	let results = await newReservation.find();

	let filtredResults = [];

	for (let i = 0; i < results.length; i++) {
		if (results[i].ReservationTable.length == 0) {
			filtredResults.push(results[i]);
		} else {
			console.log(results[i]);
			for (let j = 0; j < results[i].ReservationTable.length; j++) {
				if ((dateFrom >= results[i].ReservationTable[j].timeFrom && dateFrom <= results[i].ReservationTable[j].timeTo) || (dateTo >= results[i].ReservationTable[j].timeFrom && dateTo <= results[i].ReservationTable[j].timeTo)
				) {
					console.log("conflict");
					break;
				} else {
					filtredResults.push(results[i]);
				}
			}
		}
	}

	return res.json(filtredResults);
});

module.exports = router;
