const express = require("express");
const cors = require("cors"); // Import CORS
const app = express();
const { sendSuccess } = require("./utils/response");
// const cookieParser = require("cookie-parser");

// Enable CORS for all routes (adjust options as needed)
app.use(cors()); // Basic usage (allows all origins)
// app.use(cors(corsOptions));

// const connectDB = require("./config/database");

// const {
//   jsonErrorHandler,
//   globalErrorHandler,
//   routeNotFound,
// } = require("./middlewares/errorHandler");

const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const connectDB = require("./database/mongodb");
// const profileRouter = require("./routes/profileRouter");
// // const requestRouter = require("./routes/requestRouter");
// const userRouter = require("./routes/userRouter");
//
// app.use(express.json());
// app.use(jsonErrorHandler);
// app.use(cookieParser());
//
app.use("/", authRouter);
app.use("/user", userRouter);

// app.use("/profile", profileRouter);
// app.use("/request", requestRouter);
// app.use("/user", userRouter);
//
// app.use(routeNotFound);
// app.use(globalErrorHandler);

// OR restrict to specific domains (recommended for production)
// app.use(cors({
//   origin: ['https://your-frontend-domain.com', 'http://localhost:3000']
// }));

app.use('/api/listings', ListingsRouter);

// const corsOptions = {
//   origin: "http://localhost:5173",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// Your API routes
app.get("/api", (req, res) => {
  res.json({ message: "API is working with CORS!" });
});

app.get("/test", (req, res) => {
  const data = {
    name: "ABC",
  };
  sendSuccess(res, 200, "OK", data);
});

// app.listen(PORT, () => {
//   console.log(`Server running on localhost:${PORT}`);
// });
//
// module.exports = app;

//-----------------------

const PORT = 3000;
const run = () => {
  connectDB()
    .then(() => {
      console.log("Database connected successfully.");
      app.listen(PORT, () => {
        console.log(`server running on port: ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Error connecting to database. " + err.message);
    });
};

run();
module.exports = { run };
