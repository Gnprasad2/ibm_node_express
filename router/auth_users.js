const express = require('express');
const jwt = require('jsonwebtoken');
const {books, getBooks} = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// const isValid = (username)=>{ //returns boolean
// //write code to check is the username is valid
// }

//  Function to check if the user exists
const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

// const authenticatedUser = (username,password)=>{ //returns boolean
// //write code to check if username and password match the one we have in records.
// }

// Function to check if the user is authenticated
const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'fingerprint_customer', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
let isbn = parseInt(req.params.isbn)
let user = req.session.authorization.username
books[isbn].reviews[user] = req.query.review
  //Write your code here
  return res.status(200).json({[isbn]: books[isbn]  });
});

// delete a book review
regd_users.delete("/auth/review/:isbn", async(req, res) => {
  let isbn = parseInt(req.params.isbn)
  let user = req.session.authorization.username
  let books = await getBooks()
  delete books[isbn].reviews[user]
    //Write your code here
    return res.status(200).json({[isbn]: books[isbn]  });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
