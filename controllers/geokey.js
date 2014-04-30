'use strict';

var mongoose = require('mongoose');
var gk       = require('../models/geokey');
// var Geokey   = mongoose.model('Geokey', GeokeySchema);

function queryDB (req, res) {
  // Let's find all the documents
  Geokey.find({}).exec(function(err, result) { 
    if (!err) { 
      res.write(html1 + JSON.stringify(result, undefined, 2) +  html2 + result.length + html3);
      var query = Geokey.find();
      query.exec(function(err, result) {
    if (!err) {
      res.end(html4 + JSON.stringify(result, undefined, 2) + html5 + result.length + html6);
    } else {
      res.end('Error in second query. ' + err)
    }
      });
    } else {
      res.end('Error in first query. ' + err)
    };
  });
}
