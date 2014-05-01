'use strict';

// POST Handler for / route of Geocode (this is the create route).

exports.create = function( req, res ) {
    console.log( 'req.body: ', req.body );
    
    var tmp = JSON.parse (req.body);

    console.log( 'tmp',tmp);
    console.debug('tmp', tmp);

    new Geokey({
        map : tmp.map,
        keywords: tmp.keywords
    }).save(function( err, geokey, count ){
    res.redirect( '/' );)
};
