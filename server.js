const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require("body-parser")

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const storeItems = new Map([
    ["Harry Potter - 4K CINEMA", { priceInCents: 75000, name: "Harry Potter - 4K CINEMA" }],
    ["Harry Potter - DOLBY THEATER", { priceInCents: 50000, name: "Harry Potter - DOLBY THEATER" }],
    ["Interstellar - 4K CINEMA", { priceInCents: 75000, name: "Interstellar - 4K CINEMA" }],
    ["Interstellar - DOLBY THEATER", { priceInCents: 50000, name: "Interstellar - DOLBY THEATER" }],
    ["Avatar - 4K CINEMA", { priceInCents: 75000, name: "Avatar - 4K CINEMA" }],
    ["Avatar - DOLBY THEATER", { priceInCents: 50000, name: "Avatar - DOLBY THEATER" }],
    ["Spiderman - NO WAY HOME - 4K CINEMA", { priceInCents: 75000, name: "Spiderman - NO WAY HOME - 4K CINEMA" }],
    ["Spiderman - NO WAY HOME - DOLBY THEATER", { priceInCents: 50000, name: "Spiderman - NO WAY HOME - DOLBY THEATER" }],
    ["BATMAN - THE DARK KNIGHT - 4K CINEMA", { priceInCents: 75000, name: "BATMAN - THE DARK KNIGHT - 4K CINEMA" }],
    ["BATMAN - THE DARK KNIGHT  - DOLBY THEATER", { priceInCents: 50000, name: "BATMAN - THE DARK KNIGHT  - DOLBY THEATER" }],
    ["Doctor Strange - 4K CINEMA", { priceInCents: 75000, name: "Doctor Strange - 4K CINEMA" }],
    ["Doctor Strange - DOLBY THEATER", { priceInCents: 50000, name: "Doctor Strange - DOLBY THEATER" }],
    ["Godzilla - 4K CINEMA", { priceInCents: 75000, name: "Godzilla - 4K CINEMA" }],
    ["Godzilla - DOLBY THEATER", { priceInCents: 50000, name: "Godzilla - DOLBY THEATER" }],
    ["JOKER - 4K CINEMA", { priceInCents: 75000, name: "JOKER - 4K CINEMA" }],
    ["JOKER - DOLBY THEATER", { priceInCents: 50000, name: "JOKER - DOLBY THEATER" }],
    ["SUPERMAN - 4K CINEMA", { priceInCents: 75000, name: "SUPERMAN- 4K CINEMA" }],
    ["SUPERMAN - DOLBY THEATER", { priceInCents: 50000, name: "SUPERMAN - DOLBY THEATER" }]
])

app.post("/create-checkout-session", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: req.body.items.map(item => {
                const storeItem = storeItems.get(item.id)
                return {
                    price_data: {
                        currency: "lkr",
                        product_data: {
                            name: storeItem.name,
                        },
                        unit_amount: storeItem.priceInCents,
                    },
                    quantity: item.quantity,
                }
            }),
            success_url: `${process.env.CLIENT_URL}/payment-success`,
            cancel_url: `${process.env.CLIENT_URL}/cart/view#`,
        })
        res.json({ url: session.url })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
    'useNewUrlParser': true
}
);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

//Customer Routes
const cartRouter = require('./routes/customer-routes/cart');
const favRouter = require('./routes/customer-routes/favItems');
const reviewRouter = require('./routes/customer-routes/review')

// user management routes
const userRoutes = require("./routes/userManagement-routes/userRegistration");
const userLoginRoutes = require("./routes/userManagement-routes/userLogin");
const passwordResetRoutes = require("./routes/userManagement-routes/passwordReset");

//Store admin routes
const storeAdmin = require("./routes/storeAdmin-routes/storeAdmin.routes")

const req = require('express/lib/request');

// Delivery Routes
const deliveryRoutes = require("./routes/delivery-routes/deliveryOrder");

//Customer Routes
app.use('/cart', cartRouter);
app.use('/favorites', favRouter);
app.use('/reviews', reviewRouter);

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
