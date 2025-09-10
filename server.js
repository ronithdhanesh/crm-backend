const express = require("express");

app = express();
port = 5002

app.get("/", (req, res)=>{
    res.send("hii");
})
app.listen(port, ()=>{
    console.log("app running on port ",port)
})



console.log("server running ");
console.log("helloooww");
