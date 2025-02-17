const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require('cors');
const app = express();
const Router = require('./Routes/Router');

app.use(express.json());

// Determine which .env file to use based on the NODE_ENV
const envPath =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: path.resolve(__dirname, envPath) });

const { MONGO_URI } = process.env;

// Log the MongoDB URI to verify it's loaded
console.log("MongoDB URI:", MONGO_URI);

// Check if MONGO_URI is defined
if (!MONGO_URI) {
  console.error("MONGO_URI is not defined in environment variables.");
  process.exit(1); // Exit the application if MONGO_URI is not set
}

// Use cors middleware before defining any routes
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://scribbie-notes.vercel.app"]
    : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // access-control-allow-credentials:true
    methods: "GET,PUT,POST,DELETE",
    optionSuccessStatus: 200,
  })
);

// Connect to MongoDB
(async function () {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
})();

// All the routes are available here
app.use('/', Router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;