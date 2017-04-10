/**
 * Created by mangawy on 3/24/17.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var cookie = req.cookies.UserName;
    if (cookie === undefined)
    {
        res.redirect('/');
    }
    else
    {
        var fs = require("fs"),
            path = require("path");

        var p = "/app/public/images/users/"+req.cookies.UserName;
        fs.readdir(p, function (err, files) {
            if (err) {
                throw err;
            }
            var saved=new Array();
            files.map(function (file) {
                return path.join(p, file);
            }).filter(function (file) {
                return fs.statSync(file).isFile();
            }).forEach(function (file) {
                saved.push(path.basename(file));
            });
            res.render('home', {user: req.cookies.UserName,saved:saved});
        });

    }
});

module.exports = router;
