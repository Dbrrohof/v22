$(function () {
    var socket = io();
    var modal = document.getElementById('myModal');

    // $( "#setNameBtn" ).click(function() {
    //     nameInput = $("#name").val();
    //     socket.emit('send-nickname',nameInput);
    // });
    
    // send chat msg
    $('#sendMsg').click(function(){
        msgGet = $('#msgInput').val();
        socket.emit('chat message',{msg: msgGet});
    });

    // Get userlist
    socket.on('userlist', function(list) {
        var playersList = document.getElementById('player-list');
        playersList.innerHTML = "";
        console.log(list);
        for (i = 0; i < list.length; i++) {
            playersList.innerHTML += "<h1>"+list[i]+"";
        } 
    });

    // get chat msg
    socket.on('chat message', function(msg){
        console.log(msg)
    });

    $( "#join-room" ).click(function() {
        nameInput = $("#username").val();
        if (nameInput) socket.emit('send-nickname',nameInput);
    });

    socket.on('username-set', function(msg){
        console.log('username set')
        modal.style.display = "none";
        socket.emit('get-users',true)
    });
    });