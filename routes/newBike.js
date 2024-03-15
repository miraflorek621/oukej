require("dotenv/config");

const express = require("express");
const router = express.Router();
const path = require("path");
const ReservationTable = require("../models/reservation_model");

router.get("/", (req, res) => {
  return res.render(path.join(__dirname, "..", "frontend", "nove-kolo.html"));
});

router.post("/", async (req, res) => {
  // Get the data from the request.body check if they are not null

  try {
    console.log(req.body);
    /*

    const { image } = req.files;
    if (!image) {
      return res.status(400).json({ status: "No image found" });
    }

    if (!/^image/.test(image.mimetype)){
		return res.status(400).json({ status: "Wrong file type" });
	}


    const BycicleName = req.body.BycicleName;
    const Quantity = req.body.Quantity;
    const BycicleImage = req.body.BycicleImage;
    const Brand = req.body.Brand;

	console.log(req.files)
	console.log(req.body)

    if (!BycicleName || !Quantity || !BycicleImage || !Brand) {
      return res.json({ message: "Něco chybí" });
    }


    
        const newBike = new ReservationTable({
            BycicleName: BycicleName,
            Quantity: Quantity,
            BycicleImage: BycicleImage,
            Brand: Brand,
        });
    
        await newBike.save();
    
        return res.json({ message: "Kolo bylo úspěšně přidáno" });


	*/
  } catch (error) {
    console.log(error.toString());
  }
});

module.exports = router;
