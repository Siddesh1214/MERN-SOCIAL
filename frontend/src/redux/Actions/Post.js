import axios from "axios";
import { server } from "../../index";

export const likePost = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "likeRequest",
		});

		const { data } = await axios.get(`${server}/post/likeunlike/${id}`, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		});

		dispatch({
			type: "likeSuccess",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "likeFailure",
			payload: error.response.data.message,
		});
	}
};

export const addCommentOnPost = (id, comment) => async (dispatch) => {
	try {
		dispatch({
			type: "addCommentRequest",
		});
		const { data } = await axios.post(
			`${server}/post/addComment/${id}`,
			{
				comment,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			}
		);
		dispatch({
			type: "addCommentSuccess",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "addCommentFailure",
			payload: error.response.data.message,
		});
	}
};
export const deleteCommentOnPost = (id, commentId) => async (dispatch) => {
	try {
		dispatch({
			type: "deleteCommentRequest",
		});
		const { data } = await axios.delete(
			`${server}/post/deleteComment/${commentId}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			}
		);
		dispatch({
			type: "deleteCommentSuccess",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "deleteCommentFailure",
			payload: error.response.data.message,
		});
	}
};

export const createNewPost = (formData) => async (dispatch) => {
	try {
		dispatch({
			type: "newPostRequest",
		});
		const { data } = await axios.post(
			// `http://localhost:4000/api/v1/post/createPost`,
			`${server}/post/upload`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
				withCredentials: true,
			}
		);
		dispatch({
			type: "newPostSuccess",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "newPostFailure",
			payload: error.response,
		});
	}
};
export const updatePost = (caption, id) => async (dispatch) => {
	try {
		dispatch({
			type: "updateCaptionRequest",
		});
		const { data } = await axios.put(
			`${server}/post/updateCaption/${id}`,
			{ caption },
			{
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			}
		);
		dispatch({
			type: "updateCaptionSuccess",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "updateCaptionFailure",
			payload: error.response,
		});
	}
};
export const deletePost = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "deletePostRequest",
		});
		const { data } = await axios.delete(
			`${server}/post/deletePost/${id}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			}
		);
		dispatch({
			type: "deletePostSuccess",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "deletePostFailure",
			payload: error.response,
		});
	}
};
