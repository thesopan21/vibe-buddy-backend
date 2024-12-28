import app from "./app";
import connectToMongodb from "./config/database";
import { PORT } from "./utils/processEnvVaribale";




app.listen(PORT, () => {
  connectToMongodb()
  console.log(`Server is running on port http://localhost:${PORT}`);
});