const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const user = require("./routes/user");


app.use(cors());
app.use(bodyParser.json()); // parse request body to json 

app.use(express.json()); // express json use as a middleware


// testing app routes  
app.get("/" , (req, res)=>{
    res.send("api is working fine");
})


app.use("/users", user)

module.exports = app;