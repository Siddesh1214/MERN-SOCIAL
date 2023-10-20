// import { confgureStore } from '@reduxjs/toolkit'
import { configureStore}  from "@reduxjs/toolkit";
import { allUsersReducer, postOfFollowingReducer, userReducer } from './Reducers/User'
import { likeReducer, myPostsReducer } from "./Reducers/Post";

// const store = confgureStore(initialState, {
//   reducer:{}
// })

// export default store;

export default configureStore({
  reducer: {
    user: userReducer,
    postOfFollowing: postOfFollowingReducer,
    allusers: allUsersReducer,
    like: likeReducer,
    myPosts:myPostsReducer
  }
})