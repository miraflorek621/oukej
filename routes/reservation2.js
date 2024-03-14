// Import .env variables
require("dotenv/config");

const express = require("express");
const router = express.Router();
const path = require("path");
const newReservation = require("../models/reservation_model");

const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const { randomUUID } = require("crypto");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ADD,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
});

const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve("./email_templates"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./email_templates"),
};

transporter.use("compile", hbs(handlebarOptions));
async function SendMail(user, bikes) {
  // Convert quantity values to integers
  const formattedBikes = bikes.map((bike) => ({
    name: bike.name,
    quantity: parseInt(bike.quantity, 10),
    price: parseInt(bike.TotalPrice, 10),
  }));

  let validPrice = 0;

  for (let i = 0; i < formattedBikes.length; i++) {
    validPrice += formattedBikes[i].price;
  }

  const mailOptions = {
    from: '"Mr. Rental Harachov" <mr.rental.harrachov@gmail.com>',
    template: "verification",
    to: user.email,
    subject: `Ahoj ${user.name}, zde je info o tvé objednávce`,
    context: {
      name: user.name,
      phone: user.phone,
      bikes: formattedBikes,
      time: user.time,
      time1: user.time1,
      price: validPrice,
    },
  };

  try {
    console.log(formattedBikes);
    console.log(validPrice);
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error.toString());
  }
}

router.get("/", (req, res) => {
  return res.render(
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

    let emailName = "";
    let emailEmail = "";
    let emailPhone = "";

    req.body.forEach((element) => {
      if (element.name == "name") {
        emailName = element.value;
      }
      if (element.name == "email") {
        emailEmail = element.value;
      }
      if (element.name == "phone") {
        emailPhone = element.value;
      }
    });

    const orderedBikes = [];

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

    timeFrom = timeFrom.split("T", 1).toString();
    let validTimeF = timeFrom.split("-");
    validTimeF = validTimeF[2] + "." + validTimeF[1] + "." + validTimeF[0];

    timeTo = timeTo.split("T", 1).toString();
    let validTimeT = timeTo.split("-");
    validTimeT = validTimeT[2] + "." + validTimeT[1] + "." + validTimeT[0];

    let fromDate = new Date(timeFrom.split("T")[0]);
    let toDate = new Date(timeTo.split("T")[0]);
    let differenceInMilliseconds = Math.abs(toDate - fromDate);
    let TotalDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

    const userObject = {
      name: emailName,
      email: emailEmail,
      phone: emailPhone,
      time: validTimeF,
      time1: validTimeT,
    };

    // Check if any bikes were selected
    if (result.length == 0) {
      return res
        .status(400)
        .json({ message: "Please Select at least one bike" });
    }

    // Process each selected bike
    for (let i = 0; i < result.length; i++) {
      const queryResult = await newReservation.findOne({
        BycicleName: result[i].BycicleName,
      });

      let totalReservedQuantity = 0;

      // Calculate the total quantity of bikes already reserved during the requested time period
      for (let j = 0; j < queryResult.ReservationTable.length; j++) {
        if (
          isDateInRange(
            new Date(queryResult.ReservationTable[j].timeFrom),
            new Date(queryResult.ReservationTable[j].timeTo),
            new Date(result[i].timeFrom),
            new Date(result[i].timeTo)
          )
        ) {
          totalReservedQuantity += parseInt(
            queryResult.ReservationTable[j].Quantity
          );
        }
      }

      // Check if there are enough bikes available considering the requested time period
      if (
        totalReservedQuantity + parseInt(result[i].Quantity) <=
        queryResult.Quantity
      ) {
        // Add the reservation to the bike
        await newReservation.updateOne(
          { BycicleName: result[i].BycicleName },
          {
            $push: {
              ReservationTable: {
                timeFrom: result[i].timeFrom,
                timeTo: result[i].timeTo,
                Quantity: result[i].Quantity,
                name: userObject.name,
                email: userObject.email,
                phone: userObject.phone,
                id: randomUUID(),
                TotalPrice: result[i].Quantity * queryResult.Price * TotalDays,
              },
            },
          }
        );

        orderedBikes.push({
          name: result[i].BycicleName,
          quantity: result[i].Quantity,
          TotalPrice: result[i].Quantity * queryResult.Price * TotalDays,
        });
      } else {
        return res.status(400).json({ message: "Not enough bikes available" });
      }
    }

    SendMail(userObject, orderedBikes);

    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(500).json({ message: err.toString() });
  }
});

module.exports = router;
