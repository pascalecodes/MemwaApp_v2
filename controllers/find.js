const cloudinary = require("../middleware/cloudinary");
require('dotenv').config();
const Post= require("../models/Post");
const path = require('path')
const User = require("../models/User")

module.exports = {
  getSearch: (req, res) => {
      res.render('search.ejs', {results: [] })
  },
  postSearch: async (req, res) => {
    const query = req.body.q
    try {
      const results =  await Post.find({
        $or: [
          {title: {$regex: query, $options: 'i'}},
          {caption: {$regex: query, $options: 'i'}},
          {description: {$regex: query, $options: 'i'}}
        ]
      })
      res.render('search.ejs', {results})
      console.log(`post results: ${results}`)

    } catch(err) {
      console.error(err)
      res.render('search.ejs', {results: []})
    }
  },
  //This is the function that is being used for the search and find functionality
  findPost: async (req, res) => {
    try {
      const searchTerm= req.query.searchTerm;
      let posts;
      if(searchTerm){
        posts = await Post.find({$or: [{title: {$regex: searchTerm, $options: 'i'}}, {caption: {$regex: searchTerm, $options: 'i'}}, {description: {$regex: searchTerm, $options: 'i'}}]})
      }else {
        posts = await Post.find()
      } 
      console.log(posts)
      res.render("find.ejs", { posts: posts, searchTerm: searchTerm});
  
    } catch (err) {
      console.log(err);
      res.render('error/500')
    }
  },
};


