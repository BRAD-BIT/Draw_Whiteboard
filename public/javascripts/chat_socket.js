/**
 * Created by mangawy on 3/24/17.
 */

$(function () {
    $('#btn-chat').click(function(){
        socket.emit('chat message', $('#msg').val(),room,userName);
        // • 51 min
        if($('#msg').val().trim().length==0)return;
        var newS='<div class="row msg_container base_sent"> <div class="col-md-10 col-xs-10 "> <div class="messages msg_sent"> <p>'+ $('#msg').val()+'</p> <time datetime="2009-11-13T20:00">'+userName+'</time> </div> </div> <div class="col-md-2 col-xs-2 avatar"> <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive "> </div> </div>';
        msgsToSave.push({username: userName, msg: $('#msg').val()});
        $('#msg').val('');
        $('#messages').append(newS);
        return false;
    });
    socket.on('chat message', function(msg,username){
        //console.log("Recived Mess "+msg);
        msgsToSave.push({username: username, msg: msg});
        var newR='<div class="row msg_container base_receive"> <div class="col-md-2 col-xs-2 avatar"> <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive "> </div> <div class="col-xs-10 col-md-10"> <div class="messages msg_receive"> <p>'+msg+'</p> <time datetime="2009-11-13T20:00">'+username+'</time> </div> </div> </div>';
        var newS='<div class="row msg_container base_sent"> <div class="col-md-10 col-xs-10 "> <div class="messages msg_sent"> <p>'+ msg+'</p> <time datetime="2009-11-13T20:00">'+username+'</time> </div> </div> <div class="col-md-2 col-xs-2 avatar"> <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive "> </div> </div>';
        if(username==userName) $('#messages').append(newS);
        else
        $('#messages').append(newR);
    });
});

function x()
{
    if($('#msg').val().trim().length==0)return;
    socket.emit('chat message', $('#msg').val(),room,userName);
    var newS='<div class="row msg_container base_sent"> <div class="col-md-10 col-xs-10 "> <div class="messages msg_sent"> <p>'+ $('#msg').val()+'</p> <time datetime="2009-11-13T20:00">'+userName+'</time> </div> </div> <div class="col-md-2 col-xs-2 avatar"> <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive "> </div> </div>';
    msgsToSave.push({username: userName, msg: $('#msg').val()});
    $('#msg').val('');
    $('#messages').append(newS);
    return false;
}


