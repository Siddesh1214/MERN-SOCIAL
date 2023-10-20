import React, { useEffect } from "react";
import "./Home.css";
import User from "../../Components/User/User";

import Post from "../../Components/Post/Post";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, getFollowingPost } from "../../redux/Actions/User";
import Loader from "../../Components/Loader/Loader";
import { Typography } from "@mui/material";
import toast from "react-hot-toast";

function Home() {
	const dispatch = useDispatch();
	const { loading, posts, error } = useSelector(
		(state) => state.postOfFollowing
	);
	const { users, loading: usersLoading } = useSelector(
		(state) => state.allusers
	);
	// console.log("arr", users);
	useEffect(() => {
		dispatch(getFollowingPost());
		dispatch(getAllUsers());
	}, [dispatch]);

	const { error: likeError, message } = useSelector((state) => state.like);

	useEffect(() => {
		if (message) {
			toast.success(message);
			dispatch({ type: "clearMessage" });
		}
		if (error) {
			toast.error(error);
			dispatch({ type: "clearErrors" });
		}
		if (likeError) {
			toast.error(likeError);
			dispatch({ type: "clearErrors" });
		}
	}, [error, message, likeError, dispatch]);
	return loading === true || usersLoading === true ? (
		<Loader />
	) : (
		<div className="home">
			<div className="homeleft">
				{posts && posts.length > 0 ? (
					posts.map((post) => (
						<Post
							key={post._id}
							// postImage={"https://static.toiimg.com/thumb/msid-53891743,width-748,height-499,resizemode=4,imgsize-152022/Tour-Eiffel.jpg"}
							ownerName={post.owner.name}
							// caption="blah blah blah..."
							postId={post._id}
							caption={post.caption}
							postImage={post.image}
							likes={post.likes}
							comments={post.comments}
							ownerImage={post.owner.avatar}
							ownerId={post.owner._id}
						></Post>
					))
				) : (
					<Typography variant="h6"> No Posts exists</Typography>
				)}
			</div>
			<div className="homeright">
				<h1>aLL uSERS</h1>
				{users && users.length > 0 ? (
					users.map((user) => (
						<User
							key={user._id}
							userId={user._id}
							name={user.name}
							avatar={user.avatar}
						></User>
					))
				) : (
					<Typography variant="h6"> No Users exist</Typography>
				)}
			</div>
		</div>
	);
}

export default Home;
