var express = require('express');
var app = require('express')(); 
var http = require('http').Server(app);
var redis = require ('redis');
var client = redis.createClient();
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

//Root Route
app.get('/', function (req, res) {

  res.sendFile(__dirname + '/index.html');

});

var messages = []; //Stores messages in array
var storeMessage = function(name, data) {
  var message = JSON.stringify({name: name, data: data}); //storing object as string in redis
};
  
   redisClient.lpush("messages", message, function (err, response) {
        redisClient.ltrim("messages", 0, 9); //keep newest 10 items   
    });


io.on('connection', function (socket) {
    socket.on('chat message', function (msg){
      io.emit('chat message', msg);
      client.on('join', function(name) {
          client.username = name; //show username feature
      ///
          client.emit('messages', message.name + ": " + message.data);
      });
       client.get('username', function (err, name) {
        client.broadcast.emit('chat message', name + ": " + message);
        client.emit('chat message', name + ': ' + message);
        //when client sends a message, store message
        storeMessage(name, message);

      });
    });
  });

  //join listener
  client.on('join'), function (name) {

    redisClient.lrange("messages", 0, -1, function (err, messages) {
      messages = messages.reverse(); //reverse so they are emitted in correct order
    });

    messages.forEach( function (message) {

      message = JSON.parse(message); //parse into JSON object
      client.emit('messages', message.name + ": " + data);
      //iterate through messages array and emit a message on the connecting client for each one

    });
  });
});


io.sockets.on ('connection', function (client) {
  client.on('messages', function (message) {
    storeMessage(name, message); //when client sends a message, call storeMessage
  });
}

//notify other clients a chatter has joined
  client.on('join'), function (name) {
    client.broadcast.emit("add chatter", name); 

    redisChatter.smembers('names', function (err, names) {
      names.forEach function (name) {
        client.emit('add chatter', name); //Emit all the currently logged in chatters to the newly connected client
      });
    });
    redisClient.sadd("chatters", name); //add name to chatters set
  });

//disconnect users
client.on('disconnect', function (name) {
  client.get('nickname', function (err, name) {
    client.broadcast.emit("remove chatter", name);

    redisClient.srem("chatters", name);
  }); 
})

//Connect to the server
http.listen(3000, function () {
  console.log('Connected to server');
});

///not my code below

// var express = require('express');
// var app = express();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
// var redis = require("redis");
// var client = redis.createClient();
// var methodOverride = require("method-override");
// var bodyParser = require("body-parser");

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//   });
// });

// app.get('/', function(req, res){
//   res.render('/index.html');
// });

// //middleware below
// app.set("view engine", "ejs");
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(methodOverride("_method"));
// app.use(express.static(__dirname + "/index"));

// var loggedIn = [];

// // Root Route && Login
// app.get('/', function(req, res) {
//  res.render('index');
// });

// // Render new user page
// app.get('/newUser', function(req, res){
//  res.render('newUser');
// });

// // Enter global chat
// app.get('/globalchat', function(req, res){
//   res.render('globalchat');
// });

// // Create new User
//  //validate uniqueness of userName
//  app.post("/newuser", function(req, res){
//    client.HSETNX("users", req.body.userName, req.body.userPass, function(err, success) {
//      if (success === 1) {
//        res.redirect('/');
//      } else {
//        console.log("person already exists, figure out how to render this to the page");
//      }
//    });
//  });

// //validates userPass === userName and logs in
//  app.post("/globalchat", function(req, res){
//   var getUserPass = function(){
//     client.HGET("users", req.body.userName, function(err, reply){
//       if (err){
//         console.log("Could not query the database");
//       }

//       if (req.body.userPass == reply){
//         res.redirect("/globalchat");
//       } else {
//         console.log("Incorrect UserName or Password");
//         res.redirect('/');
//       }
//     });
//   };
//   getUserPass();
// });


// var usersLoggedIn = [];



// //start the server
// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });
