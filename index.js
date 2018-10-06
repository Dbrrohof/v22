var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var users = [];

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
        if(socket.nickname) {
            var index = users.indexOf(socket.nickname);
            users.splice(index, 1);
            console.log('user discnonnected - ' + socket.nickname)
        } else {
            console.log('user disconnected - no name');
        }
    });

    socket.on('send-nickname', function(nickname) {
        if(users.includes(nickname)) {
            socket.emit('nameError', "Nickname already in use");
        } else {
            users.push(nickname)
            socket.nickname = nickname;
            console.log(users);
        }
    });

    socket.on('chat message', function(msg){
        console.log('message: ' + socket.nickname + ': ' + msg.msg);
        io.emit('chat message', msg);
    });
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});
