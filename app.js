//jshint esversion:6

//modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose')

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//constants
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//functions
const app = express();

const makeConnection = ()=>{
  // mongoose.connect('mongodb://0.0.0.0:27017/blogsDB',{
  mongoose.connect('mongodb+srv://admin:admin123@cluster0.abvqgur.mongodb.net/blogsDB',{
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(()=>{
    console.log('Connected Successfully')
  }).catch((err)=>{
    console.log('Failed to connect to database : '+err)
  })
}

const discardConnection = ()=>{
  mongoose.connection.close()
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Schema Definition
const blogsSchema = new mongoose.Schema({
  title:{type: String},
  content:{type:String},
})

const Blog = mongoose.model('Blog',blogsSchema)

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", function(req, res){
  makeConnection();
  Blog.find().then((blogs)=>{
    res.render("home", {
      startingContent: homeStartingContent,
      posts: blogs
      });
  })

  setTimeout(() => {
    discardConnection();
  }, 1800000);
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  makeConnection();
  const post = new Blog({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  
  post.save().then(()=>{
    console.log(`New Post Created with Title ${req.body.postTitle}`);
  }).catch((err)=>{
    throw err;
  })
  res.redirect("/");

});

app.get("/posts/:id", function(req, res){
  // const requestedTitle = _.lowerCase(req.params.id);
  const id = req.params.id;
  Blog.findById(id).then((post)=>{
    
    res.render("post", {
      title: post.title,
      content: post.content
    });
  })
  
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
