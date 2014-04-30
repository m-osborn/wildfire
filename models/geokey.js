var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var GeokeySchema = new Schema({
    map:  { latitude:  { type: Number, default: 39.7683800 }, 
            longitude: { type: Number, default: -86.1580400 },
            radius:    { type: Number, default: 1 }
          },
    keywords: Array,
});

module.exports = mongoose.model('Geokey', GeokeySchema);
