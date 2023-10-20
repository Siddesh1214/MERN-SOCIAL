import { createReducer } from "@reduxjs/toolkit";
const initalState = {
	// isAuthenticated : false,
};

export const userReducer = createReducer(initalState, {
	LoginRequest: (state) => {
		state.loading = true;
	},
	LoginSuccess: (state, action) => {
		state.loading = false;
		state.user = action.payload;
		state.isAuthenticated = true;
	},
	LoginFailure: (state, action) => {
		state.loading = false;
		state.user = action.payload;
		state.isAuthenticated = false;
	},
	
	RegisterRequest: (state) => {
		state.loading = false;
	},
	RegisterSuccess: (state, action) => {
		state.loading = false;
		state.user = action.payload;
		state.isAuthenticated = true;
	},
	RegisterFailure: (state, action) => {
		state.loading = false;
		state.user = action.payload;
		state.isAuthenticated = false;
	},
	
	LoadUserRequest: (state) => {
		state.loading = true;
	},
	LoadUserSuccess: (state, action) => {
		state.loading = false;
		state.user = action.payload;
		state.isAuthenticated = true;
	},
	LoadUserFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
		state.isAuthenticated = false;
	},


	LogoutUserRequest: (state) => {
		state.loading = true;
	},
	LogoutUserSuccess: (state) => {
		state.loading = false;
		state.user = null;
		state.isAuthenticated = false;
	},
	LogoutUserFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
		state.isAuthenticated = true;
	},
	clearErrors: (state) => {
		state.error = null;
	}
});


export const postOfFollowingReducer = createReducer(initalState, {
	postOfFollowingRequest: (state) => { 
		state.loading = true;
		
	},
	postOfFollowingSuccess: (state, action) => {
		state.loading = false;
		state.posts = action.payload;
		
	},
	postOfFollowingFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;

	 },
	clearErrors: (state) => {
		state.error = null;
	}

})

export const allUsersReducer = createReducer(initalState, {
	allUsersRequest: (state) => { 
		state.loading = true;
		
	},
	allUsersSuccess: (state, action) => {
		state.loading = false;
		state.users = action.payload;
		
	},
	allUsersFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;

	 },
	clearErrors: (state) => {
		state.error = null;
	}

})