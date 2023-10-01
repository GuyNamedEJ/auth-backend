const mongoose = require('mongoose')

// Define the schema for Users
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique : [true, "User already exists with this email"]
    },

    password: {
        type: String,
        required: [true, "Please enter a password"],
        unique: false
    }
})

// "create a user table or collection if there is no table with that name already".
module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema)