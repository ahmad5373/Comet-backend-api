const express = require("express");
const app = express();
const connection = require("./database/connection");
const user = require("./routes/user");
const cors = require("cors");
const bodyParser = require("body-parser");


app.use(cors());
app.use(bodyParser.json()); // parse request body to json 

app.use(express.json()); // express json use as a middleware


// testing app routes  
app.get("/" , (req, res)=>{
    console.log("api is working fine");
    res.send("api is working fine");
})

// connection();

app.use("/users", user)

module.exports = app;