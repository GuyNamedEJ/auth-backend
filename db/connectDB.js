// mongoose is needed for creating connection to MongoDB database
const mongoose = require('mongoose')

// Get access to ENV file so I can get URI for database
require('dotenv').config()

console.log(process.env.MONGODB_URI)
async function dbConnect(){
    
    // use mongoose to connect this app to our database on mongoDB using the DB_URL (connection string)
    mongoose
    .connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("Database connection successful")
        })
        .catch((e) => {
            console.log("Unable to connect to MongoDB")
            console.error(e)
        })
}

module.exports = dbConnect