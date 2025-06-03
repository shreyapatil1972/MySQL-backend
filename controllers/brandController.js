const {Brand} = require('../models/brandModel'); 
const fs = require('fs');
const path = require('path')
const { Op } = require('sequelize')

const capitalizeName = (str) => {
  if (!str) return '';
  return str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();
};


const createBrand = async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(401).send({ message: "Not Authorized" });
    }

    const rawName = req.body?.name;
    const name = capitalizeName(rawName);
    const image = req.file ? req.file.filename : null;
    const createdBy = req.user.id;

    if (!name) {
      return res.status(400).send({ message: "Brand name is required" });
    }

    if (!image) {
      return res.status(400).send({ message: "Brand image is required" });
    }

    // Validate image mimetype
    if (req.file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).send({ message: 'Invalid image format. Allowed: JPEG, PNG, WEBP.' });
      }
    }

    const existingBrand = await Brand.findOne({ where: { name } });
    if (existingBrand) {
      return res.status(409).send({ message: "Brand already exists" });
    }

    const newBrand = await Brand.create({ name, image, createdBy });

    res.status(200).send({
      message: "Brand created successfully",
      brand: newBrand,
      success: true
    });
  } catch (error) {
    console.error("Create Brand Error:", error);
    res.status(500).send({ error: error.message });
  }
};


// Get all brands
 const getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.findAll({order:[['name','ASC']]});
        const modifiedBrands = brands.map((brand)=>({
            id:brand.id,
            name:brand.name,
            image:brand.image ?`http://localhost:7000/uploads/${brand.image}`: null
        }))
        res.status(200).send({ brands:modifiedBrands, success: true });
    } catch (error) {
       console.error("Get All Brands Error:", error);
        res.status(500).send({ error: error.message });
    }
};

// Get brand by ID
 const getBrandByID = async (req, res) => {
    const { id } = req.params;
    try {
        const brand = await Brand.findByPk(id);
        if (!brand) return res.status(404).send({ message: 'Brand not found', success: false });
        res.status(200).send({
      brand: {
        id: brand.id,
        name: brand.name,
        image: brand.image ? `http://localhost:7001/uploads/${brand.image}` : null
      },
      success: true
    });
    } catch (error) {
        console.error("Get Brand by ID Error:", error);
        res.status(500).send({message: "Internal server error", error: error.message });
    }
};

// Update brand
 const updateBrand = async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(401).send({ message: "Not Authorized" });
    }

    const { id } = req.params;
    let name = req.body.name;
    const updatedBy = req.user.id;

    if (!id) {
      return res.status(400).json({ message: 'Brand ID is required in URL.' });
    }

    // Validate image mimetype if new file uploaded
    if (req.file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).send({ message: 'Invalid image format. Allowed: JPEG, PNG, WEBP.' });
      }
    }

    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found.', success: false });
    }

    // Check for duplicate brand name (excluding current brand id)
    const existingBrand = await Brand.findOne({
      where: { name, id: { [Op.ne]: id } }
    });
    if (existingBrand) {
      return res.status(409).json({ message: "Another brand with this name already exists." });
    }

    // Capitalize name before update
    name = capitalizeName(name);

    // If new image uploaded, delete old image file
    if (req.file && brand.image) {
      const oldImagePath = path.join(__dirname, '../uploads', brand.image);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error('Failed to delete old image:', err);
      });
    }

    // Use new image filename if uploaded, otherwise keep old
    const image = req.file ? req.file.filename : brand.image;

    await Brand.update({ name, image, updatedBy }, { where: { id } });

    const updatedBrand = await Brand.findByPk(id);

    res.status(200).json({
      message: 'Brand updated successfully.',
      data: updatedBrand,
      success: true
    });
  } catch (error) {
    console.error("Update Brand Error:", error);
    res.status(500).json({ error: error.message });
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
        if (brand.image) {
      const imagePath = path.join(__dirname, '../uploads', brand.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Failed to delete image:', err);
      });
    }
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