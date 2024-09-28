const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Session middleware for handling customer sessions
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.session.authorization && req.session.authorization.accessToken;

    if (!token) {
        return res.status(403).send({ message: "Unauthorized access" });
    }

    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) {
            return res.status(403).send({ message: "Failed to authenticate token" });
        }
        req.user = user; // Save user information in request
        next(); // Proceed to the next middleware or route handler
    });
});

const PORT = 5000;

// Set up routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start the server
app.listen(PORT, () => console.log("Server is running on port " + PORT));