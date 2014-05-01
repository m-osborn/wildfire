'use strict';

var mongoose = require('mongoose');
var gk       = require('../models/geokey');
var geokey   = mongoose.model('Geokey', gk);

// POST Handler for / route of Geocode (this is the create route).
exports.create = function( req, res ){

    console.log( 'req.body: ', req.body );
    console.log( 'inside routes.geokey.js create');

    new geokey({
        map : req.body.map,
        keywords: req.body.keywords

    }).save(function(err){
      if (err) return handleError(err);
    });

    console.log( 'no errors!?');
};

console.log('outside of exports.create');

exports.read = function (req, res){
    console.log( 'req.body: ', req.body );
    console.log( 'inside routes.geokey.js read ');

    tmp = geokey.find()
    console.log('tmp:   ', tmp)
};
