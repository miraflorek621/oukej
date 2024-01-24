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
	const bikeList = [];

	const timeFrom = new Date(req.body[0].split("=")[1]);
	const timeTo = new Date(req.body[1].split("=")[1]);

	for (let i = 2; i < req.body.length; i++) {
		let split = req.body[i].split("=");
		let parsedBike = split[0].split("Bike").join("").trim();

		const result = await newReservation.findOne({ BycicleName: parsedBike });
		if (!result) {
			return res.status(404).json({ message: "Bike not found" });
		}
		if (result.Quantity < split[1]) {
			return res.status(404).json({ message: "Not enough bikes" });
		}
		await newReservation.updateMany(
			{ BycicleName: parsedBike },
			{
				$push: {
					ReservationTable: {
						$each: [
							{
								Quantity: result.Quantity - parseInt(split[1]),
								TimeFrom: timeFrom,
								TimeTo: timeTo,
							},
						],
						$position: 0,
					},
				},
			}
		);
	}

	return res.json({ message: "Success" });
});

module.exports = router;
