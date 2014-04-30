'use strict';

var mongoose = require('mongoose');
var gk       = require('../models/geokey');
// var Geokey   = mongoose.model('Geokey', GeokeySchema);

function queryDB (res) {
    Geokey.find().exec(function(err, result) { 
        if (!err) { 
            res.write(JSON.stringify(result, undefined, 2));
            var query = Geokey.find();
            query.exec(function(err, result){});
        } else {
            res.end('Error in query. ' + err)
        };
    });
}
