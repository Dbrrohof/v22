const express = require('express')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
// app.get('/game', function(req, res){
//     res.sendFile(__dirname + '/game.html');
//   });

var admins = {}
var users = [];
var admin = [];
var counter;
var countdown;
var countdownInMinutes;

var adminPass = '21232f297a57a5a743894a0e4a801fc3';


io.on('connection', function(socket){
    console.log('a user connected');
    emitCountdown()
    socket.on('disconnect', function(){
        if(socket.nickname) {
            var index = users.indexOf(socket.nickname);
            users.splice(index, 1);
            console.log('user discnonnected - ' + socket.nickname)
            if (admins[socket.nickname]) delete admins[socket.nickname];
            io.emit('userlist',users)
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

            socket.emit('username-set',nickname)
        }
    });

    socket.on('get-users', function() {
        io.emit('userlist',users)
    });

    socket.on('chat message', function(msg){
        // console.log('message: ' + socket.nickname + ': ' + msg.msg);

        // sending to the client
        socket.emit('chat message own', {name: socket.nickname, msg: msg.msg});

        // sending to all clients except sender
        socket.broadcast.emit('chat message', {name: socket.nickname, msg: msg.msg});
    });

    // socket.on('setCountdown', function(countdown){
    //     console.log('Countdown ready with time: ');
    //     io.emit('countdownSet', {name: socket.nickname, countdown: countdown});
    // });

    socket.on('command', function(data) {
        if (admins[socket.nickname]) {
            console.log(socket.nickname + ' used command ' + data.command + ' with value ' + data.value)
        } else {
            console.log('Not admin');
            return;
        }
        switch(data.command) {
            case "cd":
                setCountdown(data.value);
                break;
            case "pause":
                pause();
                break;
            case "reset":
                reset();
                break;
            case "start":
                start();
                break;
            default:
                return;
        }
    });

    function setCountdown(value) {
        countdown = value*60;
        countdownInMinutes = value;
        emitCountdown();
    }
    function emitCountdown() {
        if (countdownInMinutes) io.sockets.emit('countdownSet', countdownInMinutes);
    }
    function start() {
        counter = setInterval(function() {
            countdown--;
            io.sockets.emit('timer', { countdown: countdown });
            if (countdown == 0) clearInterval(counter);
        }, 1000);
    }
    function pause() {
        clearInterval(counter);
    }
    function reset() {
        clearInterval(counter);
        countdown = countdownInMinutes*60;
    }

    socket.on('admin', function(value) {
        if (value == adminPass && !admins[socket.nickname]) {
            admins[socket.nickname] = {
                "socket": socket.id
            };
            console.log('Added admin - ' + socket.nickname + ', with id: ' + socket.id);
        } else {
            
        }
        
    });

  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});

