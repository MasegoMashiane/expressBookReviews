const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    return users.some(
        user => user.username === username && user.password === password
    );
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if(!username || !password){
    return res.status(400).json({ message: "Username and password required"});
  }

  let accessToken = jwt.sign(
    { username: username},
    "access",
    { expiresIn: "1h"}
  );

  return res.status(200).json({
    message: "User successfully logged in",
    token: accessToken
  })
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;

  const username = req.user.username;

  if (!books[isbn]){
    return res.status(404).json({message: "Book not found"});
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/update successfully",
    reviews: books[isbn].reviews
  })
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;