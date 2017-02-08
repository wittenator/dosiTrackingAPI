var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var Client = require('mariasql');
var passport = require('passport')    
var BasicStrategy = require('passport-http').BasicStrategy;
//var secrets = require("./secrets.json");
var sql_queries = require("./sql_queries/sql_queries.js");

var app = express();
app.use(passport.initialize());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

//Enable CORS requests
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

//Set up Basic Auth Strategy
passport.use(new BasicStrategy(
  function(username, password, done) {
    if (username.valueOf() === 'trollmaster' &&
      password.valueOf() === "123456")
      return done(null, true);
    else
      return done(null, false);
  }
));

//Initialize database connection
var c = new Client({
    host: process.env.host || secrets.host,
    user: process.env.user || secrets.user,
    password: process.env.password  || secrets.password,
    db: process.env.db || secrets.db
});

// Initialize the app.
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

// GET Presence entries of every person
app.get("/attendance", passport.authenticate('basic', { session: false }), function(req, res) {
    c.query(sql_queries.getAttendance, function(err, rows) {
        if (err)
            throw err;
        res.send(rows);
    });    
});

//POST new attendence entry
app.post("/attendance", passport.authenticate('basic', { session: false }), function(req, res) {
    c.query(sql_queries.insertAttendance, {rfid:req.body.rfid, deviceid:req.body.deviceid, time:req.body.time}, function(err, rows) {
        if (err)
            throw err;
        res.status(200);
        res.send();
    });    
});

//GET all user entries
app.get("/user", passport.authenticate('basic', { session: false }), function(req, res) {
    c.query(sql_queries.getUsers, function(err, rows) {
        if (err)
            throw err;
        res.send(rows);
    });    
});

app.post("/user", passport.authenticate('basic', { session: false }), function(req, res) {
    c.query(sql_queries.insertUser, {name:req.body.name, lastname:req.body.lastname, ressort:req.body.ressort, rfid:req.body.rfid}, function(err, rows) {
        if (err)
            throw err;
        res.send(rows);
    });    
});

//GET all event entries
app.get("/sessions", passport.authenticate('basic', { session: false }), function(req, res) {
    c.query(sql_queries.getSessions, function(err, rows) {
        if (err)
            throw err;
        res.send(rows);
    });    
});

//POST new event entry
app.post("/sessions", passport.authenticate('basic', { session: false }), function(req, res) {
    c.query(sql_queries.insertSession, {name:req.body.name, type:req.body.type, starttime:req.body.starttime, endtime:req.body.endtime}, function(err, rows) {
        if (err)
            throw err;
        res.send(rows);
    });    
});

