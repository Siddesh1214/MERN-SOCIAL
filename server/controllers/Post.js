const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

async function uploadFileToCloudinary(file, folder, quality) {
	const options = {
		folder,
	};
	if (quality) {
		options.quality = quality;
	}

	options.resource_type = "auto";

	return await cloudinary.uploader.upload(file.tempFilePath, options);
}

function isFileTypeSupported(file, supportedTypes) {
	console.log("first");
	return supportedTypes.includes(file);
}

exports.createPost = async (req, res) => {
	try {
		const caption = req.body.caption;
		console.log(caption);

		const file = req.files.image;
		console.log(file);
		const owner = req.user.id;
		console.log("owner", owner);

		if (!caption || !owner || !file) {
			return res.status(404).json({
				success: false,
				message: "All Fields are Required",
			});
		}

		const supportedTypes = ["jpg", "jpeg", "png"];
		const fileType = file.name.split(".")[1].toLowerCase();
		console.log("File type : ", fileType);

		if (!isFileTypeSupported(fileType, supportedTypes)) {
			return res.status(503).json({
				success: false,
				message: "Only jpg/jpeg and png files are allowed",
			});
		}

		//file format supported hai

		console.log("second");
		const response = await uploadFileToCloudinary(file, "MernSocial", 90);
		console.log("The response is ", response);

		// const red = await cloudinary.uploader.upload(req.body.image, {
		//   folder: 'Siddesh',
		// });

		const fileData = await Post.create({
			caption,
			image: response.secure_url,
			owner,
		});

		// console.log('Per', per);
		console.log("fileData._id ", fileData._id);

		await User.findByIdAndUpdate(
			{ _id: owner },
			{
				$push: {
					posts: fileData._id,
				},
			},
			{ new: true }
		);

		const per = await User.findById(owner);
		per.password = undefined;
		res.status(201).json({
			success: true,
			message: "Post created",
			per,
			fileData,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

async function uploadFileToCloudFolder(file, folder) {
	const options = {
		folder,
	};
	options.resource_type = "auto";
	return await cloudinary.uploader.upload(file.tempFilePath, options);

}
exports.createNewPost = async (req, res) => {
	try {
		const caption = req.body.caption;
		console.log('caption--- ',caption);
		
		const file = req.files.image;
		// const file = req.body.image;
		// const file = req.file;
		// console.log("---- ",req);
		console.log("file -- ",file);
		const owner = req.user.id;

		// console.log("owner", owner);
		if (!caption || !owner || !file) {
			return res.status(404).json({
				success: false,
				message: "All Fields are Required",
			});
		}
		
		const response = await uploadFileToCloudFolder(file, "MernSocialPosts");
		
		const fileData = await Post.create({
			caption,
			image: {
				public_id: response.public_id,
				url:response.secure_url,
			},
			owner,
		});

		await User.findByIdAndUpdate(
			{ _id: owner },
			{
				$push: {
					posts: fileData._id,
				},
			},
			{ new: true }
		);

		const per = await User.findById(owner);
		per.password = undefined;
		res.status(201).json({
			success: true,
			message: "Post created",
			per,
			fileData,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.likeAndUnlikePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(400).json({
				success: false,
				message: "no post found",
			});
		}

		if (post.likes.includes(req.user.id)) {
			// remove like from the array of likes in db
			let index = post.likes.indexOf(req.user.id);

			post.likes.splice(index, 1);

			await post.save();

			return res.status(200).json({
				success: true,
				message: "Post Uniked",
			});
		} else {
			// add user id to likers array and save it into database
			post.likes.push(req.user.id);

			await post.save();

			return res.status(200).json({
				success: true,
				message: "Post Liked",
			});
		}
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post not found",
			});
		}

		if (post.owner.toString() !== req.user.id.toString()) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}

		console.log('------------',post.image.public_id);
		// await cloudinary.v2.uploader.destroy(post.image.public_id);
		await cloudinary.uploader.destroy(post.image.public_id);

		
		const user = await User.findById(req.user.id);
		
		const postArr = user.posts;

    const postIndex = postArr.indexOf(req.params.id);
		postArr.splice(postIndex, 1);
		

		await user.save();


		await Post.findByIdAndDelete(req.params.id);
		
		res.status(200).json({
			success: true,
			message: "Post deleted",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
// const user = await User.findById(req.user.id);

// const index = user.posts.indexOf(req.params.id);
// user.posts.splice(index, 1);
// await user.save();

// await post.remove();

exports.updateCaption = async (req, res) => {
	try {
		// const post = req.params.id;
		const caption  = req.body.caption;
		// console.log("caption: ", caption, "id: ", req.params.id);
		await Post.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				caption: caption,
			},
			{ new: true }
		);

		const post = await Post.findById(req.params.id);
		// console.log("this",post.caption);

		res.status(200).json({
			success: true,
			message: "Post caption updated",
			post,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

// exports.addComment = async (req, res) => {
// 	try {
// 		const comment = req.body;

// 		const post = await Post.findById(req.params.id);
// 		if (!post) {
// 			return res.status(404).json({
// 				success: false,
// 				message: "Post not found",
// 			});
// 		}

// 		const updatedPost = await Post.findByIdAndUpdate(
// 			{ _id: req.params.id },
// 			{
// 				$push: {
// 					comments: comment,
// 					user: req.user.id,
// 				},
// 			},
// 			{ new: true }
// 		);

// 		return res.status(200).json({
// 			success: true,
// 			message: "comment added",
// 			post: updatedPost
// 		});

// 	} catch (error) {
// 		console.log(error);
// 		res.status(400).json({
// 			success: false,
// 			message: error.message,
// 		});
// 	}
// };

// exports.deleteComment = async (req, res) => {
// 	try {
// 		const comment = req.params.id;

// 	} catch (error) {
// 		console.log(error);
// 		res.status(400).json({
// 			success: false,
// 			message: error.message,
// 		});
// 	}
// }
