const express = require('express');
const brandController = require('../controllers/brandController')
const {auth} = require('../middleware/auth')

const router = express.Router();

router.post('/create', auth,brandController.createBrand);
router.get('/getAllBrands', brandController.getAllBrands);
router.get('/getBrandByID/:id', brandController.getBrandByID);
router.put('/updateBrand/:id', auth,brandController.updateBrand);
router.delete('/deleteBrand/:id', auth, brandController.deleteBrand);

module.exports = router