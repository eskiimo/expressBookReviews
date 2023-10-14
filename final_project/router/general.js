const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!isValid(username)) {
    return res.status(403).json({
      message: "username is not valid, should be more than 3 letters!",
    });
  }
  let user = users.filter((user) => user.username === username)[0];
  if (user) {
    return res
      .status(401)
      .json({ message: "User Already exits, try Loging in instead!" });
  } else {
    return res.status(201).json({ message: "user created" });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res, next) {
  return res.status(300).json({ message: books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const ISBN = req.params.isbn;
  let book;
  if (!books[ISBN]) {
    res.status(404).json({ message: "NO such book exists" });
  } else {
    book = books[ISBN];
  }
  return res.status(300).json({ book: book });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  let author_books = [];
  for (var prop in books) {
    if (books[prop].author === author) {
      author_books.push(books[prop]);
    }
  }
  return res.status(300).json({ message: author_books });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  let bot = [];
  for (var prop in books) {
    if (books[prop].title === title) {
      bot.push(books[prop]);
    }
  }
  return res.status(300).json({ message: bot });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const ISBN = req.params.isbn;
  let review;
  if (!books[ISBN]) {
    res.status(404).json({ message: "Not found" });
  }
  review = books[ISBN].reviews;

  return res.status(300).json({ message: review });
});

// Task 10
// Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios

function getBookList() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  getBookList().then(
    (bk) => res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send("denied")
  );
});

// Task 11
// Add the code for getting the book details based on ISBN (done in Task 2) using Promise callbacks or async-await with Axios.

function getFromISBN(isbn) {
  let book = books[isbn];
  return new Promise((resolve, reject) => {
    if (book) {
      resolve(book);
    } else {
      reject("Can't find book!");
    }
  });
}

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  getFromISBN(isbn).then((book) => res.status(200).json(book)),
    (error) => res.send(error);
});

// Task 12
// Add the code for getting the book details based on Author (done in Task 3) using Promise callbacks or async-await with Axios.

function getFromAuthor(author) {
  let author_books = [];
  return new Promise((resolve, reject) => {
    for (var isbn in books) {
      let book = books[isbn];
      if (book[author] === author) {
        output.push(book);
      }
    }
    resolve(author_books);
  });
}

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  getFromAuthor(author).then((result) => res.status(200).json(result));
});

// Task 13
// Add the code for getting the book details based on Title (done in Task 4) using Promise callbacks or async-await with Axios.

function getFromTitle(title) {
  let output = [];
  return new Promise((resolve, reject) => {
    for (var isbn in books) {
      let book_ = books[isbn];
      if (book_.title === title) {
        output.push(book_);
      }
    }
    resolve(output);
  });
}

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  getFromTitle(title).then((result) =>
    res.send(JSON.stringify(result, null, 4))
  );
});

module.exports.general = public_users;
