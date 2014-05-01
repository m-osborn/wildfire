'use strict';

var mongoose    = require('mongoose');
var gk          = require('../models/geokey');
var geokeyModel = mongoose.model('Geokey', gk);

// POST Handler for / route of Geocode
exports.create = function( req, res ){

    console.log( 'req.body: ', req.body );
    console.log( 'inside routes.geokey.js create');

    new geokeyModel({
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

    tmp = geokeyModel.find({}).exec(function(err, result) {
      if (!err) return handleError(err);
    });
    console.log ('tmp:', tmp);
};
