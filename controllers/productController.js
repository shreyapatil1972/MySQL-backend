const { Product } = require('../models/productModel');

// Create product
const createproduct = async (req, res) => {
    const { name, description, price, category_id, brand_id, quantity } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        if (!req.user.isAdmin) {
            return res.status(401).send({ message: 'Not Authorized', success: false });
        }

        const newProd = await Product.create({ name, description, price, category_id, brand_id, quantity, image });

        return res.status(201).send({ message: "Product added successfully", product: newProd, success: true });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// Get all products
const getAllproducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        const modifiedProducts = products.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category_id: product.category_id,   
            brand_id: product.brand_id,
            quantity: product.quantity,
            image: product.image ? `http://localhost:3000/uploads/${product.image}` : null,
        }));
        res.status(200).send({ products:modifiedProducts, success: true });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Get product by ID
const getproductByID = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).send({ message: 'Product not found', success: false });
        }

        const modifiedProduct = {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category_id: product.category_id,
            brand_id: product.brand_id,
            quantity: product.quantity,
            inStock: product.inStock,
            image: product.image ? `http://localhost:7000/uploads/${product.image}` : null
        };

        return res.status(200).send({ product: modifiedProduct, success: true });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

// Update product
const updateproduct = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(401).send({ message: 'Not Authorized', success: false });
        }

        const [updated] = await Product.update(req.body, {
            where: { id: req.params.id }
        });

        if (updated === 0) {
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

const getproductByCategory = async (req, res) => {
    try {
        const { category_id } = req.params;
        const products = await Product.findAll({ where: { category_id } });
        res.status(200).send({ success: true, products });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getproductByBrand = async (req, res) => {
    try {
        const { brand_id } = req.params;
        const products = await Product.findAll({ where: { brand_id } });
        res.status(200).send({ success: true, products });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getProductsByQuery = async(req,res)=>{
        try{
        res.status(200).send({message:"Product By Query", success:true})

    } catch (error) {
        console.log("Error deleting product:", error);
    }
}

module.exports = {
    createproduct,
    getAllproducts,
    getproductByID,
    updateproduct,
    deleteproduct,
    getproductByCategory,
    getproductByBrand,
    getProductsByQuery

};
