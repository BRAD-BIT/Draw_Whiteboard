/**
 * Created by moham on 4/3/2017.
 */
var bcrypt = require('bcrypt');
var randomstring = require("randomstring");
var mysql  = require('mysql');
var db = mysql.createPool({
    connectionLimit : 100,
    host     : 'localhost',
    user     : 'root',
    password : 'Moha4422med',
});

db.getConnection(function(err, connection) {
    connection.query('CREATE DATABASE IF NOT EXISTS Draw', function (error)
    {
        if (error) throw error;
        connection.query('USE Draw', function (error) {
            if (error) throw error;
            connection.query('CREATE TABLE IF NOT EXISTS user('
                + 'Handle 	        VARCHAR(50) NOT NULL,'
                + 'Hahsed_password 	TEXT NOT NULL,'
                + 'PRIMARY KEY(Handle));'
                , function (error) {
                    if (error) throw error;
                });

            connection.query('CREATE TABLE IF NOT EXISTS user_draws('
                + 'id   	VARCHAR(50) NOT NULL,'
                + 'users 	TEXT NOT NULL,'
                + 'points 	LONGTEXT  NOT NULL,'
                + 'PRIMARY KEY(id));'
                , function (error) {
                    if (error) throw error;
                });

            connection.query('CREATE TABLE IF NOT EXISTS rooms('
                + 'room_id TEXT NOT NULL'
                + ');'
                , function (error) {
                    if (error) throw error;
                });
            connection.query("INSERT INTO user (Handle, Hahsed_password) "+
            "SELECT * FROM (SELECT '#room', '0') AS tmp "+
            "WHERE NOT EXISTS ("+
             "SELECT Handle FROM user WHERE Handle = '#room') LIMIT 1", function (error) {
                if (error) throw error;
            });

        });

    });
    if (err) throw err;
});
function isHandleTaken(handle,callback)
{
    db.getConnection(function(err, connection)
     {
         connection.query('USE Draw', function (error) {
             if (error) throw error;
             connection.query("SELECT Handle From User where Handle='"+handle+"'", function (error,results) {
                     if (error) throw error;
                     callback(results.length);
                 });
         });
     });
}

function insert_user(handle,password,callback)
{
    db.getConnection(function(err, connection)
    {
        connection.query('USE Draw', function (error) {
            if (error) throw error;

            bcrypt.hash(password, 10, function(err, hash) {
                connection.query("Insert Into user values('"+handle+"','"+hash+"')", function (error) {
                    if (error) throw error;
                    callback();
                });
            });
        });
    });
}

function insert_draw(id,users,points)
{
    db.getConnection(function(err, connection)
    {
        connection.query('USE Draw', function (error) {
            if (error) throw error;
            connection.query("Insert Into user_draws values('"+id+"','"+users+"','"+points+"')", function (error) {
                if (error) throw error;
            });

        });
    });
}

function get_draw(id,callback)
{
    db.getConnection(function(err, connection)
    {
        connection.query('USE Draw', function (error) {
            if (error) throw error;
            connection.query("SELECT * FROM user_draws where id='"+id+"'", function (error,results) {
                if (error) throw error;
                if(results.length>0) {
                    callback(results[0].users, results[0].points);
                }
                else
                callback("","");
            });

        });
    });
}

function username_password_check(handle,password,callback)
{
    db.getConnection(function(err, connection)
    {
        connection.query('USE Draw', function (error) {
            if (error) throw error;
            connection.query("SELECT * From User where Handle='"+handle+"'", function (error,results) {
                if (error) throw error;
                if(results.length==0)callback(0);
                else
                bcrypt.compare(password, results[0].Hahsed_password, function(err, res) {
                    if(res==true)
                        callback(1);
                    else callback(0);

                });
            });

        });
    });
}

function create_new_room(load,callback)
{
    db.getConnection(function(err, connection)
    {
        connection.query('USE Draw', function (error) {
            if (error) throw error;
            connection.query("SELECT * From User where Handle='"+'#room'+"'", function (error,results) {
                if (error) throw error;
                var cur_id=results[0].Hahsed_password;
                var send="";
                for(var i=0;i<cur_id.length;i++)
                {
                    send+=cur_id[i]+randomstring.generate(7);
                }
                var new_id=parseInt(results[0].Hahsed_password)+1;
                connection.query("UPDATE User SET Hahsed_password='"+new_id+"' WHERE Handle='#room'", function (error,results) {
                    if (error) throw error;
                });

                connection.query("Insert Into rooms values('"+send+"')", function (error) {
                    if (error) throw error;
                    callback(send);
                });

            });

        });
    });
}

function cheack_room(id,callback)
{
    db.getConnection(function(err, connection)
    {
        connection.query('USE Draw', function (error) {
            if (error) throw error;
            connection.query("SELECT * From rooms where Binary room_id='"+id+"'", function (error,results) {
                if (error) throw error;
                if(results.length>0)
                    callback(1);
                else callback(0);
            });

        });
    });
}
module.exports.get_draw=get_draw;
module.exports.insert_draw=insert_draw;
module.exports.username_password_check=username_password_check;
module.exports.isHandleTaken=isHandleTaken;
module.exports.insert_user=insert_user;
module.exports.create_new_room=create_new_room;
module.exports.cheack_room=cheack_room;