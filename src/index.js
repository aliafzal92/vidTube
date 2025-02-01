import "dotenv/config";
import { connectDB } from "./db/index.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    // Start server only after DB is connected
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1); // Exit process if DB connection fails
  });

app.on("error", (err) => {
  console.error("🔥 Server Error:", err);
  process.exit(1);
});

