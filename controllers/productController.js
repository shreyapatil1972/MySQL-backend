const { Product } = require('../models/productModel');
const path = require('path')
const fs = require('fs')

const handleFileUpload = (file) => {
    if (!file) return null;
    return file.filename;
};
// Create product
const createproduct = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        const { name, description, price, Category_id, Brand_id, Quantity } = req.body;
        const image = handleFileUpload(req.file);

        if (!name || !description || !price || !Category_id || !Brand_id || !Quantity || !image) {
            // Clean up uploaded file if validation fails
            if (req.file) {
                fs.unlinkSync(path.join(__dirname, '../uploads', req.file.filename));
            }
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const product = await Product.create({
            name,
            description,
            price: parseFloat(price),
            Category_id: parseInt(Category_id),
            Brand_id: parseInt(Brand_id),
            Quantity: parseInt(Quantity),
            inStock: req.body.inStock || true,
            image
        });

        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        });

    } catch (error) {
        // Clean up file if error occurs
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, '../uploads', req.file.filename));
        }
        console.error('Error creating product:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
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
            Category_id: product.Category_id,   
            Brand_id: product.Brand_id,
            Quantity: product.Quantity,
            image: product.image ? `http://localhost:7000/uploads/${product.image}` : null,
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
            Category_id: product.Category_id,
            Brand_id: product.Brand_id,
            Quantity: product.Quantity,
            Instock: product.Instock,
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
            return res.status(401).json({ success: false, message: 'Not Authorized' });
        }

        const productId = req.params.id;
        const existingProduct = await Product.findByPk(productId);

        if (!existingProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const { name, description, price, Category_id, Brand_id, Quantity, inStock } = req.body;

        // Parse numbers safely
        const parsedData = {
            name,
            description,
            price: parseFloat(price),
            Category_id: parseInt(Category_id),
            Brand_id: parseInt(Brand_id),
            Quantity: parseInt(Quantity),
            inStock: inStock === 'false' ? false : true // handle checkbox string value
        };

        // Handle new image upload
        if (req.file) {
            const newImage = req.file.filename;

            // Delete old image
            if (existingProduct.image) {
                const oldImagePath = path.join(__dirname, '../uploads', existingProduct.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlink(oldImagePath, (err) => {
                        if (err) console.error('Failed to delete old image:', err);
                    });
                }
            }

            parsedData.image = newImage;
        }

        await Product.update(parsedData, {
            where: { id: productId }
        });

        return res.status(200).json({
            success: true,
            message: 'Product updated successfully'
        });

    } catch (error) {
        console.error("Update Product Error:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};


// Delete product
const deleteproduct = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(401).send({ message: 'Not Authorized' });
    }

    // Fetch product first to access its image
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).send({ message: 'Product not found', success: false });
    }

    // Delete the image file if exists
    if (product.image) {
      const imagePath = path.join(__dirname, '../uploads', product.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Failed to delete image:', err);
      });
    }

    // Delete the product from DB
    await Product.destroy({ where: { id: req.params.id } });

    return res.status(200).send({ message: 'Product deleted successfully', success: true });

  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).send({ error: error.message });
  }
};


// Example controller
const getproductByCategory = async (req, res) => {
  const categoryId = req.params.id;
  console.log("Requested categoryId:", categoryId);  // ✅ Add this to debug

  try {
    const products = await Product.findAll({ where: { category_id: categoryId } });

    return res.status(200).send({
      success: true,
      products: products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image ? `http://localhost:7000/uploads/${product.image}` : null,
      })),
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

const getproductByBrand = async (req, res) => {
  try {
    const brand_id = req.params.id;

    if (!brand_id) {
      return res.status(400).json({ success: false, message: "Brand ID is required" });
    }

    const products = await Product.findAll({
      where: { brand_id },
    });

    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found for this brand" });
    }

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error in getproductByBrand:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
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
