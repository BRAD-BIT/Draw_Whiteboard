var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var cookie=req.cookies.UserName;
    if ( cookie=== undefined)
    {
        res.render('index');
    }
    else {
        res.redirect('/home');
    }
});

module.exports = router;
