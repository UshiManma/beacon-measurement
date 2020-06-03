var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dbControll = require('./routes/db');

const mongo = require('./public/javascripts/mongo');
const db = new mongo.mongo_controller();
//requestから中身を取り出す
var bodyParser = require('body-parser')

var app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

const log4js = require('log4js');
const logg = log4js.getLogger();
logg.level = 'info';

var co = require('co')
app.get('/getStatus', function(req, res){
  try {
    co(function *(){
      let finds = [];
      let keys = yield db.keyFind();
      for(let key of keys){
        finds.push(db.find(key));
      }
      let datas = yield Promise.all(finds);
      return datas;
    }).then(d => {
      //logg.info(`datas : ${JSON.stringify(d)}`);
      res.send({ data: d });
    })
  } catch (error) {
    logg.info(`error : ${error}`);
  }
})

app.post('/upload', function(req, res, next) {
  let req_body = req.body;
  console.log(`>>>> ${JSON.stringify(req_body)}`);
  var iData = {
    key: req_body.beacon_id,
    x: req_body.xPosition,
    y: req_body.yPosition
  };
  db.upload(iData);
  res.redirect('/db');
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/db', dbControll);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
