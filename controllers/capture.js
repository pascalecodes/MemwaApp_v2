require('dotenv').config();
const cloudinary = require("../middleware/cloudinary");
const Capture = require("../models/Post");
const path = require('path')
const Video = require('../models/Post')
const Post = require('../models/Post')

module.exports = {
  getCapture: (req, res) => {
    res.render("capture.ejs");
  },
  getUpload: (req, res) => {
    res.render("upload.ejs");
  },
  uploadFile: async (req, res) => {
    try {
      // Upload video to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto", folder: "memwa",
      });
      await Capture.create({
        title: req.body.title,
        user: req.user.id,
        media: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        description: req.body.description,
        status: req.body.status,
        likes: 0,
      });
      console.log("Capture has been uploaded!");
      res.redirect("/capture");
    } catch (err) {
      console.log(err);
    }
  },
  // POST /videos
  captureVideo: async(req, res)=>{
    try {
      const { title, description, caption} = req.body
      // Save the video file to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'video',
      });
  
      // Create a new Video object to save to MongoDB
      const video = new Video({
        title: req.body.title,
        user: req.user.id,
        description: req.body.description,
        filename: req.file.filename,
        cloudinaryId: result.public_id,
        media: result.secure_url,
        caption: req.body.caption,
        status: req.body.status,
        likes: 0,
      });
  
      // Save the Video object to MongoDB
      await video.save();
  
      res.status(201).json(video);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }


  },
  uploadVideo: async (req,res) =>{
    try {
      const { title, description, caption } = req.body
    const videoUrl = req.file.path; 
    const newVideo = new Video({
      title,
      description,
      caption,
      user: req.use.id,
      filename: videoUrl.filename,
      media: videoUrl.secure_url,
      status: req.body.status,
      likes: 0,
    });
    
    await newVideo.save()
    res.status(201).json({success: true, media: videoUrl.secure_url})
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Internal server error'})
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
      res.status(201).json({success: true, media: result.secure_url})
      console.log("Post has been added!");
    } catch (err) {
      console.log(err);
      res.render('error/500')
    }
  },
  createVideoPost: async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {resource_type: "auto"});
      
      await Video.create({
        title: req.body.title,
        user: req.user.id,
        media: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        description: req.body.description,
        status: req.body.status,
        likes: 0,
      });
      console.log("VideoPost has been added!");
      res.redirect("/capture");
    } catch (err) {
      console.log(err);
      res.render('error/500')
    }
  },
  
};

//  // Save the post to MongoDB
//  await post.save();

//  // Redirect the user to the post page
//  res.redirect('/posts/' + post._id);
