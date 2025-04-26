import axios from 'axios';

const API_URL = '/api/comments/';

const getComments =async() => {
    const response= await axios.get(API_URL);
    return response.data;
}
const getAssetComments =async(assetId) => {
    const response= await axios.get(API_URL+'asset/'+assetId);
    return response.data;
}
const createComment =async(commentData, token) => {
    const config={
        headers:{
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }
    const response= await axios.post(API_URL, commentData, config);
    return response.data;
}
const deleteComment =async(commentId, token) => {
    const config={
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response= await axios.delete(API_URL+commentId, config);
    return response.data;
}
const commentService={
   getComments,
    getAssetComments,
    createComment,
}


export default commentService;