const Post = require("../models/Post");
const User = require("../models/User");
const path = require('path')

module.exports = {
  getIndex: async (req, res) => {
    try {
      res.render("index");
    } catch(err) {
      console.log(err)
      res.render('error/404')
    }
  },
  getHome: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).populate('user').lean();
      const ext= posts.map(post=> path.extname(post.media))
      res.render("home.ejs", {posts: posts, user: req.user, ext: ext});
    } catch(err) {
      console.log(err)
      res.render('error/404')
    }
  },
  getWatch: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).populate('user').lean();
      const ext= posts.map(post=> path.extname(post.media))
      const playlist = posts.map(post => [post._id, post.title, post.user.userName, post.media])
      res.render("watch.ejs", {posts: posts, user: req.user, ext: req.ext, playlist: playlist});
    } catch(err) {
      console.log(err)
      res.render('error/404')
    }
  },
  getVideo: async (req, res) =>{
    try{
      const posts = await Post.find().sort({ createdAt: "desc" }).populate('user').lean();
      
      const video_list = await 
        Post.find().populate('user')
        const video_detail = []; // initialize empty playlist array

        video_list.forEach(video => {
          video_detail.push({
            title: video.title,
            user: video.user.userName,
            description: video.description,
            caption: video.caption,
            url: video.media,
            id: video._id,
            ext: path.extname(video.media)
          }); // add video objects to playlist array
        });
      res.render('watch.ejs', {posts: posts, videos: video_list, detail: video_detail, user: req.user})
  
    } catch(err) {
      console.log(err)
      res.render('error/404')
    }
  },

};
