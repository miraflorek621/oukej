// Import .env variables
require("dotenv/config");

const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
	return res.sendFile(path.join(__dirname, "..", "frontend", "rezervace_kola.html"));
});

module.exports = router;