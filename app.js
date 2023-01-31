
require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const _ = require('lodash')
const mongoose = require('mongoose')
const date = require(__dirname + '/date.js')
const year = date.getYear()

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hi, I'm Syukri Hadi Kamil. A Developer 'in the making'. I learn Fullstack, but heavily on the Backend. I use JS, Python, and GoLang.";
const contactContent = "Well, this page still on the early stage of development.";

const app = express();

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

mongoose.set('strictQuery', false)
// mongoose.connect('mongodb://localhost:27017/blogDB')
mongoose.connect(`mongodb+srv://${process.env.ATLAS_ID}:${process.env.ATLAS_PW}@cluster0.ouzmlbq.mongodb.net/blogDB`)

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please type the blog title. No title specified.']
  },
  content: {
    type: String,
    required: [true, 'Please type your blog content. Content empty.']
  }
})

const Post = new mongoose.model('Post', postSchema)

app.get('/', (req, res) => {
  Post.find({}, (err, foundPosts) => {
    if (err) {
      console.log(err)
    } else {
      let blogs = foundPosts
      res.render('home', {
        year: year,
        homeStartingContent: homeStartingContent,
        pageTitle: 'Daily Journal',
        contents: blogs
      })
    }
  })
  
})

app.get('/about', (req, res) => {
  res.render('about', {year: year, pageTitle: 'About Me', content: aboutContent})
})

app.get('/contact', (req, res) => {
  res.render('contact', {year: year, pageTitle: 'Contact Me', content: contactContent})
})

app.get('/compose', (req, res) => {
  res.render('compose', {year: year, pageTitle: 'Compose'})
})

app.post('/compose', (req, res) => {
  const blog = new Post ({
    title: req.body.textTitle,
    content: req.body.textPost
  })
  blog.save()
  res.redirect('/')
})

app.get('/posts/:postTitle', (req, res) => {
  const requestedTitle = _.lowerCase(req.params.postTitle)
  Post.find({}, (err, foundPosts) => {
    if (err) {
      console.log(err)
    } else {
      let blogs = foundPosts
      for (i = 0; i < blogs.length; i++) {
        const postTitle = _.lowerCase(blogs[i].title)
        if (requestedTitle === postTitle) {
          res.render('post', {
            year: year,
            pageTitle: blogs[i].title,
            blog: blogs[i],
          })
          break
        }
      }
    }
  })
})






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
