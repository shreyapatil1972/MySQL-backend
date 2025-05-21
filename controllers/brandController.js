const {Brand} = require('../models/brandModel'); 

// Create a new brand
 const createBrand = async (req, res) => {
    console.log(req.body)
    console.log(req.user.isAdmin)
    const { name } = req.body;
    try {
        if(!req.user.isAdmin){
            res.status(401).send({message:'not Authorized'})
        }
        const newBrand = await Brand.create({name});
        res.status(200).send({ message: 'Brand created successfully', brand: newBrand, success: true });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Get all brands
 const getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.findAll();
        res.status(200).send({ brands:brands, success: true });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Get brand by ID
 const getBrandByID = async (req, res) => {
    const { id } = req.params;
    try {
        const brand = await Brand.findByPk(id);
        if (!brand) return res.status(404).send({ message: 'Brand not found', success: false });
        res.status(200).send({ brand, success: true });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Update brand
 const updateBrand = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        if(!req.user.isAdmin){
            res.status(401).send({message:'not Authorized'})
        }
        const brand = await Brand.findByPk(id);
        if (!brand) return res.status(404).send({ message: 'Brand not found', success: false });

        brand.name = name;
        await brand.save();

        res.status(200).send({ message: 'Brand updated successfully', brand, success: true });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Delete brand
 const deleteBrand = async (req, res) => {
    const { id } = req.params;
    try {
        if(!req.user.isAdmin){
            res.status(401).send({message:'not Authorized'})
        }
        const brand = await Brand.findByPk(id);
        if (!brand) return res.status(404).send({ message: 'Brand not found', success: false });

        await brand.destroy();
        res.status(200).send({ message: 'Brand deleted successfully', success: true });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    createBrand,
    getAllBrands,
    getBrandByID,
    updateBrand,
    deleteBrand
};