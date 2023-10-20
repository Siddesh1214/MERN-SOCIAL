import React, { useEffect, useState } from "react";
import "./Account.css";
import { useDispatch, useSelector } from "react-redux";
import { getMyPosts, logoutUser } from "../../redux/Actions/User";
import Post from "../../Components/Post/Post";
import toast from "react-hot-toast";
import Loader from "../../Components/Loader/Loader";
import { Avatar, Button, Dialog, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import server from '../../App'
import User from "../../Components/User/User";




function Account() {
	const dispatch = useDispatch();
  const { user, loading: userLoading } = useSelector((state) => state.user);
	const { loading, error, posts } = useSelector((state) => state.myPosts);
	const { error: likeError, message } = useSelector((state) => state.like);
  
  const [followersToggle, setFollowersToggle] = useState(false);
  const [followingToggle, setFollowingToggle] = useState(false);
  const logoutHandler = async () => {
		dispatch(logoutUser());
		// ToastBar.success(message);
		
		toast.success("Logged out successfully");
		// Toast
  }

	// useEffect(() => {
		

	// }, [dispatch]);
	// console.log("---",user.data.following);
	// console.log("+++++",user.data.followers);
	// console.log("=====",user.data.name);
	console.log("====-+-___+++", user.data.avatar);
	const userimg = user.data.avatar.url;

	useEffect(() => {
		dispatch(getMyPosts());
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
	return loading === true || userLoading === true ? (
		<Loader></Loader>
	) : (
		<div className="account">
			<div className="accountleft">
				{posts && posts.length > 0 ? (
					posts.map((post) => (
						<Post
							key={post._id}
							ownerName={post.owner.name}
							postId={post._id}
							caption={post.caption}
							postImage={post.image.url}
							likes={post.likes}
							comments={post.comments}
							ownerImage={post.owner.avatar}
							ownerId={post.owner._id}
							isAccount={true}
							isDelete={true}
						></Post>
					))
				) : (
					<Typography variant="h6"> You have not made any post</Typography>
				)}
			</div>
			<div className="accountright">
				<Avatar
					src={userimg}
					// src={user.avatar.url}
					sx={{ height: "8vmax", width: "8vmax" }}
				></Avatar>
				<Typography variant="h5">{user.data.name}</Typography>
				<div>
					<button onClick={()=>setFollowersToggle(!followersToggle)}>
						<Typography>Followers</Typography>
					</button>
					<Typography>{user.data.followers.length}</Typography>
				</div>
				<div>
					<button onClick={()=>setFollowingToggle(!followingToggle)}>
						<Typography>Following</Typography>
					</button>
					<Typography>{user.data.following.length}</Typography>
				</div>
				<div>
					<Typography>Posts</Typography>
					<Typography>{user.data.posts.length}</Typography>
				</div>

          <Button variant="contained" onClick={logoutHandler}>Logout</Button>
          <Link to={`update/profile`}>Edit Profile</Link>
          <Link to={`update/password`}>Change Password</Link>
          <Button variant='text' style={{ color: 'red', 'margin': '2vmax' }}>Delete My Profile</Button>
          
          <Dialog open={followersToggle} onClose={() => setFollowersToggle(!followersToggle)}>
            <div className="DialogBox">
              <Typography variant="h4">Followers</Typography>
              {
                user && user.data.followers.length > 0 ? user.data.followers.map((follower) => (
                  <User
                  key={follower._id}
                  userId={follower._id}
                  name={follower.name}
                  avatar={follower.avatar}
                />
                )):<Typography style={{margin:'2vmax'}}>You have no followers</Typography>
              }
            </div>
          </Dialog>
          <Dialog open={followingToggle} onClose={() => setFollowingToggle(!followingToggle)}>
            <div className="DialogBox">
              <Typography variant="h4">Following</Typography>
              {
                user && user.data.following.length > 0 ? user.data.following.map((follow) => (
                  <User
                  key={follow._id}
                  userId={follow._id}
                  name={follow.name}
                  avatar={follow.avatar}
                />
                )) : <Typography style={{margin:'2vmax'}}>You do not follow anyone</Typography>
              }
            </div>
          </Dialog>
			</div>
		</div>
	);
}

export default Account;
