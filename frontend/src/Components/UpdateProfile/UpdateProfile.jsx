import { Avatar, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import './UpdateProfile.css';
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../redux/Actions/User";
import toast from "react-hot-toast";

export function UpdateProfile() {
	const { loading, error,user } = useSelector((state) => state.user);
	// console.log("---",user);
	// console.log("---",user.data.avatar.url);
	// console.log("---",user.data.name);
	const [email, setEmail] = useState(user.data.email);
	const [name, setName] = useState(user.data.name);
	const [avatar, setAvatar] = useState("");
	const [avatarPrev, setAvatarPrev] = useState(user.data.avatar.url);
	const dispatch = useDispatch();

	const navigate = useNavigate();
	
  
	const handleImageChange = (e) => {
		// setAvatar(URL.createObjectURL(e.target.files[0]));
		const file = e.target.files[0];

		const Reader = new FileReader();
		Reader.readAsDataURL(file);

		Reader.onload = () => {
			if (Reader.readyState === 2) {
				setAvatarPrev(Reader.result);
				setAvatar(Reader.result);
			}
		}
	}

  const submitHandler = (e) => {
    e.preventDefault();
		console.log(name, email, avatar);
		dispatch(registerUser(name, email, avatar));
	}
	
	useEffect(() => {
		if (error) {
			toast.error(error);
			dispatch({ type: 'clearErrors' });
		}
	}, [dispatch, error]);
	return (
		<div className="register">
			<form action="" className="updateProfileForm" onSubmit={submitHandler}>
        <Typography variant="h3">Mern Social</Typography>
        <Avatar src={avatarPrev} alt="User" sx={{height:"10vmax",width:"10vmax"}}/>
        <input type="file" accept="image/*"  onChange={handleImageChange}/>

        
        {/* <input type="file" accept="image/*" onChange={handleImageChange} /> */}

				<input
					type="name"
          placeholder="Name"
          className="updateProfileInputs"
					required
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<input
					type="email"
          placeholder="Email"
          className="updateProfileInputs"

					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				

        
				<Link to="/forgot/password">Forgot Password</Link>
				<Button disabled={loading }type="submit">Update</Button>
			</form>
		</div>
	);
}

export default UpdateProfile