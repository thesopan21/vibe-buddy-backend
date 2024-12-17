import connectToMongodb from "src/model/userModel";
import app from "./src/app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  connectToMongodb()
  console.log(`Server is running on port http://localhost:${PORT}`);
});