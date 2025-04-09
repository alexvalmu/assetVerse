const asyncHandler = require("express-async-handler");
const Category = require("../model/categoryModel");


const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
});

const createCategory = asyncHandler(async (req, res) => {
    if (!req.body.name) {
        res.status(400);
        throw new Error("El nombre de la categoría es requerido");
    }

    const category = await Category.create({
        name: req.body.name
    });

    res.status(201).json(category);
});


const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
        res.status(404);
        throw new Error("Categoría no encontrada");
    }

    await category.deleteOne();
    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getCategories,
    createCategory,
    deleteCategory
};