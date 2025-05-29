const express = require('express');
const productController = require('../controllers/productController');
const {auth} = require('../middleware/auth')
const multerMiddleware = require("../middleware/multer")


const router = express.Router();

router.post('/create',auth,multerMiddleware.single('image') ,productController.createproduct);
router.get('/getAllproducts', productController.getAllproducts);
router.get('/getproductByID/:id', productController.getproductByID);
router.put('/updateproduct/:id',auth, productController.updateproduct);
router.delete('/deleteproduct/:id',auth, productController.deleteproduct);
router.get('./getproductByCategory',productController.getproductByCategory)
router.get('./getproductByBrand',productController.getproductByBrand)
router.get('/getProductsByQuery',productController.getProductsByQuery)

module.exports = router