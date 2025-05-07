import axios from 'axios';


const API_URL = '/api/tags/';

const getTags =async() => {
    const response= await axios.get(API_URL);
    return response.data;
}

const tagService={
    getTags
}


export default tagService;