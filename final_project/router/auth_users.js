const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username is valid
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Check if username and password match
const authenticatedUser = (username, password) => {
    const user = users.find(user => user.username === username);
    return user ? user.password === password : false;
}

// Only registered users can log in
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if the username is valid and authenticated
    if (!isValid(username) || !authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create a token and send it to the user
    const accessToken = jwt.sign({ username }, 'your_secret_key', { expiresIn: '1h' });
    req.session.authorization = { accessToken, username }; // Store token in session
    return res.status(200).json({ message: "Login successful", accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { username } = req.session.authorization;
    const { review } = req.body; // Assuming the review is sent in the request body
    const isbn = req.params.isbn;

    // Check if user is authenticated
    if (!username) {
        return res.status(403).json({ message: "Unauthorized access" });
    }

    // Check if the book exists
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Add the review to the book
    if (!book.reviews) {
        book.reviews = {};
    }

    book.reviews[username] = review; // Save the review under the username
    return res.status(200).json({ message: "Review added successfully" });
});

// User Registration
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if the username is already taken
    if (isValid(username)) {
        return res.status(400).json({ message: "Username already taken" });
    }

    // Add new user to the users array
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;