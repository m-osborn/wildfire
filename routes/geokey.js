'use strict';

var Geokey = require('../models/geokey');

// POST Handler for / route of Geocode (this is the create route).

exports.create = function( req, res ){

    console.log( 'req.body: ', req.body );

    new Geokey({
        map : req.body.map,
        keywords: req.body.keywords
    }).save(function( err, geokey, count ){
    res.send( 200, 'Create' );
    });

    console.log( 'past the GeoKey Model create');
};
