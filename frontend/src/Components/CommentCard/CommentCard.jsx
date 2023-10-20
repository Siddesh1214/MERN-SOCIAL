import React from "react";
import "./CommentCard.css";
import { Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { server } from "../../index";
import { useDispatch, useSelector } from "react-redux";
import { deleteCommentOnPost } from "../../redux/Actions/Post";
import { getFollowingPost } from "../../redux/Actions/User";

function CommentCard({
	userId,
	name,
	avatar,
	comment,
	commentId,
	postId,
	isAccount,
}) {
	const { user } = useSelector((state) => state.user);
	// console.log("hfjdsk",user.data._id);
	const dispatch = useDispatch();
	function deleteCommentHandler() {
		console.log("delete this");
		dispatch(deleteCommentOnPost(postId, commentId));
		console.log("deleted");
		if (isAccount) {
			console.log("Bring my posts");
		} else {
			dispatch(getFollowingPost());
		}
	}
	return (
		<div className="commentUser">
			<Link to={`${server}/user/getUserProfile/${userId}`}>
				<img src={avatar} alt={name} />
				<Typography style={{ minWidth: "6vmax" }}>{name}</Typography>
			</Link>
			<Typography>{comment}</Typography>
			{isAccount ? (
				<Button onClick={deleteCommentHandler}>
					<Delete />
				</Button>
			) : userId === user.data._id ? (
				<Button onClick={deleteCommentHandler}>
					<Delete />
				</Button>
			) : null}
		</div>
	);
}

export default CommentCard;
