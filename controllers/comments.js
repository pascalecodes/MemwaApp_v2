const Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res) => {
    try {
      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        post: req.params.id,
        madeBy: req.user.userName,
        madeByID: req.user.id
      });
      console.log("Comment has been added!");
      res.redirect("/post/"+req.params.id)
    } catch (err) {
      console.log(err);
      res.render('error/500')
    }
  },
  deleteComment: async (req, res) => {
    try {
      // Find comment by id
      await Comment.deleteOne({_id: req.params.commentid})
      console.log("Deleted Comment");
      res.redirect("/post/"+req.params.postid)
    } catch (err) {
      res.redirect("/profile");
      console.log(err)
    }
  },
};
