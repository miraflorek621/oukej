// Import .env variables
require("dotenv/config");

const express = require("express");
const router = express.Router();
const path = require("path");
const newReservation = require("../models/reservation_model");

router.post("/", async (req, res) => {


    const timeFrom = new Date(req.body.timeFrom);
    const timeTo = new Date(req.body.timeTo);

    const result = await newReservation.find()


    return res.json(result);
});

module.exports = router;