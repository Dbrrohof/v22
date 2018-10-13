var userNickname;
$(function () {
    var socket = io();
    var modal = document.getElementById('myModal');

    // $( "#setNameBtn" ).click(function() {
    //     nameInput = $("#name").val();
    //     socket.emit('send-nickname',nameInput);
    // });
    
    // detect send msg
    $('#sendMsg').click(function(){
        sendMsg();
    });
    $("#msgInput").on('keyup', function (e) {
        if (e.keyCode == 13) {
            sendMsg();
        }
    });

    // send chat msg function
    function sendMsg() {
        msgGet = $('#msgInput').val();
        if (msgGet && !msgGet.trim()) return;
        if ( msgGet.charAt( 0 ) !== '!' ) {
            socket.emit('chat message',{msg: msgGet});
            $('#msgInput').val('');
            return;
        }
        var command = msgGet.substring(1).split(" ")[0];
        var value = msgGet.substring(1).split(" ")[1];
        switch(command) {
            case "admin":
                socket.emit('admin',value);
                break;
            case "cd":
                socket.emit('command',{command: command, value: value});
                break;
            case "pause":
                socket.emit('command',{command: command, value: value});
                break;
            case "reset":
                socket.emit('command',{command: command, value: value});
                break;
            case "start":
                socket.emit('command',{command: command, value: value});
                break;
            default:
                console.log('Command not found')
        }
        $('#msgInput').val('');
    }
    // Get userlist
    socket.on('userlist', function(list) {
        var playersList = document.getElementById('player-list');
        playersList.innerHTML = "";
        console.log(list);
        for (i = 0; i < list.length; i++) {
            playersList.innerHTML += "<h1>"+list[i]+"";
        } 
    });

    socket.on('countdownSet', function(cd) {
        var toString;
        (cd.slice(-2).length < 2) ? toString = "0"+cd+":00" : toString = cd+":00";
        $('#countdown').html(toString)
    });

    // Get timer
    socket.on('timer', function(time) {
        console.log(time);
    });

    // get chat msg
    socket.on('chat message', function(msg){
        var msgArea = $('.messages');
        msgArea.append(`
        <div class="message">
            <div class="contents">
                <div class="username">
                    ${msg.name}
                </div>
                <div class="msg">
                    ${msg.msg}
                </div>
            </div>
        </div>
        `);
        msgArea[0].scrollTop = msgArea[0].scrollHeight;
    });
    // Own chat msg
    socket.on('chat message own', function(msg){
        var msgArea = $('.messages');
        msgArea.append(`
        <div class="message own">
            <div class="contents">
                <div class="msg">
                    ${msg.msg}
                </div>
            </div>
        </div>
        `);
        msgArea[0].scrollTop = msgArea[0].scrollHeight;
    });

    $( "#join-room" ).click(function() {
        nameInput = $("#username").val();
        if (nameInput) socket.emit('send-nickname',nameInput);
    });

    socket.on('username-set', function(nickname){
        console.log('username set')
        userNickname = nickname;
        modal.style.display = "none";
        socket.emit('get-users',true)
    });

});