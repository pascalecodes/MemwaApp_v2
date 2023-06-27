const cloudinary = require("../middleware/cloudinary");
require('dotenv').config();
const Post = require("../models/Post");
const User = require("../models/User")
const Comment = require("../models/Comment");
const path = require('path')

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      const ext= posts.map(post=> path.extname(post.media))
      res.render("profile.ejs", { posts: posts, user: req.user, ext: ext });
    } catch (err) {
      console.log(err);
      res.render('error/500')
    }
  },
  uploadAvatar: async (req, res) => {
    let user = req.user
    let id = req.params.id;
    const {userName, email, firstName, lastName, avatar} = req.body;
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {resource_type: "auto"})
      user.avatar = result.secure_url
      user.save()
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
      res.render('error/500')
    }
  },
  updateProfile: async (req,res) => {
    try {
      console.log(req.params.id)
      let user= req.user
      let id = user._id
        
      let {
          firstName,
          lastName,
          email,
          bio,
          //avatar,
        } = req.body
      
        let updateUser = {
          firstName:  firstName= (req.body.firstName? req.body.firstName: req.user.firstName),
          lastName:  lastName= (req.body.lastName? req.body.lastName: req.user.lastName),
          email:  email= (req.body.email? req.body.email: req.user.email),
          bio:  bio= (req.body.bio? req.body.bio: req.user.bio),
          //avatar: avatar,
        }
        user = await User.findByIdAndUpdate(id, { firstName, lastName, email, bio }, { new: true });
        console.log("Profile has been edited!");
        res.redirect('/profile')
    } catch (err) {
      console.error(err)
      return req.render('error/500')
    }
  },
  editProfile: async (req,res) => {
    try {
      const user = req.user;
      res.render('editProfile.ejs', {
        user,
      });

    } catch (err) {
      console.log(err);
      res.render('error/500')
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ likes: "desc" }).populate('user');
      const ext= posts.map(post=> path.extname(post.media))
    
      //group posts by username but not using it to render right now
      const groupPosts = posts.reduce((acc, post) => {
        if (!acc[post.user.userName]) {
          acc[post.user.userName] = []
        }
        acc[post.user.userName].push({
          ...post,
          ext: path.extname(post.media)
        });
        return acc;
      }, {});

      //console.log(posts)
      res.render("feed.ejs", { posts: posts,  user: req.user, ext: ext, groupPosts: groupPosts});
    } catch (err) {
      console.log(err);
      res.render('error/500')
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id).populate('user');
      const ext= path.extname(post.media)
    
      const comments = await Comment.find({post: req.params.id}).sort({ createdAt: "desc" }).lean();
      res.render("post.ejs", { post: post, user: req.user, comments: comments, ext: ext});
    } catch (err) {
      console.log(err);
      res.render('error/500')
    }
  },
  getAdd: async (req, res) => {
    try {
      res.render("stories/add.ejs")
    } catch (err) {
      console.log(err);
      res.render('error/500')
    }    
  },
  createPost: async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {resource_type: "auto"});
      
      await Post.create({
        title: req.body.title,
        user: req.user.id,
        media: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        description: req.body.description,
        status: req.body.status,
        likes: 0,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
      res.render('error/500')
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
      res.render('error/500')
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.deleteOne({ _id: req.params.id });
      console.log("Deleted Post");
      //res.redirect("/profile");
      // Delete comment from db
      await Comment.deleteMany({ post: req.params.id });
      // _id: req.params.commentid
      console.log("Deleted Comment");
      //res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
    //Redirect back to profile page
    res.redirect("/profile");
  },
 
};
