// Import .env variables
require("dotenv/config");

const express = require("express");
const router = express.Router();
const path = require("path");
const PSWD = process.env.ADMIN_PSWD
const System = require("../models/system_model");
const { randomUUID } = require("crypto");

router.get("/", (req, res) => {
	return res.render(path.join(__dirname, "..", "frontend", "administrace-login.html"));
});

router.post("/", async (req, res) =>{

    if(req.body.password == PSWD){

        // Delete everything from the database
        await System.deleteMany({});

        const Hash = randomUUID();

        const HashVar = new System({
            Hash: Hash
		});

        await HashVar.save()

        return res.json({message: "Success", Hash: Hash})
    }
    else{
        return res.json({message: "Spatne Heslo"})
    }

})



module.exports = router;
