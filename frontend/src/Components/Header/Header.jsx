import React, { useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { Home, Add, Search, AccountCircle,HomeOutlined,AddOutlined,SearchOutlined,AccountCircleOutlined } from "@mui/icons-material";

function Header() {
  // const [tab, setTab] = useState("/");
  const [tab, setTab] = useState(window.location.pathname);
  console.log(tab);

	return (
		<div className="header">
			<Link to="/" onClick={()=>setTab('/')}>
				{tab==='/' ? <Home style={{color:'black'}}/>:<HomeOutlined/>}
      </Link>
      
      <Link to="/newpost" onClick={() => setTab('/newpost')}>
        {tab==='/newpost' ? <Add style={{color:'black'}}/>:<AddOutlined/>}
      </Link>
      
			<Link to="/serch" onClick={()=>setTab('/search')}>
        {tab==='/search' ? <Search style={{color:'black'}}/>:<SearchOutlined/>}
      </Link>
      
      <Link to="/account" onClick={() => setTab('/account')}>
        {tab==='/account' ? <AccountCircle style={{color:'black'}}/>:<AccountCircleOutlined/>}
			</Link>
		</div>
	);
}

export default Header;
