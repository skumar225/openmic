var express = require('express');
var app = require('express')(); 
var server = require('http').createServer(app);
var http = require('http').Server(app);
var redis = require ('redis');
var redisClient = redis.createClient();
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));


// app.use("/public", express.static(__dirname + '/public'));

//Root Route
app.get('/', function (req, res) {

  res.sendFile(__dirname + '/index.html');

});

app.get('/auth/soundcloud/callback', function(req,res){
  res.sendFile(__dirname + '/public/callback.html');
});


var storeMessage = function(name, data) {
  var message = JSON.stringify({name: name, data: data}); //storing object as string in redis
  redisClient.lpush('messages', message, function (err, response) {
    redisClient.ltrim('messages', 0,9); //keeps the newest 10 items
  });
};
  

io.on('connection', function (client) {
  
      client.on('join', function(name) {
        redisClient.sadd('chatters', name);
        client.broadcast.emit('add_chatter', name); //Notify everyone about a new single chatter
        redisClient.smembers('chatters', function (err, names) {
          names.forEach(function (name) {
            client.emit('add_chatter',name); //Newly connected person who is online
          });
        });
        client.username = name; //show username feature
        });
        redisClient.lrange('messages', 0, -1, function (err, messages) {
          messages = messages.reverse();
          messages.forEach(function (message) {
            message = JSON.parse(message);
            io.emit('messages', message.name + ": " + message.data);
          });
        });
    
      client.on('messages', function (message) {
        var username = client.username;
        io.emit('messages', username + ": " + message);
        // client.broadcast.emit('messages', username + ": " + message);
        storeMessage(username, message);
      });

      client.on('track', function (track) {
        var username = client.username;
        client.broadcast.emit('track', track);
      }); 

      client.on('disconnect', function (name) {
        var username = client.username;
          console.log("username before remove", username);
        client.broadcast.emit('remove chatter', username);
        if (username) {
           redisClient.srem('chatters', username);  
        }

      });
});

//Connect to the server
http.listen(3000, function () {
  console.log('Connected to server');
});

