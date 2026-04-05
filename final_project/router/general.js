const express = require('express');
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();
const BASE_URL = "http://localhost:5000";

public_users.get('/books', (req, res) => {
    return res.status(200).json(books);
})

public_users.post("/register", (req,res) => {
  //Write your code here
    const  { username, password } = req.body;

    if (!username || !password){
        return res.status(400).json({ message: "Username and password required"});
    }

    if (isValid(username)){
        return res.status(409).json({ message: "User already exits" })
    }

    users.push({ username, password });

    return res.status(201).json({message: "User succesfully registered"});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  //Write your code here
  try{ 
    const response = await axios.get(`${BASE_URL}/books`);
    return res.status(200).json(response.data);
  }catch(err){
    return res.status(500).json({ message: "Error fetching books"})
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  try{
    const response = await axios.get(`${BASE_URL}/books`);
    const book = response.data[isbn];

        if (!book){
            return res.status(404).json({ message: "Book not found"})
        }

        return res.status(200).json(book);
    } catch(err){
    return res.status(500).json({ message: "Error fetching book by ISBN "})
  }
  
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  //Write your code here
  const author = req.params.author;
    try{
        const response = await axios.get(`${BASE_URL}/books`)
        const books = response.data;

        const filtered = Object.keys(books)
        .filter(key => books[key].author === author)
        .reduce((obj, key) => {
            obj[key] = books[key];
            return obj;
        }, {});

        return res.status(200).json(filtered);

    } catch(err){
        return res.status(500).json({ message: "Erro fetching books by author"})
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  //Write your code here
  const title = req.params.title;

    try {
        const response = await axios.get(`${BASE_URL}/books`)
        const books = response.data;

        const filtered = Object.keys(books)
        .filter( key => books[key].title === title)
        .reduce((obj, key) => {
            obj[key] = books[key];
            return obj;
        }, {});

        return res.status(200).json(filtered);

    } catch (err) {
        return res.status(500).json({ message: "Error fetching books by title"})
    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  const reviews = books[isbn].reviews;

  if (Object.keys(reviews).length === 0) {
    return res.json({ message: "No reviews found for this book." });
  }

    return res.json(reviews);
});

module.exports.general = public_users;