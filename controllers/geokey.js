'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
// var geokey   = require('./models/geokey');
var mongoose = require('mongoose');
var Geokey   = mongoose.model('Geokey', GeokeySchema);

function queryDB (res) {
    Geokey.find().exec(function(err, result) { 
        if (!err) { 
            res.write(JSON.stringify(result, undefined, 2));
            var query = Geokey.find();
            query.exec(function(err, result) {
        });
        } else {
            res.end('Error in query. ' + err)
        };
    });
}


var GeokeySchema = new Schema({
    map:  { latitude:  { type: Number, default: 39.7683800 }, 
            longitude: { type: Number, default: -86.1580400 },
            radius:    { type: 1,      default: 1 }
          },
    keywords: Array,
});

module.exports = mongoose.model('Geokey', GeokeySchema);