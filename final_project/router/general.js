const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


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
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 2));  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if  (books[isbn]){
    return res.json(books[isbn])
  } else {
    return res.status(404).json({ message : "Book not found"});
  }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase();

  let filteredBooks = {};

  Object.keys(books).forEach(isbn =>{
    if (books[isbn].author.toLowerCase()=== author){
        filteredBooks[isbn] = books[isbn];
    }
  })
  return res.json(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase();

  let filteredBooks = {};

  Object.keys(books).forEach( isbn => {
    if (books[isbn].title.toLowerCase() === title){
        filteredBooks[isbn] = books[isbn];
    }
  });

  return res.json(filteredBooks)
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