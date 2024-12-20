import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import { residencyRoute } from "./routes/residencyRoute.js";
import { userRoute } from "./routes/userRoute.js";



dotenv.config();

const app = express();
app.get("/test", (req, res) => {
    console.log("Test ok");
    res.status(200).send("Test ok");
  });
app.use(express.json());
app.use(cors());

app.use("/api/user", userRoute);
app.use("/api/residency", residencyRoute);

 
 export default app;
