import axios from "axios";
import { server } from "../../index";

export const loginUser = (email, password) => async (dispatch) => {
	try {
		dispatch({
			type: "LoginRequest",
		});
		const { data } = await axios.post(
			`${server}/user/login`,
			{ email, password },
			{
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			}
		);

		dispatch({
			type: "LoginSuccess",
			payload: data.user,
		});
	} catch (error) {
		dispatch({
			type: "LoginFailure",
			payload: error,
		});
		// console.log(error);
	}
};

export const loadUser = () => async (dispatch) => {
	try {
		dispatch({
			type: "LoadUserRequest",
		});

		const { data } = await axios.get(`${server}/user/profile`, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		});

		dispatch({
			type: "LoadUserSuccess",
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: "LoadUserFailure",
			// payload:error.response.data.messsage,
			payload: error.message,
		});
	}
};

export const getFollowingPost = () => async (dispatch) => {
	try {
		dispatch({
			type: "postOfFollowingRequest",
		});
		const { data } = await axios.get(`${server}/post/getPostOfFollowing`, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		});
		dispatch({
			type: "postOfFollowingSuccess",
			payload: data.posts,
		});
	} catch (error) {
		dispatch({
			type: "postOfFollowingFailure",
			payload: error.response.data.messsage,
			// payload:error.messaage,
		});
	}
};
export const getAllUsers = () => async (dispatch) => {
	try {
		dispatch({
			type: "allUsersRequest",
		});
		const { data } = await axios.get(`${server}/user/getAllUsers`, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		});
		dispatch({
			type: "allUsersSuccess",
			payload: data.users,
		});
	} catch (error) {
		dispatch({
			type: "allUsersFailure",
			payload: error.response.data.messsage,
			// payload:error.messaage,
		});
	}
};

export const getMyPosts = () => async (dispatch) => {
	try {
		dispatch({
			type: "myPostsRequest",
		});
		const { data } = await axios.get(`${server}/user/myPosts`, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		});
		dispatch({
			type: "myPostsSuccess",
			payload: data.posts,
		});
	} catch (error) {
		dispatch({
			type: "myPostsFailure",
			payload: error.response.data.messsage,
			// payload:error.messaage,
		});
	}
};

export const logoutUser = () => async (dispatch) => {
	try {
		dispatch({
			type: "LogoutUserRequest",
		});
		await axios.get(`${server}/user/logout`, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		});

		dispatch({
			type: "LogoutUserSuccess",
		});
	} catch (error) {
		dispatch({
			type: "LogoutUserFailure",
			payload: error,
		});
		// console.log(error);
	}
};

export const registerUser =
	(name, email, password, avatar) => async (dispatch) => {
		try {
			dispatch({
				type: "RegisterRequest",
			});
			const { data } = await axios.post(
				`${server}/user/signup`,
				{ email, password, name, avatar },
				{
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				}
			);

			dispatch({
				type: "RegisterSuccess",
				payload: data.user,
			});
		} catch (error) {
			dispatch({
				type: "RegisterFailure",
				payload: error,
			});
			// console.log(error);
		}
	};

export const UpdateProfile = (name, email, avatar) => {
	try {
		dispatch({
			type: "updateProfileRequest"
		});
		dispatch({
			type: "updateProfileSuccess"
		});
		
		
	} catch (error) {
		dispatch({
			type: "updateProfileFailure"
		});
		
	}
};
