const { Product } = require('../models/productModel');

// Create product
const createproduct = async (req, res) => {
    try {
        if(!req.user.isAdmin){
            res.status(401).send({message:'not Authorized'})
        }
        const newProd = await Product.create(req.body);
        res.status(201).send({ message: "Product added successfully", product: newProd, success: true });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Get all products
const getAllproducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).send({ products, success: true });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Get product by ID
const getproductByID = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).send({ message: 'Product not found', success: false });
        }
        res.status(200).send({ product, success: true });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Update product
const updateproduct = async (req, res) => {
    try {
        if(!req.user.isAdmin){
            res.status(401).send({message:'not Authorized'})
        }
        const updated = await Product.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated[0] === 0) {
            return res.status(404).send({ message: 'Product not found or no changes made', success: false });
        }
        res.status(200).send({ message: 'Product updated successfully', success: true });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Delete product
const deleteproduct = async (req, res) => {
    try {
        if(!req.user.isAdmin){
            res.status(401).send({message:'not Authorized'})
        }
        const deleted = await Product.destroy({ where: { id: req.params.id } });
        if (!deleted) {
            return res.status(404).send({ message: 'Product not found', success: false });
        }
        res.status(200).send({ message: 'Product deleted successfully', success: true });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getproductByCategory =  (req,res) => {
    try {
        req.status(200).send({message:'Product found by Category'})
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const getproductByBrand = (req,res) => {
    try {
        req.status(200).send({message:'Product found by Brand'})
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = {
    createproduct,
    getAllproducts,
    getproductByID,
    updateproduct,
    deleteproduct,
    getproductByCategory,
    getproductByBrand

};
