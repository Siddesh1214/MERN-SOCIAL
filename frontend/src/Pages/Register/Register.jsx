import { Avatar, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import './Register.css';
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../redux/Actions/User";
import toast from "react-hot-toast";

export function Register() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [avatar, setAvatar] = useState("");
	const dispatch = useDispatch();
	const { loading, error } = useSelector((state) => state.user);

	const navigate = useNavigate();
	
  
	const handleImageChange = (e) => {
		// setAvatar(URL.createObjectURL(e.target.files[0]));
		const file = e.target.files[0];

		const Reader = new FileReader();
		Reader.readAsDataURL(file);

		Reader.onload = () => {
			if (Reader.readyState === 2) {
				setAvatar(Reader.result);
			}
		}
	}

  const submitHandler = (e) => {
    e.preventDefault();
		console.log(name, email, password, avatar);
		dispatch(registerUser(name, email, password, avatar));
	}
	
	useEffect(() => {
		if (error) {
			toast.error(error);
			dispatch({ type: 'clearErrors' });
		}
	}, [dispatch, error]);
	return (
		<div className="register">
			<form action="" className="registerForm" onSubmit={submitHandler}>
        <Typography variant="h3">Mern Social</Typography>
        <Avatar src={avatar} alt="User" sx={{height:"10vmax",width:"10vmax"}}/>
        <input type="file" accept="image/*"  onChange={handleImageChange}/>

        
        {/* <input type="file" accept="image/*" onChange={handleImageChange} /> */}

				<input
					type="name"
          placeholder="Name"
          className="registerInputs"
					required
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<input
					type="email"
          placeholder="Email"
          className="registerInputs"

					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="password"
          placeholder="Password"
          className="registerInputs"
					required
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

        <Link to="/login">
          <Typography>Already SignedUp</Typography>
        </Link>
				<Link to="/forgot/password">Forgot Password</Link>
				<Button disabled={loading }type="submit">SignUp</Button>
			</form>
		</div>
	);
}
