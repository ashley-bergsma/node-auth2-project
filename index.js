const server = require("./api/server"); 

const port = process.env.PORT || 2814; 

server.listen(port, () => console.log(`welcome to space sector ${port}`));