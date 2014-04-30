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
var geokey      = require('./controllers/geokey');
var mongoose    = require('mongoose');
var MONGOHQ_URL = 'mongodb://wildfire:Spre@d5@oceanic.mongohq.com:10031/app24138460';

var app = express();

// Register configs for the environments where the app functions
// , these can be stored in a separate file using a module like config
var APIKeys = {
    appId           : '6f783347-80e8-46c5-9b57-3d4fd2be92b8',
    clientId        : '3vj2rwufbdt6v95cmur6z4t2',
    clientSecret    : 'ww7QhCMPPMGJATeRFC7SY9KU',
    appSignature    : 'who1x3cac1cl3jltjbswy4fqn4hq0khoa5dpddhxqjvljou1hbwa41q2xew1ryuuehn310ujdij1my0xj1mcxnijp3f345rrrodpmeywdcqrsumplk5aqbtamnf011qz2t4kqxeukacrbqqxexwre2ttihom3f2i1c5stgrtyofq2dji1jovyz5jrld5iomoo2lxjjrpy5aj0b1tsyftzcnm2rb3mmhx3ot53ojd1sdoy5haxt1sktgofbwvzk2',
    authUrl         : 'https://auth.exacttargetapis.com/v1/requestToken?legacy=1'
};

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
    req.session.token = jwtData.token;
    next();
}

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

// Express in Development Mode
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// HubExchange Routes
app.get('/', routes.index );
app.post('/login', tokenFromJWT, routes.login );
app.post('/logout', routes.logout );

//Tmp route to see DB contents
app.get('/geokeys', trigger.geokeys );



// Custom Wildfire Twitter Activity Routes
// app.post('/ixn/activities/wildfire-twitter/save/', activity.save );
// app.post('/ixn/activities/wildfire-twitter/validate/', activity.validate );
// app.post('/ixn/activities/wildfire-twitter/publish/', activity.publish );
// app.post('/ixn/activities/wildfire-twitter/execute/', activity.execute );
//app.post('/ixn/activities/wildfire-twitter/edit/', activity.edit );

// Custom Wildfire Twitter Trigger Route
app.post('/ixn/triggers/wildfire-twitter/', trigger.edit );
app.post('/ixn/triggers/wildfire-twitter/update', trigger.update)

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
                'Authorization': 'Bearer ' + req.session.token
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

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// Mongodb to hold jb activity configs
mongoose.connect(MONGOHQ_URL);
//mongoose.connect('mongodb://localhost/wildfire')

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("Connected to db");
});


//---------------------
// var          = require('mongoose');
var gk       = require('../models/geokey');
var Geokey   = mongoose.model('Geokey', GeokeySchema);

function queryDB (req, res) {
  // Let's find all the documents
  Geokey.find({}).exec(function(err, result) { 
    if (!err) { 
      res.write(html1 + JSON.stringify(result, undefined, 2) +  html2 + result.length + html3);
      var query = Geokey.find();
      query.exec(function(err, result) {
    if (!err) {
      res.end(html4 + JSON.stringify(result, undefined, 2) + html5 + result.length + html6);
    } else {
      res.end('Error in second query. ' + err)
    }
      });
    } else {
      res.end('Error in first query. ' + err)
    };
  });
}

// The rudimentary HTML content in three pieces.
var html1 = '<title> hello-mongoose: MongoLab MongoDB Mongoose Node.js Demo on Heroku </title> \
<head> \
<style> body {color: #394a5f; font-family: sans-serif} </style> \
</head> \
<body> \
<h1> hello-mongoose: MongoLab MongoDB Mongoose Node.js Demo on Heroku </h1> \
See the <a href="https://devcenter.heroku.com/articles/nodejs-mongoose">supporting article on the Dev Center</a> to learn more about data modeling with Mongoose. \
<br\> \
<br\> \
<br\> <h2> All Documents in MonogoDB database </h2> <pre><code> ';
var html2 = '</code></pre> <br\> <i>';
var html3 = ' documents. </i> <br\> <br\>';
var html4 = '<h2> Queried (name.last = "Doe", age >64) Documents in MonogoDB database </h2> <pre><code> ';
var html5 = '</code></pre> <br\> <i>';
var html6 = ' documents. </i> <br\> <br\> \
<br\> <br\> <center><i> Demo code available at <a href="http://github.com/mongolab/hello-mongoose">github.com</a> </i></center>';
