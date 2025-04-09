const express = require("express");
const router = express.Router();
const {
    getCategories,
    createCategory,
    deleteCategory
} = require("../controllers/categoryController");


// Rutas públicas
router.get("/", getCategories);

router.post("/",createCategory);
router.delete("/:id",deleteCategory);

module.exports = router;