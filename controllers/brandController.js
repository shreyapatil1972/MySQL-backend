const {Brand} = require('../models/brandModel'); 

const createBrand = async (req, res) => {
    console.log("Request Body:", req.body);
    console.log("Is Admin:", req.user.isAdmin);

    const { name } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        if (!req.user.isAdmin) {
            return res.status(401).send({ message: 'Not Authorized', success: false });
        }
        const existingBrand = await Brand.findOne({ where: { name } });

        if (existingBrand) {
            return res.status(409).send({ message: "Brand already exists", success: false });
        }
        const newBrand = await Brand.create({ name, image });
        return res.status(201).send({ message: 'Brand created successfully', success: true });
    } catch (error) {
        console.error("Error in createBrand:", error);
        return res.status(500).send({ error: error.message, success: false });
    }
};


// Get all brands
 const getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.findAll();
        const modifiedBrands = brands.map((brand)=>({
            id:brand.id,
            name:brand.name,
            image:`http://localhost:7000/uploads/${brand.image}`
        }))
        res.status(200).send({ brands:modifiedBrands, success: true });
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
        res.status(500).send({message: "Internal server error", error: error.message });
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