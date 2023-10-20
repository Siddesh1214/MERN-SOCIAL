import React from "react";
import { Typography } from "@mui/material";

import "./User.css";
import { Link } from "react-router-dom";

function User({ userId, name, avatar }) {
  return (
    <Link to={`/user/${userId}`} className="homeUser">
			<img src={avatar} alt={name} />
			<Typography>{name}</Typography>
		</Link>
		
	);
}

export default User;
