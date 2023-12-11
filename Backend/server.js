require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const HOST = process.env.HOST;
const PORT = process.env.PORT;
const Connection = process.env.DB_CONNECTION;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import Routes
const loginRoute = require("./routes/login");

// Endpoints
app.use("/login", loginRoute);

app.get("/", (req, res) => {
    res.send("Welcome to the API");
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
