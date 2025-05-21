const express = require('express');
const productController = require('../controllers/productController');


const router = express.Router();

router.post('/create', productController.createproduct);
router.get('/getAllproducts', productController.getAllproducts);
router.get('/getproductByID/:id', productController.getproductByID);
router.put('/updateproduct/:id', productController.updateproduct);
router.delete('/deleteproduct/:id', productController.deleteproduct);
router.get('./getproductByCategory',productController.getproductByCategory)
router.get('./getproductByBrand',productController.getproductByBrand)

module.exports = router