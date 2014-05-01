'use strict';

// var mongoose    = require('mongoose');
// var gk          = require('../models/geokey');
// var Geokey      = mongoose.model('Geokey', gk);

// console.log( mongoose );
// mongoose.Geokey.find( function( err, data ) {
//     if( error ) {
//         console.log( 'ERROR: ', error)
//     }else{
//         console.log( 'DATA: ', data)
//     }
// });


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

//     res.send( 200, 'Create' );
//     console.log( 'no errors!?');
// };

// exports.read = function (req, res){
//     console.log( 'inside routes.geokey.js read ');


//     Geokey.find(function(err, geokeys) {
//       if (!err) {
//         res.json(geokeys)
//         console.log(geokeys)
//       } else {
//         console.log('error in Geokey.find():', err);
//       }
//     });
//     res.send( 200, 'Read' );
// };
