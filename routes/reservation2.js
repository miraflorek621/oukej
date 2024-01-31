// Import .env variables
require("dotenv/config");

const express = require("express");
const router = express.Router();
const path = require("path");
const newReservation = require("../models/reservation_model");

router.get("/", (req, res) => {
	return res.sendFile(
		path.join(__dirname, "..", "frontend", "rezervace_kola.html")
	);
});

router.post("/", async (req, res) => {
	try {
		let timeFrom;
		let timeTo;
		let result = [];

		// Extract timeFrom and timeTo from the request body
		for (let i = 0; i < req.body.length; i++) {
			if (req.body[i].name == "timeFrom") {
				timeFrom = req.body[i].value;
			}
			if (req.body[i].name == "timeTo") {
				timeTo = req.body[i].value;
			} else {
				// For each bike in the request body, check if it exists in the database
				let temp = await newReservation.findOne({
					BycicleName: req.body[i].name,
				});
				if (temp != null) {
					result.push({
						BycicleName: req.body[i].name,
						Quantity: req.body[i].value,
					});
				}
			}
		}

		// Check if any bikes were selected
		if (result.length == 0) {
			return res
				.status(400)
				.json({ message: "Please Select at least one bike" });
		}

		// Process each selected bike
		for (let i = 0; i < result.length; i++) {
			const queryResult = await newReservation.findOne({
				BycicleName: result[i].BycicleName,
			});

			let totalReservedQuantity = 0;

			// Calculate the total quantity of bikes already reserved
			for (let j = 0; j < queryResult.ReservationTable.length; j++) {
				totalReservedQuantity += parseInt(
					queryResult.ReservationTable[j].Quantity
				);
			}

			console.log(
				"Total reserved quantity for " +
					queryResult.BycicleName +
					": " +
					totalReservedQuantity
			);
			console.log(
				"Requested quantity for " +
					queryResult.BycicleName +
					": " +
					parseInt(result[i].Quantity)
			);
			console.log(
				"Total available quantity for " +
					queryResult.BycicleName +
					": " +
					queryResult.Quantity
			);

			console.log(
				totalReservedQuantity + parseInt(result[i].Quantity) <=
					queryResult.Quantity
			);

			// Check if there are enough bikes available
			if (
				totalReservedQuantity + parseInt(result[i].Quantity) <=
				queryResult.Quantity
			) {
				// Add the reservation to the bike
				await newReservation.updateOne(
					{ BycicleName: result[i].BycicleName },
					{
						$push: {
							ReservationTable: {
								timeFrom: timeFrom,
								timeTo: timeTo,
								Quantity: result[i].Quantity,
							},
						},
					}
				);
			} else {
				return res.status(400).json({ message: "Not enough bikes available" });
			}
		}

		return res.status(200).json({ message: "Success" });
	} catch (err) {
		return res.status(500).json({ message: err.toString() });
	}
});

module.exports = router;
