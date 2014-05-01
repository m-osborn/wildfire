'use strict';

var mongoose = require('mongoose');
var gk       = require('../models/geokey');
var geokey   = mongoose.model('Geokey', gk);

// POST Handler for / route of Geocode (this is the create route).
exports.create = function( req, res ){

    console.log( 'req.body: ', req.body );

    new geokey({
        map : req.body.map,
        keywords: req.body.keywords
    }).save(function( err, geokey, count ){
    res.send( 200, 'Create' );
    });

    console.log('req.body.map: ', req.body.map);
    console.log('req.body.keywords: ', req.body.keywords);
};


