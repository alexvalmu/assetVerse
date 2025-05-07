import axios from 'axios';


const API_URL = '/api/assets/';

const createAsset =async(assetData, token) => {
    const config={
        headers:{
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }

    const response= await axios.post(API_URL, assetData, config);
    return response.data;
}

const getAssets =async() => {
     const response= await axios.get(API_URL);
     return response.data;
}

const deleteAsset =async(assetId, token) => {
    const config={
        headers:{
            Authorization: `Bearer ${token}`
        }
    }

    const response= await axios.delete(API_URL+assetId, config);
    return response.data;
}

const getAsset = async(assetId) => {
    const response= await axios.get(API_URL+assetId);
    return response.data;
}

const getUserAssets = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL+'user/'+id, config); 
    return response.data;
};

const getAssetByTag = async (name, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL+'tags/'+name, config); 
    return response.data;
};

const getAssetByCategory = async (name, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(`${API_URL}categories/${encodeURIComponent(name)}`, config);
    return response.data;
};
const assetService={
    createAsset,
    getAssets,
    deleteAsset,
    getAsset,
    getUserAssets,
    getAssetByTag,
    getAssetByCategory
}


export default assetService;