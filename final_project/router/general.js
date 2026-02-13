const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    
    const username = req.body.username;
    const password = req.body.password;
    
    if (!username || !password) {
      return res.status(400).json({message: "Username and password are required"});
    }
    
    if (users.find(user => user.username === username)) {
      return res.status(409).json({message: "Username already exists"});
    }
    
    users.push({username: username, password: password});
    
    return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn], null, 4));
      } else {
        res.status(404).json({message: "Book not found"});
      }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
    const author = req.params.author;

    let booksByAuthor = Object.values(books).filter(book => book.author === author);

    if (booksByAuthor.length > 0) {
        res.send(JSON.stringify(booksByAuthor, null, 4));
      } else {
        res.status(404).json({message: "No books found by this author"});
      }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

    const title = req.params.title;
  
  
    let booksByTitle = Object.values(books).filter(book => book.title === title);
    
    if (booksByTitle.length > 0) {
        res.send(JSON.stringify(booksByTitle, null, 4));
    } else {
        res.status(404).json({message: "No books found with this title"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
    const isbn = req.params.isbn;

    if (books[isbn]) {
        const reviews = books[isbn].reviews;
        
        if (Object.keys(reviews).length > 0) {
          res.send(JSON.stringify(reviews, null, 4));
        } else {
          res.status(404).json({message: "No reviews found for this book"});
        }
      } else {
        res.status(404).json({message: "Book not found"});
      }
});

// Function to get all books using async-await with Axios
async function getAllBooks() {
    try {
      const response = await axios.get('http://localhost:5000/');
      console.log("All Books:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching all books:", error.message);
      throw error;
    }
  }
  
  // Function to get book by ISBN using Promises with Axios
  function getBookByISBN(isbn) {
    return axios.get(`http://localhost:5000/isbn/${isbn}`)
      .then(response => {
        console.log(`Book with ISBN ${isbn}:`, response.data);
        return response.data;
      })
      .catch(error => {
        console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
        throw error;
      });
  }

  async function getBooksByAuthor(author) {
    try {
      const response = await axios.get(`http://localhost:5000/author/${author}`);
      console.log(`Books by ${author}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching books by ${author}:`, error.message);
      throw error;
    }
  }
  
  function getBooksByTitle(title) {
    return axios.get(`http://localhost:5000/title/${title}`)
      .then(response => {
        console.log(`Books with title "${title}":`, response.data);
        return response.data;
      })
      .catch(error => {
        console.error(`Error fetching books with title "${title}":`, error.message);
        throw error;
      });
  }
  
  getAllBooks();
  getBookByISBN(1);
  getBooksByAuthor("Chinua Achebe");
  getBooksByTitle("Things Fall Apart");

module.exports.general = public_users;
