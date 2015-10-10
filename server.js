// Call the packages
var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    morgan     = require('morgan'),
    mongoose   = require('mongoose'),
    User       = require('./app/models/user'),
    port       = process.env.PORT || 8080; // set the port

mongoose.connect('mongodb://nick:nick@ds045632.mongolab.com:45632/meanusers');

// APP CONFIGURATION ---------------------
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
 Authorization');
 next();
})

app.use(morgan('dev'));

//Routes

app.get('/', function(req, res){
  res.send('Welcome to the home page');
})

// get an instance of the express router
var apiRouter = express.Router();

apiRouter.get('/', function(req, res){
  res.json({ message: 'hooray! welcome to our api!'});
});

//more routes here

//register routes

app.use('/api', apiRouter);


//Start the server

app.listen(port);

console.log('Magic happens on port '+ port);
