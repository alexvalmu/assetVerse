
const Tag = require('../model/tagModel');

exports.createTag = async (req, res) => {
    try {
        const { name } = req.body;
        const newTag = new Tag({ name });
        await newTag.save();
        res.status(201).json(newTag);
    } catch (error) {
        res.status(400).json({ message: 'Error creando el tag', error });
    }
};

exports.getTags = async (req, res) => {
    try {
        const tags = await Tag.find().sort({ createdAt: -1 });
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener tags', error });
    }
};
