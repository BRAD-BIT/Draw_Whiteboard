var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.clearCookie("UserName");
    res.redirect('/index');
});

module.exports = router;
