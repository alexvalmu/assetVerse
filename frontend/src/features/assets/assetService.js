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

const assetService={
    createAsset,
}


export default assetService;