import React, { useState } from "react";
import "./Login.css";
import { Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loginUser } from "../../redux/Actions/User";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const dispatch = useDispatch();

	const navigate = useNavigate();
	function loginHandler(e) {
    e.preventDefault();
    
		console.log(email, password);
		dispatch(loginUser(email, password));
		navigate('/home');
		
	}
	return (
		<div className="login">
			<form action="" className="loginForm" onSubmit={loginHandler}>
				<Typography variant="h3">Mern Social</Typography>
				<input
					type="email"
					placeholder="Email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Password"
					required
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				<Link to="/forgot/password">Forgot Password</Link>
				<Button type="submit">Login</Button>
				<Link to="/register">New User</Link>
			</form>
		</div>
	);
}

export default Login;
