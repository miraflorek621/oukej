// Import .env variables
require("dotenv/config");

const express = require("express");
const router = express.Router();
const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");
const newReservation = require("../models/login_model");

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


router.get("/", (req, res) => {
	return res.sendFile(path.join(__dirname, "..", "..", "Frontend", "rezervace.html"));
});


router.post("/", async (req, res) => {


	console.log(req.body);

	res.status(200).json({ message: "Email sent" });

	/*


	const name = req.body.name + " " + req.body.lname;

	const emailObject = {
		name: name,
		email: req.body.email,
	}

	const Reservation = new newReservation({
		username: name,
		email: req.body.email,
	})

	try {
		await Reservation.save()
		SendMail(emailObject);
		res.status(200).json({ message: "Email sent" });
	} catch (error) {
		console.log(error);
	}


	*/
});

module.exports = router;
