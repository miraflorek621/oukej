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

		for (let i = 0; i < req.body.length; i++) {
			if (req.body[i].name == "timeFrom") {
				timeFrom = req.body[i].value;
			}
			if (req.body[i].name == "timeTo") {
				timeTo = req.body[i].value;
			} else {
				let temp = await newReservation.findOne({
					BycicleName: req.body[i].name,
				});
				if (temp != null) {
					result.push(temp);
				}
			}
		}

		if (result.length == 0) {
			return res
				.status(400)
				.json({ message: "Please Select at least one bike" });
		}

	

		for (let i = 0; i < result.length; i++) {
			// if there is no reservation for this bike yet then create one
			if (result[i].ReservationTable.length == 0) {
				await newReservation.findOneAndUpdate(
					{ BycicleName: result[i].BycicleName },
					{
						$push: {
							ReservationTable: {
								timeFrom: timeFrom,
								timeTo: timeTo,
							},
						},
					}
				);
			} else {
				// if there is a reservation for this bike then check if the new reservation is not in conflict with the old one
				for (let j = 0; j < result[i].ReservationTable.length; j++) {
					if (
						result[i].ReservationTable[j].timeFrom <= timeTo &&
						result[i].ReservationTable[j].timeTo >= timeFrom
					) {
						return res.status(400).json({ message: "Conflict" });
					}
					else{
						await newReservation.findOneAndUpdate(
							{ BycicleName: result[i].BycicleName },
							{
								$push: {
									ReservationTable: {
										timeFrom: timeFrom,
										timeTo: timeTo,
									},
								},
							}
						);
					}
				}
			}
		}

		return res.status(200).json({ message: "Success" });
	} catch (err) {
		return res.status(500).json({ message: err });
	}
});

module.exports = router;
