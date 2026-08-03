const express = require("express");
const cors = require("cors");
const pool = require("./config/database");
const authRoutes = require("./routes/authRoutes");

const app = express();


app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
    res.send("Hospital API is running");
});


pool.connect()
    .then(() => {
        console.log("Connected to PostgreSQL database");
    })
    .catch((error) => {
        console.log("Database connection error:", error);
    });


const PORT = 5000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});