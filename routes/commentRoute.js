const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

router.post("/new", async (req, res) => {
    try {
        const { user, reel, text, parentComment } = await req.body;
        if (!user || !reel || !text) {
            res.status(500).json({
                message: "Somethink Error Occure in User or Reel or Comment"
            });
        }

        const comment = new Comment(
            {
                user, reel, text, parentComment: parentComment || null,
            }
        );

        const saveComment = await comment.save();

        res.status(201).json(saveComment);

    } catch (error) {
        res.status(500).json({ message: "Error Occure in Comment" });

    }
});

router.get("/", async (req, res) => {
    try {
        const comments = await Comment.find({});
        res.status(200).json(comments);

    } catch (error) {
        res.status(500).json({ message: "Error to fetching data" });

        console.log("Error to Fetching Data", error)
    }
    // console.log("Hello");
});

// find single comment 
router.get("/:id", async (req, res) => {
    try {
        const data = await Comment.findById(req.params.id);
        if (!data) {
            res.status(404).json({ message: "Comment not found" });
        };
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Error to fetching data" });

        console.log("Error to Fetching Data", error)
    }
});

// delete comment 
router.delete("/delete/:id", async (req, res) => {
    try {
        await Comment.deleteMany({ parentComment: req.params.id });
        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Comment Deleted Successfully!" });
    } catch (error) {
        console.log("Error in Delete Comment", error);
        res.status(500).json({ message: "Error in Comment video" });
    }
});

//update comment
router.put("/update/:id", async (req, res) => {
    try {
        const { text } = await req.body;
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            res.status(404).json({ message: "Comment Not Found to edit!" });
        }

        comment.text = text;

        const savedComment = await comment.save();
        res.status(201).json(
            savedComment
        );
    } catch (error) {
        console.log("Error in Update Comment", error);
        res.status(500).json({ message: "Error in Comment" });
    }
});


// GET comments for a reel
router.get('/reel/:reelId', async (req, res) => {
  try {
    const reelId = req.params.reelId;

    const comments = await Comment.find({ reel: reelId, parentComment: null })
      .populate('user', 'name profilePic') // Adjust as needed
      .sort({ createdAt: -1 });

    // Fetch replies for each comment
    const commentsWithReplies = await Promise.all(comments.map(async comment => {
      const replies = await Comment.find({ parentComment: comment._id })
        .populate('user', 'name profilePic')
        .sort({ createdAt: 1 });

      return { ...comment._doc, replies };
    }));

    res.status(200).json(commentsWithReplies);
  } catch (error) {
    console.log("Error fetching comments:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// comment like dislike
router.put("/like/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    const commentId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }

    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyLiked) {
      // If already liked, remove the like
      comment.likes = comment.likes.filter((id) => id.toString() !== userId);
      await comment.save();
      return res.status(200).json({ message: "comment Disliked", likes: comment.likes.length });
    } else {
      // If not liked, add the like
      comment.likes.push(userId);
      await comment.save();
      return res.status(200).json({ message: "comment liked", likes: comment.likes.length });
    }

  } catch (error) {
    console.log("Error in liking/Disliking comment:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


module.exports = router;
