const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// User Registration
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if the username is already taken
    if (isValid(username)) {
        return res.status(400).json({ message: "Username already taken" });
    }

    // Add new user to the users array
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.status(200).json(books); // Return the list of books
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Get the ISBN from the URL parameters
    const book = books[isbn]; // Access the book using the ISBN key

    if (book) {
        res.status(200).json(book); // Send the book details as a response
    } else {
        res.status(404).send({ message: "Book not found" }); // Handle case where book is not found
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; // Get the author from the URL parameters
    const booksByAuthor = Object.values(books).filter(b => b.author.toLowerCase() === author.toLowerCase()); // Filter books by author
    res.status(200).json(booksByAuthor); // Send the filtered books
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title; // Get the title from the URL parameters
    const booksByTitle = Object.values(books).filter(b => b.title.toLowerCase() === title.toLowerCase()); // Filter books by title
    res.status(200).json(booksByTitle); // Send the filtered books
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Get the ISBN from the URL parameters
    const book = books[isbn]; // Access the book using the ISBN key

    if (book && Object.keys(book.reviews).length > 0) {
        res.status(200).json(book.reviews); // Send the reviews of the book
    } else {
        res.status(404).send({ message: "Book not found or no reviews available" }); // Handle case where book is not found
    }
});

module.exports.general = public_users;