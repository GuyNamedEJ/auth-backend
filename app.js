const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dbConnect = require("./db/connectDB");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./db/userModel");
const userModel = require("./db/userModel");
const auth = require("./auth");

// execute database connection
dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

app.post("/register", (req, res) => {
  // Hash the password before saving the email and password into the database

  // hash the password received from request body 10 times or 10 salt rounds.
  bcrypt
    .hash(req.body.password, 10)
    // create a new user instance and collect the data
    .then((hashedPassword) => {
      const user = new User({
        email: req.body.email,
        password: hashedPassword,
      });
      // save the new user
      user
        .save()
        // return success if the new user is added to the database successfully
        .then((result) => {
          res.status(200).send({
            message: "User created",
            result,
          });
        })
        // catch error if the new user wasn't added successfully to the database
        .catch((error) => {
          res.status(500).send({
            message: "User could not be created",
            error,
          });
        });
    })

    // catch error if the password hash isn't successful
    .catch((e) => {
      res.status(500).send({
        message: "Password was not hashed correctly",
        e,
      });
    });
});

// login endpoint
app.post("/login", (req, res) => {
  // Check and see if user exists in the database
  User.findOne({ email: req.body.email })

    // if a user is found, run this block of code
    .then((user) => {
      //Using bcrypt, compare the user's password with the password sent in the request
      // the bcrypt.compare returns a boolean value
      bcrypt
        .compare(req.body.password, user.password)

        // take the result of the password comparison and run the then block
        .then((passwordCheck) => {
          // If the password
          if (!passwordCheck) {
            return res.status(400).send({
              message: "Passwords don't match",
              error,
            });
          }

          // Create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          // Return success response
          res.status(200).send({
            message: "Login successfull",
            email: user.email,
            token,
          });
        })
        // catch error if password does not match
        .catch((error) => {
          res.status(400).send({
            message: "Incorrect Password",
            error,
          });
        });
    })

    // catch error if email does not exist
    .catch((e) => {
      res.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

// free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

module.exports = app;
