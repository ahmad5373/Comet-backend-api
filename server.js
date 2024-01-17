const http = require("http")
const app = require("./src/app");
const Server = http.createServer(app);

const Port = process.env.PORT || 9000;

//Port for server listening;
Server.listen(Port,()=>{
console.log(`server is listening on : http://localhost:${Port}`);
});