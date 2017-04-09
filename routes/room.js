/**
 * Created by mangawy on 3/27/17.
 */
var express = require('express');
var router = express.Router();
var database=require('../database');


router.get('/:room', function(req, res, next) {
    var cookie = req.cookies.UserName;
    if (cookie === undefined)
    {
        res.redirect('/');
    }
    else
    {
        var rm=req.params.room;
        if(rm=='new')
        {
            database.create_new_room("",function (ans) {
                return res.redirect('/room/'+ans);
            })
        }
        else
        if(rm.substr(rm.length-4,4)=='.png')
        {
            database.create_new_room("",function (ans) {
                res.cookie("load",rm.substr(0,rm.length-4), { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
                return res.redirect('/room/'+ans);
            });
        }
        else
        {
            var load_cookie = req.cookies.load;

            database.cheack_room(rm,function (ans) {
                if(ans==1)
                {
                    if(load_cookie==undefined) {
                        res.render('room', {room: rm, userName: cookie,users:"",points:""});
                    }
                    else
                    {
                        database.get_draw(load_cookie,function (users,points) {
                            res.clearCookie("load");
                            res.render('room', {room: rm, userName: cookie,users:users,points:points});
                        });
                    }
                }
                else res.redirect('/home');
            });
        }
    }
});
module.exports = router;
