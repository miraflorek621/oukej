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
					result.push({ BycicleName: req.body[i].name, Quantity: req.body[i].value});
				}
			}
		}

		if (result.length == 0) {
			return res
				.status(400)
				.json({ message: "Please Select at least one bike" });
		}

		for (let i = 0; i < result.length; i++) {
			const queryResult = await newReservation.findOne({
				BycicleName: result[i].BycicleName,
			});

			if (queryResult.ReservationTable.length == 0) {
				await newReservation.updateOne(
					{ BycicleName: result[i].BycicleName },
					{
						$push: { ReservationTable: 
							{ 
								timeFrom: timeFrom,
							  	timeTo: timeTo,
								Quantity: result[i].Quantity,
							} 
						},
					}
				);
			}
			else{

				let temp = 0;

				for(let j = 0; queryResult.ReservationTable.length > j; j++)
				{
					temp = temp + parseInt(queryResult.ReservationTable[j].Quantity);
				}

				console.log(temp);
				console.log(result[i].Quantity);

				if(temp > result[i].Quantity)
				{
					return res.status(400).json({ message: "Not enough bikes" });
				}
				else{
					await newReservation.updateOne(
						{ BycicleName: result[i].BycicleName },
						{
							$push: { ReservationTable: 
								{ 
									timeFrom: timeFrom,
								  	timeTo: timeTo,
									Quantity: result[i].Quantity,
								} 
							},
						}
					);
				}
			}	
			
		}

		return res.status(200).json({ message: "Success" });
	} catch (err) {
		return res.status(500).json({ message: err.toString() });
	}
});

module.exports = router;
