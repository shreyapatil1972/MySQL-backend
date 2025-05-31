const { Category } = require('../models/categoryModel');

// Create a new category
const createCategory = async (req, res) => {
    const { name } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        if (!req.user.isAdmin) {
            return res.status(401).send({ message: 'Not authorized', success: false });
        }

        const existingCategory = await Category.findOne({ where: { name } });

        if (existingCategory) {
            return res.status(409).send({ message: "Category already exists", success: false });
        }

        const newCategory = await Category.create({ name, image });

        return res.status(201).send({ message: 'Category created successfully', success: true, category: newCategory });
    } catch (error) {
        console.error("Error creating category:", error);
        return res.status(500).send({ error: error.message, success: false });
    }
};

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();

        const modifiedCategories = categories.map(category => ({
            id: category.id,
            name: category.name,
            image: category.image ? `http://localhost:7000/uploads/${category.image}` : null
        }));

        return res.status(200).send({ success: true, categories: modifiedCategories });
    } catch (error) {
        return res.status(500).send({ error: error.message, success: false });
    }
};

// Get category by ID
const getCategoryByID = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).send({ success: false, message: 'Category not found' });
        }

        const modifiedCategory = {
            id: category.id,
            name: category.name,
            image: category.image ? `http://localhost:7000/uploads/${category.image}` : null
        };

        return res.status(200).send({ success: true, category: modifiedCategory });
    } catch (error) {
        return res.status(500).send({ error: error.message, success: false });
    }
};

// Update category
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const image = req.file ? req.file.filename : null;
    try {
        if (!req.user.isAdmin) {
            return res.status(401).send({ message: 'Not authorized', success: false });
        }
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).send({ success: false, message: 'Category not found' });
        }

        category.name = name || category.name;
        if (image) category.image = image;

        await category.save();

        return res.status(200).send({ success: true, message: 'Category updated successfully', category });
    } catch (error) {
        return res.status(500).send({ error: error.message, success: false });
    }
};

// Delete category
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        if (!req.user.isAdmin) {
            return res.status(401).send({ message: 'Not authorized', success: false });
        }

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).send({ success: false, message: 'Category not found' });
        }

        await category.destroy();

        return res.status(200).send({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        return res.status(500).send({ error: error.message, success: false });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryByID,
    updateCategory,
    deleteCategory
};
