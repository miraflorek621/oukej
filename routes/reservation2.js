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

function isDateInRange(start1, end1, start2, end2) {
	return (
		(start1 >= start2 && start1 <= end2) || (end1 >= start2 && end1 <= end2)
	);
}

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
                        timeFrom: timeFrom,
                        timeTo: timeTo,
                    });
                }
            }
        }

        // Check if any bikes were selected
        if (result.length == 0) {
            return res.status(400).json({ message: "Please Select at least one bike" });
        }

        // Process each selected bike
        for (let i = 0; i < result.length; i++) {
            const queryResult = await newReservation.findOne({ BycicleName: result[i].BycicleName });

            let totalReservedQuantity = 0;

            // Calculate the total quantity of bikes already reserved during the requested time period
            for (let j = 0; j < queryResult.ReservationTable.length; j++) {
                if (isDateInRange(
                    new Date(queryResult.ReservationTable[j].timeFrom),
                    new Date(queryResult.ReservationTable[j].timeTo),
                    new Date(result[i].timeFrom),
                    new Date(result[i].timeTo)
                )) {
                    totalReservedQuantity += parseInt(queryResult.ReservationTable[j].Quantity);
                }
            }

            console.log("Total reserved quantity for " + queryResult.BycicleName + ": " + totalReservedQuantity);
            console.log("Requested quantity for " + queryResult.BycicleName + ": " + parseInt(result[i].Quantity));
            console.log("Total available quantity for " + queryResult.BycicleName + ": " + queryResult.Quantity);

            // Check if there are enough bikes available considering the requested time period
            if (totalReservedQuantity + parseInt(result[i].Quantity) <= queryResult.Quantity) {
                // Add the reservation to the bike
                await newReservation.updateOne(
                    { BycicleName: result[i].BycicleName },
                    {
                        $push: {
                            ReservationTable: {
                                timeFrom: result[i].timeFrom,
                                timeTo: result[i].timeTo,
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
