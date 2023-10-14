const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "kareem", password: "password" }];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  if (username.length > 3 && username.length < 15) return true;
  return false;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let user = users.filter(
    (user) => user.username === username && user.password === password
  );
  if (user.length === 0) return false;
  return true;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  let user = users.filter((user) => user.username === username)[0];
  if (!user) {
    return res.status(403).json({ token: "User doesn't exist, register!" });
  }
  let token;
  if (authenticatedUser(username, password)) {
    try {
      token = jwt.sign(
        {
          username: username,
          password: password,
        },
        "JWT_KEY"
      );
      req.session.authorization = {
        token,
        username,
      };
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "couldn't login, pls try again" });
    }
  } else {
    return res.status(403).json({ message: "wrong username and/or password" });
  }

  return res.status(200).json({ token: token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const user = req.session.authorization.username;
  const review = req.body.review;

  let bookId = req.params.isbn;

  books[bookId].reviews = {
    ...{
      [user]: review,
    },
  };

  return res.status(201).json({ message: "Review Added", book: books[bookId] });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let bookId = req.params.isbn;
  const user = req.session.authorization.username;
  if (books[bookId].reviews[user]) {
    delete books[bookId].reviews[user];
    return res
      .status(201)
      .json({ message: "Review Removed", book: books[bookId] });
  } else {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this review" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
