
//This part is the same as usual...
var express = require("express");
var app = express();

var http = require("http");

//We are getting an instance of a Node HTTP (web) server here.
//We are also telling it to connect up with our Express application,
//so it can handle requests.
var server = http.Server(app);

//On command prompt, we need to do "npm install socket.io"
var socketio = require("socket.io");

//instantiates our 'io' instance, and also connects it up with the HTTP
//server we already created.
var io = socketio(server);

//Just for static files (like usual).  Eg. index.html, client.js, etc.
app.use(express.static("pub"));

var allSockets = [];
var allUsernames = [];

//The 'socket' is an object that refers to the connection to a particular
//client.  It will be a new (different) object every time this gets called.
io.on("connection", function(socket) {
      console.log("Somebody connected to our socket.io server :)");
      
      socket.on("disconnect", function() {
                console.log("They probably closed their web browser or went to a different page :(");
                
                var indexOfUser = allSockets.indexOf(socket);
                allSockets.splice(indexOfUser, 1); //index to remove at, how many elements to remove.
                allUsernames.splice(indexOfUser, 1); //index to remove at, how many elements to remove.
                
                io.emit("updateUserList", allUsernames);
                });
      
      socket.on("login", function(username) {
                console.log(username + " is added");
                
                allSockets.push(socket);
                allUsernames.push(username);
                
                io.emit("updateUserList", allUsernames);
                });
      
      socket.on("talk", function(msg) {
                var indexOfUser = allSockets.indexOf(socket);
                var textToSend = allUsernames[indexOfUser] + " said: " + msg;
                console.log(textToSend);
                io.emit("tellThemAll", textToSend);  //This broadcasts to EVERYBODY connected.
                });
      
      });

server.listen(8080);
console.log("ok - try it");




