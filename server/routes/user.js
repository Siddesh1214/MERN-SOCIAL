const express = require("express");
const {
	signUp,
	login,
	profile,
	followUser,
	unfollowUser,
	logout,
	updatePassword,
	updateProfile,
	deleteMyProfile,
	getUserProfile,
	getAllUsers,
	forgotPassword,
	resetPassword,
} = require("../controllers/User");
const { isAuthenticated } = require("../middlewares/auth");
const { myPosts } = require("../controllers/GetPost");
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/profile", isAuthenticated, profile);
router.post("/followUser/:id", isAuthenticated, followUser);
router.post("/unfollowUser/:id", isAuthenticated, unfollowUser);
router.get("/logout", isAuthenticated, logout);
router.post("/updatePassword", isAuthenticated, updatePassword);
router.post("/updateProfile", isAuthenticated, updateProfile);
router.delete("/deleteProfile", isAuthenticated, deleteMyProfile);
router.get("/getUserProfile/:id", isAuthenticated, getUserProfile);
router.get("/getAllUsers/", isAuthenticated, getAllUsers);

router.post("/forgotPassword", forgotPassword);
router.put("/reset/password/:token", resetPassword);
router.get("/myPosts", isAuthenticated, myPosts);

module.exports = router;
