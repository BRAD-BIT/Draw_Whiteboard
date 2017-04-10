/**
 * Created by mangawy on 3/24/17.
 */
var downloadAsSVG = function (fileName) {

    if(!fileName) {
        fileName = "paperjs_example.svg"
    }

    var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({asString:true}));
    console.log(url);
    var link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
};
paper.install(window);
var line,GlobalColor='black',GlobalSize=3,path=new Array(),pathPoints=new Array(),paths_num=0;
var pathsToSave=new Array(),users_paths=new Array();
var msgsToSave=new Array();
var room,userName;
window.onload = function() {
    paper.setup('myCanvas');
    alert("you can copy url and share room with others");
    line = new Tool();
    line.onMouseDown = function (event) {
        path[userName] = new Path();
        pathPoints[userName]=new Array();
        path[userName].strokeColor = GlobalColor;
        path[userName].strokeWidth = GlobalSize;
        path[userName].add(event.point);
        var data = {x: event.point.x, y: event.point.y, color: GlobalColor,size:GlobalSize};
        pathPoints[userName].push(data);
        socket.emit( 'drawLine1', data,room,userName);
    };

    line.onMouseDrag = function(event) {
        path[userName].add(event.point);
        var data = {x: event.point.x, y: event.point.y, color: GlobalColor,size:GlobalSize};
        pathPoints[userName].push(data);
        socket.emit( 'drawLine2', data,room,userName);
    };
    line.onMouseUp = function (event) {
        if(users_paths[userName]==null)
        {
            users_paths[userName]=new Array();
            pathsToSave[userName]=new Array();
        }
        paths_num++;
        users_paths[userName].push(path[userName]);
        pathsToSave[userName].push(pathPoints[userName]);
        socket.emit( 'drawLine3',room,userName);
    };

    socket.on( 'drawLine1', function( data,user ) {
        path[user] = new Path();
        pathPoints[user]=new Array();
        path[user].strokeColor = data.color;
        path[user].strokeWidth =data.size;
        path[user].add(new Point(data.x,data.y));
        pathPoints[user].push(data);
    });

    socket.on( 'drawLine2', function( data ,user) {
        path[user].add(new Point(data.x,data.y));
        pathPoints[user].push(data);
    });

    socket.on( 'drawLine3', function( user) {
        if(users_paths[user]==null)
        {
            users_paths[user]=new Array();
            pathsToSave[user]=new Array();
        }
        paths_num++;
        users_paths[user].push(path[user]);
        pathsToSave[user].push(pathPoints[user]);
    });

    socket.on( 'undo', function(user) {
        if( users_paths[user]!=null)
        {
            if(users_paths[user].length>0)
            {
                paths_num--;
                users_paths[user][users_paths[user].length-1].remove();
                users_paths[user].pop();
                pathsToSave[user].pop();
            }
        }
    });

    socket.on( 'UpdateMe', function(LastClient) {
        console.log(LastClient +" Want To upadte His Drawing");
        var users=new Array();
        var pths=new Array();
        for (var user in pathsToSave) {
            users.push(user);
            pths.push(pathsToSave[user]);
        }
        socket.emit( 'UpdateLastClient',room,LastClient,pths,msgsToSave,users);
    });

    socket.on( 'YourUpdate', function(Newpaths,Newmsgs,users) {
        for(var k=0;k<Newpaths.length;k++) {
            var sk = k.toString();
            var from_user=users[k];
            for (var i = 0; i < Newpaths[sk].length; i++) {
                var new_path = new Path();
                var si = i.toString();
                var new_pathPoints = new Array();
                new_path.strokeColor = Newpaths[sk][si]["0"].color;
                new_path.strokeWidth = Newpaths[sk][si]["0"].size;
                new_path.add(new Point(Newpaths[sk][si]["0"].x, Newpaths[sk][si]["0"].y));
                new_pathPoints.push(Newpaths[sk][si]["0"]);

                for (var j = 1; j < Newpaths[sk][si].length; j++) {
                    var sj = j.toString();
                    new_path.add(new Point(Newpaths[sk][si][sj].x, Newpaths[sk][si][sj].y));
                    new_pathPoints.push(Newpaths[sk][si][sj]);
                }
                if (pathsToSave[from_user] == null) {
                    pathsToSave[from_user] = new Array();
                    users_paths[from_user] = new Array();
                }
                paths_num++;
                pathsToSave[from_user].push(new_pathPoints);
                users_paths[from_user].push(new_path);
            }
        }
        for(var i=0;i<Newmsgs.length;i++)
        {
            var si=i.toString();
            var usr=Newmsgs[si].username;
            var msg=Newmsgs[si].msg;
            if(usr==userName)
            {
                var newS='<div class="row msg_container base_sent"> <div class="col-md-10 col-xs-10 "> <div class="messages msg_sent"> <p>'+ msg +'</p> <time datetime="2009-11-13T20:00">'+usr+'</time> </div> </div> <div class="col-md-2 col-xs-2 avatar"> <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive "> </div> </div>';
                $('#messages').append(newS);
            }
            else {
                var newR='<div class="row msg_container base_receive"> <div class="col-md-2 col-xs-2 avatar"> <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive "> </div> <div class="col-xs-10 col-md-10"> <div class="messages msg_receive"> <p>'+msg+'</p> <time datetime="2009-11-13T20:00">'+usr+'</time> </div> </div> </div>';
                $('#messages').append(newR);
            }
            msgsToSave.push(Newmsgs[si]);
        }
    });
    load(users_load,points_load);
};

function load(users_load,points_load)
{
    if(points_load.length==0)return;

    var Newpaths=JSON.parse(points_load);
    var users=JSON.parse(users_load);

    for(var k=0;k<Newpaths.length;k++) {
        var sk = k.toString();
        var from_user=users[k];
        for (var i = 0; i < Newpaths[sk].length; i++) {
            var new_path = new Path();
            var si = i.toString();
            var new_pathPoints = new Array();
            new_path.strokeColor = Newpaths[sk][si]["0"].color;
            new_path.strokeWidth = Newpaths[sk][si]["0"].size;
            new_path.add(new Point(Newpaths[sk][si]["0"].x, Newpaths[sk][si]["0"].y));
            new_pathPoints.push(Newpaths[sk][si]["0"]);

            for (var j = 1; j < Newpaths[sk][si].length; j++) {
                var sj = j.toString();
                new_path.add(new Point(Newpaths[sk][si][sj].x, Newpaths[sk][si][sj].y));
                new_pathPoints.push(Newpaths[sk][si][sj]);
            }
            if (pathsToSave[from_user] == null) {
                pathsToSave[from_user] = new Array();
                users_paths[from_user] = new Array();
            }
            paths_num++;
            pathsToSave[from_user].push(new_pathPoints);
            users_paths[from_user].push(new_path);
        }
    }
}

