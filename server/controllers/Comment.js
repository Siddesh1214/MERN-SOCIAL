const Comment = require("../models/Comment");
const User = require("../models/User");
const Post = require("../models/Post");

exports.addComment = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		const savedComment = await Comment.create({
			comment: req.body.comment,
			user: req.user.id,
      post: req.params.id,
      userName: req.user.name,
      uAvat:req.user.avatar
		});

    
		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post not found",
			});
		}

		const updatedPost = await Post.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				$push: {
					comments: savedComment._id,
				},
			},
			{ new: true }
		);

		const newUpdatedComm = await Comment.findById({
			_id: savedComment._id,
		}).populate("user");

		newUpdatedComm.user.password = undefined;

		return res.status(200).json({
			success: true,
			message: "Comment added successfully",
			comment: newUpdatedComm,
			// post: updatedPost,
			// new:newUpdatedComm,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

exports.deleteComment = async (req, res) => {
	try {
		const comment = await Comment.findById(req.params.id);
		// console.log(comment);
		if (!comment) {
			return res.status(401).json({
				success: false,
				message: "Comment not present",
			});
		}
		// console.log(req.user.id, comment.user.toString());

		const postId = comment.post;
		// console.log("post id is ", postId);
		const currPo = await Post.findById(postId);

		const commArr = currPo.comments;

		const comInd = commArr.indexOf(req.params.id);
		// console.log("-----", comInd);

		// console.log(commArr);
		commArr.splice(comInd, 1);
		// console.log(commArr);

		// console.log("currPosr",currPo);
		await currPo.save();

		if (req.user.id === comment.user.toString()) {
			await Comment.findByIdAndDelete({ _id: req.params.id });
		} else {
			res.status(409).json({
				success: false,
				message: "Unauthorized",
			});
		}

		res.status(200).json({
			success: true,
			message: "success full",
			// comment,
			currPo,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

exports.getCommentsOfPost = async (req, res) => {
	try {
		const post = req.params.id;
		if (!post) {
			return res.status(400).json({
				success: false,
				message: "Please provide a valid post Id",
			});
    };
    const givePosts = await Post.findById({ _id: post }).populate('comments');
    
    return res.status(200).json({
      success: true,
      posts:givePosts
    })
  } catch (error) {
    console.log(error);
		return res.status(400).json({
			success: false,
			message: error.message,
		});
  }


};
