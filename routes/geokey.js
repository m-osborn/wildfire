'use strict';

var mongoose = require('mongoose');
var gk       = require('../models/geokey');
var geokey   = mongoose.model('Geokey', gk);

// POST Handler for / route of Geocode (this is the create route).
exports.create = function( req, res ){

    console.log( 'req.body: ', req.body );
    console.log( 'inside routes.geokey.js ');

    new geokey({
        map : req.body.map,
        keywords: req.body.keywords

    }).save(function(err){
      if (err) return handleError(err);
    });

    console.log( 'no errors!?');


};
