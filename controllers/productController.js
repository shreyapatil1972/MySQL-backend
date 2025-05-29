const { Product } = require('../models/productModel');

// Create product
const createproduct = async (req, res) => {
     const {name,description,price,category_id,brand_id,Quantity} = req.body
    try {
        if(!req.user.isAdmin){
            res.status(401).send({message:'not Authorized'})
        }
        const newProd = await Product.create({name,description,price,category_id,brand_id,Quantity});
        res.status(201).send({ message: "Product added successfully", product: newProd, success: true });
    } catch (error) {
        res.status(500).send({ error: error.message });
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
        const id = req.params.ID
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).send({ message: 'Product not found', success: false });
        }
        modifiedProduct = {
        id:product.id,
        name:product.name,
        description:product.description,
        price:product.price,
        category_id:product.category_id,
        brand_id:product.brand_id,
        Quantity:product.Quantity,
        InStock:product.InStock,
        image:`http://localhost:3000/uploads/${product.image}`
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
            where: { id:req.params.id }
        });
        if (updated[0] === 0) {
            return res.status(404).send({ message: 'Product not found or no changes made', success: false });
        }
        await product.update(req.body)
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
