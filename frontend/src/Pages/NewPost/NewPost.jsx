import React, { useEffect, useState } from "react";
import "./NewPost.css";
import { Button, Typography } from "@mui/material";
import { createNewPost } from "../../redux/Actions/Post";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { loadUser } from "../../redux/Actions/User";
import {useNavigate } from "react-router-dom";
import Account from "../Account/Account";


// Typography
function NewPost() {
  const [image, setImage] = useState({
    imageFile: undefined,
    imageUrl: undefined,
  });
  const [caption, setCaption] = useState("");
  const { loading, error, message } = useSelector((state) => state.like);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  const handleImageChange = (e) => {
    const selectedImg = e.target.files[0];
    const Reader = new FileReader();
    Reader.readAsDataURL(selectedImg);
    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setImage({ imageUrl: Reader.result, imageFile: selectedImg });
      }
    };
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    const formdata = new FormData();
    e.preventDefault();
    formdata.append("caption", caption);
    formdata.append("image", image.imageFile);
    await dispatch(createNewPost(formdata));
    // Navigate
    dispatch(loadUser());
    navigate('/account');
  };

  useEffect(() => {
    if (error) {
      
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [dispatch, error, message]);
  return (
    <div className="newPost">
      <form className="newPostForm" onSubmit={handleSubmit}>
        <Typography variant="h3">New Post</Typography>
        {image.imageUrl && <img src={image.imageUrl} alt="post" />}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input
          type="text"
          placeholder="Caption...."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <Button disabled={loading} type="submit">
          Post
        </Button>
      </form>
    </div>
  );
}

export default NewPost;