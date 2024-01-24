// Import .env variables
require("dotenv/config");

const express = require("express");
const router = express.Router();
const path = require("path");

/*

const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");
const newReservation = require("../models/reservation_model");

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
async function SendMail(user) {
	const mailOptions = {
		from: '"Rental Harachov" <mr.rental.harrachov@gmail.com>',
		template: "verification",
		to: user.email,
		subject: `Ahoj ${user.name}, zde je info o tve objednavce`,
		context: {
			name: user.name,
		},
	};

	try {
		await transporter.sendMail(mailOptions);
	} catch (error) {
		console.log(error);
	}
}

*/

router.get("/", async (req, res) => {
	return res.sendFile(path.join(__dirname, "..", "frontend", "rezervace.html"));
});

router.post("/", async (req, res) => {
	if (!req.body.timeFrom || !req.body.timeTo) {
		console.log(1);
		return res.status(400).json({ message: "Please fill all fields" });
	}

	console.log(req.body);

	// get current date and check if it is not in the past
	const currentDate = new Date();
	if (currentDate.getTime() > new Date(req.body.timeFrom).getTime()) {
		console.log(2);
		return res.status(400).json({ message: "Invalid time" });
	}

	const dateFrom = new Date(req.body.timeFrom);
	const dateTo = new Date(req.body.timeTo);

	const timeDifference = dateTo.getTime() - dateFrom.getTime();

	if (timeDifference < 0) {
		console.log(3);
		return res.status(400).json({ message: "Invalid time" });
	}

	const week = 604800000;

	if (timeDifference > week) {
		console.log(4);
		return res.status(400).json({ message: "Max 1 week rent" });
	}

	const fourHours = 14400000;

	if (timeDifference < fourHours) {
		console.log(5);
		return res.status(400).json({ message: "Min 4 hour rent" });
	}

	

	/*

	const emailObject = {
		name: req.body.name,
		email: req.body.email,
	}

	const Reservation = new newReservation(emailObject)

	try {
		await Reservation.save()
		SendMail(emailObject);
		res.status(200).json({ message: "Email sent" });
	} catch (error) {
		console.log(error);
	}

	*/
	console.log(6);
	return res.status(200).json({ message: "Success", dateF: dateFrom, dateT: dateTo});
});

module.exports = router;
