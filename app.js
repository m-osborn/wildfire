'use strict';
// Module Dependencies
// -------------------
//require('newrelic');
var express     = require('express');
var http        = require('http');
var JWT         = require('./lib/jwtDecoder');
var path        = require('path');
var request     = require('request');
var routes      = require('./routes');
var activity    = require('./routes/activity');
var trigger     = require('./routes/trigger');
var geokey      = require('./routes/geokey');
var mongoose    = require('mongoose');
var MONGOHQ_URL = 'mongodb://wild:fire@oceanic.mongohq.com:10086/app24707022';
var app         = express();
var fs          = require('fs');
var twitter     = require('twit');
var geopoint    = require('geopoint');

// Register configs for the environments where the app functions
// these can be stored in a separate file using a module like config
var APIKeys = {
    appId           : '6f783347-80e8-46c5-9b57-3d4fd2be92b8',
    clientId        : '3vj2rwufbdt6v95cmur6z4t2',
    clientSecret    : 'ww7QhCMPPMGJATeRFC7SY9KU',
    appSignature    : 'who1x3cac1cl3jltjbswy4fqn4hq0khoa5dpddhxqjvljou1hbwa41q2xew1ryuuehn310ujdij1my0xj1mcxnijp3f345rrrodpmeywdcqrsumplk5aqbtamnf011qz2t4kqxeukacrbqqxexwre2ttihom3f2i1c5stgrtyofq2dji1jovyz5jrld5iomoo2lxjjrpy5aj0b1tsyftzcnm2rb3mmhx3ot53ojd1sdoy5haxt1sktgofbwvzk2',
    authUrl         : 'https://auth.exacttargetapis.com/v1/requestToken?legacy=1'
};

var token = '';

request.post('https://auth.exacttargetapis.com/v1/requestToken', {
        form: {
            clientId: APIKeys.clientId,
            clientSecret: APIKeys.clientSecret
        }
    },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var tokenData = JSON.parse(body);
            token = tokenData.accessToken;
        }
    }
);

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};

//Mongodb to hold jb activity configs
// mongoose.connect(MONGOHQ_URL);
// mongoose.connect('mongodb://127.0.0.1/wildfire');

// var db = mongoose.connection;
// //console.log("db: ", db.collections);


// db.on('error', console.error.bind(console, 'error from db on:'));
// db.once('open', function callback() {
//     console.log("Connected to db");
// });

var t = new twitter({
    consumer_key        : 'VMZOp5qIcU0Ee8lQGvOj8iIoQ',
    consumer_secret     : 'Faw7MMpBl4chofoE7HPQzWOq48CJ1OiQdRrLX7obWgU7coTnU2',
    access_token        : '16829624-Vy7AyEI2CwuT2xbwZnkdNfyKXSix5xNmmkdCnsAuF',
    access_token_secret : 'Y23cmSR8X5OrUjWTJTyZGj6GzaRheCEq51OXncDJLI8Ae'
});

var theCircle = new geopoint(39.7683800, -86.1580400);
var theCircleBox = theCircle.boundingCoordinates(1);
var theCircleSquare = [theCircleBox[0]._degLon, theCircleBox[0]._degLat, theCircleBox[1]._degLon, theCircleBox[1]._degLat];

var tweetKeywords = ['ExactTarget', '#jbdbc', 'hackathon'];


var app = express();
var db = mongoose.connection;


// Use the cookie-based session middleware
app.use(express.cookieParser());

// TODO: MaxAge for cookie based on token exp?
app.use(express.cookieSession({secret: "WildfireTwitter-CookieSecret"}));

// Configure Express
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.favicon());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());

// Express in Development Mode
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


// Simple custom middleware
function tokenFromJWT( req, res, next ) {
    // Setup the signature for decoding the JWT
    var jwt = new JWT({appSignature: APIKeys.appSignature});

    // Object representing the data in the JWT
    var jwtData = jwt.decode( req );

    // Bolt the data we need to make this call onto the session.
    // Since the UI for this app is only used as a management console,
    // we can get away with this. Otherwise, you should use a
    // persistent storage system and manage tokens properly with
    // node-fuel
    req.session.token = token;
    next();
}


// HubExchange Routes
app.get('/', routes.index );
app.post('/', function(req, res){
    console.log(req.body);      // your JSON
    res.send(req.body);    // echo the result back
    var tmp = req.body;
});
app.post('/login', tokenFromJWT, routes.login );
app.post('/logout', routes.logout );


// Custom Wildfire Twitter Trigger Route
// app.post('/ixn/triggers/wildfire-twitter/create', geokey.create );
// app.get('/ixn/triggers/wildfire-twitter/read', geokey.read );

app.post('/ixn/triggers/wildfire-twitter/edit', trigger.edit );

// Abstract Event Handler
app.post('/fireEvent/:type', function( req, res ) {
    var data = req.body;
    var triggerIdFromAppExtensionInAppCenter = 'jbdbc-wildfire-trigger';
    var JB_EVENT_API = 'https://www.exacttargetapis.com/interaction-experimental/v1/events';
    var reqOpts = {};

    if( 'wildfireTwitter' !== req.params.type ) {
        res.send( 400, 'Unknown route param: "' + req.params.type +'"' );
    } else {
        // Hydrate the request
        reqOpts = {
            url: JB_EVENT_API,
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                ContactKey: data.alternativeEmail,
                EventDefinitionKey: triggerIdFromAppExtensionInAppCenter,
                Data: data
            })
        };

        request( reqOpts, function( error, response, body ) {
            if( error ) {
                console.error( 'ERROR: ', error );
                res.send( response, 400, error );
            } else {
                res.send( body, 200, response);
            }
        }.bind( this ) );
    }
});

app.get('/clearList', function( req, res ) {
  // The client makes this request to get the data
  activity.logExecuteData = [];
  res.send( 200 );
});


// Used to populate events which have reached the activity in the interaction we created
app.get('/getActivityData', function( req, res ) {
  // The client makes this request to get the data
  if( !activity.logExecuteData.length ) {
    res.send( 200, {data: null} );
  } else {
    res.send( 200, {data: activity.logExecuteData} );
  }
});



// ===== Twitter stream stuff =======================================

var stream = t.stream('statuses/filter', {
    locations: theCircleSquare
});

stream.on('tweet', function (tweet) {
    var t = tweet.text.toLowerCase();
    var matchingTweet = false;
    var counter = 0;

    while((counter < tweetKeywords.length) && (matchingTweet === false)) {
        if (t.indexOf(tweetKeywords[counter].trim()) > -1) {
            matchingTweet = true;
        }
        counter++;
    };

    // if (matchingTweet) {
    //     console.log("matching tweet: ", tweet.text);
    // } else {
    //     console.log("regular tweet: ", tweet.text);
    // }
});

// //Mongodb to hold jb activity configs
// mongoose.connect(MONGOHQ_URL);
// // mongoose.connect('mongodb://localhost/wildfire');

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function callback() {
//     // Start serving only after connecting to Mongo.
//     app.listen(3000);
//     console.log('Express server listening on port ' + app.get('port'));
// });


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.post('/ixn/triggers/wildfire-twitter/create', function(req, res){
    //String parsing
    // var tmp = req.body;
    // console.log(tmp);
    // var map_data = tmp.map;
    // var kw_data = tmp.keywords;

    // var filename = './tmp/the_data.txt';
    // var to_write = [];
    // '{ map : ', map_data, ', keywords : ', kw_data, '}';

    // console.logger
    // fs.writeFile(filename, to_write, function(err){
    //     if(err){
    //         console.log(err);
    //     }else{
    //         console.log("file was written");
    //     }
    // });

    // console.log('map_data', map_data);
    // console.log('kw_data', kw_data);


    res.send( 200, 'Edit' );
});


