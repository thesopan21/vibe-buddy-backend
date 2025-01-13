import express from "express";
import helmet from "helmet";
import cors from "cors";

import userRoutes from "./routes/userRoutes";
import audioRoutes from "./routes/audioRoutes";

const app = express();

// security middleware
app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('src/public'))

// user routes
app.use("/api/v1/user", userRoutes);

// audio routes
app.use('/api/v1/audio', audioRoutes)

export default app;
