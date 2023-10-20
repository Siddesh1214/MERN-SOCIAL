const User = require("../models/User");
const Post = require("../models/Post");

exports.getPostOfFollowing = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		console.log("user info is ",user);
		if (!user) {
			return res.status(401).json({
				success: false,
				message: "please login first",
			});
    }
    
		const posts = await Post.find({
			owner: {
				$in: user.following,
			},
    }).populate('likes owner comments comments.comment.user');
    // posts.owner.password = undefined;
    // for (let i = 0; i < 5; i++){
    //   posts[i].owner.password = undefined;
    // }

    for (let i = 0; i < posts.length; i++) {
      posts[i].owner.password = undefined;
    }

		return res.status(200).json({
			success: true,

			posts: posts.reverse(),
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.myPosts = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		const posts = []
		
		for (let i = 0; i < user.posts.length; i++){
			const post = await Post.findById(user.posts[i]).populate('likes comments owner');
			posts.push(post);
		}
		user.password = undefined;
		return res.status(200).json({
			success: true,
			posts,
		})
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}
