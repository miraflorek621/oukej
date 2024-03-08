// Import .env variables
require("dotenv/config");

const express = require("express");
const router = express.Router();
const path = require("path");
const PSWD = process.env.ADMIN_PSWD


router.get("/", (req, res) => {
	return res.sendFile(path.join(__dirname, "..", "frontend", "administrace-login.html"));
});

router.post("/", (req, res) =>{

    if(req.body.password == PSWD){
        return res.json({message : 'nevim'})
    }
    else{
        return res.json({message: "Spatne Heslo"})
    }

})



module.exports = router;
