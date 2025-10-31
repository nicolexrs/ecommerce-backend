// import modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDatabase from "./src/config/database.js";
import productRoutes from "./src/routes/productRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import {fileURLToPath} from "url";
import path from "path"; 

dotenv.config();
const server = express();
const port = process.env.PORT;
const filename = fileURLToPath(import.meta.url);
const directoryName = path.dirname(filename);

server.use(cors());
server.use(express.json());
server.use("/api", productRoutes);
server.use("/api" , cartRoutes);
server.use("/uploads", express.static(path.join(directoryName, "uploads")));

server.listen(port, () => {
  connectDatabase();
  console.log(`Server running on http://127.0.0.1:${port}`);
});
