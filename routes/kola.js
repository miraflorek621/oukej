// Import .env variables
require("dotenv/config");

const express = require("express");
const router = express.Router();
const path = require("path");
const newReservation = require("../models/reservation_model");

router.post("/", async (req, res) => {
	const result = await newReservation.find();

	return res.json(result);
});

module.exports = router;
