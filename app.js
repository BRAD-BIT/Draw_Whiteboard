var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var database=require('./database');
var index = require('./routes/index');
var room = require('./routes/room');
var home = require('./routes/home');
var logout = require('./routes/logout');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/index', index);
app.use('/room', room);
app.use('/home', home);
app.use('/logout',logout);

app.get('/users/:user/:image', function(req, res)
{
    //console.log(req.params.user+" "+req.params.image);
    res.sendFile(__dirname+"/users/"+req.params.user+"/"+req.params.image);
});



//validation
app.post('/login', function(req, res) {
    var result = {'handle':'','password':'','statue':'OK'};
    var handle = (JSON.parse(JSON.stringify(req.body)).handle).trim();
    if(handle.length==0){result['handle']="User Name : Must Filled";result['statue']='NO';}
    var password = (JSON.parse(JSON.stringify(req.body)).password).trim();
    if(password.length==0){result['password']="Password : Must Filled";result['statue'] = 'NO';}
    if(result['statue']=='OK')
    {
        for (var i = 0; i < handle.length; i++) {
            if ((handle[i] >= '0' && handle[i] <= '9') || (handle[i] >= 'a' && handle[i] <= 'z') || (handle[i] >= 'A' && handle[i] <= 'Z') || handle[i] == '_')
                continue;
            result['password'] = "User Name or Password is wrong";
            result['statue'] = 'NO';
            res.send(result);
        }
        database.username_password_check(handle,password, function (ans) {
                if (ans == 0) {
                    result['password'] = "User Name or Password is wrong";
                    result['statue'] = 'NO';
                    res.send(result);
                }
                else
                {
                    res.cookie('UserName',handle, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
                    res.send(result);
                }
            }
        );
    }
    else res.send(result);
});

app.post('/register', function(req, res) {
    var result = {'handle':'','password':'','Cpassword':'','statue':'OK'};
    var handle = (JSON.parse(JSON.stringify(req.body)).handle).trim();
    if(handle.length==0){result['handle']="User Name : Must Filled";result['statue']='NO';}
    else
    if(handle.length<=3){result['handle']="User Name : Min Length is 4";result['statue']='NO';}
    else
    if(handle.length>10){result['handle']="User Name : Max Length is 10";result['statue']='NO';}
    else {
        for (var i = 0; i < handle.length; i++) {
            if ((handle[i] >= '0' && handle[i] <= '9') || (handle[i] >= 'a' && handle[i] <= 'z') || (handle[i] >= 'A' && handle[i] <= 'Z') || handle[i] == '_')
                continue;
            result['handle'] = "User Name : only alpha,numbers,(_)";
            result['statue'] = 'NO';
        }
        if( result['statue']=='OK')
        {
            if(!((handle[0] >= 'a' && handle[0] <= 'z') || (handle[0] >= 'A' && handle[0] <= 'Z')))
            {
                result['handle'] = "User Name : First Char Must Be alpha";
                result['statue'] = 'NO';
            }
        }
    }



    var password = (JSON.parse(JSON.stringify(req.body)).password).trim();
    if(password.length==0){result['password']="Password : Must Filled";result['statue'] = 'NO';}
    var Cpassword = (JSON.parse(JSON.stringify(req.body)).Cpassword).trim();
    if(Cpassword.length==0){result['Cpassword']="Confirm password : Must Filled";result['statue']='NO';}
    if(result['password'].length==0&&result['Cpassword'].length==0)
    {
        if(password!=Cpassword)
        {result['Cpassword']="Confirm password : Must Match The Above Password";result['statue']='NO';}
    }

    if(result['handle'].length==0) {
        database.isHandleTaken(handle, function (ans) {
                if (ans == 1) {
                    result['handle'] = "User Name : Username Is Taken";
                    result['statue'] = 'NO';
                    res.send(result);
                }
                else
                if(result['statue']=='OK')
                {
                    database.insert_user(handle,password,function () {
                        res.cookie('UserName',handle, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
                        res.send(result);
                    });
                }
            }
        );
    }
    else res.send(result);
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
