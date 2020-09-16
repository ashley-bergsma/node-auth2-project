const express = require("express"); 
const users = require("./users-model"); 
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 

const router = express.Router(); 

//* 🎇 Register new user 🎇 *// 
router.post("/register", (req, res) => {
    const { username, password, department } = req.body; 
    if (username && password && department) {
        users.add({username, password: bcrypt.hashSync(password, 4), department})
            .then(user => {
                res.status(201).json({ message: "Registration successful!", username: username }); 
            })
            .catch(err => {
                res.status(500).json({ message: "Registration failed" });
            })
    } else if (!username || !password || !department) {
        res.status(403).json({ message: "Missing or invalid field entries" }); 
    }
}); 

//* 🎇 Login an existing user 🎇 *// 
router.post("/login", (req, res) => {
    const { username, password } = req.body; 

    if(!username || !password){
        res.status(403).json({ message: "Please provide valid username and password" }); 
    } else {
        users.findBy(username)
            .then(user => {
                if (user && bcrypt.compareSync(password, user.password)) {
                    const token = generateToken(user); 
                    res.status(200).json({ message: `Welcome back ${username}!`, token }); 
                }
            })
            .catch(err => {
                console.log(err); 
                res.status(500).json({ message: "Login failed" }); 
            })
    }
}); 

//* 🎇 A GET to a route that returns a list of all users, if the client has logged in (has a token) 🎇 *// 
//TODO The validateToken middleware will go here // 
router.get("/all", validateToken, (req, res) => {
    console.log(req.jwt)
    users.find()
        .then(users => {
            console.log(users)
            // const byDepartment = users.filter(user => {
            //     return user.department === How can I grab the subjects department from the token?  
            // })

            // const sameDepartment = byDepartment.map(user => {
            //     return { id: user.id, username: user.username, department: user.department }
            // })

            res.status(200).json(users); 
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "Failed to find users" }); 
        });
});

//* 🎆 Json Web Token! 🎆 *// 
function generateToken(user){
    const payload = {
        username: user.username, 
        department: user.department
    };
    const options = {
        expiresIn: "1 hour"
    }; 
    return jwt.sign(payload, process.env.JWT_SECRET || "secret", options); 
}

//* 🎆 Validate user has a token! 🎆 *//
function validateToken(req, res, next){
    const token = req.headers.authorization; 

    if (token){
        jwt.verify(token, process.env.JWT_SECRET || "secret", (err, decodedToken) => {
            if (err) {
                res.status(401).json({ message: "Invalid Token" }); 
            } else {
                req.username = decodedToken; 
                next(); 
            }
        })
    } else { 
        res.status(400).json({ message: "You shall not pass!" }); 
    }
}

//* router export *// 
module.exports = router; 