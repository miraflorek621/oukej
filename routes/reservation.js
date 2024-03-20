// Import .env variables
require("dotenv/config");

const express = require("express");
const router = express.Router();
const path = require("path");
const newReservation = require("../models/reservation_model");







router.get("/", async (req, res) => {
	return res.render(path.join(__dirname, "..", "frontend", "rezervace.html"));
});

router.post("/", async (req, res) => {
	if (!req.body.timeFrom || !req.body.timeTo) {
		return res.status(400).json({ message: "Prosím vyplňte všechny pole"});
	}


	// get current date and check if it is not in the past
	const currentDate = new Date();
	if (currentDate.getTime() > new Date(req.body.timeFrom).getTime()) {
		return res.status(400).json({ message: "Neplatný čas" });
	}

	const dateFrom = new Date(req.body.timeFrom);
	const dateTo = new Date(req.body.timeTo);

	const timeDifference = dateTo.getTime() - dateFrom.getTime();

	console.log('Time diff ' + timeDifference)

	if (timeDifference < 0) {
		return res.status(400).json({ message: "Neplatný čas" });
	}

	const week = 604800000;

	if (timeDifference > week) {
		return res.status(400).json({ message: "Pronájem maximálně na týden" });
	}

	const oneHour = 3600000;
						
	if (timeDifference < oneHour) {
		return res.status(400).json({ message: "Pronájem minimálně na 1h" });
	}
	
	return res.status(200).json({ message: "Uspěšně", dateF: dateFrom, dateT: dateTo});
});

module.exports = router;
