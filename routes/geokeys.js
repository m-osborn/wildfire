'use strict';

exports.geokeys = function( req, res ) {
    console.log( 'req.body: ', req.body );
    res.redirect( '/geokeys' );
};
