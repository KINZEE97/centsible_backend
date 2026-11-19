import cors from "cors";
import express from "express";
import "dotenv/config";
import { router } from "./routes/router";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server runnig on http://localhost:${port}`);
});
