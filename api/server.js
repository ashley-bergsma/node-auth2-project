const express = require("express"); 
const helmet = require("helmet"); 
const cors = require("cors"); 


//  
const usersRouter = require("../users/users-router"); 
// const authenticateUser = require("../auth/auth-middleware"); 
const server = express(); 

server.use(express.json()); 
server.use(cors()); 
server.use(helmet()); 

//! Routers will go here !// 
// server.use("/api/auth", authRouter); 
server.use("/api/users", usersRouter); 

server.get("/", (req, res) => {
    res.send({ message: "Welcome to the api!" }); 
}); 

module.exports = server; 
