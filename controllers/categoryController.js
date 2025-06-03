const { Category } = require('../models/categoryModel');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

const capitalizeName = (str) => {
  if (!str) return '';
  return str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();
};

// Create a new category
const createCategory = async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(401).send({ message: "Not Authorized" });
    }

    const rawName = req.body?.name;
    const name = capitalizeName(rawName);
    const image = req.file ? req.file.filename : null;
    const createdBy = req.user.id;

    if (!name) {
      return res.status(400).send({ message: "Category name is required" });
    }

    if (!image) {
      return res.status(400).send({ message: "Category image is required" });
    }

    // Validate image mimetype
    if (req.file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).send({ message: 'Invalid image format. Allowed: JPEG, PNG, WEBP.' });
      }
    }

    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(409).send({ message: "Category already exists" });
    }

    const newCategory = await Category.create({ name, image, createdBy });

    res.status(200).send({
      message: "Category created successfully",
      category: newCategory,
      success: true
    });
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).send({ error: error.message });
  }
};


// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({ order: [['name', 'ASC']] });

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
  try {
    if (!req.user?.isAdmin) {
      return res.status(401).send({ message: "Not Authorized" });
    }

    const { id } = req.params;
    let name = req.body.name;
    const updatedBy = req.user.id;

    if (!id) {
      return res.status(400).json({ message: 'Category ID is required in URL.' });
    }

    // Validate image mimetype if new file uploaded
    if (req.file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).send({ message: 'Invalid image format. Allowed: JPEG, PNG, WEBP.' });
      }
    }

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.', success: false });
    }

    // Check for duplicate category name (excluding current id)
    const existingCategory = await Category.findOne({
      where: { name, id: { [Op.ne]: id } }
    });
    if (existingCategory) {
      return res.status(409).json({ message: "Another category with this name already exists." });
    }

    // Capitalize name before update
    name = capitalizeName(name);

    // If new image uploaded, delete old image file
    if (req.file && category.image) {
      const oldImagePath = path.join(__dirname, '../uploads', category.image);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error('Failed to delete old image:', err);
      });
    }

    // Use new image filename if uploaded, otherwise keep old
    const image = req.file ? req.file.filename : category.image;

    await Category.update({ name, image, updatedBy }, { where: { id } });

    const updatedCategory = await Category.findByPk(id);

    res.status(200).json({
      message: 'Category updated successfully.',
      data: updatedCategory,
      success: true
    });
  } catch (error) {
    console.error("Update Category Error:", error);
    res.status(500).json({ error: error.message });
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
         if (category.image) {
      const imagePath = path.join(__dirname, '../uploads', category.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Failed to delete image:', err);
      });
    }

        await category.destroy({ where: { id } });

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
