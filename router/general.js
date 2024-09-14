const express = require('express');
const axios = require('axios')
// for implementing async
const {books, getBooks} = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  // const username = req.body.username;
  // const password = req.body.password;
  console.log(req.body)
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  let books = await getBooks()
  //Write your code here
  return res.status(200).json(books);
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  let isbn = parseInt(req.params.isbn)
  let t = await axios.get('http:localhost:5000')
  let books = t['data']
  // console.log(books['data'])
  // res.json(books)
  if (isbn < 1 || isbn > 10) {
    return res.status(400).json({ msg: 'Invalid ISBN' })
  }
  return res.status(200).json({ [isbn]: books[req.params.isbn] });
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code 
  let t = await axios.get('http:localhost:5000')
  let books = t['data']
  let author = req.params.author
  let books_by_author = []
  Object.entries(books).forEach(function ([ISBN, book]) {
    if (book.author == author) {
      book['ISBN'] = ISBN
      books_by_author.push(book)
    }
  })
  return res.status(200).json({ [author]: books_by_author });
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  let t = await axios.get('http:localhost:5000')
  let books = t['data']
  let title = req.params.title
  let books_by_title = []
  Object.entries(books).filter(function([ISBN, book]) {
    if(book.title == title){
      book['ISBN'] = ISBN
      books_by_title.push(book)
    }

  })
  //Write your code here
  return res.status(200).json({ [title]: books_by_title});
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  //Write your code here
  let books = await getBooks()
  let ISBN = req.params.isbn
  let isbn = parseInt(ISBN)
  if (isbn < 1 || isbn > 10) {
    return res.status(400).json({ msg: 'Invalid ISBN' })
  }
 
  return res.status(200).json({ [ISBN]: books[isbn] });
});

module.exports.general = public_users;
