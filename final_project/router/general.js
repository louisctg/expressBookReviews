const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!users.find((user) => user.username === username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(409).json({ message: "User already exists" });
    }
  }
  return res.status(400).json({ message: "Unable to register user" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  Promise.resolve(books)
    .then((books) => res.send(books))
    .catch((error) => res.status(500).send(error));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  Promise.resolve(books)
    .then((books) => {
      if (books[isbn]) {
        res.send(books[isbn]);
      } else {
        res.status(404).send({ message: "Book not found" });
      }
    })
    .catch((error) => res.status(500).send(error));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  Promise.resolve(books)
    .then((books) => {
      const filteredBooks = Object.fromEntries(
        Object.entries(books).filter(([key, value]) => value.author === author)
      );
      return filteredBooks;
    })
    .then((filteredBooks) => {
      if (Object.keys(filteredBooks).length) {
        res.send(filteredBooks);
      } else {
        res.status(404).send({ message: "No books found for this author" });
      }
    })
    .catch((error) => res.status(500).send(error));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  Promise.resolve()
    .then(() => {
      const filteredBooks = Object.fromEntries(
        Object.entries(books).filter(([key, value]) => value.title === title)
      );
      return filteredBooks;
    })
    .then((filteredBooks) => {
      if (Object.keys(filteredBooks).length) {
        res.send(filteredBooks);
      } else {
        res.status(404).send({ message: "No books found with this title" });
      }
    })
    .catch((error) => res.status(500).send(error));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  return res.send(book.reviews);
});

module.exports.general = public_users;
