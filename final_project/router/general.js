const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Import Axios


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

// Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
    // If you want to use Axios to fetch from an external API
    axios.get('https://abdalhadials-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/')
        .then(response => {
            // If the API call is successful, return the data from the API
            res.status(200).json(response.data); // Return the list of books from the API
        })
        .catch(error => {
            // If the API call fails, return the local book data
            console.error('Error fetching books:', error); // Log the error for debugging
            res.status(200).json(books); // Fallback to local books data
        });
});


// Get book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn; // Get the ISBN from the URL parameters
    
    try {
        // Attempt to fetch book details from an external API
        const response = await axios.get(`https://abdalhadials-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`);
        
        // Return the book details from the API
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching book details:', error); // Log the error for debugging
        
        // Fallback to local book data if the API call fails
        const book = books[isbn]; // Access the local books object using ISBN
        
        if (book) {
            res.status(200).json(book); // Send the local book details as a response
        } else {
            res.status(404).send({ message: "Book not found" }); // Handle case where book is not found
        }
    }
});

// Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author; // Get the author from the URL parameters

    try {
        // Attempt to fetch books by the author from an external API
        const response = await axios.get(`https://abdalhadials-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`);
        
        // Return the list of books by the author from the API
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching books by author:', error); // Log the error for debugging
        
        // Fallback to local book data if the API call fails
        const booksByAuthor = Object.values(books).filter(b => b.author.toLowerCase() === author.toLowerCase()); // Filter local books by author
        
        if (booksByAuthor.length > 0) {
            res.status(200).json(booksByAuthor); // Send the filtered local book details as a response
        } else {
            res.status(404).send({ message: "No books found by this author" }); // Handle case where no books are found
        }
    }
});

// Get book details based on title using async-await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title; // Get the title from the URL parameters

    try {
        // Attempt to fetch books by the title from an external API
        const response = await axios.get(`https://abdalhadials-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${title}`);
        
        // Return the list of books by the title from the API
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching books by title:', error); // Log the error for debugging
        
        // Fallback to local book data if the API call fails
        const booksByTitle = Object.values(books).filter(b => b.title.toLowerCase() === title.toLowerCase()); // Filter local books by title
        
        if (booksByTitle.length > 0) {
            res.status(200).json(booksByTitle); // Send the filtered local book details as a response
        } else {
            res.status(404).send({ message: "No books found with this title" }); // Handle case where no books are found
        }
    }
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