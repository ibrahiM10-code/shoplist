import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/apiRoutes.js";

dotenv.config({ path: "../.env" });

const MONGODB_HOST = process.env.MONGODB_HOST;
const DB_HOST = process.env.ALTERNATE_HOST;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

app.use("/api", router);

async function connectDB() {
    try {
        mongoose.connection.on('connected', () => console.log('Successfull DB connection!'));
        await mongoose.connect(MONGODB_HOST);
    } catch (error) {
        console.error(error);
    }
}

connectDB();

app.listen(3001, () => console.log("Server running on port", 3001));