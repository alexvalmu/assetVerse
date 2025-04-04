import axios from 'axios';

const API_URL = '/api/assets/';

const createAsset =async(assetData, token) => {
    const config={
        headers:{
            Authorization: `Bearer ${token}`
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



const assetService={
    createAsset,
    getAssets,
    deleteAsset
}


export default assetService;