// Import .env variables
require("dotenv/config");

const express = require("express");
const router = express.Router();
const path = require("path");
const System = require("../models/system_model");

router.get("/", (req, res) => {
	return res.render(path.join(__dirname, "..", "frontend", "administrace.html"));
});

router.post("/token", async (req, res) => {

    const result = await System.findOne({Hash: req.body.token});

    if(result){
        return res.json({message: "Success"})
    }
    else{
        return res.json({message: "Invalid token"})
    }
});


module.exports = router;
