// 'use strict';

// var mongoose = require('mongoose');
// var gk       = require('../models/geokey');
// var geokey   = mongoose.model('Geokey', GeokeySchema);

// function queryDB (req, res) {
//   // Let's find all the documents
//   Geokey.find({}).exec(function(err, result) { 

//   });
// }




// app.post('/api/products', function (req, res){
//   var product;
//   console.log("POST: ");
//   console.log(req.body);
//   product = new ProductModel({
//     title: req.body.title,
//     description: req.body.description,
//     style: req.body.style,
//   });
//   product.save(function (err) {
//     if (!err) {
//       return console.log("created");
//     } else {
//       return console.log(err);
//     }
//   });
//   return res.send(product);
// });