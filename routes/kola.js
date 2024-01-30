// Import .env variables
require("dotenv/config");

const express = require("express");
const router = express.Router();
const path = require("path");
const newReservation = require("../models/reservation_model");

router.post("/", async (req, res) => {
	console.log(req.body);

	try {
    const dateFrom = new Date(req.body.timeFrom);
    const dateTo = new Date(req.body.timeTo);

    let results = await newReservation.find();

    let filteredResults = [];

    for (let i = 0; i < results.length; i++) {
        let isAvailable = true;

        for (let j = 0; j < results[i].ReservationTable.length; j++) {
            const reservationFrom = new Date(results[i].ReservationTable[j].timeFrom);
            const reservationTo = new Date(results[i].ReservationTable[j].timeTo);

            // Check if the requested time range overlaps with any existing reservations
            if (
                (dateFrom >= reservationFrom && dateFrom <= reservationTo) ||
                (dateTo >= reservationFrom && dateTo <= reservationTo) ||
                (dateFrom <= reservationFrom && dateTo >= reservationTo)
            ) {
                isAvailable = false;
                break;
            }
        }

        if (isAvailable) {
            filteredResults.push(results[i]);
        }
    }

    return res.json(filteredResults);
} catch (error) {
    return res.status(500).json({ message: error.message });
}

});

module.exports = router;
