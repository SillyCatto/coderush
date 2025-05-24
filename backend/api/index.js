const express = require("express");
const cors = require("cors"); // Import CORS
const app = express();

// Enable CORS for all routes (adjust options as needed)
app.use(cors()); // Basic usage (allows all origins)

// OR restrict to specific domains (recommended for production)
// app.use(cors({
//   origin: ['https://your-frontend-domain.com', 'http://localhost:3000']
// }));

// Your API routes
app.get("/api", (req, res) => {
  res.json({ message: "API is working with CORS!" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});

module.exports = app;
