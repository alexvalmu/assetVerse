// Se encarga de manejar las peticiones de los endpoints de la API


const { get } = require("http");

const getAsset = (req, res) =>{
    res.status(200).json({message: 'get all assets'});
}

const postAsset = (req, res) =>{
    if(!req.body.text){
        res.status(400).json({message: 'El campo de texto del asset es requerido'});
    }
    res.status(200).json({message: 'create an asset'});
}

const putAsset = (req, res) =>{
    res.status(200).json({message: `Update asset with id: ${req.params.id}`});
}

const deleteAsset = (req, res) =>{
    res.status(200).json({message: `Deleted asset with id: ${req.params.id}`});
}


module.exports = {
    getAsset,
    postAsset,
    putAsset,
    deleteAsset


}