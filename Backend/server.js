require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const HOST = process.env.HOST;
const PORT = process.env.PORT;
const Connection = process.env.DB_CONNECTION;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..", "Frontend")));

// Import Routes
const reservationRoute = require("./routes/reservation");

// Endpoints
app.use("/rezervace", reservationRoute);



app.get("/", (req, res) => {
	return res.sendFile(path.join(__dirname, "..", "Frontend", "index.html"));
});	

app.get("/*", (req, res) => {
	res.send("404");
});

app.listen(PORT, HOST, () => {
	console.log(`Server is running on http://${HOST}:${PORT}`);
	
	mongoose
		.connect(Connection, { useNewUrlParser: true })
		.then(() => console.log("Connected to MongoDB!"))
		.catch((error) => console.error(error));
		
});