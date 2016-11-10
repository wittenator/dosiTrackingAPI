var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var PRESENCE_COLLECTION = "presence";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// CONTACTS API ROUTES BELOW

app.post("/presence", function(req, res) {
  var newPresenceEntry = req.body;
  newPresenceEntry.createDate = new Date();

  if (!(req.body.firstName || req.body.lastName)) {
    handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
  }
  
  if(db.collection.find({personID: newPresenceEntry.personID}) != NULL)
  {
    db.collection(PRESENCE_COLLECTION).update({personID:newPresenceEntry.personID}, {$push:{presence:{date: new Date().format("d-m-Y"), time: new Date().format("h:i:s")}}});
  } 
  else
  {
    db.collection(PRESENCE_COLLECTION).insertOne(newPresenceEntry, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new contact.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
  }

  
});