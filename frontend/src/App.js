import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header/Header";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
// import Signup from "./Pages/Signup/Signup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./redux/Actions/User";
import { Toaster } from 'react-hot-toast';
import Account from "./Pages/Account/Account";
import NewPost from "./Pages/NewPost/NewPost";
import { Register } from "./Pages/Register/Register";
import UpdateProfile from "./Components/UpdateProfile/UpdateProfile";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  const { isAuthenticated } = useSelector((state) => state.user);

	return (
    <Router>

      {isAuthenticated &&<Header/> }
    
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Login />}/>
        <Route path='/account' element={isAuthenticated ? <Account /> : <Login />}/>
        <Route path='/newpost' element={isAuthenticated ? <NewPost /> : <Login />}/>
        {/* <Route path="/login" element={<Login/>}></Route> */}
        <Route path="/register" element={isAuthenticated ? <Account /> : <Register />}></Route>
        <Route path='/update/profile' element={isAuthenticated?<UpdateProfile/>:<Login/>}></Route>
        {/* <Route path='/update/password' element={isAuthenticated?</>:<Login/>}></Route> */}
        {/* <Route path="/newpost" element={<NewPost />}></Route>   */}
      </Routes>
      <Toaster></Toaster>
		</Router>
	);
}

export default App;
