'use strict';

/*
 * POST Handler for / route of Trigger (this is the edit route).
 */
exports.edit = function( req, res ) {
    res.send( 200, 'Edit' );

};


exports.create = function( req, res ) {

    console.log( 'req.body: ', req.body );

    exports.geokeys_data.push({
        maps: req.body.map,
        keywords: req.body.keywords
    });

    new Geokey({
        map : tmp.map,
        keywords: tmp.keywords
    }).save(function( err, geokey, count ){
    res.send( 200, 'create' );
});
};

