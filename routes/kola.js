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
			let isInRange = false; // Flag to track if any reservation is within the range

			for (let j = 0; j < results[i].ReservationTable.length; j++) {
				if (
					isDateInRange(
						new Date(results[i].ReservationTable[j].timeFrom),
						new Date(results[i].ReservationTable[j].timeTo),
						dateFrom,
						dateTo
					)
				) {
					// If any reservation is within the range, set the flag and break the loop
					isInRange = true;
					break;
				}
			}

			// If no reservation is within the range, push the bike to the filtered list
			if (!isInRange) {
				filteredDateResults.push(results[i]);
			}
		}

		let totalBikes = [];

		for (let i = 0; i < filteredDateResults.length; i++) {
			let bikeName = filteredDateResults[i].BycicleName;
			let totalQuantity = 0; // Initialize total quantity for each bike

			for (let j = 0; j < filteredDateResults[i].ReservationTable.length; j++) {
				totalQuantity += parseInt(filteredDateResults[i].ReservationTable[j].Quantity);
			}

			totalBikes.push({ bikeName: bikeName, totalQuantity: totalQuantity});

		}


		let filtredBikes = [];

		for(let i = 0; i < totalBikes.length; i++) {
		
			const result = await newReservation.findOne({ BycicleName: totalBikes[i].bikeName })
			if(result.Quantity > totalBikes[i].totalQuantity) {
				result.Quantity = result.Quantity - totalBikes[i].totalQuantity;
				filtredBikes.push(result);
			}
		}

		return res.status(200).json(filtredBikes);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

module.exports = router;
