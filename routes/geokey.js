// 'use strict';

var mongoose    = require('mongoose');
var gk          = require('../models/geokey');
var Geokey      = mongoose.model('Geokey', gk);

// // POST Handler for / route of Geocode
// exports.create = function( req, res ){

//     console.log( 'req.body: ', req.body );
//     console.log( 'inside routes.geokey.js create');

//     new Geokey({
//         map : req.body.map,
//         keywords: req.body.keywords

//     }).save(function(err){
//       if (err) return handleError(err);
//     });

//     new Geokey({
//         map : tmp.map,
//         keywords: tmp.keywords
//     }).save(function( err, geokey, count ){
//        res.send( 200, 'create' );
//     });
// };
