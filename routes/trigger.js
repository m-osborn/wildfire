'use strict';

/*
 * POST Handler for / route of Trigger (this is the edit route).
 */
exports.edit = function( req, res ) {
    res.send( 200, 'Edit' );
};

exports.geokeys = function( req, res ) {
    console.log( 'req.body: ', req.body );
    console.log( 'In the triggers route geokeys')
    res.redirect( '../controllers/geokey' );
};
