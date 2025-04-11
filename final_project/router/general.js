const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Creating a promise method. The promise will get resolved when timer times out after 6 seconds.
let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve("Promise resolved")
    },6000)})

public_users.post("/register", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  myPromise.then((successMessage) => {
    res.send(JSON.stringify(books,null,3));
    console.log("From Callback " + successMessage)
  })
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (books[isbn])
  {
    myPromise.then((successMessage) => {
        res.send(books[isbn]);
        console.log("From Callback " + successMessage)
      })
  }
  else
  {
    return res.status(300).json({message: "No book under that ISBN"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  console.log("Start author check");
  let author = req.params.author;
  console.log(Object.keys(books).length);
  let found = false;
  for (let i = 1; i < Object.keys(books).length + 1; i++)
  {
    if (author == books[i]["author"])
    {
        myPromise.then((successMessage) => {
            res.send(books[i]);
            console.log("From Callback " + successMessage)
          })
        found = true;
    }
  }
  if (!found)
  {
    return res.status(300).json({message: "No book found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let found = false;
  console.log(books[1]["title"]);
  for (let i = 1; i < Object.keys(books).length + 1; i++)
  {
    if (title == books[i]["title"])
    {
        myPromise.then((successMessage) => {
            res.send(books[i]);
            console.log("From Callback " + successMessage)
          })
        found = true;
    }
  }
  if (!found)
  {
    return res.status(300).json({message: "No book found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (books[isbn])
  {
    res.send(books[isbn]["reviews"]);
  }
  else{
    return res.status(300).json({message: "Yet to be implemented"});
  }
});

module.exports.general = public_users;
