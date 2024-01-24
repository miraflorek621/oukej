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
		return res.status(200).json({ message: "Success" });
	} catch (err) {
		return res.status(500).json({ message: err });
	}
});

module.exports = router;
