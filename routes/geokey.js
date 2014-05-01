'use strict';

// POST Handler for / route of Geocode (this is the create route).

exports.create = function( req, res ){

    console.log( 'req.body: ', req.body );

    new Geokey({
        map : tmp.map,
        keywords: tmp.keywords
    }).save(function( err, geokey, count ){
    res.send( 200, 'create' );
    });
};
