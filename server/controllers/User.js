const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mailSender = require("../utils/mailSender");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

exports.signUp = async (req, res) => {
	try {
		const { name, email, password, avatar } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({
				success: false,
				message: "Please enter all fields",
			});
		}
		const myCloud = await cloudinary.uploader.upload(avatar, {
			folder: "MernSocialAvatar",
		});

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists",
			});
		}

		// try {
		// } catch (error) {
		// 	return res.status(400).json({
		// 		success: false,
		// 		message: "Error in hashing password",
		// 	});
		// }

		const hashPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			name,
			email,
			password: hashPassword,
			// avatar: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}`,
			avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
		});

		return res.status(200).json({
			success: true,
			message: "User Created Successfully",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "User can not be registered, please try again later",
		});
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Please enter all fields",
			});
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const payload = {
			id: user._id,
			email: user.email,
		};
		//check for correct passowrd and generate token

		if (await bcrypt.compare(password, user.password)) {
			const token = jwt.sign(payload, process.env.JWT_SECRET, {
				expiresIn: "3h",
			});

			const options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};

			// res.cookie('token', token, options).status(200).json({
			//   success: true,
			//   token,
			//   _id: user._id,
			//   name: user.name,
			//   email,
			//   message: 'User logged in Successfully'
			// });
			user.password = undefined;
			res.cookie("token", token, options).status(200).json({
				success: true,
				token,
				user,
				message: "User logged in Successfully",
			});

			// console.log(undefined);
		} else {
			return res.status(403).json({
				success: false,
				message: "Incorrect password",
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Login failure",
		});
	}
};

exports.profile = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).populate(
			"posts followers following"
		);
		// console.log(req.user);
		user.password = undefined;
		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Cannot fetch profile",
		});
	}
};

exports.followUser = async (req, res) => {
	try {
		const userToFollow = await User.findById(req.params.id);
		//     console.log('user to follow is ', userToFollow );
		const loggedInUser = await User.findById(req.user.id);

		// console.log(userToFollow.followers," ---- ",loggedInUser.following);
		console.log(loggedInUser._id);
		if (!userToFollow) {
			return res.status(400).json({
				success: false,
				message: "No user found",
			});
		}

		if (userToFollow.followers.includes(loggedInUser._id)) {
			return res.status(401).json({
				success: false,
				messsage: "User is followed already",
			});
		} else {
			await User.findByIdAndUpdate(
				{ _id: req.user.id },
				{
					$push: {
						following: req.params.id,
					},
				},
				{ new: true }
			);

			await User.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					$push: {
						followers: req.user.id,
					},
				},
				{ new: true }
			);
		}

		res.status(200).json({
			success: true,
			message: "User Followed",
			loggedInUser,
		});
	} catch (error) {
		console.log(error);
		res.status(200).json({
			success: false,
			message: error.message,
		});
	}
};

exports.unfollowUser = async (req, res) => {
	try {
		const userToUnFollow = await User.findById(req.params.id);
		//     console.log('user to follow is ', userToFollow );
		const loggedInUser = await User.findById(req.user.id);

		if (!userToUnFollow) {
			return res.status(400).json({
				success: false,
				message: "No user found",
			});
		}

		await User.findByIdAndUpdate(
			{ _id: req.user.id },
			{
				$pull: {
					following: req.params.id,
				},
			},
			{ new: true }
		);

		await User.findByIdAndUpdate(
			{ _id: req.params.id },
			{
				$pull: {
					followers: req.user.id,
				},
			},
			{ new: true }
		);

		res.status(200).json({
			success: true,
			message: "User Unfollowed",
			loggedInUser,
		});
	} catch (error) {
		console.log(error);
		res.status(200).json({
			success: true,
			message: error.message,
		});
	}
};

exports.logout = async (req, res) => {
	try {
		const options = {
			// expiresIn: new Date.now,
			expiresIn: new Date(Date.now()),
			httpOnly: true,
		};
		res.status(200).cookie("token", null, options).json({
			success: true,
			message: "user logged out successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

exports.updatePassword = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "No user found",
			});
		}

		const { oldPassword, newPassword, confirmNewPass } = req.body;
		if (!oldPassword || !newPassword || !confirmNewPass) {
			return res.status(400).json({
				success: false,
				message: "All fields required",
			});
		}
		console.log(user.password);

		console.log(oldPassword, newPassword, confirmNewPass);
		if (newPassword !== confirmNewPass) {
			return res.status(409).json({
				success: false,
				message: "new password and confirm new passwords do not match",
			});
		}

		const isMatch = await bcrypt.compare(oldPassword, user.password);

		if (!isMatch) {
			return res.status(409).json({
				success: false,
				message: "passwords do not match, incorrect old password",
			});
		}

		const hashNewPassword = await bcrypt.hash(newPassword, 10);

		await User.findByIdAndUpdate(
			req.user.id,
			{ password: hashNewPassword },
			{ new: true }
		);

		return res.status(200).json({
			success: true,
			message: "Password Updated",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.updateProfile = async (req, res) => {
	try {
		const { name, email, avatar } = req.body;
		
		let result;
		if (avatar) {
			await cloudinary.uploader.destroy(user.avatar.public_id);
		 	result = await cloudinary.uploader.upload(avatar, {
				folder:'MernSocialAvatar'
			});
		}
		
		await User.findByIdAndUpdate(
			req.user.id,
			{
				avatar: {
					public_id: result.public_id,
					url:result.secure_url
				},
				name: name,
				email: email,

			},
			{ new: true }
		);

		

		const user = await User.findById(req.user.id);
		console.log(user.name, user.email);

		res.status(200).json({
			success: true,
			message: "profile updated",
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

exports.deleteMyProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		const posts = user.posts;
		const followers = user.followers;
		const following = user.following;
		const temp = user.id;
		console.log(posts);

		for (let i = 0; i < posts.length; i++) {
			// await Post.findbyIdAndDelete(posts[i]);
			await Post.findByIdAndDelete(posts[i]);
		}

		//removing users from followers following
		for (let i = 0; i < followers.length; i++) {
			const follower = await User.findById(followers[i]);

			const index = follower.following.indexOf(temp);
			follower.following.splice(index, 1);
			await follower.save();
		}
		//removing users from following followers
		for (let i = 0; i < following.length; i++) {
			const follows = await User.findById(following[i]);

			const index = follows.followers.indexOf(temp);
			follows.followers.splice(index, 1);
			await follows.save();
		}

		await User.findByIdAndDelete(req.user.id);
		const options = {
			expiresIn: new Date(Date.now()),
			httpOnly: true,
		};
		res.cookie("token", null, options);

		return res.status(200).json({
			success: true,
			message: "Profile Deleted Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Unable to Delete Profile, please try again",
			error: error.message,
		});
	}
};

exports.getUserProfile = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).populate(
			"posts followers following"
		);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}
		return res.status(200).json({
			success: true,
			user: user,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Unable to get Profile, please try again",
			error: error.message,
		});
	}
};

exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find({});
		return res.status(200).json({
			success: true,
			users,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

async function getResetPasswordToken(user) {
	const resetToken = crypto.randomBytes(20).toString("hex");
	// console.log(resetToken);

	// resetPasswordToken: resetToken
	user.resetPasswordToken = resetToken;
	user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

	return resetToken;
}

exports.forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;
		// console.log("email", email);

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "user not found",
			});
		}

		const resetPasswordToken = getResetPasswordToken(user);

		// console.log("token is", resetPasswordToken);

		console.log("token is", user.resetPasswordToken);
		await user.save();

		const resetUrl = `http://localhost:4000/api/v1/user/reset/password/${user.resetPasswordToken}`;

		const message = `Reset your password by clicking on the link below: \n\n ${resetUrl}`;
		try {
			mailSender(user.email, "Reset Password", message);

			return res.status(200).json({
				success: true,
				message: `Email sent to ${user.email}`,
			});
		} catch (error) {
			user.resetPasswordToken = undefined;
			user.resetPasswordExpire = undefined;
			user.save();

			return res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.resetPassword = async (req, res) => {
	try {
		const resetPasswordToken = req.params.token;
		// 		console.log('needToMatch', needToMatch);
		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpire: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "token is invalid or is expired",
			});
		}

		const newPassword = req.body.password;
		user.password = await bcrypt.hash(newPassword, 10);
		user.resetPasswordExpire = undefined;
		user.resetPasswordToken = undefined;

		await user.save();

		return res.status(200).json({
			success: true,
			message: "password updated",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
