import React, { useEffect, useState } from "react";
import "./Post.css";
import { Avatar, Button, Typography, Dialog } from "@mui/material";
import {
	MoreVert,
	Favorite,
	ChatBubbleOutline,
	DeleteOutline,
	FavoriteBorder,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	addCommentOnPost,
	deletePost,
	likePost,
	updatePost,
} from "../../redux/Actions/Post";
import { getFollowingPost, getMyPosts, loadUser } from "../../redux/Actions/User";
import User from "../User/User";
import CommentCard from "../CommentCard/CommentCard";

function Post({
	postId,
	caption,
	postImage,
	likes = [],
	comments = [],
	ownerImage,
	ownerName,
	ownerId,
	isDelete = false,
	isAccount = false,
}) {
	const [liked, setLiked] = useState(false);
	const [likesUser, setLikesUser] = useState(false);
	const [commentValue, setCommentValue] = useState("");
	const [commentToggle, setCommentToggle] = useState(false);
	const [captionValue, setCaptionValue] = useState(caption);
	const [captionToggle, setCaptionToggle] = useState(false);

	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.user);
	async function handleLike() {
		setLiked(!liked);
		await dispatch(likePost(postId));

		if (isAccount) {
			dispatch(getMyPosts());
		} else {
			dispatch(getFollowingPost());
		}
		// toast.success(data.message);
		// console.log("-----",user.data._id);
	}
	// console.log("mai hu", likes);
	// console.log("mai hu ghfj", likes.length);
	// console.log("vo hai", user.data._id);
	console.log("comms are", comments);
	// console.log("names are are", comments.comment);

	// const {comms}=useSelector((state)=>state.comments)
	const addCommentHandler = async (e) => {
		e.preventDefault();
		// console.log("add comment");
		await dispatch(addCommentOnPost(postId, commentValue));

		if (isAccount) {
			// console.log("Bring my posts");
			dispatch(getMyPosts());
		} else {
			dispatch(getFollowingPost());
		}
	};

	console.log("==============", postImage);

	const updateCaptionHandler = (e) => {
		e.preventDefault();
		dispatch(updatePost(captionValue, postId));
		dispatch(getMyPosts());
	};

	const deletePostHandler = async () => {
		// dispatch(deletePost(postId));
		// console.log("first");
		await dispatch(deletePost(postId));
		// console.log("second");
		dispatch(getMyPosts());
		dispatch(loadUser());
		// console.log("Third");
	};

	useEffect(() => {
		likes.forEach((item) => {
			if (item._id === user.data._id) {
				setLiked(true);
			}
		});
	}, [likes, user.data]);

	return (
		<div className="post">
			<div className="postHeader">
				{isAccount ? (
					<Button onClick={() => setCaptionToggle(!captionToggle)}>
						<MoreVert />
					</Button>
				) : null}
			</div>
			<img src={postImage.url} alt="" />
			<div className="postDetails">
				<Avatar
					src={ownerImage}
					alt="User"
					sx={{ height: "3vmax", width: "3vmax" }}
				/>
				<Link to={`/user/${ownerId}`}>
					<Typography fontWeight={700}>{ownerName}</Typography>
				</Link>
			</div>
			<Typography
				fontWeight={100}
				color="rgba(0,0,0,0.582"
				style={{ alignSelf: "center" }}
			>
				{" "}
				{caption}
			</Typography>

			<button
				className="likeBtn"
				onClick={() => setLikesUser(!likesUser)}
				disabled={likes.length === 0 ? true : false}
			>
				<Typography>{likes.length} likes</Typography>{" "}
			</button>

			<div className="postFooter">
				<Button onClick={handleLike}>
					{liked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />}
				</Button>
				<Button onClick={() => setCommentToggle(!commentToggle)}>
					<ChatBubbleOutline />
				</Button>

				{isDelete ? (
					<Button onClick={deletePostHandler}>
						<DeleteOutline />
					</Button>
				) : null}
			</div>

			<Dialog open={likesUser} onClose={() => setLikesUser(!likesUser)}>
				<div className="DialogBox">
					<Typography variant="h4">Liked By</Typography>
					{likes.map((like) => (
						<User
							key={like._id}
							userId={like._id}
							name={like.name}
							avatar={like.avatar}
						></User>
					))}
				</div>
			</Dialog>

			<Dialog
				open={commentToggle}
				onClose={() => setCommentToggle(!commentToggle)}
			>
				<div className="DialogBox">
					<Typography variant="h4">Comments</Typography>

					<form className="commentForm" onSubmit={addCommentHandler}>
						<input
							type="text"
							value={commentValue}
							onChange={(e) => setCommentValue(e.target.value)}
							placeholder="Comment here"
							required
						/>
						<Button type="submit" variant="contained">
							Add
						</Button>
					</form>
					{comments.length > 0 ? (
						comments.map((item) => (
							<CommentCard
								key={item._id}
								userId={item.user}
								name={item.userName}
								comment={item.comment}
								commentId={item._id}
								avatar={item.uAvat}
								isAccount={isAccount}
								postId={item.post}
							></CommentCard>
							// <CommentCard></CommentCard>
						))
					) : (
						<Typography>No Comments Yet</Typography>
					)}
				</div>
			</Dialog>

			<Dialog
				open={captionToggle}
				onClose={() => setCaptionToggle(!captionToggle)}
			>
				<div className="DialogBox">
					<Typography variant="h4">Update Caption</Typography>
					<form className="commentForm" onSubmit={updateCaptionHandler}>
						<input
							type="text"
							value={captionValue}
							onChange={(e) => setCaptionValue(e.target.value)}
							placeholder="New Caption here"
							required
						/>
						<Button type="submit" variant="contained">
							Add
						</Button>
					</form>
				</div>
			</Dialog>
		</div>
	);
}

export default Post;
