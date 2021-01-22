var express           = require('express'),
    app               = express(),
    bodyParser        = require('body-parser'),
    mongoose          = require('mongoose'),
    Campground        = require('./models/campground'),
    passport          = require('passport'),
    LocalStrategy     = require('passport-local'),
    Comment           = require('./models/comment'),
    methodOverride    = require('method-override'),
    User              = require('./models/user'),
    seedDB            = require('./seeds')
    flash             = require('connect-flash');

//requiring routes
var commentRoutes = require('./routes/comments');
var campgroundsRoutes = require('./routes/campgrounds');
var indexRoutes = require('./routes/index');

//seedDB(); //seed the Database

mongoose.connect('mongodb://127.0.0.1:27017/yelp_camp_FINAL', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret: 'Bitpanda rocks!',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(3000, '127.0.0.1', function ()
{
  console.log('The Camp Server has started');
});
