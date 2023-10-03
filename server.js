const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5050;

// Use of Helmet middleware
app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
    },
  })
);

// Disable the X-Powered-By header
app.disable("x-powered-by");

// Use the X-Frame-Options header - Missing Anti-clickjacking Header
app.use(helmet.frameguard({ action: "deny" }));

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  next();
});

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

//Customer Routes
const cartRouter = require("./routes/customer-routes/cart");
const favRouter = require("./routes/customer-routes/favItems");
const reviewRouter = require("./routes/customer-routes/review");

// user management routes
const userRoutes = require("./routes/userManagement-routes/userRegistration");
const userLoginRoutes = require("./routes/userManagement-routes/userLogin");
const passwordResetRoutes = require("./routes/userManagement-routes/passwordReset");

//Store admin routes
const storeAdmin = require("./routes/storeAdmin-routes/storeAdmin.routes");

const req = require("express/lib/request");

// Delivery Routes
const deliveryRoutes = require("./routes/delivery-routes/deliveryOrder");

//Customer Routes
app.use("/cart", cartRouter);
app.use("/favorites", favRouter);
app.use("/reviews", reviewRouter);

// User Management Routes
app.use("/user", userRoutes);
app.use("/user/login", userLoginRoutes);
app.use("/user/password-reset", passwordResetRoutes);

// Delivery Routes
app.use("/delivery", deliveryRoutes);

//storeAdmin routes
app.use("/storeAdmin", storeAdmin);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
