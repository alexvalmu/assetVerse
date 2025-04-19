const asyncHandler = require("express-async-handler");
const Asset = require("../model/AssetModel");
const User = require("../model/userModel");
const path = require("path");
const Comment = require("../model/commentModel");
const { findById } = require("../model/AssetModel");
const { putAsset } = require("./assetController");

const getComment = asyncHandler(async (req, res) => {
    const comment = await Comment.find().populate("user", "username").populate("asset", "title");
    res.status(200).json(comment);
});


const getAssetComments = asyncHandler(async (req, res) => {
    const comment = await Comment.find({asset:req.params.id});
    if (!comment) {
        res.status(404);
        throw new Error('Comentario no encontrado');
    }
    res.status(200).json(comment);
});

const postComment = asyncHandler(async (req, res) => {
    const { stars, text } = req.body;

    if (!stars) {
        return res.status(400).json({ message: "El campo de estrellas del comentario es requerido" });
    }

    const asset = await Asset.findById(req.body.asset);
    if (!asset) {
        res.status(404);
        throw new Error('Asset no encontrado');
    }

    const comment = await Comment.create({
        asset: req.body.asset,
        user: req.body.user,
        username: req.body.username,
        stars,
        text
    });

    const comentarios = await Comment.find({ asset: req.body.asset });
    const starsSum = comentarios.reduce((sum, c) => sum + c.stars, 0);
    const starsAvg = comentarios.length > 0 ? starsSum / comentarios.length : 0;

    // Actualizar y guardar el asset
    asset.ratingAverage = starsAvg;
    await asset.save();


    res.status(200).json(comment);
});

module.exports = {
    getComment,
    getAssetComments,
    postComment
};