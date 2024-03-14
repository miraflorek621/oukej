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

    let results = await newReservation.find();

    let availableBikes = [];

    // Iterate through each bike to check availability
    for (let i = 0; i < results.length; i++) {
      let availableQuantity = results[i].Quantity; // Initialize available quantity
      let isAvailable = true; // Flag to track bike availability

      for (let j = 0; j < results[i].ReservationTable.length; j++) {
        // Check if any reservation conflicts with the requested time period
        if (
          isDateInRange(
            new Date(results[i].ReservationTable[j].timeFrom),
            new Date(results[i].ReservationTable[j].timeTo),
            dateFrom,
            dateTo
          )
        ) {
          // If there's a conflict, reduce the available quantity
          availableQuantity -= parseInt(
            results[i].ReservationTable[j].Quantity
          );
          // If the available quantity becomes negative, mark the bike as unavailable
          if (availableQuantity < 0) {
            isAvailable = false;
            break; // No need to check further if the bike is unavailable
          }
        }
      }

      // If the bike is available, add it to the list of available bikes
      if (isAvailable) {
        availableBikes.push({
          BycicleName: results[i].BycicleName,
          Quantity: availableQuantity,
        });
      }
    }

    // Return the list of available bikes with their respective quantities
    return res.status(200).json(availableBikes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/vsechny-kola", async (req, res) => {
  try {
    const results = await newReservation.find();
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/smazat-rezervaci", async (req, res) => {
  console.log(req.body);

  try {
    const results = await newReservation.find();
    // go through all bikes and reservation tables until you find req.body.ID
    for (let i = 0; i < results.length; i++) {
      for (let j = 0; j < results[i].ReservationTable.length; j++) {
        if (results[i].ReservationTable[j].id == req.body.ID) {
          // remove the reservation from the table
          results[i].ReservationTable.splice(j, 1);
          // save the changes
          results[i].save();
          return res.json({ message: results[i].BycicleName });
        }
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
