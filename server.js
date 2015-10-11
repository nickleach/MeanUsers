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

//middleware to use for all requrests

apiRouter.use(function (req, res, next){
  //logging
  console.log("someone just came to our app!");

  //this is where we authenticate users
  next();
});

apiRouter.get('/', function(req, res){
  res.json({ message: 'hooray! welcome to our api!'});
});

//more routes here

apiRouter.route('/users')

  .post(function(req, res){
    //create a new instance of the user model
    var user = new User();
    // set the users information (comes from requrests)
    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;

    //save the user and check for errors
    user.save(function(err){
      if (err){
        //duplicate entry
        if(err.code == 11000)
          return res.json({ success: false, message: "A user with that username already exists. "});
        else
          return res.send(err);

      }

          res.json({message: 'User Created!'});
    })


  })

  .get(function(req, res){

    User.find(function(err, users){
      if (err) res.send(err);

      res.json(users);
    })

  });

  apiRouter.route('/users/:user_id')

    //get the user with that id
    .get(function(req, res){

      User.findById(req.params.user_id, function(err, user){

        if(err) res.send(err);

        //return that user
        res.json(user);

      });

    })

    .put(function(req, res){

      User.findById(req.params.user_id, function(err, user){

        // user our usermodel to find the user we want
        if(err) res.send(err);

        // update the users info only if its new
        if(req.body.name) user.name = req.body.name;
        if(req.body.username) user.username = req.body.username;
        if(req.body.password) user.password = req.body.password;

        user.save(function(err){
          if(err) res.send(err);

          res.json({message: 'User updated'});

        });

      });

    })

    .delete(function(req, res){
      User.remove({
        _id: req.params.user_id
      }, function(err, user){
        if(err) return res.send(err);

        res.json({ message: 'Successfully deleted'});
      });


    });



app.use('/api', apiRouter);


//Start the server

app.listen(port);

console.log('Magic happens on port '+ port);
