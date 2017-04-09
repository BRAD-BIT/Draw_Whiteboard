var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.clearCookie("UserName");
    res.render('index');
});

module.exports = router;