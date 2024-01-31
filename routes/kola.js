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

        // Find all reservations
        let results = await newReservation.find();

        let filteredDateResults = [];

        // Filter out bikes whose reservations fall outside the specified date range
        for (let i = 0; i < results.length; i++) {
            let isInRange = false;

            for (let j = 0; j < results[i].ReservationTable.length; j++) {
                if (!isDateInRange(
                    new Date(results[i].ReservationTable[j].timeFrom),
                    new Date(results[i].ReservationTable[j].timeTo),
                    dateFrom,
                    dateTo
                )) {
                    isInRange = true;
                    break;
                }
            }

            if (!isInRange) {
                filteredDateResults.push(results[i]);
            }
        }

        let filteredBikes = [];

        // Update available quantities for filtered bikes
        for (let i = 0; i < filteredDateResults.length; i++) {
            const bike = filteredDateResults[i];
            let totalQuantity = 0;

            // Calculate total quantity reserved for the bike
            for (let j = 0; j < bike.ReservationTable.length; j++) {
                totalQuantity += parseInt(bike.ReservationTable[j].Quantity);
            }

            // Check if available quantity is sufficient
            if (bike.Quantity >= totalQuantity) {
                // Decrement available quantity
                await newReservation.findOneAndUpdate(
                    { BycicleName: bike.BycicleName },
                    { $inc: { Quantity: -totalQuantity } }
                );

                filteredBikes.push(bike);
            }
        }

        // Return filtered bikes with updated quantities
        return res.status(200).json(filteredBikes);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


module.exports = router;