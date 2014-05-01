'use strict';

var mongoose    = require('mongoose');
var gk          = require('../models/geokey');
var Geokey      = mongoose.model('Geokey', gk);

// POST Handler for / route of Geocode
exports.create = function( req, res ){

    console.log( 'req.body: ', req.body );
    console.log( 'inside routes.geokey.js create');

    new Geokey({
        map : req.body.map,
        keywords: req.body.keywords

    }).save(function(err){
      if (err) return handleError(err);
    });

    console.log( 'no errors!?');
};

exports.read = function (req, res){
    console.log( 'req.body: ', req.body );
    console.log( 'inside routes.geokey.js read ');

    var tmp = geokeyModel.find({}).exec(function(err, result) {
      if (!err) return handleError(err);
    });
    console.log ('tmp:', tmp);
};
