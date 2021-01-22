var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');

//INDEX - show all campgrounds
router.get('/', function (req, res) {
  // Get all Campgrounds from the DB
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render('campground/index', { campgrounds: allCampgrounds, currentUser: req.user });
    }
  });

});

//CREATE - add new Campground to DB
router.post('/', middleware.isLoggedIn, function (req, res)
{
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };

  var newCampground = { name: name, price: price, image: image, description: desc, author: author };

  //Create New Campground and save to Database
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      //redirect back to campgrounds page
      res.redirect('/campgrounds');
    }
  });
});

//NEW - show Form to create new Campground
router.get('/new', middleware.isLoggedIn, function (res, req)
{
  req.render('campground/new');
});

//SHOW- show more info for one campground
router.get('/:id', function (req, res) {
  //find campground with provided ID and show details
  Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      console.log(foundCampground);

      //render show template with that playground
      res.render('campground/show', { campground: foundCampground });
    }
  });

  // res.send('This will be shown on Page one day!');

});

//EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function (req, res) {
        Campground.findById(req.params.id, function (err, foundCampground) {
          res.render('campground/edit', { campground: foundCampground });
        });
      });

//UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, foundCampground) {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });

});

//DESTROY CAMPGROUND ROUTE:
router.delete('/:id', middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
